"""Add the server-calculated freight total to orders.

Revision ID: 20260622_0002
Revises: 20260610_0001
Create Date: 2026-06-22
"""

from alembic import op
import sqlalchemy as sa


revision = "20260622_0002"
down_revision = "20260610_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "orders",
        sa.Column("freight_total", sa.Float(), nullable=False, server_default="0"),
    )


def downgrade() -> None:
    op.drop_column("orders", "freight_total")
