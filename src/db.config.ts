
import { ConnectionPool } from 'mssql';

export const databaseConfig: ConnectionPool = new ConnectionPool({
  user: 'ccpl',
  password: 'Ccpl@7276',
  server: '203.192.229.114',
  // database: 'NANDANERP', /** NEW SITE DB */
  database: 'NANDANERPTEST', /** FOR TESING DB */
  port: 1433,
  // user: 'sa1',
  // password: '123456',
  // server: '192.168.1.156',
  // database: 'NANDANERP',
  // port: 1433, 
 
  requestTimeout: 800000, // Set timeout to 10 min (600000ms)
  pool: {
    max: 10000,
    min: 0,
    idleTimeoutMillis: 800000, 
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    connectionTimeout: 1500000, // 15 seconds timeout for connection establishment
    requestTimeout: 800000, // 5 minutes timeout for queries
    max: 1000, // Maximum number of connections in the pool
  },
});
export const databaseConfig1: ConnectionPool = new ConnectionPool({

  user: 'ccpl',
  password: 'Ccpl@7276',
  server: '203.192.229.114',
  database: 'NANDANERPUSERS', /** NEW SITE DB */
  // database: 'NANDANERPUSERSTEST', /** FOR TESING DB */
  port: 1433,


  requestTimeout: 800000, // Set timeout to 10 min (600000ms)
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 80000
  },

  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    trustedConnection: true
  },
});

export const databaseConfigOLDDB: ConnectionPool = new ConnectionPool({

  user: 'ccpl',
  password: 'Ccpl@7276',
  server: '203.192.229.114',
  // database: 'NANDANERP', /** NEW SITE DB */
  database: 'OLDNANDANERP', /** FOR TESTING DB */
  port: 1433,

  requestTimeout: 800000, // Set timeout to 10 min (600000ms)
  pool: {
    max: 10000,
    min: 0,
    idleTimeoutMillis: 800000,
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    connectionTimeout: 1500000, // 15 seconds timeout for connection establishment
    requestTimeout: 800000, // 5 minutes timeout for queries
    max: 1000, // Maximum number of connections in the pool
  },
});

