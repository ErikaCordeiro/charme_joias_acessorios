"""Add store shipping and payment settings.

Revision ID: 20260625_0005
Revises: 20260625_0004
Create Date: 2026-06-25
"""

from alembic import context, op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260625_0005"
down_revision = "20260625_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    tables = inspect(bind).get_table_names()

    if "shipping_carriers" not in tables:
        op.create_table(
            "shipping_carriers",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(length=120), nullable=False),
            sa.Column("region", sa.String(length=40), nullable=False),
            sa.Column("base_freight", sa.Float(), nullable=False, server_default="0"),
            sa.Column("price_per_kg", sa.Float(), nullable=False, server_default="0"),
            sa.Column("value_rate", sa.Float(), nullable=False, server_default="0"),
            sa.Column("estimated_days", sa.Integer(), nullable=False, server_default="5"),
            sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_shipping_carriers_id"), "shipping_carriers", ["id"], unique=False)
        op.create_index(op.f("ix_shipping_carriers_region"), "shipping_carriers", ["region"], unique=False)

    if "payment_settings" not in tables:
        op.create_table(
            "payment_settings",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("provider", sa.String(length=80), nullable=False, server_default="manual"),
            sa.Column("pix_enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("boleto_enabled", sa.Boolean(), nullable=False, server_default=sa.false()),
            sa.Column("pix_key", sa.String(length=255), nullable=True),
            sa.Column("recipient_name", sa.String(length=255), nullable=True),
            sa.Column("bank_name", sa.String(length=120), nullable=True),
            sa.Column("instructions", sa.Text(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_payment_settings_id"), "payment_settings", ["id"], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    tables = inspect(bind).get_table_names()

    if "payment_settings" in tables:
        op.drop_index(op.f("ix_payment_settings_id"), table_name="payment_settings")
        op.drop_table("payment_settings")

    if "shipping_carriers" in tables:
        op.drop_index(op.f("ix_shipping_carriers_region"), table_name="shipping_carriers")
        op.drop_index(op.f("ix_shipping_carriers_id"), table_name="shipping_carriers")
        op.drop_table("shipping_carriers")
