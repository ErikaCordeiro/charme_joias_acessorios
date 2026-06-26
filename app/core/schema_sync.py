from sqlalchemy import inspect, text


USER_COLUMN_DEFINITIONS = {
    "full_name": "VARCHAR(255)",
    "phone": "VARCHAR(20)",
    "cpf": "VARCHAR(11)",
    "zip_code": "VARCHAR(8)",
    "street": "VARCHAR(255)",
    "number": "VARCHAR(30)",
    "complement": "VARCHAR(255)",
    "neighborhood": "VARCHAR(255)",
    "city": "VARCHAR(255)",
    "state": "VARCHAR(2)",
    "is_admin": "BOOLEAN DEFAULT FALSE",
    "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",
}

ORDER_COLUMN_DEFINITIONS = {
    "freight_total": "DOUBLE PRECISION DEFAULT 0 NOT NULL",
}


def ensure_site_contents_table(connection, existing_tables: set[str]) -> None:
    if "site_contents" in existing_tables:
        return

    connection.execute(
        text(
            """
            CREATE TABLE site_contents (
                id SERIAL PRIMARY KEY,
                key VARCHAR(100) NOT NULL UNIQUE,
                eyebrow VARCHAR(120),
                title VARCHAR(255) NOT NULL,
                body_primary TEXT,
                body_secondary TEXT,
                cta_label VARCHAR(120),
                cta_url VARCHAR(255),
                image_url VARCHAR(1000),
                image_alt VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
            """
        )
    )
    connection.execute(
        text("CREATE INDEX IF NOT EXISTS ix_site_contents_id ON site_contents (id)")
    )
    connection.execute(
        text("CREATE UNIQUE INDEX IF NOT EXISTS ix_site_contents_key ON site_contents (key)")
    )


def ensure_store_settings_tables(connection, existing_tables: set[str]) -> None:
    if "shipping_carriers" not in existing_tables:
        connection.execute(
            text(
                """
                CREATE TABLE shipping_carriers (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(120) NOT NULL,
                    region VARCHAR(40) NOT NULL,
                    base_freight DOUBLE PRECISION DEFAULT 0 NOT NULL,
                    price_per_kg DOUBLE PRECISION DEFAULT 0 NOT NULL,
                    value_rate DOUBLE PRECISION DEFAULT 0 NOT NULL,
                    estimated_days INTEGER DEFAULT 5 NOT NULL,
                    active BOOLEAN DEFAULT TRUE NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                )
                """
            )
        )
        connection.execute(
            text("CREATE INDEX IF NOT EXISTS ix_shipping_carriers_id ON shipping_carriers (id)")
        )
        connection.execute(
            text("CREATE INDEX IF NOT EXISTS ix_shipping_carriers_region ON shipping_carriers (region)")
        )

    if "payment_settings" not in existing_tables:
        connection.execute(
            text(
                """
                CREATE TABLE payment_settings (
                    id SERIAL PRIMARY KEY,
                    provider VARCHAR(80) DEFAULT 'manual' NOT NULL,
                    pix_enabled BOOLEAN DEFAULT TRUE NOT NULL,
                    boleto_enabled BOOLEAN DEFAULT FALSE NOT NULL,
                    pix_key VARCHAR(255),
                    recipient_name VARCHAR(255),
                    bank_name VARCHAR(120),
                    instructions TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                )
                """
            )
        )
        connection.execute(
            text("CREATE INDEX IF NOT EXISTS ix_payment_settings_id ON payment_settings (id)")
        )


def sync_schema(connection) -> None:
    inspector = inspect(connection)
    table_names = set(inspector.get_table_names())
    ensure_site_contents_table(connection, table_names)
    ensure_store_settings_tables(connection, table_names)

    if "users" not in table_names:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    for column_name, column_type in USER_COLUMN_DEFINITIONS.items():
        if column_name in existing_columns:
            continue

        connection.execute(
            text(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")
        )

    if "orders" not in inspector.get_table_names():
        return

    existing_order_columns = {
        column["name"] for column in inspector.get_columns("orders")
    }
    for column_name, column_type in ORDER_COLUMN_DEFINITIONS.items():
        if column_name in existing_order_columns:
            continue
        connection.execute(
            text(f"ALTER TABLE orders ADD COLUMN {column_name} {column_type}")
        )
