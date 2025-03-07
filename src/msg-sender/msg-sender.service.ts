import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Config } from 'src/config/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
const axios = require('axios').default;


@Injectable()
export class MsgSenderService {
  private transporter: nodemailer.Transporter;

  constructor(private config: Config,private httpService: HttpService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail'
      auth: {
        user: 'mailto:niranjankhochare1999@gmail.com', // your email address
        pass: 'jozq sunb pvyi yppo', // your email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, htmlContent: string, attachments: Array<{ filename: string; path: string }>) {
    const mailOptions = {
      from: 'mailto:niranjankhochare1999@gmail.com',
      to,
      subject,
      text,
      html: htmlContent,
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ' + error);
    }
  }

  // private async getConnectionPool(): Promise<ConnectionPool> {
  //   try {
  //     if (!this.pool) {
  //       // Initialize the connection pool if not already established
  //       this.pool = await sql.connect(databaseConfig);
  //     }
  //     return this.pool;
  //   } catch (error) {
  //     console.error('Error creating connection pool:', error);
  //     throw error;
  //   }
  // }

  // async checkDatabaseConnection(): Promise<string> {
  //   try {
  //     const pool = this.getConnectionPool();
  //     // Try to connect to the database
  //     return 'Database connection successful'; // Success message
  //     // pool.close();
  //     // Close the connection pool after the test
  //   } catch (error) {
  //     console.log('An error occured:', error);
  //     return 'Database connection failed';
  //   }
  // }

  async validate_cutomer(data) {
    const CNFCOMPANY = await this.config.executeQuery(`select * from CNFCOMPANY`);
    const result = await this.config.executeQuery(`SELECT * FROM MSTEMAILCONFIG WHERE TRAN_TYPE = ${data.TRAN_TYPE} AND TRAN_SUBTYPE = ${data.TRAN_SUBTYPE} AND TRAN_SERIES = ${data.TRAN_SERIES}`);
    const attachdata = await this.config.executeQuery(`SELECT * FROM MSTCOMMATTACHMENT WHERE REF_CODE = ${result[0].CODE}`);
    const TABLEASSIGN = await this.config.executeQuery(`TABLEASSIGN ${data.TRAN_NO}`);
    let filteredTnames = TABLEASSIGN
    .filter(item => item.tname.includes(data.TABLE_NAME))
    .map(item => item.query);
    const TranData =  await this.config.executeQuery(` ${filteredTnames[0]}`)
    // TranData[0].forEach(TranData => {
      for (let item of attachdata) {
        const parameterString = this.asyncgenerateFormulaString(item,TranData[0],'RPT_PARAMS')
        attachdata[0].parameterString = parameterString; // You can adjust to store multiple if needed
      }
    // });
    CNFCOMPANY.forEach(company => {
      for (let item of attachdata) {
        const formulaString = this.asyncgenerateFormulaString(item, company,'RPT_FORMULAS')
        attachdata[0].formulaString = formulaString; // You can adjust to store multiple if needed

      }
    });
    const attachments =[]
    for (let item of attachdata) {
      // let a = `${await this.config.reportUrl}/report.php?fileName=${item.RPT_NAME}&parameter=${item.parameterString}&formulas=${item.formulaString}&sessionid ='1'`
      // console.log(a)
      // let res =  await this.getReport(item,result[0].RPT_URL,data.TRAN_NO);
    
      let res = await this.getReportCommon({
        fileName: item.RPT_NAME,
        parameters: item.parameterString, // Replace placeholder if needed
        formulas: item.formulaString,
        session_id: data.TRAN_NO,
      })
      attachments.push({filename:res.filename,path:result[0].RPT_FILE_PATH+''+res.filename})
    }

    if (result.length != 0) {
      // const attachments = data.attachedFile && data.attachedFile.length > 0
      //   ? data.attachedFile // Use the attached files
      //   : []; // No attachments
      // // Send the email to the validated user
      await this.sendMail(data.EMAIL_ID, result[0].SUBJECT, '', result[0].BODY, attachments); // Sending actual email

      return { STATUS_CODE: 0 }; // Optionally return the subject and body
    } else {
      return { STATUS_CODE: 21 };
    }


  }

  asyncgenerateFormulaString(report, company,type) {
    var formulas
    if(type == 'RPT_FORMULAS'){
       formulas = report.RPT_FORMULAS.split(',');
    }else if(type == 'RPT_PARAMS'){
      formulas = report.RPT_PARAMS.split(',');
    }
    const result = formulas.map(formula => {
      const [key, value] = formula.split(':');
      if (value.includes('+')) {
        // Handle concatenation for address
        const parts = value.split('+').map(part => part.trim());
        const concatenatedValue = parts.map(part => company[part]).join(' ');
    
        if(type == 'RPT_FORMULAS'){
          return `-b "${key.trim()}: ${concatenatedValue}"`;
        }else if(type == 'RPT_PARAMS'){
         return `-a "${key.trim()}: ${concatenatedValue}"`;
       }
      }if (value.includes('-')) {
        // Handle concatenation for address
        const parts = value.split('-').map(part => part.trim());
        let concatenatedValue = parts.map(part => company[part]).join('');
        concatenatedValue = String(concatenatedValue) + String(parts[1])
        if(type == 'RPT_FORMULAS'){
          return `-b "${key.trim()}: ${concatenatedValue}"`;
        }else if(type == 'RPT_PARAMS'){
         return `-a "${key.trim()}: ${concatenatedValue}"`;
       }
      }  else {
        // Regular key-value mapping
        if(type == 'RPT_FORMULAS'){
          return `-b "${key.trim()}: ${company[value.trim()]}"`;
       }else if(type == 'RPT_PARAMS'){
         return `-a "${key.trim()}: ${company[value.trim()]}"`;
       }
      }
    });

    return result.join(', ');
  }
  async getReport(data: any,URL:any,TRAN_NO:any): Promise<any> {    
    const params = {
      fileName: data.RPT_NAME,
      parameter: data.parameterString, // Replace placeholder if needed
      formulas: data.formulaString,
      // sessionid: '1',
      TRAN_NO:TRAN_NO
    };

    try {
      
      const response = await lastValueFrom(this.httpService.get(URL, { params }));
      return response.data;
    } catch (error) {
      // Handle error as needed
      throw new Error('Failed to fetch the report');
    }
  }

  async insTable(files) {
    let queryArray = new Array();

    let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
    let SR_NO = 0
    if(files.length!=0){
      const parts = files[0].filename.split('-');
      const TRAN_NO = parts[0].trim();
      for (let item of files) {
        item['SR_NO'] = SR_NO;
        item['TRAN_NO'] = TRAN_NO;
        item['FILE_NAME'] = item.filename
        item['ORG_FILENAME'] = item.originalname
        item['SYSADD_DATETIME'] = sysDate[0][''];
        // item['SYSADD_LOGIN'] = data.dsHeader.SYSADD_LOGIN;
        item['SYSCHNG_DATETIME'] = sysDate[0][''];
        // item['SYSCHNG_LOGIN'] = data.dsHeader.SYSADD_LOGIN;
        item['STATUS_CODE'] = 0;
        item['AMEND_NO'] = 0;
        item['tableName'] = 'TRNCOMPREFATTACHFILE';
  
        queryArray.push(await this.config.insertData(item));
        SR_NO++
      }

      return await this.config.executeInsertQuery(queryArray);

    }
  }

  async getReportCommon(data: any): Promise<any> {    
    // let URL='http://192.168.1.156:3000' /**NANDANERP */  // let URL='http://192.168.1.199:6001' /**NANDANERP */
    let URL='http://192.168.1.199:6002' /**NANDANERPTEST*/
    // let URL='http://192.168.1.199:6003' /**OLDNANDANERP*/
    const params = {
      fileName: data.fileName,
      parameters: data.parameters, // Replace placeholder if needed
      formulas: data.formulas,
      session_id: data.session_id,
    //   TRAN_NO:TRAN_NOx
    };

    try {
      const response1 = await axios.get(URL, { params });
      const data = response1.data;  // Extract the data from the response
      console.log(data);           // Log or use the received data
      return data;
    } catch (error) {
      // Handle error as needed
      throw new Error('Failed to fetch the report');
    }
  }
  
  
  
  async getReportCommon_PAYROLL(data: any): Promise<any> {    
    let URL='http://192.168.1.199:6003' /***/
    const params = {
      fileName: data.fileName,
      parameters: data.parameters, // Replace placeholder if needed
      formulas: data.formulas,
      session_id: data.session_id,
    //   TRAN_NO:TRAN_NOx
    };

    try {
      const response1 = await axios.get(URL, { params });
      const data = response1.data;  // Extract the data from the response
      console.log(data);           // Log or use the received data
      return data;
    } catch (error) {
      // Handle error as needed
      throw new Error('Failed to fetch the report');
    }
  }
}
