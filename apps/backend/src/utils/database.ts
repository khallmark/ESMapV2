import mysql from 'mysql2/promise';
import config from './config';

const pool = mysql.createPool({
  host: config.db_host,
  user: config.db_user,
  password: config.db_pass,
  database: config.db_name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const getData = async (sql: string, values: any[] = []) => {
  const [rows] = await pool.query(sql, values);
  return rows;
};