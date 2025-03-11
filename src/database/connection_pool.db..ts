
import { ConnectionPool } from 'mssql';
import * as sql from "mssql";
import { __MSSQL_dbConfig_ERP, __MSSQL_dbConfig_USER } from './config.db';

let pool: sql.ConnectionPool;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    pool = await sql.connect(__MSSQL_dbConfig_ERP);
  }
  return pool;
};

export const __databaseConfig_ERP: ConnectionPool = new ConnectionPool(__MSSQL_dbConfig_ERP);
export const __databaseConfig_USER: ConnectionPool = new ConnectionPool(__MSSQL_dbConfig_USER);