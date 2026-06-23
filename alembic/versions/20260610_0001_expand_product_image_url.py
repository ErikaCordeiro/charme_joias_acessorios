"""Expand product image URL length for remote media URLs.

Revision ID: 20260610_0001
Revises: 20260609_0000
Create Date: 2026-06-10
"""

from alembic import op
import sqlalchemy as sa


revision = "20260610_0001"
down_revision = "20260609_0000"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "products",
        "image_url",
        existing_type=sa.String(length=255),
        type_=sa.String(length=1000),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "products",
        "image_url",
        existing_type=sa.String(length=1000),
        type_=sa.String(length=255),
        existing_nullable=True,
    )
