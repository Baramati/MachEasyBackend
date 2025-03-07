import * as sql from "mssql";

const dbConfig: sql.config = {
  user: 'ccpl',
  password: 'Ccpl@7276',
  server: '203.192.229.114',
  database: 'NANDANERPTEST',
  port: 1433,
  requestTimeout: 800000, // 10 minutes timeout
  pool: {
    max: 100, // Maximum number of connections in the pool
    min: 5,   // Keep at least 5 connections open
    idleTimeoutMillis: 800000, 
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    connectionTimeout: 15000, // 15 seconds timeout for connection establishment
    requestTimeout: 800000, // 5 minutes timeout for queries
  },
};

let pool: sql.ConnectionPool;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }
  return pool;
};
