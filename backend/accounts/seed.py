"""Explicit development-only demo data; repeat runs preserve account state."""
import uuid
from .security import SecurityContext

DEMO_EMAIL = 'parent@example.com'
DEMO_PASSWORD = 'password'


def seed_demo(security: SecurityContext):
    if security.settings.app_env not in {'development','test'} or security.settings.password_policy != 'dev':
        raise ValueError('Demo seeding requires APP_ENV=development/test and PASSWORD_POLICY=dev')
    with security.db.transaction() as connection:
        account = connection.execute('SELECT id FROM accounts WHERE email=?',(DEMO_EMAIL,)).fetchone()
        if account:
            return account['id']
        account_id = uuid.uuid4().hex
        connection.execute('INSERT INTO accounts(id,email,password_hash,created_at) VALUES (?,?,?,?)',(account_id,DEMO_EMAIL,security.hash_secret(DEMO_PASSWORD),security.clock.now()))
        for name,grade,avatar in [('Alex','3','fox'),('Maya','1','owl')]:
            connection.execute('INSERT INTO kid_profiles VALUES (?,?,?,?,?,?)',(uuid.uuid4().hex,account_id,name,grade,avatar,security.clock.now()))
    return account_id
