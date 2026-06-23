import asyncio
import json
import re
from typing import Optional
from urllib.error import URLError
from urllib.request import Request, urlopen

from fastapi import HTTPException, status

from app.schemas.shipping import ShippingCalculate, ShippingResponse

REGION_BY_UF = {
    "AC": "Norte",
    "AL": "Nordeste",
    "AP": "Norte",
    "AM": "Norte",
    "BA": "Nordeste",
    "CE": "Nordeste",
    "DF": "Centro-Oeste",
    "ES": "Sudeste",
    "GO": "Centro-Oeste",
    "MA": "Nordeste",
    "MT": "Centro-Oeste",
    "MS": "Centro-Oeste",
    "MG": "Sudeste",
    "PA": "Norte",
    "PB": "Nordeste",
    "PR": "Sul",
    "PE": "Nordeste",
    "PI": "Nordeste",
    "RJ": "Sudeste",
    "RN": "Nordeste",
    "RO": "Norte",
    "RR": "Norte",
    "RS": "Sul",
    "SC": "Sul",
    "SP": "Sudeste",
    "SE": "Nordeste",
    "TO": "Norte",
}

REGIONAL_PRICING = {
    "Norte": {"base": 29.9, "weight": 7.8, "value_rate": 0.018},
    "Nordeste": {"base": 24.9, "weight": 6.4, "value_rate": 0.015},
    "Centro-Oeste": {"base": 22.9, "weight": 5.9, "value_rate": 0.013},
    "Sudeste": {"base": 17.9, "weight": 4.8, "value_rate": 0.011},
    "Sul": {"base": 21.9, "weight": 5.6, "value_rate": 0.012},
}

REGIONAL_DELIVERY = {
    "Norte": {"carrier": "Jadlog", "base_days": 9},
    "Nordeste": {"carrier": "Jadlog", "base_days": 7},
    "Centro-Oeste": {"carrier": "Loggi", "base_days": 6},
    "Sudeste": {"carrier": "Loggi", "base_days": 4},
    "Sul": {"carrier": "Correios", "base_days": 5},
}

CEP_UF_RANGES = (
    (1000000, 19999999, "SP"),
    (20000000, 28999999, "RJ"),
    (29000000, 29999999, "ES"),
    (30000000, 39999999, "MG"),
    (40000000, 48999999, "BA"),
    (49000000, 49999999, "SE"),
    (50000000, 56999999, "PE"),
    (57000000, 57999999, "AL"),
    (58000000, 58999999, "PB"),
    (59000000, 59999999, "RN"),
    (60000000, 63999999, "CE"),
    (64000000, 64999999, "PI"),
    (65000000, 65999999, "MA"),
    (66000000, 68899999, "PA"),
    (68900000, 68999999, "AP"),
    (69000000, 69899999, "AM"),
    (69900000, 69999999, "AC"),
    (70000000, 73699999, "DF"),
    (72800000, 72999999, "GO"),
    (73700000, 76799999, "GO"),
    (76800000, 76999999, "RO"),
    (77000000, 77999999, "TO"),
    (78000000, 78899999, "MT"),
    (79000000, 79999999, "MS"),
    (80000000, 87999999, "PR"),
    (88000000, 89999999, "SC"),
    (90000000, 99999999, "RS"),
    (69300000, 69399999, "RR"),
)

HTTP_TIMEOUT_SECONDS = 3.5


class ShippingService:
    async def calculate_shipping(self, shipping_data: ShippingCalculate) -> ShippingResponse:
        cep = self._normalize_cep(shipping_data.cep)
        self._validate_input(cep=cep, weight=shipping_data.weight, value=shipping_data.value)

        uf = await self._resolve_uf(cep)
        region = REGION_BY_UF.get(uf, "Sudeste")
        pricing = REGIONAL_PRICING.get(region, REGIONAL_PRICING["Sudeste"])
        delivery = REGIONAL_DELIVERY.get(region, REGIONAL_DELIVERY["Sudeste"])

        base_freight = round(pricing["base"], 2)
        weight_cost = round(shipping_data.weight * pricing["weight"], 2)
        value_cost = round(shipping_data.value * pricing["value_rate"], 2)
        total_freight = round(base_freight + weight_cost + value_cost, 2)
        estimated_days = self._estimate_delivery_days(
            base_days=delivery["base_days"],
            weight=shipping_data.weight,
        )

        return ShippingResponse(
            cep=self._format_cep(cep),
            uf=uf,
            region=region,
            carrier=delivery["carrier"],
            estimated_days=estimated_days,
            base_freight=base_freight,
            weight_cost=weight_cost,
            value_cost=value_cost,
            total_freight=total_freight,
        )

    def _validate_input(self, cep: str, weight: float, value: float) -> None:
        if len(cep) != 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CEP invalido. Use 8 digitos.",
            )
        if weight <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Peso invalido para calculo de frete.",
            )
        if value < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Valor do pedido invalido para calculo de frete.",
            )

    async def _resolve_uf(self, cep: str) -> str:
        for resolver in (self._lookup_viacep, self._lookup_brasilapi):
            uf = await resolver(cep)
            if uf:
                return uf

        fallback_uf = self._resolve_uf_from_cep_range(cep)
        if fallback_uf:
            return fallback_uf

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Nao foi possivel calcular o frete agora. Tente novamente em instantes.",
        )

    async def _lookup_viacep(self, cep: str) -> Optional[str]:
        payload = await self._fetch_json(f"https://viacep.com.br/ws/{cep}/json/")
        if not payload or payload.get("erro"):
            return None
        return self._extract_uf(payload.get("uf"))

    async def _lookup_brasilapi(self, cep: str) -> Optional[str]:
        payload = await self._fetch_json(f"https://brasilapi.com.br/api/cep/v1/{cep}")
        if not payload:
            return None
        return self._extract_uf(payload.get("state"))

    async def _fetch_json(self, url: str) -> Optional[dict]:
        return await asyncio.to_thread(self._fetch_json_sync, url)

    def _fetch_json_sync(self, url: str) -> Optional[dict]:
        request = Request(url=url, headers={"User-Agent": "CharmeJoias/1.0"})

        try:
            with urlopen(request, timeout=HTTP_TIMEOUT_SECONDS) as response:
                if response.status != status.HTTP_200_OK:
                    return None
                content = response.read().decode("utf-8")
        except (URLError, TimeoutError, ValueError):
            return None

        try:
            payload = json.loads(content)
        except json.JSONDecodeError:
            return None

        if isinstance(payload, dict):
            return payload
        return None

    def _resolve_uf_from_cep_range(self, cep: str) -> Optional[str]:
        cep_number = int(cep)
        for min_cep, max_cep, uf in CEP_UF_RANGES:
            if min_cep <= cep_number <= max_cep:
                return uf
        return None

    def _extract_uf(self, value: Optional[str]) -> Optional[str]:
        if not value:
            return None
        candidate = value.strip().upper()
        if candidate in REGION_BY_UF:
            return candidate
        return None

    def _normalize_cep(self, cep: str) -> str:
        return re.sub(r"\D", "", cep or "")

    def _format_cep(self, cep: str) -> str:
        return f"{cep[:5]}-{cep[5:]}"

    def _estimate_delivery_days(self, base_days: int, weight: float) -> int:
        extra_days = 0
        if weight > 2:
            extra_days += 1
        if weight > 5:
            extra_days += 1
        return base_days + extra_days
