"""Add the server-calculated freight total to orders.

Revision ID: 20260622_0002
Revises: 20260610_0001
Create Date: 2026-06-22
"""

from alembic import context, op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260622_0002"
down_revision = "20260610_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if context.is_offline_mode():
        op.add_column(
            "orders",
            sa.Column("freight_total", sa.Float(), nullable=False, server_default="0"),
        )
        return

    bind = op.get_bind()
    columns = {column["name"] for column in inspect(bind).get_columns("orders")}
    if "freight_total" not in columns:
        op.add_column(
            "orders",
            sa.Column("freight_total", sa.Float(), nullable=False, server_default="0"),
        )


def downgrade() -> None:
    bind = op.get_bind()
    columns = {column["name"] for column in inspect(bind).get_columns("orders")}
    if "freight_total" in columns:
        op.drop_column("orders", "freight_total")
