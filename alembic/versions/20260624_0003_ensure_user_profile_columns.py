"""Ensure user profile columns exist on legacy databases.

Revision ID: 20260624_0003
Revises: 20260622_0002
Create Date: 2026-06-24
"""

from alembic import context, op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260624_0003"
down_revision = "20260622_0002"
branch_labels = None
depends_on = None


USER_COLUMNS = {
    "full_name": sa.Column("full_name", sa.String(length=255), nullable=True),
    "phone": sa.Column("phone", sa.String(length=20), nullable=True),
    "cpf": sa.Column("cpf", sa.String(length=11), nullable=True),
    "zip_code": sa.Column("zip_code", sa.String(length=8), nullable=True),
    "street": sa.Column("street", sa.String(length=255), nullable=True),
    "number": sa.Column("number", sa.String(length=30), nullable=True),
    "complement": sa.Column("complement", sa.String(length=255), nullable=True),
    "neighborhood": sa.Column("neighborhood", sa.String(length=255), nullable=True),
    "city": sa.Column("city", sa.String(length=255), nullable=True),
    "state": sa.Column("state", sa.String(length=2), nullable=True),
    "is_admin": sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false()),
    "created_at": sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
}


def _existing_user_columns() -> set[str]:
    return {column["name"] for column in inspect(op.get_bind()).get_columns("users")}


def upgrade() -> None:
    if context.is_offline_mode():
        return

    existing_columns = _existing_user_columns()
    for column_name, column in USER_COLUMNS.items():
        if column_name not in existing_columns:
            op.add_column("users", column.copy())


def downgrade() -> None:
    existing_columns = _existing_user_columns()
    for column_name in reversed(USER_COLUMNS):
        if column_name in existing_columns:
            op.drop_column("users", column_name)
