import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Config } from './config/config';
import axios from 'axios';

import { buttonNevigation } from './config/tableButtonNevigation'; 
import * as fs from 'fs';
import * as path from 'path';
// var axios = require('axios').default;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
              private readonly config: Config,
              private readonly nevigation: buttonNevigation) {}

  @Post('/insert')
  insertData(@Body() data) {
    return this.appService.insertData(data);
  }

  @Post('/select')
  getData(@Body() data) {
    return this.appService.selectAll(data);
  }

  @Post('/datatable')
  getDatatableData(@Body() data) {
    return this.appService.getDatatableDataForClientSide(data);
  }

  /*******UPDATE********/
  @Post('/update')
  async updateData(
    @Body() data: { [key: string]: any; column: string }[],
  ): Promise<any> {
    if (Array.isArray(data)) {
      const tableData = data.map((item) => ({
        tableName: item.tableName,
        column: item.column,
        data: item.data,
      }));
      const result = await this.appService.updateData(tableData);
      return result;
    }
  }

  //-------------* Button Nevigation *--------------//
  @Post('/buttonNevigation')
  async buttonNevigation(@Body() data){
     return this.appService.nevigation(data);
  }

  //-------------* Login API *---------------------//
  @Post('/login')
  async login(@Body() data){
    return this.appService.login(data);
  }

  @Get()
  async test(){
    return {msg : 'Test Working'}
  }

  @Post('/TestSP')
  async testSp(@Body() data){
    return this.appService.testSp(data);
    
  }

  @Get('/companyDetails')
  async companyDetails(){
    return this.appService.companyDetails();
  }


  @Get('/WeightTrack')
  async weightDetails(){
    const response = await axios.get('http://192.168.1.199:9000/GetWeightData');
    return response.data;

  }
  
//------------------- GST Number Checking API ----------------------
@Post('/checkGstNumberValid')
async checkGSTNumberValidation(@Body() data){
  console.log(data);
  return await this.appService.fetchData(data);
  // const response = await this.axios.get('http://sheet.gstincheck.co.in/check/8e47366db96db6ed0680bfec9cf60873/27AGRPD1427B1ZS');
  // console.log('API response:', response.data);
  // return {"flag":true,"message":"GSTIN  found.","data":{"ntcrbs":"SPO","adhrVFlag":"Yes","lgnm":"VIKRAMSINHA VIJAYSINHA DESHMUKH","stj":"State - Maharashtra,Zone - PUNE_NORTH_EAST,Division - PUNE_NORTH,Charge - DHANKAWADI_701","dty":"Regular","cxdt":"","gstin":"27AGRPD1427B1ZS","nba":["Service Provision","Factory / Manufacturing","Supplier of Services"],"ekycVFlag":"Not Applicable","cmpRt":"NA","rgdt":"01/07/2017","ctb":"Proprietorship","pradr":{"adr":"55A, 55A, SAIKRUPA, DHANKWADI, PUNE, Pune, Maharashtra, 411043","addr":{"flno":"","lg":"","loc":"PUNE","pncd":"411043","bnm":"SAIKRUPA","city":"","lt":"","stcd":"Maharashtra","bno":"0","dst":"Pune","st":"DHANKWADI"}},"sts":"Active","tradeNam":"3 R WASTE MANAGEMENT","isFieldVisitConducted":"No","adhrVdt":"23/06/2023","ctj":"State - CBIC,Zone - PUNE,Commissionerate - PUNE - II,Division - DIVISION-VII KATRAJ,Range - RANGE-V (Jurisdictional Office)","einvoiceStatus":"No","lstupdt":"","adadr":[],"ctjCd":"","errorMsg":null,"stjCd":""}}
}

}


