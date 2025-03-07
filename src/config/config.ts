import { BadRequestException, Injectable } from '@nestjs/common';
import { databaseConfig, databaseConfig1, databaseConfigOLDDB } from '../db.config';
import * as moment from 'moment';
import { getPool } from "./db";
import * as sql from "mssql";

export class Config {

  reportUrl: any = 'http://203.192.229.114:90/ERPREPORT'
  //----------------------------- Insert Data Into Table As Received Data -----------------------//
  async insertData(data) {

    const dataset = await this.createObjectInsert(data.tableName, data);
    const fieldNames = dataset.field.join(', ');
    const values = dataset.value.join(', ');

    const query = `INSERT INTO ${dataset.table} (${fieldNames}) VALUES (${values})`;
    console.log(query);

    return query;
    //return this.executeQuery(query);
  }
  //----------------------------- Insert Data Into Table As Received Data for user database -----------------------//
  async insertUserData(data) {

    const dataset = await this.createObjectInsertUser(data.tableName, data);
    const fieldNames = dataset.field.join(', ');
    const values = dataset.value.join(', ');

    const query = `INSERT INTO ${dataset.table} (${fieldNames}) VALUES (${values})`;
    // console.log(query);
    return this.executeUserQuery(query);
  }



  //----------------------------- End Function Insert Data -----------------------------------//
  //------------------------------* Insert data Filtering Fun *---------------------------------//
  async createObjectInsert(tableName: string, data: any): Promise<any> {
    const returnObj: any = {};
    const fieldArray = [];
    const valueArray = [];
    const datatype = [];

    returnObj['table'] = tableName;
    // const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}';`;
    const query = `  SELECT 
    COLUMN_NAME, 
    DATA_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = '${tableName}';`
    const result: any = await this.executeQuery(query, []);

    for (const item of result) {
      datatype.push(JSON.parse(JSON.stringify(item)));
    }
    // console.log(datatype);
    Object.keys(data).forEach((ele: any) => {
      if (data[ele] == 0) {
        data[ele] = data[ele].toString();
      }
      if (
        data[ele] != '' &&
        data[ele] != null &&
        data[ele] != undefined &&
        typeof (data[ele]) != 'object'
      ) {
        const filterObj = datatype.filter((eles) => eles.COLUMN_NAME === ele);
        // console.log(filterObj)
        if (filterObj.length != 0) {

          if (filterObj[0].DATA_TYPE == 'nvarchar' || filterObj[0].DATA_TYPE == 'varchar' || filterObj[0].DATA_TYPE == 'string' || filterObj[0].DATA_TYPE == 'char') {
            fieldArray.push(ele);
            valueArray.push(`N'${data[ele]}'`);
          } else if (filterObj[0].DATA_TYPE == 'bigint' || filterObj[0].DATA_TYPE == 'int' || filterObj[0].DATA_TYPE == 'numeric' || filterObj[0].DATA_TYPE == 'nchar' || filterObj[0].DATA_TYPE == 'number' || filterObj[0].DATA_TYPE == 'decimal') {
            fieldArray.push(ele);
            // console.log(filterObj[0])
            valueArray.push(data[ele]);

          } else if (filterObj[0].DATA_TYPE === 'bit' && typeof data[ele] == 'boolean') {
            fieldArray.push(ele);
            valueArray.push(data[ele] ? '1' : '0');
          } else if (filterObj[0].DATA_TYPE === 'date') {
            fieldArray.push(ele);
            valueArray.push(`'${data[ele]}'`);
          } else {
            throw new BadRequestException(`Something went wrong we want ${filterObj[0].DATA_TYPE} column name ${filterObj[0].COLUMN_NAME} but you send ${typeof (data[ele])}`);
          }
        }
      }
    });

    returnObj['field'] = fieldArray;
    returnObj['value'] = valueArray;
    return returnObj;
  }
  //------------------------------* Insert data Filtering Fun for user*---------------------------------//
  async createObjectInsertUser(tableName: string, data: any): Promise<any> {
    const returnObj: any = {};
    const fieldArray = [];
    const valueArray = [];
    const datatype = [];

    returnObj['table'] = tableName;
    // const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}';`;
    const query = `  SELECT 
    COLUMN_NAME, 
    DATA_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = '${tableName}';`
    const result: any = await this.executeUserQuery(query, []);

    for (const item of result) {
      datatype.push(JSON.parse(JSON.stringify(item)));
    }
    // console.log(datatype);
    Object.keys(data).forEach((ele: any) => {
      if (data[ele] == 0) {
        data[ele] = data[ele].toString();
      }
      if (
        data[ele] != '' &&
        data[ele] != null &&
        data[ele] != undefined &&
        data[ele] != 'NULL'
      ) {
        const filterObj = datatype.filter((eles) => eles.COLUMN_NAME === ele);
        // console.log(filterObj)
        if (filterObj.length != 0) {

          if (filterObj[0].DATA_TYPE == 'nvarchar' || filterObj[0].DATA_TYPE == 'varchar' || filterObj[0].DATA_TYPE == 'string' || filterObj[0].DATA_TYPE == 'char') {
            fieldArray.push(ele);
            valueArray.push(`'${data[ele]}'`);
          } else if (filterObj[0].DATA_TYPE == 'bigint' || filterObj[0].DATA_TYPE == 'int' || filterObj[0].DATA_TYPE == 'numeric' || filterObj[0].DATA_TYPE == 'nchar' || filterObj[0].DATA_TYPE == 'number' || filterObj[0].DATA_TYPE == 'decimal') {
            fieldArray.push(ele);
            // console.log(filterObj[0])
            valueArray.push(data[ele]);

          } else if (filterObj[0].DATA_TYPE === 'bit' && typeof data[ele] == 'boolean') {
            fieldArray.push(ele);
            valueArray.push(data[ele] ? '1' : '0');
          } else if (filterObj[0].DATA_TYPE === 'date') {
            fieldArray.push(ele);
            valueArray.push(`'${data[ele]}'`);
          } else {
            throw new BadRequestException(`Something went wrong we want ${filterObj[0].DATA_TYPE} column name ${filterObj[0].COLUMN_NAME} but you send ${typeof (data[ele])}`);
          }
        }
      }
    });

    returnObj['field'] = fieldArray;
    returnObj['value'] = valueArray;
    return returnObj;
  }

  //-------------------------------* Insert data filtering function end *----------------------------//

  //=================================================================================================//
  //----------------------------* Selected Data Return As Per Requirement *------------------------//
  async selectAll(data) {
    // console.log(data);
    //--------------------------------* Start Select Query Creation *------------------------///
    let query = `SELECT `;
    if (data.hasOwnProperty('view')) {
      if (data?.view?.length != 0) {
        for (const [i, value] of data.view.entries()) {
          if (i === data.view.length - 1) {
            query += ` ${value}`
          } else {
            query += ` ${value},`
          }
        }
      } else {
        query += '*'
      }
    } else {
      query += '*'
    }

    query += ` FROM ${data.table}`;

    // --------------------------------* Join Condition Part *-------------------------------////
    if (data.hasOwnProperty('join')) {
      for (const item of data.join) {
        for (const [key, value] of Object.entries(item)) {
          query += ` ${key} ${value[0].table} on ${value[0].table}.${value[0].relationColumn} = ${data.table}.${value[0].mainColumn}`
        }
      }
    }
    //--------------------------------* End Join Condition Part *---------------------------////
    //--------------------------------* Start Where Condition Part *-------------------------///
    if (data.hasOwnProperty('condition')) {
      if (data?.condition.length != 0) {
        query += ` where`;
        for (const item of data.condition) {
          // console.log(item)
          if (item?.type == 'BETWEEN') {
            query += `${item.condition} ${item.column} BETWEEN `;
            for (const [i, value] of item.value.entries()) {
              if (i === item.value.length - 1) {
                query += ` AND ${value}`;
              } else {
                query += ` ${value}`;
              }
            }
          } else {
            for (const [key, value] of Object.entries(item)) {
              if (key != 'type') {
                query += ` ${key} = '${value}'`
              } else {
                query += ` ${value}`
              }
            }
          }
        }
      }
    }
    ///-------------------------------* End Where Condition Part *------------------------//////////
    ///--------------------------------* Start Sort Condtion Part *------------------------/////////

    if (data.hasOwnProperty('sort')) {
      if (data.sort[0].column.length != 0) {
        query += ' order by '
        for (const [i, value] of data.sort[0].column.entries()) {
          if (i === data.sort[0].column.length - 1) {
            query += ` ${value}`
          } else {
            query += ` ${value},`
          }
        }

        query += ` ${data.sort[0].order}`;
      }
    }
    /////--------------------------------* End Sort Condition Part *---------------///////////////
    ///----------------------------------* Limit Condtion Part *------------------/////////////////
    // if(data.hasOwnproperty('limit')){
    //   query += ' limit '+ data.limit;
    // }
    ///////------------------------------* End Limit Condtion Part *---------------////////////////////

    // console.log(query);
    if (data.user == 1) {
      let dataset = await this.executeUserQuery(query, []);
      return dataset;
    } else {
      let dataset = await this.executeQuery(query, []);
      return dataset;
    }
    // let dataset = await this.executeQuery(query, []);
    //   return dataset;

  }
  //-----------------------------* End Function Selected Data Return *-----------------------------//


  //-----------------------------* Update table data *---------------------------------------------//
  //  async updateData(tableData: { tableName: string; data: any, }[]): Promise<any> {
  //   const queries = [];
  //   const parameters = {};

  //   for (const { tableName, data } of tableData){
  //     const columns = Object.keys(data);
  //     const values = Object.values(data);


  //     const placeholders = values.map((value, index) => `${columns[index]} = ${value}`);
  //     console.log(placeholders);

  //     let query = `UPDATE ${tableName} SET ${placeholders.join(',')}`;



  //     //--------------------------------* Start Where Condition Part *-------------------------///
  //     if (data.hasOwnProperty('condition')) {
  //     if (data?.condition.length != 0) {
  //       query += ` where`;
  //       for (const item of data.condition) {
  //         console.log(item)
  //         if (item?.type == 'BETWEEN') {
  //           query += `${item.condition} ${item.column} BETWEEN `;
  //           for (const [i, value] of item.value.entries()) {
  //             if (i === item.value.length - 1) {
  //               query += ` AND ${value}`;
  //             } else {
  //               query += ` ${value}`;
  //             }
  //           }
  //         } else {
  //           for (const [key, value] of Object.entries(item)) {
  //             if (key != 'type') {
  //               query += ` ${key} = ${value}`

  //             } else {
  //               query += ` ${value}`
  //             }
  //           }
  //         }
  //       }
  //     }
  //    }
  //    ///-------------------------------* End Where Condition Part *------------------------//////////

  //    console.log(query);
  //    queries.push(query);

  //    for (let i = 0; i < columns.length; i++) {
  //     parameters[`${tableName}_${columns[i]}`]=values[i];
  //    }
  //  }
  //   const result = await this.executeQuery(queries.join(';'), parameters);
  //   return result;

  // }

  async updateData(data) {

    let updateString = '';
    let query = ''
    let dataset = await this.createObjectInsert(data.tableName, data.data);
    if (dataset.field.length == dataset.value.length) {
      for (let i = 0; i < dataset.field.length; i++) {
        if (i != dataset.field.length - 1) {
          updateString += `${dataset.field[i]} = ${dataset.value[i]}, `;
        } else {
          updateString += `${dataset.field[i]} = ${dataset.value[i]} `;
        }

      }
      query = `update ${dataset.table} set ${updateString} `;
      if (data.hasOwnProperty('condition')) {
        if (data?.condition.length != 0) {
          query += ` where`;
          for (let item of data.condition) {
            // console.log(item)
            if (item?.type == 'BETWEEN') {
              query += `${item.condition} ${item.column} BETWEEN `;
              for (const [i, value] of item.value.entries()) {
                if (i === item.value.length - 1) {
                  query += ` AND ${value}`;
                } else {
                  query += ` ${value}`;
                }
              }
            } else {
              for (const [key, value] of Object.entries(item)) {
                if (key != 'type') {
                  query += ` ${key} = ${value}`
                } else {
                  query += ` ${value}`
                }
              }
            }
          }
        }

      }



      // console.log(query)
      return await this.executeQuery(query);
    } else {
      throw new BadRequestException(`Something went wrong in query column and value length not matched`);
    }
  }
  async updateUserData(data) {

    let updateString = '';
    let query = ''
    let dataset = await this.createObjectInsertUser(data.tableName, data.data);
    if (dataset.field.length == dataset.value.length) {
      for (let i = 0; i < dataset.field.length; i++) {
        if (i != dataset.field.length - 1) {
          updateString += `${dataset.field[i]} = ${dataset.value[i]}, `;
        } else {
          updateString += `${dataset.field[i]} = ${dataset.value[i]} `;
        }

      }
      query = `update ${dataset.table} set ${updateString} `;
      if (data.hasOwnProperty('condition')) {
        if (data?.condition.length != 0) {
          query += ` where`;
          for (let item of data.condition) {
            // console.log(item)
            if (item?.type == 'BETWEEN') {
              query += `${item.condition} ${item.column} BETWEEN `;
              for (const [i, value] of item.value.entries()) {
                if (i === item.value.length - 1) {
                  query += ` AND ${value}`;
                } else {
                  query += ` ${value}`;
                }
              }
            } else {
              for (const [key, value] of Object.entries(item)) {
                if (key != 'type') {
                  query += ` ${key} = ${value}`
                } else {
                  query += ` ${value}`
                }
              }
            }
          }
        }

      }



      // console.log(query)
      return await this.executeUserQuery(query);
    } else {
      throw new BadRequestException(`Something went wrong in query column and value length not matched`);
    }
  }
  //-----------------------------* end update function *---------------------------------------------//


  ////////////////////////////////////////////////////////////////////////////////////////////////
  //--------------------------------* Get Datatable for Create Table *--------------------------------//
  async getDatatableDataForClientSide(data) {
    let dataset = await this.selectAll(data);
    return { data: dataset };
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  ///-------------------------------* Dynamic SP Creation *------------------------------------///
  async execSpWithParams(data, mult = 0) {
    if (data.params.length == 0 || data.name == '') {
      throw new BadRequestException('Please send proper data for sp')
    } else {
      let spString = `${data.name} ${data.params.toString()}`;
      if (mult == 1) {
        console.log(spString)
        return await this.executeQueryForMultTable(spString);
      } else {
        console.log(spString)
        return await this.executeQuery(spString);
      }
    }
  }
  ///-------------------------------* Dynamic SP Creation *------------------------------------///
  async execUserSpWithParams(data, mult = 0) {
    if (data.params.length == 0 || data.name == '') {
      throw new BadRequestException('Please send proper data for sp')
    } else {
      let spString = `${data.name} ${data.params.toString()}`;
      if (mult == 1) {
        // console.log(spString)
        return await this.executeUserQueryForMultTable(spString);
      } else {
        // console.log(spString)
        return await this.executeUserQuery(spString);
      }
    }
  }

  ///-------------------------------* Dynamic SP Creation *------------------------------------///
  async execOnlySp(data) {
    if (data.name == '') {
      throw new BadRequestException('Please send proper sp')
    } else {
      let spString = `${data.name}`;
      return await this.executeQuery(spString);
    }
  }

  ///-------------------------------* End Dynamic SP Creation *---------------------------------//


  //-----------------------------* MSSql Execution Function *---------------------------------//
  async executeQuery(query: string, parameters?: any): Promise<any> {
    const pool = await getPool(); // ✅ Use shared connection pool
    try {
      const result = await pool.request().query(query);
      // console.log(result);
      return result.recordset;  
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  //-------------------------------* Execute Query For Insert Query *---------------------------//
  ///////////////////////////////////////////////////////////////////////////////////////////////
  async  executeInsertQuery(queries: string[]): Promise<void> {
    if (!queries || queries.length === 0) {
      throw new Error("No queries provided");
    }

    console.log(queries);
  
    const pool = await getPool(); // ✅ Use shared connection pool
  
    const transaction = pool.transaction(); // ✅ Use pool to create a transaction
  
    try {
      await transaction.begin();
      const request = transaction.request();
  
      for (const query of queries) {
        if (!query || typeof query !== "string") {
          throw new Error("Invalid query provided");
        }
        await request.query(query);
      }
  
      await transaction.commit();
      console.log("Transaction committed successfully.");
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction rolled back due to error:", error);
      throw error;
    }
  }




  //////////////////////////////////////////////////////////////////////////////////////////////
  //************************************* End Funcation ************************************ */
  async executeQueryForMultTable(query: string, parameters?: any): Promise<any> {
    try {
      await databaseConfig.connect();
      const request = databaseConfig.request();
      if (parameters) {
        for (const [key, value] of Object.entries(parameters)) {
          request.input(key, value);
        }
      }
      // console.log(query)
      const result = await request.query(query);
      // if (databaseConfig.connected) {
      databaseConfig.close();
      // }

      return result.recordsets;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      if (databaseConfig.connected) {
        databaseConfig.close();
      }
      // databaseConfig.close();
    }


  }
  //----------------------------- MSSql Execution Function For User ---------------------------------//
  async executeUserQuery(query: string, parameters?: any): Promise<any> {
    try {
      // console.log(query)
      await databaseConfig1.connect();
      const request = databaseConfig1.request();
      if (parameters) {
        for (const [key, value] of Object.entries(parameters)) {
          request.input(key, value);
        }
      }
      // console.log(query)
      const result = await request.query(query);
      databaseConfig1.close();

      return result.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      if (databaseConfig1.connected) {
        databaseConfig1.close();
      }
    }
  }
  async executeUserQueryForMultTable(query: string, parameters?: any): Promise<any> {
    try {
      await databaseConfig1.connect();
      const request = databaseConfig1.request();
      if (parameters) {
        for (const [key, value] of Object.entries(parameters)) {
          request.input(key, value);
        }
      }
      // console.log(query)
      const result = await request.query(query);
      // if (databaseConfig1.connected) {
      databaseConfig1.close();
      // }

      return result.recordsets;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      if (databaseConfig1.connected) {
        databaseConfig1.close();
      }
    }
  }
  //---------------------------* End MSsql Connection and execute query function *---------------------//
  //---------------------------* Smart Table query Execution function *--------------------------------//
  async smartTable(data) {
    // console.log(data);
    let recordSet = JSON.parse(data.query);
    let limitData = recordSet.limit.split(' ');
    let orderby = ''
    if (recordSet.orderBy == '') {
      orderby = 'ORDER BY (SELECT NULL)';
    } else {
      orderby = recordSet.orderBy;
    }

    if (recordSet.where == '' && data.condition != '') {
      recordSet.where = ' where ' + data.condition
    } else if (recordSet.where != '' && data.condition != '') {
      recordSet.where = recordSet.where + ' AND ' + data.condition
    } else {
    }
    let limitRecord = ` OFFSET ${limitData[4]} ROWS FETCH NEXT ${limitData[2]} ROWS ONLY`
    let query = `select ${data.view != '' ? data?.view : '*'} from ${data.table} ${data?.join != '' && data?.join != undefined ? data?.join : ''} ${recordSet.where} ${data.groupby != '' && data.groupby != undefined ? data.groupby : ''}   ${orderby} ${limitRecord}`;
    // console.log(query);
    let dataset = await this.executeQuery(query, []);
    // console.log(dataset);
    return dataset;
  }


  /*******************************DATE Format Change**************************************/
  async dataChange(DateValue: any, cout?: any): Promise<any> {
    try {
      let convertedDate = '';

      // Check and parse the date based on known formats
      if (moment(DateValue, 'YYYY-MM-DD', true).isValid()) {
        // Format: YYYY-MM-DD
        convertedDate = moment(DateValue, 'YYYY-MM-DD').format('YYYYMMDD');
      } else if (moment(DateValue, 'DD-MM-YYYY', true).isValid()) {
        // Format: DD-MM-YYYY
        convertedDate = moment(DateValue, 'DD-MM-YYYY').format('YYYYMMDD');
      } else if (moment(DateValue, 'DD/MM/YYYY', true).isValid()) {
        // Format: DD/MM/YYYY
        convertedDate = moment(DateValue, 'DD/MM/YYYY').format('YYYYMMDD');
      } else {
        convertedDate = moment(DateValue).format('YYYYMMDD');
      }

      return convertedDate;
    } catch (error) {
      console.error('Error parsing date:', error.message);
      return null; // Return null or handle the error based on your use case
    }
  }

  async dataChangeForEdit(date: any,): Promise<any> {

    let formattedDate = moment(date).format('DD-MM-YYYY');
    return formattedDate;
  }


  async Get_SysDateTime() {
    let result = await this.executeQuery(`exec Get_SysDateTime`);
    return result[0][''];
  }

  async Get_Next_Trans_No(data) {
    // console.log('data', data)
    let object = {
      name: 'Get_Next_Trans_No',
      params: [data.COMPANY_ID, data.voutype, data.vouSubType, data.vouseries, data.effdate, data.TABLE_NAME]
    }
    return await this.execSpWithParams(object);
  }

  //-----------------------------* MSSql Execution Function *---------------------------------//
  async executeQueryOLDDB(query: string, parameters?: any): Promise<any> {
    try {
      const pool = await databaseConfigOLDDB.connect();
      const result = await pool.request().query(query);
      // console.log(result);
      return result.recordset;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }
}