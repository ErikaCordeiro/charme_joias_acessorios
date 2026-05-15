import asyncpg
import asyncio

async def create_db():
    try:
        conn = await asyncpg.connect('postgresql://postgres:password@localhost:5432/postgres')
        await conn.execute('CREATE DATABASE lua_active;')
        await conn.close()
        print('Database created!')
    except asyncpg.exceptions.DuplicateDatabaseError:
        print('Database already exists!')
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(create_db())