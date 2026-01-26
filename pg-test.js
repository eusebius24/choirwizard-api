const { Client } = require('pg');

(async () => {
  const client = new Client({
    connectionString: 'postgresql://erikareiman@127.0.0.1:5432/choirwizard',
    ssl: false,
    connectionTimeoutMillis: 5000,
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected. Running query...');
    const res = await client.query('select 1 as ok');
    console.log('Result:', res.rows);
  } catch (e) {
    console.error('PG ERROR:', e);
  } finally {
    await client.end().catch(() => {});
    console.log('Done.');
  }
})();
