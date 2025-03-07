import { CommonService } from './common.service';
import { Config } from 'src/config/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  BadRequestException, Body, Controller, Delete, Get, Param,
  Patch, Post, Query, Res, UploadedFile, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService, private config: Config) { }

  @Get('/MenusNav')
  getMenuNavDetails() {
    return this.commonService.menuNavDetails()
  }

  @Get('/Testing')
  async testing(){
    let array = [
      "INSERT INTO TRNCFEEDMATH (COMPUNIT_ID, SYSADD_LOGIN, TRAN_NO, REFCOMPUNIT_ID, TRAN_SUBTYPE, SHORT_NAME, TRAN_DATE, RECEIVER_NO, RECEIVER_NAME, FREIGHT, PER_BOX, GL_ACNO2, OTHER_AMT1, OTHER_AMT3, SEC_DEPOSITE, GL_ACNO, SUB_GLACNO, TRAN_AMT, OTHER_AMT2, SHORT_NARRTN, STATUS_CODE, PARTY_STATE, IS_GSTINVOICE, IS_FLAG, IS_GSTINREGISTERED, SYSADD_DATETIME, SYSCHNG_DATETIME, SYSCHNG_LOGIN) VALUES (104, N'ADMIN', 104242560123014691, 0, 23, N'H-CR', N'20250207', N'7276703607', N'Ajit Sutar', N'0', 0, 101000256, 116.25, 0, 1.5, 101000005, 101170001, 7750.00, 0, N'test', 21, 27, 1, 0, 0, N'2025020723:17:15', N'2025020723:17:15', N'ADMIN')",
      "INSERT INTO TRNGATETRACKDETAILS (TRAN_NO, TRAN_DATE, TRAN_SUBTYPE, SUB_GLACNO, STATUS_CODE, SYSADD_DATETIME, SYS_DATE, USER_NAME, QTY) VALUES (104242560123014691, N'20250207', 23, 101170001, 21, N'2025020723:17:15', N'ADMIN', N'sa', 10)",
      "INSERT INTO TRNCFEEDMATIGPASS (MAT_CODE, QTY, RATE, AMOUNT, CGST_RATE, CGST_AMOUNT, SGST_RATE, SGST_AMOUNT, GL_ACNO, WEIGHT, TOTAL_WEIGHT, TRAN_NO, TRAN_SUBTYPE, CHAPTER_CODE, CHAPTER_NO, UNIT_CODE, TAX_CODE, DISC_ON_BAG, STATUS_CODE, TRAN_DATE, CUST_SUB_GLACNO, OUTDISC_AMOUNT, SR_NO) VALUES (1010400089, 10, 775, 7750.00, 0, 0.00, 0, 0.00, 101000067, 25, 250, 104242560123014691, 23, 1010024, N'2309', NOS, 102, 0, 21, N'20250207', 101170001, 7750.00, 1)"
    ]
    console.log(array)
    await this.config.executeInsertQuery(array);
    return {msg :'working'}
  }

  @Post('/autoIncrement')
  autoIncrement(@Body() data) {
    return this.commonService.autoIncrement(data);
  }

  @Post('/menuDetails')
  menuDetails(@Body() data) {
    return this.commonService.menuDetails(data);
  }

  @Post('/MenuDocWiseNevigation')
  menuDocWiseNevigation(@Body() data) {
    return this.commonService.menuDocWiseNevigation(data);
  }
  @Post('/MSTMenuDocWiseNevigation')
  MSTDocWiseNevigation(@Body() data) {
    return this.commonService.MSTDocWiseNevigation(data);
  }
  @Post('/GetHelpList')
  getHelpList(@Body() data) {
    return this.commonService.getHelpList(data);
  }

  @Post('/Upd_StatusTransactionsFinance')
  async Upd_StatusTransactionsFinance(@Body() data) {
    return this.commonService.Upd_StatusTransactionsFinance(data);
  }

  @Post('/Upd_StatusTransactionsCattleFeed')
  async Upd_StatusTransactionsCattleFeed(@Body() data) {
    return this.commonService.Upd_StatusTransactionsCattleFeed(data);
  }


  @Post('/Sel_RootChillers')
  async Sel_RootChillers(@Body() data) {
    return this.commonService.Sel_RootChillers(data);
  }
  @Post('/Sel_ChillerSansthas')
  async Sel_ChillerSansthas(@Body() data) {
    return this.commonService.Sel_ChillerSansthas(data);
  }

  @Post('/MenuNevigationBtnAccessDataAsPerUser')
  getUserAccess(@Body() data) {
    return this.commonService.getUserAccess(data);
  }
  // this endpoint for common geting data by angular  
  @Post('/GetData')
  async GetData(@Body() data) {
    return this.commonService.GetData(data);
  }

  @Post('/Get_TableFieldswithClause')
  Get_TableFieldswithClause(@Body() data) {
    return this.commonService.Get_TableFieldswithClause(data);
  }
  @Post('/Sel_PackedMilkList')
  Sel_PackedMilkList(@Body() data) {
    return this.commonService.Sel_PackedMilkList(data);
  }

  @Get('/centerDetails')
  getCenterDetails() {
    return this.commonService.getCenterDetails();
  }
  @Post('/Sel_SaleMilkJawakLooseBillProcess')
  Sel_SaleMilkJawakLooseBillProcess(@Body() data) {
    return this.commonService.Sel_SaleMilkJawakLooseBillProcess(data);
  }
  @Post('/Sel_MasterCodeList')
  Sel_MasterCodeList(@Body() data) {
    return this.commonService.Sel_MasterCodeList(data);
  }
  @Post('/Sel_DepartMentWsMilkDealers')
  Sel_DepartMentWsMilkDealers(@Body() data) {
    return this.commonService.Sel_DepartMentWsMilkDealers(data);
  }
  @Post('/getFATData')
  snf(@Body() data) {
    return this.commonService.getFAT(data);
  }
  @Post('/Sel_ExistingTransactionsDairyDesp')
  Sel_ExistingTransactionsDairyDesp(@Body() data) {
    return this.commonService.Sel_ExistingTransactionsDairyDesp(data);
  }
  @Post('/docDayWiseClaction')
  docDayWiseClaction(@Body() data) {
    return this.commonService.docDayWiseClaction(data);
  }

  @Post('/Sel_SaleMilkJawakPackBillProcess')
  Sel_SaleMilkJawakPackBillProcess(@Body() data) {
    return this.commonService.Sel_SaleMilkJawakPackBillProcess(data);
  }

  @Post('/Sel_TransporterBillPackPosting')
  Sel_TransporterBillPackPosting(@Body() data) {
    return this.commonService.Sel_TransporterBillPackPosting(data);
  }

  @Post('/Sel_SaleJawakPackMilkBillPosting')
  Sel_SaleJawakPackMilkBillPosting(@Body() data) {
    return this.commonService.Sel_SaleJawakPackMilkBillPosting(data);
  }
  @Get('/GstPostKeyData')
  async getPostKeyData() {
    return this.commonService.getPostKeyData();
  }
  @Post('/getPostKeyDataIdWise')
  async getPostKeyDataIdWise(@Body() data) {
    return this.commonService.getPostKeyDataIdWise(data);
  }

  @Get('/getGstCategoryData')
  async getGstCategoryData() {
    return this.commonService.getGstCategoryData();
  }

  @Get('/getGstCategoryData1')
  async getGstCategoryData1() {
    return this.commonService.getGstCategoryData1();
  }

  @Post('/ConstantAccount')
  async getConstantAccount(@Body() data) {
    return this.commonService.getConstantAccount(data);
  }

  //----* Get Date Dropdown List Data
  @Post('/BillDateSP')
  async billDateSP(@Body() data) {
    return this.commonService.billDateSP(data);
  }

  @Post('/Sel_TransactionCattleFeedMaterialPurchase')
  async CattleFeedMaterialPurchase(@Body() data) {
    return this.commonService.cattleFeedMaterialPurch(data);
  }

  @Get('/getSupplierList')
  async getSupplierList() {
    return this.commonService.getSupplierList();
  }

  @Get('/getSupplierListCattlefeed')
  async getSupplierListCattlefeed() {
    return this.commonService.getSupplierListCattlefeed();
  }

  @Get('/GetMSTCOMPUNITSData')
  async GetMSTCOMPUNITSData() {
    return this.commonService.GetMSTCOMPUNITSData();
  }

  //Get HSN-SAC Data
  //  @Post('/HSNSAC')
  //  async getHSNSACList(@Body() data) {
  //    return await this.commonService.HSNSACLIST(data);
  //  }

  //Get TDS category
  @Post('/getTDSCategory')
  async getTDSCategory(@Body() data) {
    return await this.commonService.getTDSCategory(data);
  }

  @Post('/Sel_GetMaterialsGSTList')
  async Sel_GetMaterialsGSTList(@Body() data) {
    return await this.commonService.getMaterialDetails(data);
  }

  // @Post('/Sel_GetMaterialsGSTList1')
  // async Sel_GetMaterialsGSTList1(@Body() data) {
  //   return await this.commonService.getMaterialDetails1(data);
  // }

  @Post('/Sel_FatList')
  async Sel_FatList(@Body() data) {
    return this.commonService.Sel_FatList(data);
  }
  @Post('/Sel_GetLedgerBalance')
  async Sel_GetLedgerBalance(@Body() data) {
    return this.commonService.Sel_GetLedgerBalance(data);
  }
  @Post('/GET_VOUTYPE_FROM_MENUDOC')
  async GET_VOUTYPE_FROM_MENUDOC(@Body() data) {
    return this.commonService.GET_VOUTYPE_FROM_MENUDOC(data);
  }

  @Post('/getSpData')
  async getSpData(@Body() data) {
    return this.commonService.getSpData(data);
  }

  @Post('/Sel_GetSubGLAccount')
  async Sel_GetSubGLAccount(@Body() data) {
    return this.commonService.Sel_GetSubGLAccount(data);
  }

  @Post('/getSp')
  async getSp(@Body() data) {
    return this.commonService.getSp(data);
  }
  @Get('/EmployeeList')
  async get_EmployeeList() {
    return await this.commonService.getEmployeeList();
  }

  @Get('/GetTransporterData')
  async getTransporterData() {
    return this.commonService.getTransporterData();
  }


  @Post('/Sel_MSTAcctGLSUBGL')
  async Sel_MSTAcctGLSUBGL(@Body() data) {
    return this.commonService.Sel_MSTAcctGLSUBGL(data);
  }

  @Post('/Sel_ControlAcctGl')
  async Sel_ControlAcctGl(@Body() data) {
    return this.commonService.Sel_ControlAcctGl(data);
  }
  @Post('/Sel_GroupWiseLedgerList')
  async Sel_GroupWiseLedgerList(@Body() data) {
    return this.commonService.Sel_GroupWiseLedgerList(data);
  }
  @Post('/Sel_GetSubGLAccoun')
  async Sel_GetSubGLAccoun(@Body() data) {
    return this.commonService.Sel_GetSubGLAccoun(data);
  }
  @Post('/Sel_ReportHelp')
  async Sel_ReportHelp(@Body() data) {
    return this.commonService.Sel_ReportHelp(data);
  }
  @Post('/Sel_ReportLinking')
  async Sel_ReportLinking(@Body() data) {
    return this.commonService.Sel_ReportLinking(data);
  }
  @Post('/Sel_TransactionsFinance')
  async Sel_TransactionsFinance(@Body() data) {
    return this.commonService.Sel_TransactionsFinance(data);
  }
  @Get('/pumpUnits')
  async pumpUnits() {
    return this.commonService.pumpUnits();
  }
  //------------- Visual Inspection Submit Form
  @Post('/submitVisualInspection')
  async submitVisualInspection(@Body() data) {
    return this.commonService.submitVisualInspection(data);
  }

  //------------ Insert Vender demand Letter
  @Post('/insertDemandLetter')
  async insertVenderDemandDebit(@Body() data) {
    return this.commonService.insertVenderDemandDebit(data);
  }

  //------------ rokh-demand-insert
  @Post('/rokhDemandInsert')
  async insertDemand(@Body() data) {
    return this.commonService.insertDemand(data);
  }

  //------------ Get Sansath Details for GatePass
  @Get('/SansthaData')
  async getSansthaData() {
    return this.commonService.getSansthaDetails();
  }

  @Get('/SansthaDataDraft')
  async getSansthaDataDraft() {
    return this.commonService.getSansthaDataDraft();
  }

  @Post('/SansthaData1')
  async getSansthaData1(@Body() data) {
    return this.commonService.getSansthaDetails1(data.data);
  }

  @Post('/cattleMaterialList')
  async getCattleMaterialList(@Body() data) {
    return await this.config.executeQuery(`exec Sel_GetMaterialsGSTList @intMaterialType=${data.code},@chrWhereclause=N'STATUS_CODE=0',@chrEffectDate=N'20250206'`);
  }
  @Post('/cattleMaterialList1')
  async getCattleMaterialList1(@Body() data) {
    return await this.config.executeQuery(`exec Sel_GetMaterialsGSTList @intMaterialType=0,@chrWhereclause=N'STATUS_CODE=0 AND MATERIAL_TYPE IN(104,107)',@chrEffectDate=N''`);
  }

  @Get('/COMPUNITDATA')
  async getCompUnitData() {
    return await this.config.executeQuery(`select * from MSTCOMPUNITS where STATUS_CODE=0 AND CODE=101`);
  }

  ///--------------- Dairy Equipment Material Data --------------------
  @Post('/insertGatePassDEM')
  async insertGatePass(@Body() data) {
    if (data.data.dsHeader.COMPUNIT_ID == 103) {
      return this.commonService.insertGatePass(data);
    } else if (data.data.dsHeader.COMPUNIT_ID == 106) {
      return this.commonService.insertGatePassCEMM(data);
    } else if (data.data.dsHeader.COMPUNIT_ID == 104) {
      return this.commonService.insertGatePassCETTLE(data);
    }
  }



  @Get('/dsCashAcSub')
  async getAcMsbData() {
    return this.commonService.dsCashAcSub();
  }

  @Post('/dsCompAccountData')
  async dsCompAccountData(@Body() data) {
    return this.commonService.dsCashAccountDetails(data.dept);
  }
  @Post('/getUserSpdata')
  async getUserSpdata(@Body() data) {
    return this.commonService.getUserSpdata(data);
  }
  @Post('/DeleteQury')
  async DeleteQury(@Body() data) {
    return this.commonService.DeleteQury(data);
  }

  @Post('/MASTDeleteQury')
  async MASTDeleteQury(@Body() data) {
    return this.commonService.MASTDeleteQury(data);
  }

  @Post('/lastPurchaseDate')
  async lastPurchaseDate(@Body() data) {
    return this.commonService.lastPurchaseDate(data.subglacno);
  }

  @Post('/getMstSubGLAcNoPurchaseFlag')
  async getMstSubGLAcNoPurchaseFlag(@Body() data) {
    return this.commonService.getMstSubGLAcNoPurchaseFlag(data.code);
  }


  // ----------------------- Dashboard Section ---------------------//
  // Dairy 
  @Post("dairyDetails")
  async dairyDetails(@Body() body) {
    return await this.commonService.dairyDetails(body);
  }

  @Post("dairyGraph")
  async dairyGraph(@Body() body) {
    return await this.commonService.dairyGraph(body);
  }
  @Post("dairyDispatchLoosePackingMilk")
  async dairyDispatchLoosePackingMilk(@Body() body) {
    return await this.commonService.dairyDispatchLoosePackingMilk(body);
  }

  // @Post("dairyPackingProductionMilkPacking")
  // async dairyPackingProductionMilkPacking(@Body() body){
  //   return await this.commonService.dairyPackingProductionMilkPacking(body);
  // }

  @Post("dairyPackingProductionMilkQtyLtr")
  async dairyPackingProductionMilkQtyLtr(@Body() body) {
    return await this.commonService.dairyPackingProductionMilkQtyLtr(body);
  }

  @Post('/GetAllSupplierData')
  async getAllSupplierData(){
    return await this.config.executeQuery(`select SUB_GLACNO,SUBGL_LONGNAME,GL_ACNO from MSTACCTGLSUB where STATUS_CODE = 0`)
  }
  //Sanstha Chalu band form
  @Get('/sansthaChaluBandTableData')
  async sansthaChaluBandTableData() {
    return await this.config.executeQuery(`select SUB_GLACNO,SUBGL_LONGNAME,SST_DATE,CST_DATE,SERVICETAX_DATE,OUTSTAND_CODE from MSTACCTGLSUB where OUTSTAND_CODE = 1`)
  }

  //Sanstha chalu band form
  @Post('/sansthaChaluBandUpdateData')
  async sansthaChaluBandUpdate(@Body() data) {
    for (let items of data) {
      await this.config.executeQuery(`update MSTACCTGLSUB set OUTSTAND_CODE = 0 where SUB_GLACNO = ${items}`)
    }
    return true
  }

  //Get GST purchase data return 
  @Post('/getGSTInternalData')
  async getGSTInternalData(@Body() data) {
    if (data.DEPT == 106) {
      return await this.config.executeQuery(`exec Sel_ExistingTransactionsFinance @bintTranNo=${data.TRAN_NO},@intTranSubType=5,@intAmendNo=0`);
    } else if (data.DEPT == 103) {
      return await this.config.executeQuery(`exec Sel_ExistingTransactionsFinance @bintTranNo=${data.TRAN_NO},@intTranSubType=5,@intAmendNo=0`);
    } else if (data.DEPT == 101) {
      return await this.config.executeQuery(`exec Sel_ExistingTransactionsFinance @bintTranNo=${data.TRAN_NO},@intTranSubType=5,@intAmendNo=0`);
    }
  }

  @Post('/Ins_MSTCATTLESECDEPSLAB')
  async MSTCATTLESECDEPSLAB(@Body() data) {
    return await this.commonService.MSTCATTLESECDEPSLAB(data);
  }
  @Post('/Ins_MSTCATTLEFEEDITEMRATE')
  async MSTCATTLEFEEDITEMRATE(@Body() data) {
    return await this.commonService.MSTCATTLEFEEDITEMRATE(data);
  }
  @Post('/Ins_MSTPUMPITEMRATE')
  async MSTPUMPITEMRATE(@Body() data) {
    return await this.commonService.MSTPUMPITEMRATE(data);
  }
  @Post('/Ins_MSTCFEEDRAWQCTESTSMAT')
  async MSTCFEEDRAWQCTESTSMAT(@Body() data) {
    return await this.commonService.MSTCFEEDRAWQCTESTSMAT(data);
  }
  @Post('/NaveRakam')
  async setNaveRakam(@Body() data) {
    return await this.commonService.setNaveRakam(data);
  }
  @Post('/pashukhadypoticount')
  async pashukhadypoticount(@Body() data) {
    return await this.commonService.pashukhadypoticount(data);
  }
  @Post('/matrateforAPO')
  async matrateforAPO(@Body() data) {
    return await this.commonService.matrateforAPO(data);
  }
  @Post('/empatendance')
  async empatendance(@Body() data) {
    return await this.commonService.empatendance(data);
  }

  //Rokh kharch magni records from all module
  @Get('/rokhkharchmagniallmodule')
  async rokhkharchmagniallmodule() {
    return await this.config.executeQuery(`SELECT
    TRNACCTOTHH.TRAN_NO,
    0 AMEND_NO,
    TRNACCTOTHH.SHORT_NAME,
    SUBSTRING(CONVERT(VARCHAR, TRNACCTOTHH.TRAN_NO), 4, 4)
        + '-' + SUBSTRING(CONVERT(VARCHAR, TRNACCTOTHH.TRAN_NO), 13, 6) STRAN_NO,
    TRNACCTOTHH.TRAN_SUBTYPE,
    TRNACCTOTHH.TRAN_DATE,
    dbo.FORMAT_DATE(TRNACCTOTHH.TRAN_DATE) PRN_TRANDATE,
    MSTACCTGLSUBGLVW.AC_NAME,
    TRNACCTOTHH.EXT_REF1 EXT_REFNO,
    TRNACCTOTHH.EXT_REFDATE1 EXT_REFDATE,
    dbo.FORMAT_DATE(TRNACCTOTHH.EXT_REFDATE1) PRN_REFDATE,
    TRNACCTOTHH.TRAN_AMT,
    TRNACCTOTHH.SYSADD_LOGIN CREATED_BY,
    dbo.FORMAT_DATE(LEFT(TRNACCTOTHH.SYSADD_DATETIME, 8)) CREATED_ON,
    LEFT(TRNACCTOTHH.SYSADD_DATETIME, 8) CREATEDON,
    TRNACCTOTHH.STATUS_CODE,
    
    -- CASE logic directly in SELECT
    CASE 
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '101' THEN N'मुख्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '103' THEN N'डेअरी साहित्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '104' THEN N'पशूखाद्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '105' THEN N'पंप विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '106' THEN N'पशूऔषध विभाग'
        ELSE 'अन्य विभाग'  -- Default case if none of the conditions match
    END AS DEPT_NAME,
    
    CASE
        WHEN TRNACCTOTHH.SYSADD_LOGIN = 'ADMIN' THEN (SELECT ISNULL(GL_ACNO, 0) IS_MakerCheker FROM MSTACCTCONST WHERE CODE = 106)
        ELSE 0 
    END OWN_ENTRY

FROM
    TRNACCTOTHH
    LEFT OUTER JOIN MSTACCTGLSUBGLVW 
    ON ISNULL(TRNACCTOTHH.SUB_GLACNO, TRNACCTOTHH.GL_ACNO) = MSTACCTGLSUBGLVW.AC_NO
WHERE
    LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) IN (101, 103, 104, 105, 106)
    AND CONVERT(INT, SUBSTRING(CONVERT(VARCHAR, TRNACCTOTHH.TRAN_NO), 8, 3)) = 120
    AND TRNACCTOTHH.TRAN_SUBTYPE = 1
    AND TRNACCTOTHH.STATUS_CODE = 22
ORDER BY
    TRNACCTOTHH.TRAN_DATE DESC,
    TRNACCTOTHH.TRAN_NO DESC;
  `)
  }

  //Rokh kharch magni records from all module
  @Get('/rokhkharchmagniMD')
  async rokhkharchmagniMD() {
    return await this.config.executeQuery(`SELECT
    TRNACCTOTHH.TRAN_NO,
    0 AMEND_NO,
    TRNACCTOTHH.SHORT_NAME,
    SUBSTRING(CONVERT(VARCHAR, TRNACCTOTHH.TRAN_NO), 4, 4)
        + '-' + SUBSTRING(CONVERT(VARCHAR, TRNACCTOTHH.TRAN_NO), 13, 6) STRAN_NO,
    TRNACCTOTHH.TRAN_SUBTYPE,
    TRNACCTOTHH.TRAN_DATE,
    dbo.FORMAT_DATE(TRNACCTOTHH.TRAN_DATE) PRN_TRANDATE,
    MSTACCTGLSUBGLVW.AC_NAME,
    TRNACCTOTHH.EXT_REF1 EXT_REFNO,
    TRNACCTOTHH.EXT_REFDATE1 EXT_REFDATE,
    dbo.FORMAT_DATE(TRNACCTOTHH.EXT_REFDATE1) PRN_REFDATE,
    TRNACCTOTHH.TRAN_AMT,
    TRNACCTOTHH.SYSADD_LOGIN CREATED_BY,
    dbo.FORMAT_DATE(LEFT(TRNACCTOTHH.SYSADD_DATETIME, 8)) CREATED_ON,
    LEFT(TRNACCTOTHH.SYSADD_DATETIME, 8) CREATEDON,
    TRNACCTOTHH.STATUS_CODE,
    
    -- CASE logic directly in SELECT
    CASE 
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '101' THEN N'मुख्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '103' THEN N'डेअरी साहित्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '104' THEN N'पशूखाद्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '105' THEN N'पंप विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) = '106' THEN N'पशूऔषध विभाग'
        ELSE 'अन्य विभाग'  -- Default case if none of the conditions match
    END AS DEPT_NAME,
    
    CASE
        WHEN TRNACCTOTHH.SYSADD_LOGIN = 'ADMIN' THEN (SELECT ISNULL(GL_ACNO, 0) IS_MakerCheker FROM MSTACCTCONST WHERE CODE = 106)
        ELSE 0 
    END OWN_ENTRY

FROM
    TRNACCTOTHH
    LEFT OUTER JOIN MSTACCTGLSUBGLVW 
    ON ISNULL(TRNACCTOTHH.SUB_GLACNO, TRNACCTOTHH.GL_ACNO) = MSTACCTGLSUBGLVW.AC_NO
WHERE
    LEFT(CONVERT(NVARCHAR, TRNACCTOTHH.TRAN_NO), 3) IN (101, 103, 104, 105, 106)
    AND CONVERT(INT, SUBSTRING(CONVERT(VARCHAR, TRNACCTOTHH.TRAN_NO), 8, 3)) = 120
    AND TRNACCTOTHH.TRAN_SUBTYPE = 1
    AND TRNACCTOTHH.STATUS_CODE = 23
ORDER BY
    TRNACCTOTHH.TRAN_DATE DESC,
    TRNACCTOTHH.TRAN_NO DESC;
  `)
  }

  //Kharedi magni record from all module
  @Get('/kharediMagniFinance')
  async GetKharediMagniFinance() {
    return await this.config.executeQuery(`SELECT
				TRNPRCHPOH.TRAN_NO,
				TRNPRCHPOH.AMEND_NO,
				TRNPRCHPOH.SHORT_NAME,
				SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 8, 3) TRAN_TYPE,
				SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 4, 4)
					+ '-' + SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 13, 6) STRAN_NO,
				TRNPRCHPOH.TRAN_SUBTYPE,
				TRNPRCHPOH.TRAN_DATE,
				dbo.FORMAT_DATE(TRNPRCHPOH.TRAN_DATE) PRN_TRANDATE,
				CNFPOTYPES.NAME PO_TYPE,
				MSTACCTGLSUBGLVW.AC_NAME,
				TRNPRCHPOH.EXT_REFNO,
				TRNPRCHPOH.TRAN_AMT,
				TRNSALEPRCHITAX.AMOUNT ITEM_AMT,
				TRNPRCHPOH.SYSADD_LOGIN CREATED_BY,
				dbo.FORMAT_DATE(LEFT(TRNPRCHPOH.SYSADD_DATETIME, 8)) CREATED_ON,
				LEFT(TRNPRCHPOH.SYSADD_DATETIME, 8) CREATEDON,
				TRNPRCHPOH.STATUS_CODE,

				    -- CASE logic directly in SELECT
    CASE 
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '101' THEN N'मुख्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '103' THEN N'डेअरी साहित्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '104' THEN N'पशूखाद्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '105' THEN N'पंप विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '106' THEN N'पशूऔषध विभाग'
        ELSE 'अन्य विभाग'  -- Default case if none of the conditions match
    END AS DEPT_NAME,

				CASE TRNPRCHPOH.SYSADD_LOGIN
					WHEN '' THEN (SELECT ISNULL(GL_ACNO, 0) IS_MakerCheker FROM MSTACCTCONST WHERE CODE = 106)
					ELSE 0 END OWN_ENTRY
			FROM   
				TRNPRCHPOH
				LEFT OUTER JOIN MSTACCTGLSUBGLVW ON ISNULL(TRNPRCHPOH.SUB_GLACNO, TRNPRCHPOH.GL_ACNO) = MSTACCTGLSUBGLVW.AC_NO
				LEFT OUTER JOIN (
								SELECT
									TRAN_NO,
									AMEND_NO,
									ISNULL(AMOUNT, 0) AMOUNT
								FROM
									TRNSALEPRCHITAX
								WHERE
									POST_KEY = 101
									AND STATUS_CODE = 22
								)TRNSALEPRCHITAX ON TRNSALEPRCHITAX.TRAN_NO = TRNPRCHPOH.TRAN_NO
								AND TRNSALEPRCHITAX.AMEND_NO = TRNPRCHPOH.AMEND_NO
				LEFT OUTER JOIN CNFPOTYPES ON CNFPOTYPES.CODE = TRNPRCHPOH.PO_TYPE
			WHERE  
				LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) IN (101, 103, 104, 105, 106)
				AND CONVERT(INT,SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 8, 3)) = 403
				AND TRNPRCHPOH.TRAN_SUBTYPE IN (5,51)
				AND TRNPRCHPOH.STATUS_CODE = 22
			ORDER BY
				TRNPRCHPOH.TRAN_DATE DESC,
				TRNPRCHPOH.TRAN_NO DESC`)
  }

  //Kharedi magni record from all module
  @Get('/kharediMagniMD')
  async GetKharediMagniMD() {
    return await this.config.executeQuery(`SELECT
				TRNPRCHPOH.TRAN_NO,
				TRNPRCHPOH.AMEND_NO,
				TRNPRCHPOH.SHORT_NAME,
				SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 8, 3) TRAN_TYPE,
				SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 4, 4)
					+ '-' + SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 13, 6) STRAN_NO,
				TRNPRCHPOH.TRAN_SUBTYPE,
				TRNPRCHPOH.TRAN_DATE,
				dbo.FORMAT_DATE(TRNPRCHPOH.TRAN_DATE) PRN_TRANDATE,
				CNFPOTYPES.NAME PO_TYPE,
				MSTACCTGLSUBGLVW.AC_NAME,
				TRNPRCHPOH.EXT_REFNO,
				TRNPRCHPOH.TRAN_AMT,
				TRNSALEPRCHITAX.AMOUNT ITEM_AMT,
				TRNPRCHPOH.SYSADD_LOGIN CREATED_BY,
				dbo.FORMAT_DATE(LEFT(TRNPRCHPOH.SYSADD_DATETIME, 8)) CREATED_ON,
				LEFT(TRNPRCHPOH.SYSADD_DATETIME, 8) CREATEDON,
				TRNPRCHPOH.STATUS_CODE,

				    -- CASE logic directly in SELECT
    CASE 
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '101' THEN N'मुख्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '103' THEN N'डेअरी साहित्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '104' THEN N'पशूखाद्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '105' THEN N'पंप विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) = '106' THEN N'पशूऔषध विभाग'
        ELSE 'अन्य विभाग'  -- Default case if none of the conditions match
    END AS DEPT_NAME,

				CASE TRNPRCHPOH.SYSADD_LOGIN
					WHEN '' THEN (SELECT ISNULL(GL_ACNO, 0) IS_MakerCheker FROM MSTACCTCONST WHERE CODE = 106)
					ELSE 0 END OWN_ENTRY
			FROM   
				TRNPRCHPOH
				LEFT OUTER JOIN MSTACCTGLSUBGLVW ON ISNULL(TRNPRCHPOH.SUB_GLACNO, TRNPRCHPOH.GL_ACNO) = MSTACCTGLSUBGLVW.AC_NO
				LEFT OUTER JOIN (
								SELECT
									TRAN_NO,
									AMEND_NO,
									ISNULL(AMOUNT, 0) AMOUNT
								FROM
									TRNSALEPRCHITAX
								WHERE
									POST_KEY = 101
									AND STATUS_CODE = 23
								)TRNSALEPRCHITAX ON TRNSALEPRCHITAX.TRAN_NO = TRNPRCHPOH.TRAN_NO
								AND TRNSALEPRCHITAX.AMEND_NO = TRNPRCHPOH.AMEND_NO
				LEFT OUTER JOIN CNFPOTYPES ON CNFPOTYPES.CODE = TRNPRCHPOH.PO_TYPE
			WHERE  
				LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) IN (101, 103, 104, 105, 106)
				AND CONVERT(INT,SUBSTRING(CONVERT(VARCHAR, TRNPRCHPOH.TRAN_NO), 8, 3)) = 403
				AND TRNPRCHPOH.TRAN_SUBTYPE IN (5,51)
				AND TRNPRCHPOH.STATUS_CODE = 23
			ORDER BY
				TRNPRCHPOH.TRAN_DATE DESC,
				TRNPRCHPOH.TRAN_NO DESC`)
  }

  //kharedi for all module
  @Get('/kharedifinance')
  async GetKharediForFinance() {
    return await this.config.executeQuery(
      `SELECT
			TRNACCTMATH.TRAN_NO,
			0 AMEND_NO,
			TRNACCTMATH.SHORT_NAME,
			SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 8, 3) TRAN_TYPE,
			SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 11, 2) TRAN_SERIES,
			SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 4, 4)
				+ '-' + SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 13, 6) STRAN_NO,
			SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 4, 4) FIN_YEAR,
			TRNACCTMATH.TRAN_SUBTYPE,
			TRNACCTMATH.TRAN_DATE,
			dbo.FORMAT_DATE(TRNACCTMATH.TRAN_DATE) PRN_TRANDATE,
			MSTACCTGLSUBGLVW.AC_NAME,
			ISNULL(TRNACCTMATH.EXT_REF1, TRNACCTMATH.EXT_REF2) EXT_REFNO,
			TRNACCTMATH.EXT_REFDATE1 EXT_REFDATE,
			dbo.FORMAT_DATE(TRNACCTMATH.EXT_REFDATE1) PRN_REFDATE,
			TRNACCTMATH.TRAN_AMT,
			TRNACCTMATH.SYSADD_LOGIN CREATED_BY,
			dbo.FORMAT_DATE(LEFT(TRNACCTMATH.SYSADD_DATETIME, 8)) CREATED_ON,
			LEFT(TRNACCTMATH.SYSADD_DATETIME, 8) CREATEDON,
			TRNACCTMATH.STATUS_CODE,
			 CASE 
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '101' THEN N'मुख्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '103' THEN N'डेअरी साहित्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '104' THEN N'पशूखाद्य विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '105' THEN N'पंप विभाग'
        WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '106' THEN N'पशूऔषध विभाग'
        ELSE 'अन्य विभाग'  -- Default case if none of the conditions match
    END AS DEPT_NAME,

			CASE
				WHEN TRNACCTMATH.SYSADD_LOGIN = '' THEN (SELECT ISNULL(GL_ACNO, 0) IS_MakerCheker FROM MSTACCTCONST WHERE CODE = 106)
				ELSE 0 END OWN_ENTRY
		FROM
			TRNACCTMATH
			LEFT OUTER JOIN MSTACCTGLSUBGLVW ON ISNULL(TRNACCTMATH.SUB_GLACNO, TRNACCTMATH.GL_ACNO) = MSTACCTGLSUBGLVW.AC_NO
		WHERE
			LEFT(TRNACCTMATH.TRAN_NO, 3) IN (101, 103, 104, 105, 106)
			AND CONVERT(INT, SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 8, 3)) = 116
			AND TRNACCTMATH.TRAN_SUBTYPE IN (1,51)
			AND TRNACCTMATH.STATUS_CODE = 22
		ORDER BY
			TRNACCTMATH.TRAN_DATE DESC,
			TRNACCTMATH.TRAN_NO DESC`)
  }

  //kharedi for all module
  @Get('/kharediMD')
  async GetKharediMD() {
    return await this.config.executeQuery(
      `SELECT
        TRNACCTMATH.TRAN_NO,
        0 AMEND_NO,
        TRNACCTMATH.SHORT_NAME,
        SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 8, 3) TRAN_TYPE,
        SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 11, 2) TRAN_SERIES,
        SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 4, 4)
          + '-' + SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 13, 6) STRAN_NO,
        SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 4, 4) FIN_YEAR,
        TRNACCTMATH.TRAN_SUBTYPE,
        TRNACCTMATH.TRAN_DATE,
        dbo.FORMAT_DATE(TRNACCTMATH.TRAN_DATE) PRN_TRANDATE,
        MSTACCTGLSUBGLVW.AC_NAME,
        ISNULL(TRNACCTMATH.EXT_REF1, TRNACCTMATH.EXT_REF2) EXT_REFNO,
        TRNACCTMATH.EXT_REFDATE1 EXT_REFDATE,
        dbo.FORMAT_DATE(TRNACCTMATH.EXT_REFDATE1) PRN_REFDATE,
        TRNACCTMATH.TRAN_AMT,
        TRNACCTMATH.SYSADD_LOGIN CREATED_BY,
        dbo.FORMAT_DATE(LEFT(TRNACCTMATH.SYSADD_DATETIME, 8)) CREATED_ON,
        LEFT(TRNACCTMATH.SYSADD_DATETIME, 8) CREATEDON,
        TRNACCTMATH.STATUS_CODE,
         CASE 
          WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '101' THEN N'मुख्य विभाग'
          WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '103' THEN N'डेअरी साहित्य विभाग'
          WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '104' THEN N'पशूखाद्य विभाग'
          WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '105' THEN N'पंप विभाग'
          WHEN LEFT(CONVERT(NVARCHAR, TRNACCTMATH.TRAN_NO), 3) = '106' THEN N'पशूऔषध विभाग'
          ELSE 'अन्य विभाग'  -- Default case if none of the conditions match
      END AS DEPT_NAME,
  
        CASE
          WHEN TRNACCTMATH.SYSADD_LOGIN = '' THEN (SELECT ISNULL(GL_ACNO, 0) IS_MakerCheker FROM MSTACCTCONST WHERE CODE = 106)
          ELSE 0 END OWN_ENTRY
      FROM
        TRNACCTMATH
        LEFT OUTER JOIN MSTACCTGLSUBGLVW ON ISNULL(TRNACCTMATH.SUB_GLACNO, TRNACCTMATH.GL_ACNO) = MSTACCTGLSUBGLVW.AC_NO
      WHERE
        LEFT(TRNACCTMATH.TRAN_NO, 3) IN (101, 103, 104, 105, 106)
        AND CONVERT(INT, SUBSTRING(CONVERT(VARCHAR, TRNACCTMATH.TRAN_NO), 8, 3)) = 116
        AND TRNACCTMATH.TRAN_SUBTYPE IN (1,51)
        AND TRNACCTMATH.STATUS_CODE = 23
      ORDER BY
        TRNACCTMATH.TRAN_DATE DESC,
        TRNACCTMATH.TRAN_NO DESC`)
  }

  ///--------- Gate Tracking Data 
  @Post('/GateTrackingData')
  async GateTrackingSystem(@Body() data) {
    let Status = 0;
    if (data.SPname == 'IN') {
      Status = 21;
    } else {
      Status = 23;
    }

    let query = `select TRNGATETRACKDETAILS.*,MSTACCTGLSUB.SUBGL_LONGNAME CUST_NAME,
dbo.FORMAT_DATE(TRNCFEEDMATH.TRAN_DATE) PRN_TRANDATE,
CASE TRNGATETRACKDETAILS.TRAN_SUBTYPE
			WHEN 21 THEN N'रोख'
			WHEN 22 THEN N'ड्राफ्ट'
			WHEN 23 THEN N'ऊधार'
			WHEN 25 THEN N'भुसा ऊधार' END SHORT_NAME,
SUBSTRING(CONVERT(VARCHAR, TRNCFEEDMATH.TRAN_NO), 13, 6) STRAN_NO from TRNGATETRACKDETAILS
inner join MSTACCTGLSUB on MSTACCTGLSUB.SUB_GLACNO = TRNGATETRACKDETAILS.SUB_GLACNO 
inner join TRNCFEEDMATH on TRNCFEEDMATH.TRAN_NO = TRNGATETRACKDETAILS.TRAN_NO
where TRNCFEEDMATH.TRAN_SUBTYPE = ${data.params} and TRNGATETRACKDETAILS.STATUS_CODE = ${Status} order by TRNCFEEDMATH.TRAN_NO DESC`;
    console.log(query);
    return await this.config.executeQuery(query);
  }

  @Post('/RateHistory')
  async RateHistory(@Body() data) {
    return await this.commonService.RateHistory(data);
  }
  @Post('/absentMilkCustermer')
  async absentMilkCustermer(@Body() data) {
    return await this.commonService.absentMilkCustermer(data);
  }

  @Post('/signupload')
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any  // Capture additional data sent with the files
  ) {
    const { fileType, vibhagName } = body;

    // Check if fileType is an array, otherwise handle a single fileType for all files.
    const response = files.map((file, index) => ({
      originalname: file.originalname,
      filename: file.filename,
      path: `uploads/${file.filename}`,  // Update path to reflect the correct location
      fileType: Array.isArray(fileType) ? fileType[index] : fileType,  // Match each file with its corresponding fileType
    }));

    // Assuming this.commonService.singUpload is an asynchronous operation.
    await this.commonService.singUpload({
      files: response,
      vibhagName,  // If needed to save alongside the file data
    });

    return {
      files: response,
      vibhagName,
    };
  }

  @Post('/POmatNotgrn')
  async POmatNotgrn(@Body() data) {
    return await this.commonService.POmatNotgrn(data);
  }
  @Post('/MilkPurchaseAndSaleCosting')
  async MilkPurchaseAndSaleCosting(@Body() data) {
    return await this.commonService.MilkPurchaseAndSaleCosting(data);
  }
  @Post('/BulkCoolerCosting')
  async BulkCoolerCosting(@Body() data) {
    return await this.commonService.BulkCoolerCosting(data);
  }
  @Post('/SMSTOSEND')
  async SmsToSend(@Body() data) {
    return await this.commonService.SmsToSend(data);
  }
  @Post('/EMAILCONFIG')
  async emailconfig(@Body() data) {
    console.log(data)
    return await this.commonService.emailconfig(data);
  }

  @Post('/chckDuplicateChllnNO')
  async chckDuplicateChllnNO(@Body() data) {
    return await this.commonService.chckDuplicateChllnNO(data)
  }

  @Post("dairyDetailsDMY")
  async dairyDetailsDMY(@Body() body) {
    return await this.commonService.dairyDetailsDMY(body);
  }
  @Post("cattleFeedPartyWiseDMY")
  async cattleFeedPartyWiseDMY(@Body() body) {
    return await this.commonService.cattleFeedPartyWiseDMY(body);
  }
  @Post("dairySahitySalePurchaseDMY")
  async dairySahitySalePurchaseDMY(@Body() body) {
    return await this.commonService.dairySahitySalePurchaseDMY(body);
  }
  @Post("pumpDetailsDMY")
  async pumpDetailsDMY(@Body() body) {
    return await this.commonService.pumpDetailsDMY(body);
  }
  @Post("cattleFeedProductionItemWise")
  async cattleFeedProductionItemWise(@Body() body) {
    return await this.commonService.cattleFeedProductionItemWise(body);
  }
  @Post("/getMatCodeWiseData")
  async getMatCodeWiseData(@Body() body) {
    return await this.commonService.getMatCodeWiseData(body);
  }
  // @Post('/getMatStock')
  // async getMatStock(@Body() body){
  //   return await this.commonService.getMatStock(body);
  // }


  //----------- Document module - Drive - Cloud

  @Post('create-folder')
  createFolder(@Body('path') folderPath: string): string {
    return this.commonService.createFolder(folderPath);
  }

  @Get('list-files/:folderPath')
  listFiles(@Param('folderPath') folderPath: string): string[] {
    return this.commonService.listFiles(folderPath);
  }

  @Get('folders')
  getAllFolders(): string[] {
    return this.commonService.getAllFolders();
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folderName') folderName: string
  ): string {
    console.log(folderName);
    console.log(file);

    if (!folderName) {
      throw new BadRequestException('Folder name is required');
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.commonService.uploadFile(folderName, file);
  }

  @Get('search-files')
  searchFiles(@Query('term') searchTerm: string): string[] {
    return this.commonService.searchItems(searchTerm);
  }

  @Get('drive-structure')
  getDriveStructure(): any {
    return this.commonService.getDriveStructure();
  }

  @Delete('delete-file')
  deleteFile(
    @Body('folderPath') folderPath: string,
    @Body('fileName') fileName: string,
  ): string {
    return this.commonService.deleteFile(folderPath);
  }

  @Delete('delete-folder')
  deleteFolder(@Body('path') folderPath: string): string {
    return this.commonService.deleteFolder(folderPath);
  }

  @Get('download-file')
  downloadFile(
    @Query('folderPath') folderPath: string,

  ) {
    return this.commonService.downloadFile(folderPath);
  }

  @Get('download-folder')
  downloadFolder(@Query('folderPath') folderPath: string) {
    return this.commonService.downloadFolder(folderPath);
  }
  @Patch('rename')
  rename(@Body('oldPath') oldPath: string, @Body('newName') newName: string) {
    this.commonService.rename(oldPath, newName);
    return { message: 'Renamed successfully' };
  }
  @Post('create-file')
  createFile(
    @Body('folderPath') folderPath: string,
    @Body('fileName') fileName: string,
    @Body('content') content: string,
  ): string {
    return this.commonService.createFile(folderPath, fileName, content);
  }
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join('D:/c/Typescript/Compserv_MiniProjects/drive/drive', filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(404).send('File not found');
      }
    });
  }

 ////----------------------- Auto Weight Tracking Code (Design by Ajit Sutar)----------------------------//
  @Post('/getWeightTranData')
  async getWeightTranData(@Body() data){
    return await this.commonService.getWeightTranData(data);
  }

  @Post('/checkVechicalData')
  async getVehicalData(@Body() data){
    return await this.commonService.getVechicalData(data);
  }

  @Post('/checkGrnVechicalData')
  async checkGrnVechicalData(@Body() data){
    return await this.commonService.checkGrnVechicalData(data);
  }

  @Post('/InsertWeightTrackData')
  async InsertWeightTrackData(@Body() data){
    return await this.commonService.InsertWeightTrackData(data);
  }

  @Post('/InsertGrnWeightTrack')
  async InsertGrnWeightTrack(@Body() data){
    return await this.commonService.InsertGrnWeightTrack(data);
  }

  @Post('/UpdateWeightTrackData')
  async UpdateWeightTrackData(@Body() data){
    return await this.config.executeQuery(`update TRNWEIGHTTRACKH set IN_TIME='${data.data.In_Time}',OUT_TIME='${data.data.Out_Time}',BLANK_WEIGHT='${data.data.In_Weight}',FULL_WEIGHT='${data.data.Out_Weight}' where TRAN_NO = ${data.data.TRAN_NO}`);
  }
  
  @Post("DATACONVERTMATPOST")
  async DATACONVERTMATPOST(@Body() body) {
    return await this.commonService.DATACONVERTMATPOST(body);
  }
    // --* MSTACCTGLSUBGL TAble insert -------------------------//
  @Post('/GLSubGLInsert')
  async insert_glsubgl(@Body() data) {
    return this.commonService.insert_glsubgl(data);
  }

  //------------------* MSTACCTGLSUBGL TAble insert -------------------------//
  @Post('/MstAcctGlSubDept')
  async insert_MstAcctGlSubDept(@Body() data) {
    return this.commonService.insert_MstAcctGlSubDept(data);
  }

  // सिस्टीम --> मुख्यकिर्द विभाग --> पोटकिर्द खाती --> व्यापारी येणे - बाय प्रोडक्ट
  // Seprate end point for this form
  @Post('/SupplierBiProduct')
  async insert_SupplierBiProduct(@Body() data) {
    return this.commonService.insert_SupplierBiProduct(data);
  }

  // सिस्टीम --> मुख्यकिर्द विभाग --> पोटकिर्द खाती --> पशू मिञ
  // Seprate end point for this form
  @Post('/PashuMitra')
  async insert_PashuMitra(@Body() data) {
    return this.commonService.insert_PashuMitra(data);
  }

  //------------------* CNFRATETAXS TAble insert -------------------------//
  @Post('/CnfRateTaxs')
  async insert_CnfRateTaxs(@Body() data) {
    return this.commonService.insert_CnfRateTaxs(data);
  }

  //------------------* CNFREPORTD TAble insert -------------------------//
  @Post('/CNFREPORTD')
  async insert_CNFREPORTD(@Body() data) {
    return this.commonService.insert_CNFREPORTD(data);
  }

  //------------------* CNFTDSTYPES TAble insert -------------------------//
  @Post('/CnfTdsTypes')
  async insert_CnfTdsTypes(@Body() data) {
    return this.commonService.insert_CnfTdsTypes(data);
  }

  //------------------* CNFRATETDS TAble insert -------------------------//
  @Post('/CnfRateTds')
  async insert_CnfRateTds(@Body() data) {
    return this.commonService.insert_CnfRateTds(data);
  }

  //------------------* MSTMATERIALS TAble insert -------------------------//
  @Post('/MstMaterials')
  async insert_MstMaterials(@Body() data) {
    return this.commonService.insert_MstMaterials(data);
  }

  //------------------* CNFGSTRATECATEGORY TAble insert -------------------------//
  @Post('/CnfGstRateCategory')
  async insert_CnfGstRateCategory(@Body() data) {
    return this.commonService.insert_CnfGstRateCategory(data);
  }

  //------------------* GSTRATECATEGORY TAble insert -------------------------//
  @Post('/GstRateCategory')
  async insert_GstRateCategory(@Body() data) {
    return this.commonService.insert_GstRateCategory(data);
  }

  //------------------* CNFRATEEXCISE TAble insert -------------------------//
  @Post('/CnfRateExcise')
  async insert_CnfRateExcise(@Body() data) {
    return this.commonService.insert_CnfRateExcise(data);
  }

  //------------------* CNFPOSTKEYSGL TAble insert -------------------------//
  @Post('/CNFPOSTKEYSGL')
  async insert_CNFPOSTKEYSGL(@Body() data) {
    return this.commonService.insert_CNFPOSTKEYSGL(data);
  }

  //------------------* CNFPOSTKEYSGL TAble insert -------------------------//
  @Post('/MSTBIPRODITEMRATES')
  async insert_MSTBIPRODITEMRATES(@Body() data) {
    return this.commonService.insert_MSTBIPRODITEMRATES(data);
  }

  //------------------* CNFSERVICEACODE TAble insert -------------------------//
  @Post('/CnfServiceCode')
  async insert_CCnfServiceCode(@Body() data) {
    return this.commonService.insert_CnfServiceCode(data);
  }

  //------------------* MSTACCTCONST TAble insert -------------------------//
  @Post('/MstAcctConst')
  async insert_MstAcctConst(@Body() data) {
    return this.commonService.insert_MstAcctConst(data);
  }

  //------------------* MSTCOMMTERMS TAble insert -------------------------//
  @Post('/MstCommTerms')
  async insert_MstCommTerms(@Body() data) {
    return this.commonService.insert_MstCommTerms(data);
  }

  //------------------* MSTCOMMUNIT TAble insert -------------------------//
  @Post('/MstCommunit')
  async insert_MstCommunit(@Body() data) {
    return this.commonService.insert_MstCommunit(data);
  }

  //------------------* MSTMATGROUP TAble insert -------------------------//
  @Post('/MstMatGroup')
  async insert_MstMatGroup(@Body() data) {
    return this.commonService.insert_MstMatGroup(data);
  }

  //------------------* MSTMATLOCATION TAble insert -------------------------//
  @Post('/MstMatLocation')
  async insert_MstMatLocation(@Body() data) {
    return this.commonService.insert_MstMatLocation(data);
  }

  //------------------* MSTMATLOCATION TAble insert -------------------------//
  @Post('/MstMSTCOMMGODOWN')
  async insert_MstMSTCOMMGODOWN(@Body() data) {
    return this.commonService.insert_MstMSTCOMMGODOWN(data);
  }

  //------------------* MSTPASHUCENTER TAble insert -------------------------//
  @Post('/MstPashuCenter')
  async insert_MstPashuCenter(@Body() data) {
    return this.commonService.insert_MstPashuCenter(data);
  }

  //------------------* MSTPASHUTYPES TAble insert -------------------------//
  @Post('/MstPashuTypes')
  async insert_MstPashuTypes(@Body() data) {
    return this.commonService.insert_MstPashuTypes(data);
  }

  //------------------* MSTPASHUDHAN TAble insert -------------------------//
  @Post('/MstPashuDhan')
  async insert_MstPashuDhan(@Body() data) {
    return this.commonService.insert_MstPashuDhan(data);
  }

  //------------------* MSTPASHULABHUTPADAK TAble insert -------------------------//
  @Post('/MstPashuLabhutpadak')
  async insert_MstPashuLabhutpadak(@Body() data) {
    return this.commonService.insert_MstPashuLabhutpadak(data);
  }

  //------------------* MSTPASHUVACCINETYPE TAble insert -------------------------//
  @Post('/MstPashuVaccieType')
  async insert_MstPashuVaccieType(@Body() data) {
    return this.commonService.insert_MstPashuVaccieType(data);
  }

  @Post('/InsertPurchaseReq')
  async InsertPurchaseReq(@Body() data) {
    return await this.commonService.InsertPurchaseReq(data);
  }

  //------------------* MSTBIPRODDEPARTMENT TAble insert -------------------------//
  @Post('/MstBiprodDepartment')
  async insert_MstBiprodDepartment(@Body() data) {
    return this.commonService.insert_MstBiprodDepartment(data);
  }

  //------------------* MSTACCTGROUP TAble insert -------------------------//
  @Post('/MstAcctGroup')
  async insert_MstAcctGroup(@Body() data) {
    return this.commonService.insert_MstAcctGroup(data);
  }

  //------------------* MSTBIPRODDEPARTMENT TAble insert -------------------------//
  @Post('/MSTCOMMTRANSPORT')
  async MSTCOMMTRANSPORT(@Body() data) {
    return this.commonService.MSTCOMMTRANSPORT(data);
  }

  @Post('/insertMSTACCTGLSUBTDS')
  async insertMSTACCTGLSUBTDS(@Body() data) {
    return await this.commonService.insertMSTACCTGLSUBTDS(data);
  }


  //-------------------* Ledger Posting Details ---------------------------//
  @Post('/ledgerPosting')
  async getLedgerPosting(@Body() data){
    return await this.config.executeQuery(`exec Sel_AcctPostingDetail ${data.TranNO}`);
  }


  //-------------------* Medical Shop Purchase table List ----------------------//
  @Post('/MedicalPurchaseData')
  async getMedicalPurchaseData(@Body() data){
    return await this.config.executeQuery(`select 
    SUBSTRING(CONVERT(VARCHAR, TRAN_NO), 4, 4)
              + '-' + SUBSTRING(CONVERT(VARCHAR,TRAN_NO), 13, 6) STRAN_NO,
    TRAN_NO,
    TRAN_AMT,
    dbo.FORMAT_DATE(TRAN_DATE) PRN_REFDATE,
    MSTACCTGLSUB.SUBGL_LONGNAME AC_NAME
    from TRNACCTMATH
    left join MSTACCTGLSUB on MSTACCTGLSUB.SUB_GLACNO = TRNACCTMATH.SUB_GLACNO
    Where COMPUNIT_ID = 108
    AND TRAN_DATE between ${data.data.StartDate} AND ${data.data.EndDate}`);
  }

 //-----------------* Get Current Stock Of ALl Materials *------------------------------------//
 @Post('/currentMatStock')
 async currentMatStock(@Body() data){
   return await this.config.executeQuery(`select sum(QTY) from ${data.tableName} where MAT_CODE = ${data.matCode}`);
 }

  @Post('/MedicalSalesData')
  async getMedicalSalesData(@Body() data){
    return await this.config.executeQuery(`select 
    SUBSTRING(CONVERT(VARCHAR, TRAN_NO), 4, 4)
              + '-' + SUBSTRING(CONVERT(VARCHAR,TRAN_NO), 13, 6) STRAN_NO,
    TRAN_NO,
    TRAN_AMT,
    dbo.FORMAT_DATE(TRAN_DATE) PRN_REFDATE,
    MSTACCTGLSUB.SUBGL_LONGNAME AC_NAME
    from TRNCMEDMATH
    left join MSTACCTGLSUB on MSTACCTGLSUB.SUB_GLACNO = TRNCMEDMATH.SUB_GLACNO
    Where COMPUNIT_ID = 108
    AND TRAN_DATE between ${data.data.StartDate} AND ${data.data.EndDate}`);
  }


  @Get('/RollbackCommit')
  async rollbackcommit(){
    let array = [
  "INSERT INTO TRNCFEEDMATH (COMPUNIT_ID, SYSADD_LOGIN, TRAN_NO, REFCOMPUNIT_ID, TRAN_SUBTYPE, SHORT_NAME, TRAN_DATE, RECEIVER_NO, RECEIVER_NAME, FREIGHT, PER_BOX, GL_ACNO2, OTHER_AMT1, OTHER_AMT3, SEC_DEPOSITE, GL_ACNO, SUB_GLACNO, TRAN_AMT, OTHER_AMT2, SHORT_NARRTN, STATUS_CODE, PARTY_STATE, IS_GSTINVOICE, IS_FLAG, IS_GSTINREGISTERED, SYSADD_DATETIME, SYSCHNG_DATETIME, SYSCHNG_LOGIN) VALUES (104, N'ADMIN', 104242560123014691, 0, 23, N'H-CR', N'20250207', N'7276703607', N'Ajit Sutar', N'0', 0, 101000256, 116.25, 0, 1.5, 101000005, 101170001, 7750.00, 0, N'test', 21, 27, 1, 0, 0, N'2025020723:17:15', N'2025020723:17:15', N'ADMIN')",
  "INSERT INTO TRNGATETRACKDETAILS (TRAN_NO, TRAN_DATE, TRAN_SUBTYPE, SUB_GLACNO, STATUS_CODE, SYSADD_DATETIME, SYS_DATE, USER_NAME, QTY) VALUES (104242560123014691, N'20250207', 23, 101170001, 21, N'2025020723:17:15', N'ADMIN', N'sa', 10)",
  "INSERT INTO TRNCFEEDMATIGPASS (MAT_CODE, QTY, RATE, AMOUNT, CGST_RATE, CGST_AMOUNT, SGST_RATE, SGST_AMOUNT, GL_ACNO, WEIGHT, TOTAL_WEIGHT, TRAN_NO, TRAN_SUBTYPE, CHAPTER_CODE, CHAPTER_NO, UNIT_CODE, TAX_CODE, DISC_ON_BAG, STATUS_CODE, TRAN_DATE, CUST_SUB_GLACNO, OUTDISC_AMOUNT, SR_NO) VALUES (1010400089, 10, 775, 7750.00, 0, 0.00, 0, 0.00, 101000067, 25, 250, 104242560123014691, 23, 1010024, N'2309', NOS, 102, 0, 21, N'20250207', 101170001, 7750.00, 1)"
]
  return this.config.executeInsertQuery(array)
  }

  @Post('/PumpGodownCode')
  async pumpgodowncode(){
    return await this.config.executeQuery(`select MSTCOMPUNITS.NAME,GODOWN.CODE from MSTCOMPUNITS 
inner join MSTCOMMGODOWN as GODOWN on GODOWN.COMPUNIT_ID = MSTCOMPUNITS.CODE
where MSTCOMPUNITS.COMPUNIT_ID = 105`);
  }
}

