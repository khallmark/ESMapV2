export default {
  db_host: process.env.DB_HOST || 'localhost',
  db_name: process.env.DB_NAME || 'esmap',
  db_user: process.env.DB_USER || 'esmap',
  db_pass: process.env.DB_PASS || '',
  db_prefix: process.env.DB_PREFIX || '',
  port: process.env.PORT || 3001
};