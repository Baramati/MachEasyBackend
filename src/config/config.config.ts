//-------------- BE Config 
export const __BE_PORT: number = 8087;
export const __BE_OPEN_TO: string = '0.0.0.0';

//------------ SMTP Config 
export const __FROM_MAIL: string = "yourmail@demo.com";
export const __FROM_MAIL_PASSWORD: string = "XXX XXX XXX XXX";

//------------------- Cloud
export const __CLOUD_PATH: string = "../../cloud";


//-------------- DB Config - MSSQL
/**
 * To Create new instance follow rules 
 * 1) Use following name if u create multiple then just Use _ (underscore) and name of database 
 * for example  `__MSSQL_DATABASE_MAIN` where `MAIN` is database name
 * 2)  for same for server variables 
 *  
 */
export const __MSSQL_DB_SERVER: string = '';
export const __MSSQL_DB_PORT: number = 1433;
export const __MSSQL_DB_USER: string = ""
export const __MSSQL_DB_PASSWORD: string = '';

export const __MSSQL_DATABASE_MAIN: string = '';
export const __MSSQL_DATABASE_USER: string = '';