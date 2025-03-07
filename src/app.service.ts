/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { databaseConfig } from './db.config';
import { Config } from './config/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// import { Cron } from '@nestjs/schedule';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class AppService {

  constructor(private config: Config,private readonly httpService: HttpService) { }
  //----------------------------- Insert Data Into Table As Received Data -----------------------//
  async insertData(data) {
    console.log(data.data);

    const dataset = await this.createObjectInsert(data.tableName, data);
    const fieldNames = dataset.field.join(', ');
    const values = dataset.value.join(', ');

    const query = `INSERT INTO ${dataset.table} (${fieldNames}) VALUES (${values})`;
    console.log(query);
    return this.executeQuery(query);

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
    console.log(datatype);
    Object.keys(data).forEach((ele: any) => {
      //console.log(data.data[ele])
      if (
        data[ele] != '' &&
        data[ele] != null &&
        data[ele] != undefined
      ) {
        const filterObj = datatype.filter((eles) => eles.COLUMN_NAME === ele);
        console.log(filterObj)
        if (filterObj.length != 0) {

          if (filterObj[0].DATA_TYPE == 'nvarchar' || filterObj[0].DATA_TYPE == 'varchar' && typeof data[ele] == 'string') {
            fieldArray.push(ele);
            valueArray.push(`N'${data[ele]}'`);
            console.log(typeof data[ele], "accepeted val=", data[ele]);

          } else if (filterObj[0].DATA_TYPE == 'int' || filterObj[0].DATA_TYPE == 'numeric' || filterObj[0].DATA_TYPE == 'nchar' && typeof data[ele] == 'number') {
            fieldArray.push(ele);
            console.log(filterObj[0])
            valueArray.push(Number(data[ele]));
            console.log(typeof data[ele], "accepeted val=", data[ele]);

          } else if (filterObj[0].DATA_TYPE === 'bit' && typeof data[ele] == 'boolean') {
            fieldArray.push(ele);
            valueArray.push(data[ele] ? '1' : '0');

          } else if (filterObj[0].DATA_TYPE === 'date') {
            fieldArray.push(ele);
            valueArray.push(`'${data[ele]}'`);
          } else {
            throw new BadRequestException(`Something went wrong we want ${filterObj[0].DATA_TYPE} but you send ${typeof (data[ele])}`);
          }
        }
      }
    });

    returnObj['field'] = fieldArray;
    returnObj['value'] = valueArray;
    console.log("col=", fieldArray, "val=", valueArray)
    return returnObj;
  }

  //-------------------------------* Insert data filtering function end *----------------------------//

  //=================================================================================================//
  //----------------------------* Selected Data Return As Per Requirement *------------------------//
  async selectAll(data) {
    console.log(data);

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
          console.log(item)
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

    console.log(query);
    return this.executeQuery(query, []);
  }
  //-----------------------------* End Function Selected Data Return *-----------------------------//


  //-----------------------------* Update table data *---------------------------------------------//
  async updateData(tableData: { tableName: string; data: any, }[]): Promise<any> {
    const queries = [];
    const parameters = {};

    for (const { tableName, data } of tableData) {
      const columns = Object.keys(data);
      const values = Object.values(data);


      const placeholders = values.map((value, index) => `${columns[index]} = ${value}`);
      // console.log(placeholders);

      let query = `UPDATE ${tableName} SET ${placeholders.join(',')}`;

      console.log(query)

      //--------------------------------* Start Where Condition Part *-------------------------///
      if (data.hasOwnProperty('condition')) {
        if (data?.condition.length != 0) {
          query += ` where`;
          for (const item of data.condition) {
            console.log(item)
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
      ///-------------------------------* End Where Condition Part *------------------------//////////

      console.log(query);
      queries.push(query);

      for (let i = 0; i < columns.length; i++) {
        parameters[`${tableName}_${columns[i]}`] = values[i];
      }
    }
    const result = await this.executeQuery(queries.join(';'), parameters);
    return result;

  }
  //-----------------------------* end update function *---------------------------------------------//


  ////////////////////////////////////////////////////////////////////////////////////////////////
  //--------------------------------* Get Datatable for Create Table *--------------------------------//
  async getDatatableDataForClientSide(data) {
    let dataset = await this.selectAll(data);
    return { data: [dataset] };
  }






  //-----------------------------* MSSql Execution Function *---------------------------------//
  async executeQuery(query: string, parameters?: any): Promise<any> {
    try {
      await databaseConfig.connect();
      const request = databaseConfig.request();
      if (parameters) {
        for (const [key, value] of Object.entries(parameters)) {
          request.input(key, value);
        }
      }
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      if (databaseConfig.connected) {
        databaseConfig.close();
      }
    }
  }
  //---------------------------* End MSsql Connection and execute query function *---------------------//

  //---------------------------* Datatable Button Nevigation List Config *----------------------------//
  async nevigation(code) {
    let dataSet = {
      "table": "CNFMASTTYPES",
      "view": [
        "NAVIGATION_OPTIONS"
      ],
      "condition": [{
        "CODE": code.code,
      }]
    }

    let result = await this.selectAll(dataSet);
    console.log(result)
    return result;
  }

  //-------------------------* Login Details API *-----------------------------//
  async generateRandamString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  async login(data) {
    if (data.username == 'admin' && data.password == 'admin') {
      let session_id = await this.generateRandamString(10)
      return { status: 'ok',session_id : session_id }
    } else {
      return { status: 'fail' }
    }
  }

  async testSp(data) {
    console.log(data);
    return await this.config.execSpWithParams(data)
  }

  async companyDetails(){
    let result  = await this.config.executeQuery(`select * from CNFCOMPANY`);
    return result[0];
  }

  //  //--------------------------------- Mobile App Generated pdf file remove every 24 hrs ---------------------------------------//
  //  @Cron('0 30 21 * * 1-6')
  //  handleCron() {
  //    fs.readdir('D:\\COMPSERV\\SITES\\BARAMATINEW\\report\\', (err, files) => {
  //  const pdfFiles = files.filter(el => path.extname(el) === '.pdf')
  //  pdfFiles.forEach(file => {
  //    console.log("Removing File -> ",file);
  //    var filename = "D:\\COMPSERV\\SITES\\BARAMATINEW\\report\\"+file;
  //    fs.unlink(filename,function(err){
  //      if(err) return console.log(err);
  //      console.log('file deleted successfully');
  //     });  
  //    });
  //  });
  //  }


  //----------------- GSTNO Number Verification
  async fetchData(data) {
      console.log(data);
      const url = `http://sheet.gstincheck.co.in/check/8e47366db96db6ed0680bfec9cf60873/${data.GSTNO}`; // Example API

      const response = await firstValueFrom(this.httpService.get(url));
      return response.data; // Return data from the response
  }
  
}

