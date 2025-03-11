import * as sql from "mssql";
import { __MSSQL_DATABASE_MAIN, __MSSQL_DATABASE_USER, __MSSQL_DB_PASSWORD, __MSSQL_DB_PORT, __MSSQL_DB_SERVER } from "src/config/config.config";
export const __MSSQL_dbConfig_ERP: sql.config = {
  server: __MSSQL_DB_SERVER,
  port: __MSSQL_DB_PORT,
  user: __MSSQL_DB_SERVER,
  password: __MSSQL_DB_PASSWORD,
  database: __MSSQL_DATABASE_MAIN,
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

export const __MSSQL_dbConfig_USER: sql.config = {
  server: __MSSQL_DB_SERVER,
  port: __MSSQL_DB_PORT,
  user: __MSSQL_DB_SERVER,
  password: __MSSQL_DB_PASSWORD,
  database: __MSSQL_DATABASE_USER,
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

