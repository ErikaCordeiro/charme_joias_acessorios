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
}

ORDER_COLUMN_DEFINITIONS = {
    "freight_total": "DOUBLE PRECISION DEFAULT 0 NOT NULL",
}


def sync_schema(connection) -> None:
    inspector = inspect(connection)
    if "users" not in inspector.get_table_names():
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
