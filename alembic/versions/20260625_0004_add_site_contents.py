"""Add editable site content.

Revision ID: 20260625_0004
Revises: 20260624_0003
Create Date: 2026-06-25
"""

from alembic import context, op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260625_0004"
down_revision = "20260624_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    tables = inspect(bind).get_table_names()
    if "site_contents" in tables:
        return

    op.create_table(
        "site_contents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("key", sa.String(length=100), nullable=False),
        sa.Column("eyebrow", sa.String(length=120), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body_primary", sa.Text(), nullable=True),
        sa.Column("body_secondary", sa.Text(), nullable=True),
        sa.Column("cta_label", sa.String(length=120), nullable=True),
        sa.Column("cta_url", sa.String(length=255), nullable=True),
        sa.Column("image_url", sa.String(length=1000), nullable=True),
        sa.Column("image_alt", sa.String(length=255), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_site_contents_id"), "site_contents", ["id"], unique=False)
    op.create_index(op.f("ix_site_contents_key"), "site_contents", ["key"], unique=True)


def downgrade() -> None:
    bind = op.get_bind()
    tables = inspect(bind).get_table_names()
    if "site_contents" not in tables:
        return

    op.drop_index(op.f("ix_site_contents_key"), table_name="site_contents")
    op.drop_index(op.f("ix_site_contents_id"), table_name="site_contents")
    op.drop_table("site_contents")
