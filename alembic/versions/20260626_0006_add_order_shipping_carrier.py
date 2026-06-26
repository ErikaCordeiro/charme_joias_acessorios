"""Add selected shipping carrier to orders.

Revision ID: 20260626_0006
Revises: 20260625_0005
Create Date: 2026-06-26
"""

from alembic import context, op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260626_0006"
down_revision = "20260625_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    columns = {column["name"] for column in inspect(bind).get_columns("orders")}
    if "shipping_carrier" not in columns:
        op.add_column("orders", sa.Column("shipping_carrier", sa.String(length=120), nullable=True))


def downgrade() -> None:
    bind = op.get_bind()
    columns = {column["name"] for column in inspect(bind).get_columns("orders")}
    if "shipping_carrier" in columns:
        op.drop_column("orders", "shipping_carrier")
