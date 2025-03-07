import { Post } from '@nestjs/common';
import { Config } from '../config/config';
import * as moment from 'moment';
import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
@Injectable()
export class CommonService {
    private readonly baseDir = path.join(__dirname, '../../drive');
    constructor(private config: Config) {
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }
    async getTransporterData() {
        return await this.config.executeQuery(`select * from MSTCOMMTRANSPORT where STATUS_CODE = 0`)
    }

    async autoIncrement(data) {

        let obj = {
            "table": data.table,
            "view": [
                data.column
            ],
            "sort": [
                {
                    "column": [data.column],
                    "order": 'desc'
                }
            ],
            "limit": 1
        }
        let getRecord = await this.config.selectAll(obj);
        let columnName = data.column
        let lastRecord: any = '';
        if (getRecord.length != 0) {
            lastRecord = getRecord[0][columnName];
        } else {
            lastRecord = '';
        }

        if (lastRecord != '') {
            lastRecord = lastRecord + 1;
        } else {
            lastRecord = 101;
        }

        return lastRecord;
    }


    ///---------* Menu Doc NO using get All pages details also nevigation details
    async menuDetails(data) {
        console.log(data);
        let details = {
            "table": "Menus",
            "view": [],
            "condition": [{
                "MENU_DOC_NO": data.menu_doc_no
            }],
            "user": 1
        }

        if (data.hasOwnProperty('menu_module')) {
            let obj: any = {
                "type": "AND",
                "MODULE_NO": data.menu_module
            }
            details.condition.push(obj)
        }
        if (data.hasOwnProperty('menu_key')) {
            let obj: any = {
                "type": "AND",
                "MENU_KEY": data.menu_key
            }
            details.condition.push(obj)
        }
        return await this.config.selectAll(details);
    }

    async menuDocWiseNevigation(data) {
        console.log(data);
        let tran_type = data.menu_doc_no.substring(0, 3);
        let tran_subType = data.menu_doc_no.slice(-2);
        let details = {
            "table": "CNFTRANTYPES",
            "view": [],
            "condition": [{
                "TRAN_TYPE": tran_type,
            }, {
                "type": 'AND',
                "TRAN_SUBTYPE": tran_subType,
            }]
        }
        return await this.config.selectAll(details);
    }
    async MSTDocWiseNevigation(data) {
        console.log(data);
        // let tran_type = data.menu_doc_no.substring(0,3);
        // let tran_subType = data.menu_doc_no.slice(-2);
        let details = {
            "table": "CNFMASTTYPES",
            "view": [],
            "condition": [{
                "CODE": data.menu_doc_no,
            }]
        }
        return await this.config.selectAll(details);
    }




    //get Common and generic function data
    async getHelpList(data) {
        let object =
        {
            name: 'Get_HelpList',
            params: [data.COMPANYID, data.TableName, data.CompanyidColumn, data.HelpColumnNames, data.HelpColumnFilter, data.SortOrder, data.ExecFlag]
        }
        return await this.config.execSpWithParams(object);

    }

    //Menu Navigation Button Access as per user data
    async getUserAccess(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        }

        return await this.config.execSpWithParams(object);

    }
    async GetData(data) {
        let result = await this.config.selectAll(data);
        return result;
    }

    //get Common and generic function data
    async Get_TableFieldswithClause(data) {
        let object = {
            name: 'Get_TableFieldswithClause',
            params: [data.TableName, data.TableColName, data.Whereclause]
        }
        return await this.config.execSpWithParams(object);

    }
    //get Common and generic function get data using SP 
    async Sel_PackedMilkList(data) {
        let object = {
            name: 'Sel_PackedMilkList',
            params: [data.COMPANYID, data.MenuDocNo, data.MilkType, data.FromDate, data.ToDate]
        }
        return await this.config.execSpWithParams(object);
    }

    async getCenterDetails() {
        let details = {
            "table": "MSTCOMMCENTER",
            "view": [],
            "condition": [{
                "STATUS_CODE": 0,
            }]
        }
        return await this.config.selectAll(details);
    }
    //get Common and generic function get data using SP 
    async Sel_SaleMilkJawakLooseBillProcess(data) {
        let object = {
            name: 'Sel_SaleMilkJawakLooseBillProcess',
            params: [data.CompanyID, data.VoucherType, data.VoucherSeries, data.TranSubType, data.FromDate, data.ToDate, data.SubAcNoList, data.TranDate, data.CollectionCenter, data.SysAddLogin]
        }
        return await this.config.execSpWithParams(object);
    }

    async Sel_MasterCodeList(data) {
        let object = {
            name: 'Sel_MasterCodeList',
            params: [data.Code, data.HelpColumnFilter]

        }
        return await this.config.execSpWithParams(object);
    }
    //  
    async Sel_DepartMentWsMilkDealers(data) {
        let object = {
            name: 'Sel_DepartMentWsMilkDealers',
            params: [data.DeptCode]
        }
        return await this.config.execSpWithParams(object);
    }

    async getFAT(data) {
        return await this.config.executeQuery(`exec Sel_FATMSTSNFRATEPRCH ${data.CompUnit}`)
    }

    async Sel_ExistingTransactionsDairyDesp(data) {
        let object = {
            name: 'Sel_ExistingTransactionsDairyDesp',
            params: [data.TranNo, data.TranSubType, data.AmendNo]
        }
        return await this.config.execSpWithParams(object, 1);
    }
    async docDayWiseClaction(data) {
        console.log(data)
        return data
    }

    async Sel_RootChillers(data) {
        let object = {
            name: 'Sel_RootChillers',
            params: [data.RootCode]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }
    async Sel_ChillerSansthas(data) {
        let object = {
            name: 'Sel_ChillerSansthas',
            params: [data.ChillerCode]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }
    async Sel_SaleJawakPackMilkBillPosting(data) {
        console.log('data', data)
        let object = {
            name: 'Sel_SaleJawakPackMilkBillPosting',
            params: [`@chrAsOnDate = ${data.data.billDate}, @intStatusCode = ${0}`]
        }
        return await this.config.execSpWithParams(object);
    }
    async getPostKeyData() {
        return await this.config.executeQuery(`select * from CNFMATRIX order by CODE`)
    }

    async getPostKeyDataIdWise(data) {
        // return await this.config.executeQuery(`select * from CNFMATRIXDETAIL where CODE = ${data.code} order by SRNO asc`)
        let result = await this.config.executeQuery(`Sel_CNFMATRIXDETAIL ${data.code}, ${data.type}`)
        // console.log(result);
        return result;
    }

    //get Common and generic function get data using SP 
    async Sel_SaleMilkJawakPackBillProcess(data) {
        console.log('data', data)
        let object = {
            name: 'Sel_SaleMilkJawakPackBillProcess',
            params: [data.data.CompanyID, data.data.VoucherType, data.data.VoucherSeries, data.data.TranSubType, data.data.FromDate, data.data.SysAddLogin]
        }
        return await this.config.execSpWithParams(object);
    }

    //get Common and generic function get data using SP 
    async Sel_TransporterBillPackPosting(data) {
        console.log('data', data)
        let object = {
            name: 'Sel_TransporterBillPackPosting',
            params: [data.data.billDate, data.data.statusCode]
        }
        return await this.config.execSpWithParams(object);

    }

    //Get GST Category Data
    async getGstCategoryData() {
        let date = moment().format('YYYYMMDD');
        let object = {
            name: 'Sel_CNFRATEGST',
            params: [date, 0]
        }
        return await this.config.execSpWithParams(object);
    }

    //Get GST Category Data
    async getGstCategoryData1() {
        let date = moment().format('YYYYMMDD');
        let object = {
            name: 'Sel_CNFRATEGST',
            params: [date, 1]
        }
        return await this.config.execSpWithParams(object);
    }

    async getAllData(data) {
        let details = {
            "table": data.tableName,
            "view": [],
            "condition": data.condition
        }
        return await this.config.selectAll(details);
    }

    //-----* Get Constant Account Data
    async getConstantAccount(data) {
        return await this.config.executeQuery(`select * from MSTACCTCONST where CODE = ${data.CODE}`)
    }

    async Sel_FatList(data) {
        let object = {
            name: 'Sel_FATMSTSALESNFRATE',
            params: [data.COMPANYID]
        }
        return await this.config.execSpWithParams(object);
    }
    async Sel_GetLedgerBalance(data) {
        let object = {
            name: 'Sel_GetLedgerBalance',
            params: [data.COMPANYID, data.Type, data.GlAcNo, data.SubGlAcNo, data.SubGlCodeList]
        }
        return await this.config.execSpWithParams(object);
    }
    async GET_VOUTYPE_FROM_MENUDOC(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        }
        return await this.config.execSpWithParams(object);
    }

    //-----* Get Date Dropdown List
    async billDateSP(data) {
        var data = await this.config.executeQuery(`exec Get_Posting_Dates @COMPANY_ID=N'101',@display_code=${data.dateCode},@days=${data.type}`);
        return data;
    }

    //-------* Cattle Feed Puchase Transaction List
    async cattleFeedMaterialPurch(data) {
        let object = {
            name: 'Sel_TransactionsCattleFeed',
            params: [data.COMPANY_ID, data.MenuDocNo, data.UserID, data.StartDate, data.EndDate]
        }
        return await this.config.execSpWithParams(object, 1);
    }

    //------------* Supplier List
    async getSupplierList() {
        return await this.config.executeQuery(`Sel_SupplierList`);
    }
    async getSupplierListCattlefeed() {
        return await this.config.executeQuery(`SELECT 
	MSTACCTGLSUB.SUB_GLACNO CODE,
	MSTACCTGLSUB.SUB_GLACNO,
	UPPER(MSTACCTGLSUB.SUBGL_LONGNAME) + CASE MSTACCTGLSUB.SUB_GLCODE WHEN 11 THEN ISNULL(','+MSTACCTGLSUB.ADDRESS3,'') + ' - CUSTOMER' WHEN 12 THEN ' - SUPPLIER' ELSE '' END AS NAME,
	UPPER(MSTACCTGLSUB.SUBGL_LONGNAME) + CASE MSTACCTGLSUB.SUB_GLCODE WHEN 11 THEN ISNULL(','+MSTACCTGLSUB.ADDRESS3,'') + ' - CUSTOMER' WHEN 12 THEN ' - SUPPLIER' ELSE '' END AS SUBGL_LONGNAME,
	(CONVERT(VARCHAR(20),MSTACCTGLSUB.GL_ACNO) + '|' + CONVERT(VARCHAR(20),MSTACCTGLSUB.SUB_GLACNO) + '|'+ CONVERT(VARCHAR(2),ISNULL(EXCISE_ONMRP,0)) + '|' + CONVERT(VARCHAR, ISNULL(CITY_CODE,' '))) AS GL_ACNO,
	(CONVERT(VARCHAR(20),MSTACCTGLSUB.GL_ACNO) + '|' + CONVERT(VARCHAR(20),MSTACCTGLSUB.SUB_GLACNO) + '|') AS GLSUBGL_ACNO,
	ISNULL(DOC_PAGE_NAME,'') DOC_PAGE_NAME,
	TDS_METHOD,
	TAX_TYPE,
	0 AMOUNT,
	STATUS_CODE
FROM
	MSTACCTGLSUB
WHERE
	MSTACCTGLSUB.SUB_GLCODE IN(12)
	--AND MSTACCTGLSUB.SUB_GLACNO IN (SELECT DISTINCT SUB_GLACNO FROM MSTMATERIALGLSUB)
	AND MSTACCTGLSUB.STATUS_CODE in (0, 21)
ORDER BY
	UPPER(MSTACCTGLSUB.SUBGL_LONGNAME)`);
    }

    //------------* Get Company Unit Details
    async GetMSTCOMPUNITSData() {
        return await this.config.executeQuery(`select * from MSTCOMPMAINUNITS where STATUS_CODE = 0`);
    }

    //-------------* TDS Dropdown Data
    async getTDSCategory(data) {
        return await this.config.executeQuery(`select  CONVERT(VARCHAR(10),CODE) + '|' + CONVERT(VARCHAR(15),GL_ACNO) + '|' + CONVERT(VARCHAR(15),ISNULL(SUB_GLACNO,0)) + '|' + CONVERT(VARCHAR(10),RATE) + '|' + CONVERT(VARCHAR(10),IT_RATE) + '|' + CONVERT(VARCHAR(10),SCHARGE_RATE) + '|' + CONVERT(VARCHAR(10),CESS_RATE) + '|' + CONVERT(VARCHAR(10),HSCCESS_RATE) AS CODE, NAME, CONVERT(VARCHAR,CODE) AS TDS_CODE, APPLICABLE_FOR AS TDS_TYPE from CNFRATETDS where STATUS_CODE = 0`)
    }

    //------------* Get Material Details
    async getMaterialDetails(data) {
        let object = {
            name: 'Sel_GetMaterialsGSTList',
            params: [data.materialType, `''`, `''`]
        }
        return await this.config.execSpWithParams(object);
    }

    /*common endpoint for all sp*/
    async getSpData(data) {
        let object = {
            name: data.SPname,
            params: data.params,
        }
        return await this.config.execSpWithParams(object, data.multiflag);
    }

    /*common endpoint for all sp*/
    async getSp(data) {
        let object = {
            name: data.SPname,
        }
        return await this.config.execOnlySp(object);
    }

    async insert_MstAcctGroup(data) {
        let queryArray = new Array();

        let tableName = "MSTACCTGROUP";
        console.log(data)
        if (data.CODE == undefined) {
            //******** insert ********//
            let prefix = await this.MSTDocWiseNevigation(
                {
                    "menu_doc_no": data.MenuDocNo
                }
            );
            console.log(prefix)
            let a = await this.config.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`)
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            console.log(data);

            queryArray.push(await this.config.insertData(data));
        } else {

            //******** update ********//
            console.log(data);
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                "data": data,
                "condition": [{
                    "CODE": codeValue
                }],
                "tableName": tableName
            }
            queryArray.push(await this.config.updateData(dataset))
            return await this.config.executeInsertQuery(queryArray);

        }

    }
    // shubham
    async Sel_MSTAcctGLSUBGL(data) {
        let object = {
            name: 'Sel_MSTAcctGLSUBGL',
            params: [data.COMPANYID, data.SUBGLCode]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }


    async InsertPurchaseReq(data) {

    }

    async Sel_ControlAcctGl(data) {
        let object = {
            name: 'Sel_ControlAcctGl',
            params: [data.SUBGLCode]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }
    async Sel_GroupWiseLedgerList(data) {
        let object = {
            name: 'Sel_GroupWiseLedgerList',
            params: [data.CompanyId, data.TranType]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }
    async Sel_GetSubGLAccoun(data) {
        let object = {
            name: 'Sel_GetSubGLAccoun',
            params: [data.CompanyId, data.GlAcNo]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }

    async Upd_StatusTransactionsFinance(data) {
        let SYSAPR_DATETIME = await this.config.Get_SysDateTime()
        let object = {
            name: 'Upd_StatusTransactionsFinance',
            params: [data.TRAN_NO, data.TRAN_SUBTYPE, data.AMEND_NO, data.STATUS_CODE, `'${data.SYSAPR_LOGIN}'`, `'${SYSAPR_DATETIME}'`, `'${data.CHNG_REMARK}'`]
        }
        return await this.config.execSpWithParams(object);
    }

    async Upd_StatusTransactionsCattleFeed(data) {
        let SYSAPR_DATETIME = await this.config.Get_SysDateTime()
        let object = {
            name: 'Upd_StatusTransactionsCattleFeed',
            params: [data.TRAN_NO, data.TRAN_SUBTYPE, data.AMEND_NO, data.STATUS_CODE, `'${data.SYSAPR_LOGIN}'`, `'${SYSAPR_DATETIME}'`, `'${data.CHNG_REMARK}'`]
        }
        return await this.config.execSpWithParams(object);
    }

    async Sel_ReportHelp(data) {
        let object = {
            name: 'Sel_ReportHelp',
            params: [data.CompanyId, data.TypeList, data.SubType]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }
    async Sel_ReportLinking(data) {
        let object = {
            name: 'Sel_ReportLinking',
            params: [data.CompanyId, data.ReportCode, data.CODE]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }
    async Sel_TransactionsFinance(data) {
        let object = {
            name: 'Sel_TransactionsFinance',
            params: [data.CompanyID, data.TranType, data.UserId, data.FromDate, data.ToDate,]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }

    //------------ रोख खर्च मागणी व्हौचर insert 
    async insertDemand(data) {
        let queryArray = new Array();

        let dsHeader = data.TRNACCTOTHH;
        let dsAccount = data.TRNACCTOTHIDETAILS
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);

        let TRANNO = 0;
        if (dsHeader?.TRAN_NO == 0) {
            let object = {
                name: 'Get_Next_Trans_No',
                params: [dsHeader.COMPUNIT_ID, dsHeader.TRAN_TYPE, dsHeader.TRAN_SUBTYPE, dsHeader.TRAN_SERIES, dsHeader.TRAN_DATE, 'TRNACCTOTHH']
            }
            let tran = await this.config.execSpWithParams(object);
            TRANNO = tran[0][''];
        } else {
            await this.config.executeQuery(`DELETE FROM TRNACCTOTHH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            await this.config.executeQuery(`DELETE FROM TRNACCTOTHIDETAILS where TRAN_NO=${dsHeader.TRAN_NO}`);
            TRANNO = dsHeader.TRAN_NO;
        }
        console.log('TRAN_NO', TRANNO);
        dsHeader['TRAN_NO'] = TRANNO;
        dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNACCTOTHH';

        //Insert into TRNPRCHPOH
        queryArray.push(await this.config.insertData(dsHeader));

        if (dsAccount.length != 0) {
            let SRNO = 1;
            for (let item of dsAccount) {
                item['TRAN_NO'] = TRANNO;
                item['SYSADD_DATETIME'] = sysDate[0][''];
                item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['SYSCHNG_DATETIME'] = sysDate[0][''];
                item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                item['SR_NO'] = SRNO;
                item['tableName'] = 'TRNACCTOTHIDETAILS';

                queryArray.push(await this.config.insertData(item));
                SRNO++;
            }
        }
        return await this.config.executeInsertQuery(queryArray);

    }


    //------------ insert व्यापारी/खर्च देणे 
    async insertVenderDemandDebit(data) {
        let queryArray = new Array();

        let dsHeader = data.TRNACCTOTHH;
        let dsHeader1 = data.TRNACCTOTHH;
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let object = {
            name: 'Get_Next_Trans_No',
            params: [dsHeader.COMPUNIT_ID, dsHeader.TRAN_TYPE, dsHeader.TRAN_SUBTYPE, dsHeader.TRAN_SERIES, dsHeader.TRAN_DATE, 'TRNACCTOTHH']
        }
        let TRANNO = await this.config.execSpWithParams(object);
        dsHeader['TRAN_NO'] = TRANNO[0][''];
        dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNACCTOTHH';
        queryArray.push(await this.config.insertData(dsHeader));

        // dsHeader1['TRAN_NO'] = TRANNO[0][''];
        // dsHeader1['REF_TRANNO'] = TRANNO[0][''];
        // dsHeader1['SYSADD_DATETIME'] = sysDate[0][''];
        // dsHeader1['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        // dsHeader1['SYSCHNG_DATETIME'] = sysDate[0][''];
        // dsHeader1['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        // dsHeader1['tableName'] = 'TRNACCTMATH';
        // await this.config.insertData(dsHeader1);
        return await this.config.executeInsertQuery(queryArray);
    }

    //-----------------Insert Visual Inspection Form 
    async submitVisualInspection(data) {
        let queryArray = new Array();

        let dsHeader = data.TRNQAMSTESTH;
        let dsAccount = data.TRNACCTMATSTATUS
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);

        let object = {
            name: 'Get_Next_Trans_No',
            params: [dsHeader.COMPANY_ID, dsHeader.TRAN_TYPE, dsHeader.TRAN_SUBTYPE, dsHeader.TRAN_SERIES, dsHeader.TRAN_DATE, 'TRNQAMSTESTH']
        }
        let TRANNO = await this.config.execSpWithParams(object);
        console.log('TRAN_NO', TRANNO[0]['']);
        dsHeader['TRAN_NO'] = TRANNO[0][''];
        dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNQAMSTESTH';

        //Insert into TRNPRCHPOH
        queryArray.push(await this.config.insertData(dsHeader));

        dsAccount['TRAN_NO'] = TRANNO[0][''];
        dsAccount['SR_NO'] = 1;
        dsAccount['SYSADD_DATETIME'] = sysDate[0][''];
        dsAccount['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsAccount['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsAccount['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsAccount['STATUS_CODE'] = dsHeader.STATUS_CODE;
        dsAccount['TRAN_DATE'] = dsHeader.TRAN_DATE;
        dsAccount['tableName'] = 'TRNACCTMATSTATUS';

        queryArray.push(await this.config.insertData(dsAccount));
        return await this.config.executeInsertQuery(queryArray);

    }


    async getEmployeeList() {
        return await this.config.executeQuery(`select * from MSTCOMMEMPLOYEE where STATUS_CODE = 0 order by NAME ASC`);
    }

    async pumpUnits() {
        return await this.config.executeQuery(`select * from MSTCOMPUNITS where COMPUNIT_ID = 105`)
    }

    async getSansthaDetails() {
        return await this.config.executeQuery(`select *,SUB_GLACNO as CODE,SUBGL_LONGNAME as NAME from MSTACCTGLSUB where STATUS_CODE=0 AND SUB_GLCODE IN(17,21)`)
    }

    async getSansthaDataDraft() {
        return await this.config.executeQuery(`select *,SUB_GLACNO as CODE,SUBGL_LONGNAME as NAME from MSTACCTGLSUB where STATUS_CODE=0 AND SUB_GLCODE IN(21)`)
    }

    async getSansthaDetails1(data) {
        return await this.config.executeQuery(`select *,SUB_GLACNO as CODE,SUBGL_LONGNAME as NAME from MSTACCTGLSUB where STATUS_CODE=0 AND SUB_GLCODE IN(${data})`)
    }

    //------------ Insert Dairy Equipement Data
    async insertGatePass(data) {
        console.log(data);
        let queryArray = new Array();

        let dsHeader = data.data.dsHeader;
        let dsAccount = data.data.dsTable
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);

        let TRANNO = 0;
        if (dsHeader?.TRAN_NO == 0) {
            let object = {
                name: 'Get_Next_Trans_No',
                params: [dsHeader.COMPUNIT_ID, dsHeader.TRAN_TYPE, dsHeader.TRAN_SUBTYPE, dsHeader.TRAN_SERIES, dsHeader.TRAN_DATE, 'TRNDSTORMATH']
            }
            let tran = await this.config.execSpWithParams(object);
            TRANNO = tran[0][''];
        } else {
            await this.config.executeQuery(`DELETE FROM TRNDSTORMATH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            await this.config.executeQuery(`DELETE FROM TRNDSTORMATIGPASS where TRAN_NO=${dsHeader.TRAN_NO}`);
            TRANNO = dsHeader.TRAN_NO;
        }
        console.log('TRAN_NO', TRANNO);
        dsHeader['TRAN_NO'] = TRANNO;
        // dsHeader['REF_TRANNO'] = TRANNO;
        dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNDSTORMATH';

        //Insert into TRNPRCHPOH
        queryArray.push(await this.config.insertData(dsHeader));

        if (dsAccount.length != 0) {
            let SRNO = 1;
            for (let item of dsAccount) {
                if (Number(item.QTY) != 0) {
                    item['TRAN_NO'] = TRANNO;
                    item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                    item['CHAPTER_CODE'] = item.CHAPTER;
                    item['CHAPTER_NO'] = item.CHAPTERNO;
                    item['UNIT_CODE'] = item.UNIT;
                    item['TAX_CODE'] = item.GST_RATECATEGORY;
                    item['SYSADD_DATETIME'] = sysDate[0][''];
                    item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                    item['SYSCHNG_DATETIME'] = sysDate[0][''];
                    item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                    item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                    item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                    item['CUST_SUB_GLACNO'] = dsHeader.SUB_GLACNO;
                    item['SR_NO'] = SRNO;
                    item['tableName'] = 'TRNDSTORMATIGPASS';

                    queryArray.push(await this.config.insertData(item));
                    SRNO++;
                }
            }
        }
        return await this.config.executeInsertQuery(queryArray);
    }

    async insertGatePassCEMM(data) {
        console.log(data);
        let queryArray = new Array();
        let dsHeader = data.data.dsHeader;
        let dsAccount = data.data.dsTable
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);

        let TRANNO = 0;
        if (dsHeader?.TRAN_NO == 0) {
            let object = {
                name: 'Get_Next_Trans_No',
                params: [dsHeader.COMPUNIT_ID, dsHeader.TRAN_TYPE, dsHeader.TRAN_SUBTYPE, dsHeader.TRAN_SERIES, dsHeader.TRAN_DATE, 'TRNCMEDMATH']
            }
            let tran = await this.config.execSpWithParams(object);
            TRANNO = tran[0][''];
        } else {
            await this.config.executeQuery(`DELETE FROM TRNCMEDMATH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            await this.config.executeQuery(`DELETE FROM TRNCMEDMATIGPASS where TRAN_NO=${dsHeader.TRAN_NO}`);
            TRANNO = dsHeader.TRAN_NO;
        }
        console.log('TRAN_NO', TRANNO);
        dsHeader['TRAN_NO'] = TRANNO;
        dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNCMEDMATH';

        //Insert into TRNPRCHPOH
        queryArray.push(await this.config.insertData(dsHeader));

        if (dsAccount.length != 0) {
            let SRNO = 1;
            for (let item of dsAccount) {
                if (Number(item.QTY) != 0) {
                    item['TRAN_NO'] = TRANNO;
                    item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                    item['CHAPTER_CODE'] = item.CHAPTER;
                    item['CHAPTER_NO'] = item.CHAPTERNO;
                    item['UNIT_CODE'] = item.UNIT;
                    item['TAX_CODE'] = item.GST_RATECATEGORY;
                    item['SYSADD_DATETIME'] = sysDate[0][''];
                    item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                    item['SYSCHNG_DATETIME'] = sysDate[0][''];
                    item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                    item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                    item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                    item['CUST_SUB_GLACNO'] = dsHeader.SUB_GLACNO;
                    item['SR_NO'] = SRNO;
                    item['tableName'] = 'TRNCMEDMATIGPASS';

                    queryArray.push(await this.config.insertData(item));
                    SRNO++;
                }
            }
        }
        return await this.config.executeInsertQuery(queryArray);
    }

    async insertGatePassCETTLE(data) {
        
        console.log(data);
        let queryArray = new Array();
        let dsHeader = data.data.dsHeader;
        let dsAccount = data.data.dsTable
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);

        let TRANNO = 0;
        if (dsHeader?.TRAN_NO == 0) {
            let object = {
                name: 'Get_Next_Trans_No',
                params: [dsHeader.COMPUNIT_ID, dsHeader.TRAN_TYPE, dsHeader.TRAN_SUBTYPE, dsHeader.TRAN_SERIES, dsHeader.TRAN_DATE, 'TRNCFEEDMATH']
            }
            let tran = await this.config.execSpWithParams(object);
            TRANNO = tran[0][''];
        } else {
            await this.config.executeQuery(`DELETE FROM TRNCFEEDMATH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            await this.config.executeQuery(`DELETE FROM TRNCFEEDMATIGPASS where TRAN_NO=${dsHeader.TRAN_NO}`);
            await this.config.executeQuery(`DELETE FROM TRNGATETRACKDETAILS where TRAN_NO=${dsHeader.TRAN_NO}`);
            TRANNO = dsHeader.TRAN_NO;
        }
        console.log('TRAN_NO', TRANNO);
        dsHeader['TRAN_NO'] = TRANNO;
        dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNCFEEDMATH';

        //Insert into TRNPRCHPOH
        queryArray.push(await this.config.insertData(dsHeader));

        //Gate Tracking Data Insert
        let tempQty = 0;
        let GateTrack = new Object();
        GateTrack['TRAN_NO'] = TRANNO;
        GateTrack['TRAN_DATE'] = dsHeader.TRAN_DATE;
        GateTrack['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
        GateTrack['SUB_GLACNO'] = dsHeader.SUB_GLACNO;
        GateTrack['STATUS_CODE'] = '21';
        GateTrack['SYSADD_DATETIME'] = sysDate[0][''];
        GateTrack['SYS_DATE'] = dsHeader.SYSADD_LOGIN;
        GateTrack['USER_NAME'] = 'sa';
        if (dsAccount.length != 0) {
            for (let item of dsAccount) {
                if (item.NAME != '') {
                    tempQty = tempQty + item.QTY
                }
            }
        }
        GateTrack['QTY'] = tempQty;
        GateTrack['tableName'] = 'TRNGATETRACKDETAILS';

        queryArray.push(await this.config.insertData(GateTrack));

        if (dsAccount.length != 0) {
            let SRNO = 1;
            for (let item of dsAccount) {
                if (Number(item.QTY) != 0) {
                    item['TRAN_NO'] = TRANNO;
                    item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                    item['CHAPTER_CODE'] = item.CHAPTER;
                    item['CHAPTER_NO'] = item.CHAPTERNO;
                    item['UNIT_CODE'] = item.UNIT; 
                    item['TAX_CODE'] = item.GST_RATECATEGORY;
                    item['DISC_ON_BAG'] = 0;
                    item['SYSADD_DATETIME'] = sysDate[0][''];
                    item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                    item['SYSCHNG_DATETIME'] = sysDate[0][''];
                    item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                    item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                    item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                    item['CUST_SUB_GLACNO'] = dsHeader.SUB_GLACNO;
                    item['OUTDISC_AMOUNT'] = item.AMOUNT;
                    item['SR_NO'] = SRNO;
                    item['tableName'] = 'TRNCFEEDMATIGPASS';

                    queryArray.push(await this.config.insertData(item));
                    SRNO++;
                }
            }
        }

        await this.config.executeInsertQuery(queryArray);
    }


    //Get Data
    async dsCashAcSub() {
        // return await this.config.executeQuery(`select * from MSTACCTGLSUB where STATUS_CODE = 0`)
        return await this.config.executeQuery(`select * from MSTACCTGLSUBGLVW where STATUS_CODE = 0`)
    }

    //get Depts Data for internal sales
    async dsCashAccountDetails(dept) {
        return await this.config.executeQuery(`select * from MSTCOMPUNITS where STATUS_CODE=0 AND APPLICABLE_FOR=0 AND CODE <> ${dept}`)
    }

    //-------------------- Menu Nav Details ----------------//
    async menuNavDetails() {
        ///Get Module details
        let modules = await this.config.executeUserQuery(`select MODULE_NO as id,MODULE_NAME as label from Modules where STATUS_CODE = 0`);
        for (let item of modules) {
            let subArray = await this.config.executeUserQuery(`select MODULE_NO as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = 0`);
            if (subArray.length != 0) {
                item['subItems'] = subArray;
                if (subArray.length != 0) {
                    for (let ele of subArray) {
                        if (ele.link == null || ele.link == "") {
                            delete ele.link
                        }
                        let subSubArray = await this.config.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele.id}`);
                        if (subSubArray.length != 0) {
                            ele['subItems'] = subSubArray;
                            if (subSubArray.length != 0) {
                                for (let ele1 of subSubArray) {
                                    if (ele1.link == null || ele1.link == "") {
                                        delete ele1.link
                                    }
                                    let subSub1Array = await this.config.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele1.id}`);
                                    if (subSub1Array.length != 0) {
                                        ele1['subItems'] = subSub1Array;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return { data: modules };
    }

    async getUserSpdata(data) {
        let object = {
            name: data.name,
            params: data.params
        }
        return await this.config.execUserSpWithParams(object, data.multiflag);
    }

    
    //get Depts Data for internal sales
    async DeleteQury(DATA) {
        let tableNameArr = [];
        let colExist;
        let DeletedStatus;
        tableNameArr = await this.config.executeQuery(`TABLEASSIGN ${DATA.TRAN_NO}`)
        for (let item of tableNameArr) {
            colExist = await this.config.executeQuery(`SELECT column_name FROM information_schema.columns WHERE table_name = '${item.tname}' AND column_name = 'SYSCHNG_REMARK'`)
            if (colExist.length != 0) {
                DeletedStatus = await this.config.executeQuery(`update ${item.tname} set SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`)
            }
            else {
                DeletedStatus = await this.config.executeQuery(`update ${item.tname} set  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`)
            }
        }
        // 

        ///------------------------ Ajit Sutar Code Date - 05/12/2024 --------------------------
        let newArray = new Array();
        for (let item of tableNameArr) {
            if (item.colname.includes('REF')) {
                let obj = {
                    'TableName': item.tname,
                    'ColumnName': item.colname
                }
                let result = await this.config.executeQuery(item.query)
                obj['TRAN_NO'] = result[0].TRAN_NO;
                newArray.push(obj);
            }

            console.log(newArray);
        }

        if (newArray.length != 0) {
            tableNameArr = await this.config.executeQuery(`TABLEASSIGN ${newArray[0].TRAN_NO}`)
            for (let item of tableNameArr) {
                colExist = await this.config.executeQuery(`SELECT column_name FROM information_schema.columns WHERE table_name = '${item.tname}' AND column_name = 'SYSCHNG_REMARK'`)
                if (colExist.length != 0) {
                    DeletedStatus = await this.config.executeQuery(`update ${item.tname} set SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${newArray[0].TRAN_NO}`)
                }
                else {
                    DeletedStatus = await this.config.executeQuery(`update ${item.tname} set  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${newArray[0].TRAN_NO}`)
                }
            }
        }
        return DeletedStatus;




        // if (DATA.SYSCHNG_REMARK != '' && DATA.SYSCHNG_REMARK != undefined) {
        //     return await this.config.executeQuery(`UPDATE ${DATA.TABLE_NAME} SET SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO} `)
        // } else {
        //     return await this.config.executeQuery(`UPDATE ${DATA.TABLE_NAME} SET  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`)
        // }
    }

    //get Depts Data for internal sales
    async MASTDeleteQury(DATA) {
        return await this.config.executeQuery(`UPDATE ${DATA.TABLE_NAME} SET  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE ${DATA.WHERE}`)
    }

    //Get Last Purchase date
    async lastPurchaseDate(data) {
        let result = await this.config.executeQuery(`select * from TRNMILKHDISP where SUB_GLACNO = ${data} order by TRAN_DATE desc OFFSET  5 ROWS 
        FETCH NEXT 5 ROWS ONLY`);
        var startDate = moment().format('DD/MM/YYYY');
        var endDate = moment().subtract(3, 'month').format('DD/MM/YYYY');
        var compDate = moment(result[0]?.TRAN_DATE, 'YYYYMMDD').format('DD/MM/YYYY');

        var isTrue = moment(compDate, 'DD/MM/YYYY').isBetween(moment(endDate, 'DD/MM/YYYY'), moment(startDate, 'DD/MM/YYYY'), 'days', '[]');
        if (!isTrue) {
            await this.config.executeQuery(`update MSTACCTGLSUB set OUTSTAND_CODE = 1 where SUB_GLACNO = ${data}`)
        }
        return { isTrue: isTrue, Date: compDate };
    }


    async getMstSubGLAcNoPurchaseFlag(data) {
        return await this.config.executeQuery(`select * from MSTACCTGLSUB where SUB_GLACNO = ${data}`);
    }


    async dairyDetails(data: any) {

        /*
{
  "TRAN_DATE" : "20110111"
}
        */



        let result: any = {};
        result["milkCollectionCowMor"] = {
            data: await this.config.executeQuery(
                `SELECT COW_BUF, GOOD_QTY, SUBGL_LONGNAME  FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 1 AND COW_BUF = 1
            `), SUM: await this.config.executeQuery(`
        SELECT COW_BUF, SUM(GOOD_QTY) AS SUM FROM TRNMILKHAWAK
            INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
            WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 1 AND COW_BUF = 1
			GROUP BY COW_BUF
        `)
        };
        result["milkCollectionCowEvg"] = {
            data: await this.config.executeQuery(
                `SELECT COW_BUF, GOOD_QTY, SUBGL_LONGNAME  FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 2 AND COW_BUF = 1
            `),
            SUM: await this.config.executeQuery(`
            SELECT COW_BUF, SUM(GOOD_QTY) AS SUM FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 2 AND COW_BUF = 1
                GROUP BY COW_BUF
            `)
        };

        result["milkCollectionBuffaloMrg"] = {
            data: await this.config.executeQuery(
                `SELECT COW_BUF, GOOD_QTY, SUBGL_LONGNAME  FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 1 AND COW_BUF = 2
            `),
            SUM: await this.config.executeQuery(`SELECT SUM(GOOD_QTY) AS SUM  FROM TRNMILKHAWAK
            INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
            WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 1 AND COW_BUF = 2 
            `)
        };
        result["milkCollectionBuffaloEvg"] = {
            data: await this.config.executeQuery(
                `SELECT COW_BUF, GOOD_QTY, SUBGL_LONGNAME  FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 2 AND COW_BUF = 2
            `),
            SUM: await this.config.executeQuery(`SELECT SUM(GOOD_QTY) AS SUM   FROM TRNMILKHAWAK
            INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
            WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 2 AND COW_BUF = 2
            `)
        };








        result["milkCollectionBuffaloAmtMrg"] = {
            data: await this.config.executeQuery(
                `SELECT COW_BUF, GOOD_QTY, SUBGL_LONGNAME ,(TRNMILKHAWAK.GOOD_QTY * TRNMILKHAWAK.MILK_RATE) AMT FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 1
            `),
            SUM: await this.config.executeQuery(
                `SELECT SUM(TRNMILKHAWAK.GOOD_QTY * TRNMILKHAWAK.MILK_RATE) TOT_AMT FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 1
            `)
        };

        result["milkCollectionBuffaloAmtEvg"] = {
            data: await this.config.executeQuery(
                `SELECT COW_BUF, GOOD_QTY, SUBGL_LONGNAME ,(TRNMILKHAWAK.GOOD_QTY * TRNMILKHAWAK.MILK_RATE) AMT FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 2
            `),
            SUM: await this.config.executeQuery(
                `SELECT SUM(TRNMILKHAWAK.GOOD_QTY * TRNMILKHAWAK.MILK_RATE) TOT_AMT FROM TRNMILKHAWAK
                INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                WHERE TRAN_DATE = '${data.TRAN_DATE}' AND SHIFT = 2
            `)
        };


        return await result
    }

    async dairyGraph(data: any) {
        let results = {};

        results["jan"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '01'`
        );
        results["feb"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '02'`
        );
        results["mar"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '03'`
        );
        results["apr"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '04'`
        );
        results["may"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '05'`
        );
        results["jun"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '06'`
        );
        results["jul"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '07'`
        );
        results["aug"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '08'`
        );
        results["sep"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '09'`
        );
        results["oct"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '10'`
        );
        results["nov"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '11'`
        );
        results["dec"] = await this.config.executeQuery(
            `SELECT COALESCE(SUM(GOOD_QTY), 0) AS VALUE FROM TRNMILKHAWAK
            WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}' AND SUBSTRING(TRAN_DATE, 5, 2) = '12'`
        );

        let temp = await this.config.executeQuery(
            `
            SELECT 
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '01' THEN GOOD_QTY ELSE 0 END) AS jan,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '02' THEN GOOD_QTY ELSE 0 END) AS feb,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '03' THEN GOOD_QTY ELSE 0 END) AS mar,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '04' THEN GOOD_QTY ELSE 0 END) AS apr,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '05' THEN GOOD_QTY ELSE 0 END) AS may,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '06' THEN GOOD_QTY ELSE 0 END) AS jun,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '07' THEN GOOD_QTY ELSE 0 END) AS jul,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '08' THEN GOOD_QTY ELSE 0 END) AS aug,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '09' THEN GOOD_QTY ELSE 0 END) AS sep,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '10' THEN GOOD_QTY ELSE 0 END) AS oct,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '11' THEN GOOD_QTY ELSE 0 END) AS nov,
        SUM(CASE WHEN SUBSTRING(TRAN_DATE, 5, 2) = '12' THEN GOOD_QTY ELSE 0 END) AS dec
    FROM TRNMILKHAWAK
    WHERE SUBSTRING(TRAN_DATE, 1, 4) = '${data.YEAR}'
            `
        )

        results["combine"] = await Object.values(temp[0]);
        return await results;

    }

    async dairyDispatchLoosePackingMilk(data: any) {
        let result: any = {};
        result["LOOSE_MILK"] = {
            "COW": await this.config.executeQuery(
                `SELECT COALESCE(SUM(DISP_ACTUAL_QTY),0) AS QTY FROM [dbo].[TRNMILKHDISP] 
            WHERE TRAN_DATE = '${data.TRAN_DATE}' AND COW_BUF = 1`
            ),
            "BUFFELO": await this.config.executeQuery(
                `SELECT COALESCE(SUM(DISP_ACTUAL_QTY),0) AS QTY FROM [dbo].[TRNMILKHDISP] 
            WHERE TRAN_DATE = '${data.TRAN_DATE}' AND COW_BUF = 2`)
        };

        result["PACKING_MILK"] = {
            "COW": await this.config.executeQuery(
                `select COALESCE((SUM(DESP_CRATES)* 10),0) AS QTY from TRNMILKDESPPACKI where
                 DESP_CRATES != 0 and TRAN_DATE = '${data.TRAN_DATE}' and MILK_TYPE = 1`
            ),
            "BUFFELO": await this.config.executeQuery(
                `select COALESCE((SUM(DESP_CRATES)* 10),0) AS QTY from TRNMILKDESPPACKI where
                 DESP_CRATES != 0 and TRAN_DATE = '${data.TRAN_DATE}' and MILK_TYPE = 2`)
        };

        return await result
    }

    async dairyPackingProductionMilkPacking(data: any) {
        return await this.getHelpList({
            "COMPANYID": "'101'",
            "TableName": "'MSTMILKTYPES'",
            "CompanyidColumn": "''",
            "HelpColumnNames": "'CODE,UPPER(NAME) AS NAME'",
            "HelpColumnFilter": "'STATUS_CODE=0'",
            "SortOrder": "'NAME'",
            "ExecFlag": "'1'"
        });
    }

    async dairyPackingProductionMilkQtyLtr(data: any) {
        return await this.config.executeQuery(
            `
            SELECT
    MSTMATERIALS.CODE MAT_CODE,
    MSTMATERIALS.MILK_TYPE,
    MSTMILKTYPES.NAME MILKTYPE,
    MSTMATERIALS.NAME,
    CASE
        WHEN MSTMATERIALS.FINISH_WT >= 1 
            THEN CONVERT(VARCHAR, CONVERT(REAL, MSTMATERIALS.FINISH_WT))
        ELSE 
            CONVERT(VARCHAR, MSTMATERIALS.FINISH_WT) 
    END AS LITER,
    MSTMATERIALS.TAX_CODE,
    CONVERT(VARCHAR, TRNMILKPRODPACKI.TRAN_NO) TRAN_NO,
    TRNMILKPRODPACKI.TOTAL_LITERS,
    TRNMILKPRODPACKI.PACK_QTY,
    TRNMILKPRODPACKI.TRAN_DATE
FROM
    MSTMATERIALS
    LEFT OUTER JOIN MSTMILKTYPES ON MSTMILKTYPES.CODE = MSTMATERIALS.MILK_TYPE
    LEFT OUTER JOIN TRNMILKPRODPACKI ON TRNMILKPRODPACKI.MAT_CODE = MSTMATERIALS.CODE
WHERE
    MSTMATERIALS.MATERIAL_TYPE = 101
    AND MSTMATERIALS.STATUS_CODE = 0
    AND MSTMATERIALS.MILK_TYPE = ${data.MILK_TYPE} -- @intMilkType
    -- AND TRNMILKPRODPACKI.TRAN_DATE = '${data.TRAN_DATE}' 
ORDER BY
    MSTMILKTYPES.SORT_IN_PACKINGDISP,
    CONVERT(REAL, MSTMATERIALS.FINISH_WT);

            `
        );
    }
    /*
गाय म्हैस .. drp down common/GetHelpList
    {
  "COMPANYID": "'101'",
  "TableName": "'MSTMILKTYPES'",
  "CompanyidColumn": "''",
  "HelpColumnNames": "'CODE,UPPER(NAME) AS NAME'",
  "HelpColumnFilter": "'STATUS_CODE=0'",
  "SortOrder": "'NAME'",
  "ExecFlag": "'1'"
}


// query for get packings 1ltr 2 ltr
SELECT      
    MSTMATERIALS.CODE MAT_CODE,
    MSTMATERIALS.MILK_TYPE,
    MSTMILKTYPES.NAME MILKTYPE,
    MSTMATERIALS.NAME,
    CASE
    WHEN MSTMATERIALS.FINISH_WT >= 1 
        THEN CONVERT(VARCHAR,CONVERT(REAL,MSTMATERIALS.FINISH_WT))
    ELSE CONVERT(VARCHAR,MSTMATERIALS.FINISH_WT) END AS LITER,
    MSTMATERIALS.TAX_CODE
FROM
    MSTMATERIALS
    LEFT OUTER JOIN MSTMILKTYPES ON MSTMILKTYPES.CODE=MSTMATERIALS.MILK_TYPE
WHERE
    MSTMATERIALS.MATERIAL_TYPE = 101
    AND MSTMATERIALS.STATUS_CODE = 0
    AND MILK_TYPE = 2 --@intMilkType 
ORDER BY
    MSTMILKTYPES.SORT_IN_PACKINGDISP
    ,CONVERT(REAL,MSTMATERIALS.FINISH_WT)

    */

    async Sel_GetSubGLAccount(data) {
        let object = {
            name: 'Sel_GetSubGLAccount',
            params: [data.CompanyID, data.GlAcNo]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }

    // async getTransporterData() {
    //     return await this.config.executeQuery(`select * from MSTCOMMTRANSPORT where STATUS_CODE = 0`)
    // }
    /*
गाय म्हैस .. drp down common/GetHelpList
    {
  "COMPANYID": "'101'",
  "TableName": "'MSTMILKTYPES'",
  "CompanyidColumn": "''",
  "HelpColumnNames": "'CODE,UPPER(NAME) AS NAME'",
  "HelpColumnFilter": "'STATUS_CODE=0'",
  "SortOrder": "'NAME'",
  "ExecFlag": "'1'"
}


// query for get packings 1ltr 2 ltr
SELECT      
    MSTMATERIALS.CODE MAT_CODE,
    MSTMATERIALS.MILK_TYPE,
    MSTMILKTYPES.NAME MILKTYPE,
    MSTMATERIALS.NAME,
    CASE
    WHEN MSTMATERIALS.FINISH_WT >= 1 
        THEN CONVERT(VARCHAR,CONVERT(REAL,MSTMATERIALS.FINISH_WT))
    ELSE CONVERT(VARCHAR,MSTMATERIALS.FINISH_WT) END AS LITER,
    MSTMATERIALS.TAX_CODE
FROM
    MSTMATERIALS
    LEFT OUTER JOIN MSTMILKTYPES ON MSTMILKTYPES.CODE=MSTMATERIALS.MILK_TYPE
WHERE
    MSTMATERIALS.MATERIAL_TYPE = 101
    AND MSTMATERIALS.STATUS_CODE = 0
    AND MILK_TYPE = 2 --@intMilkType 
ORDER BY
    MSTMILKTYPES.SORT_IN_PACKINGDISP
    ,CONVERT(REAL,MSTMATERIALS.FINISH_WT)

    */

    async MSTCATTLESECDEPSLAB(data) {
        let queryArray = new Array();

        console.log(data)
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        // if (data.EFF_DATE != '' && data.TRAN_NO != undefined) {
        //     this.config.executeQuery(`Del_TabelData 'MSTCATTLESECDEPSLAB','EFF_DATE = ${data.EFF_DATE}'`)
        //     let obj = {
        //     }
        //     console.log(obj)
        //     await this.config.insertData(obj);
        //     return
        // } else {

        let srno = 0
        // data.tableData.pop();
        for (let item of data.MSTCATTLESECDEPSLAB) {
            srno++
            item['SR_NO'] = srno;
            item['tableName'] = 'MSTCATTLESECDEPSLAB';
            item['SYSADD_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYS_DATE'] = sysDate[0][''];
            queryArray.push(await this.config.insertData(item));
        }
        return await this.config.executeInsertQuery(queryArray);
        // }
    }
    async MSTCATTLEFEEDITEMRATE(data) {
        console.log(data)
        let queryArray = new Array();

        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let Existing
        Existing = await this.config.executeQuery(`SELECT * FROM MSTCATTLEFEEDITEMRATE WHERE EFF_DATE = ${data.MSTCATTLEFEEDITEMRATE[0].EFF_DATE} AND MAT_CODE = ${data.MSTCATTLEFEEDITEMRATE[0].MAT_CODE} `)
        if (Existing.length != 0) {
            this.config.executeQuery(`Del_TabelData 'MSTCATTLEFEEDITEMRATE','EFF_DATE = ${data.MSTCATTLEFEEDITEMRATE[0].EFF_DATE} AND MAT_CODE = ${data.MSTCATTLEFEEDITEMRATE[0].MAT_CODE}'`)
        }
        let srno = 0
        // data.tableData.pop();
        for (let item of data.MSTCATTLEFEEDITEMRATE) {
            srno++
            item['SR_NO'] = srno;
            item['tableName'] = 'MSTCATTLEFEEDITEMRATE';
            item['SYSADD_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYS_DATE'] = sysDate[0][''];
            queryArray.push(await this.config.insertData(item));
        }
        return await this.config.executeInsertQuery(queryArray);

        // }
    }
    async MSTPUMPITEMRATE(data) {
        console.log(data)
        let queryArray = new Array();

        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        // if (data.EFF_DATE != '' && data.TRAN_NO != undefined) {
        let Existing
        Existing = this.config.executeQuery(`SELECT * FROM MSTPUMPITEMRATE WHERE EFF_DATE = ${data.MSTPUMPITEMRATE[0].EFF_DATE} AND MAT_CODE = ${data.MSTPUMPITEMRATE[0].MAT_CODE} `)
        if (Existing.length != 0) {
            this.config.executeQuery(`Del_TabelData 'MSTPUMPITEMRATE','EFF_DATE = ${data.MSTPUMPITEMRATE[0].EFF_DATE} AND MAT_CODE = ${data.MSTPUMPITEMRATE[0].MAT_CODE}'`)

        }

        let srno = 0
        for (let item of data.MSTPUMPITEMRATE) {
            srno++
            item['SR_NO'] = srno;
            item['tableName'] = 'MSTPUMPITEMRATE';
            item['SYSADD_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYS_DATE'] = sysDate[0][''];
            queryArray.push(await this.config.insertData(item));
        }
        return await this.config.executeInsertQuery(queryArray);

    }
    async MSTCFEEDRAWQCTESTSMAT(data) {
        console.log(data)
        let queryArray = new Array();

        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        // if (data.EFF_DATE != '' && data.TRAN_NO != undefined) {
        let Existing
        Existing = await this.config.executeQuery(`SELECT * FROM MSTCFEEDRAWQCTESTSMAT WHERE MAT_CODE = ${data.MSTCFEEDRAWQCTESTSMAT[0].MAT_CODE} AND TEST_CODE = ${data.MSTCFEEDRAWQCTESTSMAT[0].TEST_CODE} `)
        if (Existing.length != 0) {
            this.config.executeQuery(`Del_TabelData 'MSTCFEEDRAWQCTESTSMAT','MAT_CODE = ${data.MSTCFEEDRAWQCTESTSMAT[0].MAT_CODE} AND TEST_CODE = ${data.MSTCFEEDRAWQCTESTSMAT[0].TEST_CODE}'`)

        }

        let srno = 0
        for (let item of data.MSTCFEEDRAWQCTESTSMAT) {
            srno++
            item['SR_NO'] = srno;
            item['tableName'] = 'MSTCFEEDRAWQCTESTSMAT';
            item['SYSADD_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYS_DATE'] = sysDate[0][''];
            queryArray.push(await this.config.insertData(item));
        }
        return await this.config.executeInsertQuery(queryArray);

    }
    async setNaveRakam(data) {
        console.log(data)

        let res = await this.config.executeQuery(`WITH amounts AS (
                SELECT 
                    SUM(CASE WHEN DR_CR = 'C' THEN tran_amt ELSE 0 END) as amtc,
                    SUM(CASE WHEN DR_CR = 'D' THEN tran_amt ELSE 0 END) as amtd
                FROM TRNACCTPOST
                WHERE SUB_GLACNO = ${data.customer_val}
            )
            SELECT 
                amtc, 
                amtd, 
                (CASE 
                    WHEN (amtd - amtc) < 0 THEN CAST(ABS(amtd - amtc) AS VARCHAR) + N'  नावे'
                    WHEN (amtd - amtc) > 0 THEN CAST(amtd - amtc AS VARCHAR) + N'  जमा'
                    ELSE CAST(amtd - amtc AS VARCHAR) + ' neutral' -- Optional: handle the case where total is exactly 0
                END) as total
            FROM amounts;`)
        return res


    }
    async pashukhadypoticount(data) {
        console.log(data)

        let res = await this.config.executeQuery(`
         SELECT 
    T1.QUANTITY, 
    T1.RATE AS AVERAGE_RATE
FROM 
    (
        SELECT 
            SUM(TOTAL_QTY) AS QUANTITY, 
            AVG(MILK_RATE) AS RATE
        FROM TRNMILKHAWAK 
        WHERE TRAN_DATE BETWEEN 
            (
                SELECT END_DATE 
                FROM CNFMILKBILLPERIOD 
                WHERE BILL_DATE =  
                    (
                        SELECT MAX(TRAN_DATE) 
                        FROM TRNACCTMATH 
                        WHERE TRAN_SUBTYPE = 3 
                        AND TRAN_DATE = 
                            (
                                SELECT MAX(TRAN_DATE) 
                                FROM TRNACCTMATH 
                                WHERE TRAN_SUBTYPE = 3 
                                AND COMPUNIT_ID = 101
                            ) 
                        AND COMPUNIT_ID = 101
                    )
            ) 
        AND 
            (
                SELECT START_DATE 
                FROM CNFMILKBILLPERIOD 
                WHERE BILL_DATE =  
                    (
                        SELECT MAX(TRAN_DATE) 
                        FROM TRNACCTMATH 
                        WHERE TRAN_SUBTYPE = 3 
                        AND TRAN_DATE = 
                            (
                                SELECT MAX(TRAN_DATE) 
                                FROM TRNACCTMATH 
                                WHERE TRAN_SUBTYPE = 3 
                                AND COMPUNIT_ID = 101
                            ) 
                        AND COMPUNIT_ID = 101
                    )
            ) 
        AND SUB_GLACNO = ${data.SUB_GLACNO}
    ) T1;
`)
        return res
    }
    async matrateforAPO(data) {
        console.log(data)

        let res = await this.config.executeQuery(`
           SELECT  
	MIN(TRNPRCHIGRN.RATE) AS LowestRate
FROM 
	TRNCFEEDMATH
	LEFT OUTER JOIN MSTACCTGLSUB ON ISNULL(TRNCFEEDMATH.SUB_GLACNO, TRNCFEEDMATH.GL_ACNO) = MSTACCTGLSUB.SUB_GLACNO
	LEFT OUTER JOIN TRNPRCHIGRN ON TRNCFEEDMATH.TRAN_NO = TRNPRCHIGRN.TRAN_NO
	LEFT OUTER JOIN MSTMATERIALS ON TRNPRCHIGRN.MAT_CODE = MSTMATERIALS.CODE
WHERE
	--CONVERT(VARCHAR(8), TRNCFEEDMATH.TRAN_DATE, 112) BETWEEN CONVERT(VARCHAR(8), DATEADD(DAY, -45, GETDATE()), 112) AND CONVERT(VARCHAR(8), GETDATE(), 112)
    TRNCFEEDMATH.TRAN_DATE BETWEEN '20220701' AND '20240811'
	AND CONVERT(VARCHAR, TRNPRCHIGRN.MAT_CODE) IN ('${data.MAT_CODE}') 
	AND SUBSTRING(CONVERT(VARCHAR, TRNCFEEDMATH.TRAN_NO), 8, 3) = '202'
	AND LEFT(TRNCFEEDMATH.TRAN_NO, 3) = '104'
	AND TRNCFEEDMATH.TRAN_SUBTYPE IN (5, 6)
	AND TRNCFEEDMATH.STATUS_CODE = 0;
           `)
        return res
    }

    async empatendance(dataset) {
        let queryArray = new Array();

        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        if (dataset.TRAN_NO != '') {
            let date = moment(dataset.billDate, 'DD/MM/YYYY').format('YYYYMMDD');
            await this.config.executeQuery(`delete from TRNEMPDETAILS where TRAN_NO= ${dataset.TRAN_NO}`)

            dataset['TRAN_NO'] = dataset.TRAN_NO;
            dataset['SYS_DATE'] = sysDate[0]['']
            dataset['tableName'] = 'TRNEMPDETAILS';
            queryArray.push(await this.config.insertData(dataset));
        } else {
            let autoIncremented = await this.config.executeQuery(`Get_next_trans_no 104,${dataset.TRAN_TYPE},${dataset.TRAN_SUBTYPE},0,${dataset.TRAN_DATE},'TRNEMPDETAILS'`);
            //Insert Main Table
            dataset['TRAN_NO'] = autoIncremented[0][''];
            dataset['tableName'] = 'TRNEMPDETAILS';
            dataset['SYS_DATE'] = sysDate[0]['']
            dataset['USER_NAME'] = 'ADMIN';
            queryArray.push(await this.config.insertData(dataset))
        }

        return await this.config.executeInsertQuery(queryArray);


    }
    async RateHistory(dataset) {
        switch (dataset.CODE) {
            case "2":
                return await this.config.executeQuery(`		
                SELECT 
                MSTMILKTYPES.NAME AS MILK_NAME,
                dbo.FORMAT_DATE(MSTSNFRATEPRCH.EFF_DATE) AS PRN_EFFDATE,
                MSTSNFRATEPRCH.*
            FROM 
                MSTSNFRATEPRCH
            JOIN 
                MSTMILKTYPES 
            ON 
                MSTSNFRATEPRCH.COW_BUF = MSTMILKTYPES.CODE
            WHERE 
                MSTSNFRATEPRCH.RATE != 0;`);
            case "3":
                return await this.config.executeQuery(`	
                select     MSTMILKTYPES.NAME AS MILK_NAME, MSTACCTGLSUB.SUBGL_LONGNAME SUBGL_NAME,MSTCOMMCENTER.NAME COLLECTION_CENTER_NAME,
                dbo.FORMAT_DATE(MSTSALESNFRATE.EFF_DATE) PRN_EFFDATE,
                MSTSALESNFRATE.* from MSTSALESNFRATE
       JOIN  MSTMILKTYPES on MSTSALESNFRATE.COW_BUF = MSTMILKTYPES.CODE
       join MSTACCTGLSUB on MSTSALESNFRATE.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
       join MSTCOMMCENTER on MSTSALESNFRATE.COLLECTION_CENTER	=MSTCOMMCENTER.CODE
       where MSTSALESNFRATE.Rate!=0or MSTSALESNFRATE.PREMIUM_RATE !=0 or MSTSALESNFRATE.COMMISSION_RATE!=0 or MSTSALESNFRATE.COMM_PREMIUM_RATE!=0
       `);
                break;
            case "4":
                return await this.config.executeQuery(`		
				SELECT  MSTMATERIALS.NAME,
				  dbo.FORMAT_DATE(MSTCATTLEFEEDITEMRATE.EFF_DATE) PRN_EFFDATE,
										FORMAT(DATEADD(MINUTE, 330, 
       CAST(SUBSTRING(MSTCATTLEFEEDITEMRATE.SYSCHNG_DATETIME, 1, 8) + ' ' + 
            SUBSTRING(MSTCATTLEFEEDITEMRATE.SYSCHNG_DATETIME, 10, 8) AS DATETIME)), 
       'hh:mm tt dd/MM/yyyy') AS PRN_DATETIME,
	   MSTCATTLEFEEDITEMRATE.* FROM  MSTCATTLEFEEDITEMRATE
								 JOIN  MSTMATERIALS on MSTMATERIALS.CODE = MSTCATTLEFEEDITEMRATE.MAT_CODE`);
                break;
            case "6":
                return await this.config.executeQuery(`			select MSTPACKMILKRATETYPES.NAME RATETYPE_NAME,MSTMILKTYPES.NAME MILK_NAME,
                dbo.FORMAT_DATE(MSTPACKMILKTYPEITEMRATES.EFF_DATE) PRN_EFFDATE,
                FORMAT(DATEADD(MINUTE, 330, 
CAST(SUBSTRING(MSTPACKMILKTYPEITEMRATES.SYSCHNG_DATETIME, 1, 8) + ' ' + 
SUBSTRING(MSTPACKMILKTYPEITEMRATES.SYSCHNG_DATETIME, 10, 8) AS DATETIME)), 
'hh:mm tt dd/MM/yyyy') AS PRN_DATETIME,

MSTPACKMILKTYPEITEMRATES.* from MSTPACKMILKTYPEITEMRATES
JOIN  MSTMATERIALS on MSTMATERIALS.CODE = MSTPACKMILKTYPEITEMRATES.MAT_CODE
          JOIN  MSTPACKMILKRATETYPES on MSTPACKMILKTYPEITEMRATES.RATETYPE_CODE = MSTPACKMILKRATETYPES.code
                                           JOIN  MSTMILKTYPES on MSTPACKMILKTYPEITEMRATES.MILK_TYPE = MSTMILKTYPES.code`);
                break;
            case "7":
                return await this.config.executeQuery(`			select MSTMATERIALS.NAME,
            dbo.FORMAT_DATE(MSTPUMPITEMRATE.EFF_DATE) PRN_EFFDATE,


FORMAT(DATEADD(MINUTE, 330, 
CAST(SUBSTRING(MSTPUMPITEMRATE.SYSCHNG_DATETIME, 1, 8) + ' ' + 
SUBSTRING(MSTPUMPITEMRATE.SYSCHNG_DATETIME, 10, 8) AS DATETIME)), 
'hh:mm tt dd/MM/yyyy') AS PRN_DATETIME,

    MSTPUMPITEMRATE.*
    from MSTPUMPITEMRATE
     JOIN  MSTMATERIALS on MSTMATERIALS.CODE = MSTPUMPITEMRATE.MAT_CODE`);
                break;
            default:

                break;

        }

    }
    async absentMilkCustermer(data) {
        return await this.config.executeQuery(`		
                SELECT MSTACCTGLSUB.SUBGL_LONGNAME ,
                TRNMILKHAWAK.TRAN_DATE
                FROM MSTACCTGLSUB
                LEFT JOIN TRNMILKHAWAK 
                   ON MSTACCTGLSUB.SUB_GLACNO = TRNMILKHAWAK.SUB_GLACNO 
                  AND TRNMILKHAWAK.TRAN_DATE = '${data.TRAN_DATE}' 
                WHERE TRNMILKHAWAK.SUB_GLACNO IS NULL and MSTACCTGLSUB.SUB_GLCODE =17
                GROUP BY MSTACCTGLSUB.SUBGL_LONGNAME,TRNMILKHAWAK.TRAN_DATE;
                `);

    }
    async POmatNotgrn(data) {
        let Ptable
        switch (data.COMPANY_ID) {
            case '104':
                Ptable = 'TRNCFEEDMATPOST'
                break;
            case '105':
                Ptable = 'TRNPUMPMATPOST'
                break;
            case '106':
                Ptable = 'TRNCMEDMATPOST'
                break;
            case '101':
                Ptable = 'TRNBIPRODMATPOST'
                break;
            case '103':
                Ptable = 'TRNDSTORMATPOST'
                break;
        }

        return await this.config.executeQuery(`		
                SELECT
	TRNPRCHPOH.SUB_GLACNO PARTY_CODE
	,MSTACCTGLSUB.SUBGL_LONGNAME PARTY_NAME
	,TRNPRCHPOI.MAT_CODE
	,MSTMATERIALS.NAME MAT_NAME
	,SUM(TRNPRCHPOI.QTY) PO_MAT_QTY
	,ISNULL(SUM(${Ptable}.QTY), 0) GRN_MAT_QTY
    ,SUM(TRNPRCHPOI.QTY) - ISNULL(SUM(${Ptable}.QTY), 0) AS DIFF_QTY
FROM
	TRNPRCHPOH
	LEFT OUTER JOIN TRNPRCHPOI ON TRNPRCHPOH.TRAN_NO = TRNPRCHPOI.TRAN_NO
	LEFT OUTER JOIN MSTACCTGLSUB ON TRNPRCHPOH.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
	LEFT OUTER JOIN MSTMATERIALS ON TRNPRCHPOI.MAT_CODE = MSTMATERIALS.CODE
	LEFT OUTER JOIN TRNPRCHIGRN ON TRNPRCHPOH.TRAN_NO = TRNPRCHIGRN.PO_NO
	LEFT OUTER JOIN ${Ptable} ON TRNPRCHIGRN.TRAN_NO = ${Ptable}.TRAN_NO
WHERE
	TRNPRCHPOH.STATUS_CODE = 0
	AND TRNPRCHIGRN.STATUS_CODE = 0
	AND ${Ptable}.STATUS_CODE = 0
	AND LEFT(CONVERT(NVARCHAR, TRNPRCHPOH.TRAN_NO), 3) =${data.COMPANY_ID}
	AND TRNPRCHPOH.COMPUNIT_ID = ${data.COMPANY_ID}
	AND TRNPRCHPOH.TRAN_DATE BETWEEN ${data.From_Date} AND ${data.To_Date}
GROUP BY
	TRNPRCHPOH.SUB_GLACNO
	,MSTACCTGLSUB.SUBGL_LONGNAME
	,TRNPRCHPOI.MAT_CODE
	,MSTMATERIALS.NAME
                `);

    }

    async MilkPurchaseAndSaleCosting(data) {
        let TRNMILKDISPDETAILS = await this.config.executeQuery(`		
        SELECT
        'Sale' AS TYPE,
                 MSTCOMMCENTER.NAME AS COLLCEN_NAME,
                 MSTACCTGLSUB.SUBGL_LONGNAME DISPARTY_NAME ,
                 SUM(ISNULL(DISPETAILS.ACCEPTED_QUANTITY, 0)) AS MILK_LITERS,
                 ISNULL(SUM((DISPETAILS.ACCEPTED_QUANTITY / 0.9707)), 0) AS GAIN_MILKKG,
                 ISNULL(ROUND((SUM(DISPETAILS.CUST_SNF) / COUNT(DISPETAILS.CUST_SNF)), 2), 0) AS GAIN_FAT,
                 ISNULL(ROUND((SUM(DISPETAILS.CUST_FAT) / COUNT(DISPETAILS.CUST_FAT)), 2), 0) AS GAIN_SNF,
                 ISNULL(SUM(DISPETAILS.TOTAL_COMM_RATE * DISPETAILS.ACCEPTED_QUANTITY), 0) AS SALE_RATE -- Total commission rate sum
             
             FROM
                 TRNMILKDISPDETAILS DISPETAILS
                 LEFT OUTER JOIN MSTCOMMCENTER ON DISPETAILS.COLLECTION_CENTER = MSTCOMMCENTER.CODE
                 LEFT OUTER JOIN MSTACCTGLSUB ON DISPETAILS.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
                     WHERE
                 DISPETAILS.TRAN_DATE BETWEEN ${data.From_Date} AND ${data.To_Date}
                     AND DISPETAILS.TOTAL_COMM_RATE IS NOT NULL
     
             GROUP BY
                 MSTACCTGLSUB.SUB_GLACNO,
                 MSTACCTGLSUB.SUBGL_LONGNAME,
                 MSTCOMMCENTER.NAME,
                 COLLECTION_CENTER
                `);
        let TRNMILKHAWAK = await this.config.executeQuery(`		
        SELECT
        'Purchase' AS TYPE,
  MSTCOMMCENTER.NAME AS COLLCEN_NAME,
  MSTACCTGLSUB.SUBGL_LONGNAME AS DISPARTY_NAME,
  SUM(ISNULL(trnmilkhawak.GOOD_QTY, 0)) AS MILK_LITERS,
  ISNULL(SUM((trnmilkhawak.GOOD_QTY / 0.9707)), 0) AS GAIN_MILKKG,
  ISNULL(ROUND((SUM(trnmilkhawak.SNF) / COUNT(trnmilkhawak.SNF)), 2), 0) AS GAIN_FAT,
  ISNULL(ROUND((SUM(trnmilkhawak.FAT) / COUNT(trnmilkhawak.FAT)), 2), 0) AS GAIN_SNF,
  ISNULL(SUM(ISNULL(trnmilkhawak.MILK_RATE, 0) * ISNULL(trnmilkhawak.GOOD_QTY, 0)), 0) AS SALE_RATE
FROM 
  trnmilkhawak
LEFT OUTER JOIN 
  MSTCOMMCENTER ON trnmilkhawak.COLLECTION_CENTER = MSTCOMMCENTER.CODE
LEFT OUTER JOIN 
  MSTACCTGLSUB ON trnmilkhawak.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO
WHERE
  trnmilkhawak.TRAN_DATE BETWEEN ${data.From_Date} AND ${data.To_Date}
  AND trnmilkhawak.MILK_RATE IS NOT NULL
GROUP BY
  MSTACCTGLSUB.SUB_GLACNO,
  MSTACCTGLSUB.SUBGL_LONGNAME,
  MSTCOMMCENTER.NAME,
  COLLECTION_CENTER
                `);

        return data = [
            ...TRNMILKHAWAK,
            ...TRNMILKDISPDETAILS,
        ]

    }
    async BulkCoolerCosting(data) {
        return await this.config.executeQuery(`		
        SELECT
        T1.TRAN_DATE,
        DBO.FORMAT_DATE(T1.TRAN_DATE) PTRAN_DATE,
        T1.COOLER_NO,
        T1.CENTER_NAME,
        ISNULL(SUM(T1.MORNING_GOOD_QTY), 0) MORNING_GOOD_QTY,
        ISNULL(SUM(T1.EVENING_GOOD_QTY), 0) EVENING_GOOD_QTY,
        ISNULL(SUM(T1.MORNING_TOTAL_QTY), 0) MORNING_TOTAL_QTY,
        ISNULL(SUM(T1.EVENING_TOTAL_QTY), 0) EVENING_TOTAL_QTY,
            ISNULL(SUM(T1.MORNING_TOTAL_RATE), 0) MORNING_TOTAL_RATE,
    
                ISNULL(SUM(T1.EVENING_TOTAL_RATE), 0) EVENING_TOTAL_RATE,
    
        ISNULL(T2.DIESEL_TOTAL_COST, 0) DIESEL_TOTAL_COST,
        ISNULL(T2.ELECTRIC_TOTAL_COST, 0) ELECTRIC_TOTAL_COST
    FROM (
        SELECT
            TRAN_DATE,
            COOLER_NO,
            MSTCOMMCENTER.NAME CENTER_NAME,
            ISNULL(SUM(CASE TRNMILKHAWAK.SHIFT
                WHEN 1 THEN GOOD_QTY
                ELSE 0 END), 0) MORNING_GOOD_QTY,
            ISNULL(SUM(CASE TRNMILKHAWAK.SHIFT
                WHEN 2 THEN GOOD_QTY
                ELSE 0 END), 0) EVENING_GOOD_QTY,
            ISNULL(SUM(CASE TRNMILKHAWAK.SHIFT
                WHEN 1 THEN TOTAL_QTY
                ELSE 0 END), 0) MORNING_TOTAL_QTY,
            ISNULL(SUM(CASE TRNMILKHAWAK.SHIFT
                WHEN 2 THEN TOTAL_QTY
                ELSE 0 END), 0) EVENING_TOTAL_QTY,
                 ISNULL(SUM(CASE TRNMILKHAWAK.SHIFT
                WHEN 1 THEN TOTAL_QTY * MILK_RATE
                ELSE 0 END), 0) MORNING_TOTAL_RATE ,
            ISNULL(SUM(CASE TRNMILKHAWAK.SHIFT
                WHEN 2 THEN TOTAL_QTY * MILK_RATE
                ELSE 0 END), 0) EVENING_TOTAL_RATE
        FROM
            TRNMILKHAWAK
        LEFT OUTER JOIN MSTCOMMCENTER ON TRNMILKHAWAK.COLLECTION_CENTER = MSTCOMMCENTER.CODE
        WHERE
            TRAN_DATE BETWEEN ${data.From_Date} AND ${data.To_Date}
            AND LEFT(TRAN_NO, 3) = 101
            AND SUBSTRING(CONVERT(VARCHAR, TRAN_NO), 8, 3) = 201
            AND TRAN_SUBTYPE IN (1, 5, 6)
            AND TRNMILKHAWAK.STATUS_CODE = 0
        GROUP BY
            TRAN_DATE,
            COOLER_NO,
            MSTCOMMCENTER.NAME,
            TRNMILKHAWAK.SHIFT
    ) T1
    LEFT JOIN (
        SELECT 
            TRAN_DATE,
            COOLER_NO,
            SUM(RECEIVEDIESEL * MSTMATERIALS.RATE) AS DIESEL_TOTAL_COST,
            SUM(ELECTRICMETERREADING * 15) AS ELECTRIC_TOTAL_COST
        FROM 
            TRNBULKCOOLEREXP
        JOIN 
            MSTMATERIALS ON MSTMATERIALS.CODE = 1010500061
        WHERE 
            TRAN_DATE BETWEEN ${data.From_Date} AND ${data.To_Date}
        GROUP BY
            TRAN_DATE,
            COOLER_NO
    ) T2 ON T1.COOLER_NO = T2.COOLER_NO AND T1.TRAN_DATE = T2.TRAN_DATE
    GROUP BY
        T1.TRAN_DATE,
        T1.COOLER_NO,
        T1.CENTER_NAME,
        T2.DIESEL_TOTAL_COST,
        T2.ELECTRIC_TOTAL_COST;

                `);


    }
    async singUpload(dataset) {
        let queryArray = new Array();

        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let finalArray = {};
        for (let item of dataset.files) {
            finalArray['DEPT_CODE'] = dataset.vibhagName;
            if (item.fileType == 'HOD_SIGN_IMG') {
                finalArray['HOD_SIGN_IMG'] = item.path;
            }
            else if (item.fileType == 'FINANCE_SIGN_IMG') {
                finalArray['FINANCE_SIGN_IMG'] = item.path;
            }
            else if (item.fileType == 'MD_SIGN_IMG') {
                finalArray['MD_SIGN_IMG'] = item.path;
            }
            finalArray['SYSADD_DATETIME'] = sysDate[0][''];
            finalArray['tableName'] = 'MSTSIGN';
        }
        queryArray.push(await this.config.insertData(finalArray));
        return await this.config.executeInsertQuery(queryArray);

    }

    async SmsToSend(data) {
        let queryArray = new Array();

        data['tableName'] = 'SMSTOSEND';
        queryArray.push(this.config.insertData(data));
        return await this.config.executeInsertQuery(queryArray);

    }

    async emailconfig(data) {
        let queryArray = new Array();

        let a = this.config.executeQuery(`Get_Next_Master_Code '101','MSTCOMMDESIGNATION','CODE',6,'0'`)
        data['CODE'] = a[0][''];
        data['tableName'] = 'MSTEMAILCONFIG';
        queryArray.push(await this.config.insertData(data));
        return await this.config.executeInsertQuery(queryArray);

    }

    async chckDuplicateChllnNO(data) {
        let object = {
            name: 'Sel_ChallensOfGRNMAIN',
            params: [data.COMPANY_ID, data.SUB_GLCODE]
        }
        return this.config.execSpWithParams(object)
    }

    async dairyDetailsDMY(data: any) {
        // --------- Day wise month wie and year wise
        let today = data.TRAN_DATE ?? moment().format("YYYYMMDD");
        let startOfMonth = moment(today, "YYYYMMDD").startOf('month').format("YYYYMMDD");
        let startOfYear = moment(today, "YYYYMMDD").startOf('year').format("YYYYMMDD");
        let result = {};
        //*----- Qty
        result["day_qty"] = await this.config.executeQuery(`SELECT COW_BUF, coalesce( SUM(GOOD_QTY) , 0) AS SUM FROM TRNMILKHAWAK INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO WHERE TRAN_DATE = '${today}' GROUP BY  COW_BUF ORDER BY COW_BUF`);
        result["month_qty"] = await this.config.executeQuery(`SELECT COW_BUF, coalesce( SUM(GOOD_QTY) , 0) AS SUM FROM TRNMILKHAWAK INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO WHERE (TRAN_DATE  BETWEEN   '${startOfMonth}' AND '${today}') GROUP BY  COW_BUF ORDER BY COW_BUF`);
        result["year_qty"] = await this.config.executeQuery(`SELECT COW_BUF, coalesce( SUM(GOOD_QTY) , 0) AS SUM FROM TRNMILKHAWAK INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO WHERE (TRAN_DATE  BETWEEN   ${startOfYear} AND '${today}') GROUP BY  COW_BUF ORDER BY COW_BUF`);

        //*----- amt
        result["day_amt"] = await this.config.executeQuery(`SELECT COW_BUF, coalesce( SUM(TRNMILKHAWAK.GOOD_QTY * TRNMILKHAWAK.MILK_RATE) , 0) AS SUM FROM TRNMILKHAWAK INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO WHERE TRAN_DATE = '${today}' GROUP BY  COW_BUF ORDER BY COW_BUF`);
        result["month_amt"] = await this.config.executeQuery(`SELECT COW_BUF, coalesce( SUM(TRNMILKHAWAK.GOOD_QTY * TRNMILKHAWAK.MILK_RATE) , 0) AS SUM FROM TRNMILKHAWAK INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO WHERE (TRAN_DATE  BETWEEN   '${startOfMonth}' AND '${today}') GROUP BY  COW_BUF ORDER BY COW_BUF`);
        result["year_amt"] = await this.config.executeQuery(`SELECT COW_BUF, coalesce( SUM(TRNMILKHAWAK.GOOD_QTY * TRNMILKHAWAK.MILK_RATE) , 0) AS SUM FROM TRNMILKHAWAK INNER JOIN MSTACCTGLSUB ON TRNMILKHAWAK.SUB_GLACNO = MSTACCTGLSUB.SUB_GLACNO WHERE (TRAN_DATE  BETWEEN   ${startOfYear} AND '${today}') GROUP BY  COW_BUF ORDER BY COW_BUF`);

        return result;
    }
    async cattleFeedPartyWiseDMY(data: any) {
        // --------- Day wise month wie and year wise
        let today = data.TRAN_DATE ?? moment().format("YYYYMMDD");
        let startOfMonth = moment(today, "YYYYMMDD").startOf('month').format("YYYYMMDD");
        let startOfYear = moment(today, "YYYYMMDD").startOf('year').format("YYYYMMDD");
        let result = {};

        result["day_qty"] = 0
        result["month_qty"] = 0
        result["year_qty"] = 0
        // return result;

        //*----- Qty
        result["day_qty"] = await this.config.executeQuery(`Sel_RptPartyWsSaleRegCfeed '${today}', '${today}', '101500021101501293101501556101501248101500891101501303101500342101501019101501334101501449101501532101501445101501089101501496101500559101501015101501464101501158101501361101501085101501491101500420101500202101500844101500443101500044101500825101501147101500839101500965101500592101500566101501014101501240101500405101500147101500867101500695101500426101500397101501010101501204101501033101501148101501296101501086101500392101500421101500886101500028101500834101501463101500367101500200101500351101501604101501530101500768101500143101500030101501064101500201101501081101501482101500621101501332101501585101501415101500662101501641101501534101500799101500968101500826101501006101501023101500029101501319101501138101501024101501127101501218101500460101501535101500907101500290101500569101501335101500828101501211101500391101500873101501074101500879101501623101500098101500972101501186101500807101500453101501475101500547101500732101500953101500489101501091101500536101500589101500341101500939101501079101500856101501384101501437101501261101500575101500562101500943101500882101500382101500281101500493101501441101501454101500948101500187101500792101500664101500486101501636101500978101501246101500950101500961101501564101501635101501309101500778101500580101500624101500192101501080101501013101501343101501561101501054101500370101500960101500297101500195101501506101501193101500279101500808101501235101501217101501411101500657101500204101500520101500742101500191101501423101501124101501067101500964101501152101500277101501047101500544101501057101501337101501197101500134101500933101500269101500459101500698101500524101500356101500395101500684101501126101500941101500054101500104101501378101500124101501642101501625101501202101501626101500435101501620101500885101501151101500415101500416101500629101501243101500760101501049101500289101500588101500577101501181101501410101501007101501570101500442101500101101501097101501262101500107101500199101500407101501543101501455101500593101500072101500040101501178101501298101501386101500724101501379101501157101501466101500338101501314101501368101501042101500973101500750101501194101500997101500811101500498101501516101501009101501471101501198101500721101501101101500727101501039101500770101500782101500739101501330101500602101500049101500842101500110101500478101500546101501209101501185101500835101501271101501523101500951101500120101500893101500363101500326101501589101500640101500006101500496101501474101501599101500155101500177101500945101501071101501070101501357101501313101500148101500970101500058101500217101500974101500472101501008101501553101500013101501301101501323101501412101500389101501059101500539101500364101500076101500263101501439101501603101501520101500133101500438101501134101501528101500582101500608101500615101501460101501345101501602101500381101500805101500330101500022101500761101500610101500658101500249101500897101500781101501501101500990101500975101500251101500111101500262101500639101500121101501503101501598101500646101501088101501275101500266101500003101501628101501295101500723101501354101500819101500252101500957101500494101500383101501130101500605101500693101500677101501417101500348101500390101500829101500611101500485101501189101501397101501340101501260101500560101500012101500234101500292101500307101500284101501207101500995101500533101500285101500762101501250101500295101501416101501351101500433101500565101501393101500675101501153101500172101501236101500980101500519101500982101501311101500535101500669101500345101501425101501435101500010101500009101501447101501369101501557101500113101500840101500525101500043101500468101500851101500623101500894101501509101500574101500448101500032101500393101501418101501618101501579101500526101501560101501352101501385101500848101500103101500102101501555101500347101500385101500625101500607101500534101500872101500991101501521101501117101500019101501104101501624101501489101500573101500410101501406101500080101501477101500272101500704101500904101500940101500665101500775101500586101501112101500331101501362101500763101501375101500810101500352101501055101500278101500169101501294101500780101500313101500942101501105101500198101500735101501253101500903101501452101500335101501251101501274101501219101500564101501440101500619101500017101500258101500868101500827101500077101500481101501536101501108101500795101501297101501076101500881101500636101501430101501095101500866101501606101501139101501113101500558101501288101500637101500304101500895101500820101501072101501402101500523101500987101501056101501312101500359101501304101501498101500772101500918101500947101500456101500283101500047101500248101500153101500815101500729101501229101501315101501094101500710101500790101500976101500139101501554101501617101500682101500554101500117101500767101500215101501644101501568101500793101501388101500672101501581101500705101500118101500181101500401101500469101500357101500061101501266101500301101500333101500288101500887101500063101501264101501531101500127101501327101500712101500699101501160101501310101501372101501041101500512101501277101500065101500919101500733101501118101500765101501353101500745101500219101501090101500207101500310101501426101500617101501610101500812101500273101500661101500325101500099101500930101501106101500981101500511101500452101500747101500298101501490101500184101501173101500838101500418101500800101500354101500837101500005101500869101501004101501215101501011101500366101501381101500616101500804101500864101501371101500878101500857101501450101500877101500528101501092101500748101501044101500591101500503101501492101500471101500222101500004101500026101501607101501540101500343101500018101500264101500436101500642101501403101501399101500211101500653101500315101500196101500579101500425101500718101500137101500581101501223101500280101500690101500346101500361101500633101500109101500572101501273101501326101500037101500167101500070101500318101500555101500075101501174101501284101501210101500651101500051101500308101500969101500996101501508101501546101500598101501420101501443101500916101500229101500250101500488101500654101500706101500253101500989101500899101500955101500599101500702101501030101500590101500233101501220101500966101500025101501249101501413101500668101501595101501291101500136101500413101501422101500758101500518101500540101500634101501499101501349101500752101500738101500609101500603101500437101501263101500934101500371101500465101500380101501525101500376101500846101500449101501002101500411101501176101500687101501367101501387101500059101500818101501587101501167101500920101500086101500247101500369101500296101501132101501038101501488101501182101500083101501596101500613101500937101501305101501632101500105101500797101500450101501063101501545101501068101501548101501058101500956101500208101500841101500467101500319101500530101501278101501502101501504101500567101500079101501200101500388101501542101500911101500502101501481101500783101500344101501419101501279101500302101500340101501356101501169101500674101501043101501020101501021101500015101500892101500365101501099101500427101500274101500962101500731101500447101500663101500165101500683101500971101500999101500954101500358101501226101501512101500630101500186101500774101500050101500088101500977101501325101500888101501538101500439101500161101500853101500924101500483101500060101500802101501168101500501101501045101501480101500852101500328101501230101501005101500648101501103101501141101501638101501285101500011101500156101501244101500396101501241101500816101501172101500221101501451101500855101501522101501519101500670101500548101501222101500863101501526101500131101501321101500128101500097101500759101501245101500713101500189101500150101500913101500225101500638101501389101500138101501077101500434101500311101501558101500865101500140101500183101501037101500935101501225101500479101500174101500324101500680101500220101500163101501497101500457101500791101500568101501541101500240101501400101500898101500071101501350101500145101501128101500515101501051101500337101501276101501586101500142101500081101500428101501465101501645101501195101500922101500235101500551101501258101501370101501567101501233101501476101501348101501069101501583101501187101501318101500212101500182101500033101500631101500622101501611101501161101500931101501032101500106101501559101501149101500082101501514101500514101501518101501136101501456101500256101500600101500527101501066101500151101500180101501121101500597101500491101500862101501065101501268101501605101500305101501577101500717101501576101501630101500175101500734101500374101501593101500168101500463101501637101500720101501338101501591101500789101500757101500814101500833101500944101500859101501398101500542101500849101501120101500967101500064101500824101501093101500917101501346101500529101501247101500023101501470101500379101501469101500681101501035101501116101501183101500655101501597101501123101500889101500126101500500101501308101500474101501302101501196101501360101500309101500691101501373101500108101501234101501336101501201101501515101500400101501355101500068101501428101500689101500373101500787101500210101500908101500218101500725101500845101501036101500360101501192101500728101500286101500949101501429101500282101501122101500900101500993101501061101501131101500594101500910101500458101501145101501609101500936101500464101500482101500543101500618101501272101501022101500737101500321101501073101501580101500576101500850101500626101500466101500736101500751101500612101500901101500635101501619101500756101501588101501053101500875101500929101500896101500645101501206101500667101501107101501286101500402101500194101501380101501446101500417101500764101500375101501507101500649101501175101500741101500676101501333101500707101501111101500753101500505101501485101500909101501629101500923101500265101500688101500740101501109101501110101501114101501473101500746101500490101500708101500091101500550101500678101500902101501376101500078101501216101500806101501239101500843101500946101500317101500984101501040101500444101500701101500926101500320101501221101500230101500164101500387101500883101500938101500517101500476101500355101500275101501458101501029101500414101500784101501487101501292101500125101501472101500213101501166101501342101500823101501608101501621101500045101500316101501562101500160101500652101501575101501027101501026101501392101500291101501364101500378101500726101500312101500979101501341101501483101501363101501135101500650101500171101500595101500398101501199101501283101500287101500858101501154101500046101500813101501062101500132101500386101500660101500538101500988101501424101501444101500487101500462101500905101500024101501328101501551101500552101500057101500089101500093101501407101500584101501565101501382101500246101500116101501431101500614101501016101500499101501242101501478101501505101500854101501615101500545101500509101500314101500173101500454101501433101501339101500446101501405101500959101501129101501612101500715101500685101501459101501590101500404101500831101500185101500087101500914101501374101500606101500709101501265101500928101500461101501365101500257101500239101500362101500722101500119101500329101501048101501257101500484101501414101501082101501442101501404101500495101501317101500214101500932101500659101501614101500798101500521101501087101500166101501438101501280101501159101500403101501191101500587101501572101501574101501486101501203101500226101501162101501578101501102101501150101501394101501028101500384101501164101500055101500994101501180101500788101500268101500860101501075101501140101501125101501163101500334101501212101501098101500755101501643101500925101501119101501436101500406101500871101500232101500193101500643101500561101501529101500504101500261101500571101500445101501484101500497101500508101500570101500377101501457101500557101501527101501646101500031101501461101500870101500231101500507101501495101500431101501493101501494101501622101500294101500516101501401101501270101500205101501566101500016101501003101501563101500244101501289101500122101500149101500541101501409101500141101500095101501640101500641101500271101501137101500339101501017101500985101500884101500259101501227101500067101500066101500697101500267101501214101501156101500440101500958101501331101501188101500803101500730101500779101501184101500135101501096101501306101501281101501448101500992101500260101500906101501329101500537101500190101500236101501255101501232101500336101501366101500209101500510101500694101500628101500700101500178101501084101500647101500159101501316101500874101501231101501408101500203101500007101500327101500112101501571101500771101501573101501395101501046101500553101500809101501179101500092101500766101500769101501143101500073101500372101501601101500129101501060101500090101501254101501434101500532101501511101500085101500596101500056101500306101501100101500927101500912101500409101500773101500821101500424101500890101500053101500822101500041101500506101500703101500176101500776101500817101500796101501322101500245101501224101501569101501359101500206101500492101501510101500048101500455101501383101501252101500475101500152101500522101500408101500477101501031101500620101500349101500921101500162101500656101500270101500353101501320101501115101500692101501213101500323101500679101501432101500188101501282101500394101500830101500399101501133101500716101500062101500039101501421101500711101500179101500880101500632101501537101500332101500531101500432101500583101501034101500242101501513101500197101500350101500254101501012101500422101501533101500556101501018101501634101501347101500300101501269101500170101500146101500002101500786101501524101500227101501517101500223101501633101500027101501237101500069101500419101500238101500876101500480101501170101500115101501142101500144101501259101500749101500114101500451101500096101500470101500686101501453101501165101501078101501639101501290101501000101501584101500861101501550101501299101501479101500998101500158101501592101500983101500952101500666101501549101501462101501307101500986101500549101501025101501238101501616101500604101500836101501544101501155101500368101501547101501052101500052101500801101501627101501539101501427101500423101500038101500241101500237101500563101500020101500035101501146101500293101501390101500644101501396101501300101501001101500601101500441101500429101500034101500243101500719101501582101501500101500094101501344101500754101500714101501324101500473101500074101500832101501208101501083101501287101501205101500084101500154101500255101500513101501631101500299101500915101500303101500412101501594101501468101500696101500228101501256101501144101501050101500123101501600101500785101500100101501190101501552101500627101501467101500743101500036101501177101501613101500224101501358101500794101500777101500042101500014101500157101500430101500673101500744101500130101500578101501391101501267101501228101500671101500963101501377101500322101500847101501171101500585101500276'`);


        result["month_qty"] = await this.config.executeQuery(`Sel_RptPartyWsSaleRegCfeed '${startOfMonth}', '${today}', '101500021101501293101501556101501248101500891101501303101500342101501019101501334101501449101501532101501445101501089101501496101500559101501015101501464101501158101501361101501085101501491101500420101500202101500844101500443101500044101500825101501147101500839101500965101500592101500566101501014101501240101500405101500147101500867101500695101500426101500397101501010101501204101501033101501148101501296101501086101500392101500421101500886101500028101500834101501463101500367101500200101500351101501604101501530101500768101500143101500030101501064101500201101501081101501482101500621101501332101501585101501415101500662101501641101501534101500799101500968101500826101501006101501023101500029101501319101501138101501024101501127101501218101500460101501535101500907101500290101500569101501335101500828101501211101500391101500873101501074101500879101501623101500098101500972101501186101500807101500453101501475101500547101500732101500953101500489101501091101500536101500589101500341101500939101501079101500856101501384101501437101501261101500575101500562101500943101500882101500382101500281101500493101501441101501454101500948101500187101500792101500664101500486101501636101500978101501246101500950101500961101501564101501635101501309101500778101500580101500624101500192101501080101501013101501343101501561101501054101500370101500960101500297101500195101501506101501193101500279101500808101501235101501217101501411101500657101500204101500520101500742101500191101501423101501124101501067101500964101501152101500277101501047101500544101501057101501337101501197101500134101500933101500269101500459101500698101500524101500356101500395101500684101501126101500941101500054101500104101501378101500124101501642101501625101501202101501626101500435101501620101500885101501151101500415101500416101500629101501243101500760101501049101500289101500588101500577101501181101501410101501007101501570101500442101500101101501097101501262101500107101500199101500407101501543101501455101500593101500072101500040101501178101501298101501386101500724101501379101501157101501466101500338101501314101501368101501042101500973101500750101501194101500997101500811101500498101501516101501009101501471101501198101500721101501101101500727101501039101500770101500782101500739101501330101500602101500049101500842101500110101500478101500546101501209101501185101500835101501271101501523101500951101500120101500893101500363101500326101501589101500640101500006101500496101501474101501599101500155101500177101500945101501071101501070101501357101501313101500148101500970101500058101500217101500974101500472101501008101501553101500013101501301101501323101501412101500389101501059101500539101500364101500076101500263101501439101501603101501520101500133101500438101501134101501528101500582101500608101500615101501460101501345101501602101500381101500805101500330101500022101500761101500610101500658101500249101500897101500781101501501101500990101500975101500251101500111101500262101500639101500121101501503101501598101500646101501088101501275101500266101500003101501628101501295101500723101501354101500819101500252101500957101500494101500383101501130101500605101500693101500677101501417101500348101500390101500829101500611101500485101501189101501397101501340101501260101500560101500012101500234101500292101500307101500284101501207101500995101500533101500285101500762101501250101500295101501416101501351101500433101500565101501393101500675101501153101500172101501236101500980101500519101500982101501311101500535101500669101500345101501425101501435101500010101500009101501447101501369101501557101500113101500840101500525101500043101500468101500851101500623101500894101501509101500574101500448101500032101500393101501418101501618101501579101500526101501560101501352101501385101500848101500103101500102101501555101500347101500385101500625101500607101500534101500872101500991101501521101501117101500019101501104101501624101501489101500573101500410101501406101500080101501477101500272101500704101500904101500940101500665101500775101500586101501112101500331101501362101500763101501375101500810101500352101501055101500278101500169101501294101500780101500313101500942101501105101500198101500735101501253101500903101501452101500335101501251101501274101501219101500564101501440101500619101500017101500258101500868101500827101500077101500481101501536101501108101500795101501297101501076101500881101500636101501430101501095101500866101501606101501139101501113101500558101501288101500637101500304101500895101500820101501072101501402101500523101500987101501056101501312101500359101501304101501498101500772101500918101500947101500456101500283101500047101500248101500153101500815101500729101501229101501315101501094101500710101500790101500976101500139101501554101501617101500682101500554101500117101500767101500215101501644101501568101500793101501388101500672101501581101500705101500118101500181101500401101500469101500357101500061101501266101500301101500333101500288101500887101500063101501264101501531101500127101501327101500712101500699101501160101501310101501372101501041101500512101501277101500065101500919101500733101501118101500765101501353101500745101500219101501090101500207101500310101501426101500617101501610101500812101500273101500661101500325101500099101500930101501106101500981101500511101500452101500747101500298101501490101500184101501173101500838101500418101500800101500354101500837101500005101500869101501004101501215101501011101500366101501381101500616101500804101500864101501371101500878101500857101501450101500877101500528101501092101500748101501044101500591101500503101501492101500471101500222101500004101500026101501607101501540101500343101500018101500264101500436101500642101501403101501399101500211101500653101500315101500196101500579101500425101500718101500137101500581101501223101500280101500690101500346101500361101500633101500109101500572101501273101501326101500037101500167101500070101500318101500555101500075101501174101501284101501210101500651101500051101500308101500969101500996101501508101501546101500598101501420101501443101500916101500229101500250101500488101500654101500706101500253101500989101500899101500955101500599101500702101501030101500590101500233101501220101500966101500025101501249101501413101500668101501595101501291101500136101500413101501422101500758101500518101500540101500634101501499101501349101500752101500738101500609101500603101500437101501263101500934101500371101500465101500380101501525101500376101500846101500449101501002101500411101501176101500687101501367101501387101500059101500818101501587101501167101500920101500086101500247101500369101500296101501132101501038101501488101501182101500083101501596101500613101500937101501305101501632101500105101500797101500450101501063101501545101501068101501548101501058101500956101500208101500841101500467101500319101500530101501278101501502101501504101500567101500079101501200101500388101501542101500911101500502101501481101500783101500344101501419101501279101500302101500340101501356101501169101500674101501043101501020101501021101500015101500892101500365101501099101500427101500274101500962101500731101500447101500663101500165101500683101500971101500999101500954101500358101501226101501512101500630101500186101500774101500050101500088101500977101501325101500888101501538101500439101500161101500853101500924101500483101500060101500802101501168101500501101501045101501480101500852101500328101501230101501005101500648101501103101501141101501638101501285101500011101500156101501244101500396101501241101500816101501172101500221101501451101500855101501522101501519101500670101500548101501222101500863101501526101500131101501321101500128101500097101500759101501245101500713101500189101500150101500913101500225101500638101501389101500138101501077101500434101500311101501558101500865101500140101500183101501037101500935101501225101500479101500174101500324101500680101500220101500163101501497101500457101500791101500568101501541101500240101501400101500898101500071101501350101500145101501128101500515101501051101500337101501276101501586101500142101500081101500428101501465101501645101501195101500922101500235101500551101501258101501370101501567101501233101501476101501348101501069101501583101501187101501318101500212101500182101500033101500631101500622101501611101501161101500931101501032101500106101501559101501149101500082101501514101500514101501518101501136101501456101500256101500600101500527101501066101500151101500180101501121101500597101500491101500862101501065101501268101501605101500305101501577101500717101501576101501630101500175101500734101500374101501593101500168101500463101501637101500720101501338101501591101500789101500757101500814101500833101500944101500859101501398101500542101500849101501120101500967101500064101500824101501093101500917101501346101500529101501247101500023101501470101500379101501469101500681101501035101501116101501183101500655101501597101501123101500889101500126101500500101501308101500474101501302101501196101501360101500309101500691101501373101500108101501234101501336101501201101501515101500400101501355101500068101501428101500689101500373101500787101500210101500908101500218101500725101500845101501036101500360101501192101500728101500286101500949101501429101500282101501122101500900101500993101501061101501131101500594101500910101500458101501145101501609101500936101500464101500482101500543101500618101501272101501022101500737101500321101501073101501580101500576101500850101500626101500466101500736101500751101500612101500901101500635101501619101500756101501588101501053101500875101500929101500896101500645101501206101500667101501107101501286101500402101500194101501380101501446101500417101500764101500375101501507101500649101501175101500741101500676101501333101500707101501111101500753101500505101501485101500909101501629101500923101500265101500688101500740101501109101501110101501114101501473101500746101500490101500708101500091101500550101500678101500902101501376101500078101501216101500806101501239101500843101500946101500317101500984101501040101500444101500701101500926101500320101501221101500230101500164101500387101500883101500938101500517101500476101500355101500275101501458101501029101500414101500784101501487101501292101500125101501472101500213101501166101501342101500823101501608101501621101500045101500316101501562101500160101500652101501575101501027101501026101501392101500291101501364101500378101500726101500312101500979101501341101501483101501363101501135101500650101500171101500595101500398101501199101501283101500287101500858101501154101500046101500813101501062101500132101500386101500660101500538101500988101501424101501444101500487101500462101500905101500024101501328101501551101500552101500057101500089101500093101501407101500584101501565101501382101500246101500116101501431101500614101501016101500499101501242101501478101501505101500854101501615101500545101500509101500314101500173101500454101501433101501339101500446101501405101500959101501129101501612101500715101500685101501459101501590101500404101500831101500185101500087101500914101501374101500606101500709101501265101500928101500461101501365101500257101500239101500362101500722101500119101500329101501048101501257101500484101501414101501082101501442101501404101500495101501317101500214101500932101500659101501614101500798101500521101501087101500166101501438101501280101501159101500403101501191101500587101501572101501574101501486101501203101500226101501162101501578101501102101501150101501394101501028101500384101501164101500055101500994101501180101500788101500268101500860101501075101501140101501125101501163101500334101501212101501098101500755101501643101500925101501119101501436101500406101500871101500232101500193101500643101500561101501529101500504101500261101500571101500445101501484101500497101500508101500570101500377101501457101500557101501527101501646101500031101501461101500870101500231101500507101501495101500431101501493101501494101501622101500294101500516101501401101501270101500205101501566101500016101501003101501563101500244101501289101500122101500149101500541101501409101500141101500095101501640101500641101500271101501137101500339101501017101500985101500884101500259101501227101500067101500066101500697101500267101501214101501156101500440101500958101501331101501188101500803101500730101500779101501184101500135101501096101501306101501281101501448101500992101500260101500906101501329101500537101500190101500236101501255101501232101500336101501366101500209101500510101500694101500628101500700101500178101501084101500647101500159101501316101500874101501231101501408101500203101500007101500327101500112101501571101500771101501573101501395101501046101500553101500809101501179101500092101500766101500769101501143101500073101500372101501601101500129101501060101500090101501254101501434101500532101501511101500085101500596101500056101500306101501100101500927101500912101500409101500773101500821101500424101500890101500053101500822101500041101500506101500703101500176101500776101500817101500796101501322101500245101501224101501569101501359101500206101500492101501510101500048101500455101501383101501252101500475101500152101500522101500408101500477101501031101500620101500349101500921101500162101500656101500270101500353101501320101501115101500692101501213101500323101500679101501432101500188101501282101500394101500830101500399101501133101500716101500062101500039101501421101500711101500179101500880101500632101501537101500332101500531101500432101500583101501034101500242101501513101500197101500350101500254101501012101500422101501533101500556101501018101501634101501347101500300101501269101500170101500146101500002101500786101501524101500227101501517101500223101501633101500027101501237101500069101500419101500238101500876101500480101501170101500115101501142101500144101501259101500749101500114101500451101500096101500470101500686101501453101501165101501078101501639101501290101501000101501584101500861101501550101501299101501479101500998101500158101501592101500983101500952101500666101501549101501462101501307101500986101500549101501025101501238101501616101500604101500836101501544101501155101500368101501547101501052101500052101500801101501627101501539101501427101500423101500038101500241101500237101500563101500020101500035101501146101500293101501390101500644101501396101501300101501001101500601101500441101500429101500034101500243101500719101501582101501500101500094101501344101500754101500714101501324101500473101500074101500832101501208101501083101501287101501205101500084101500154101500255101500513101501631101500299101500915101500303101500412101501594101501468101500696101500228101501256101501144101501050101500123101501600101500785101500100101501190101501552101500627101501467101500743101500036101501177101501613101500224101501358101500794101500777101500042101500014101500157101500430101500673101500744101500130101500578101501391101501267101501228101500671101500963101501377101500322101500847101501171101500585101500276'`);


        result["year_qty"] = await this.config.executeQuery(`Sel_RptPartyWsSaleRegCfeed '${startOfYear}', '${today}', '101500021101501293101501556101501248101500891101501303101500342101501019101501334101501449101501532101501445101501089101501496101500559101501015101501464101501158101501361101501085101501491101500420101500202101500844101500443101500044101500825101501147101500839101500965101500592101500566101501014101501240101500405101500147101500867101500695101500426101500397101501010101501204101501033101501148101501296101501086101500392101500421101500886101500028101500834101501463101500367101500200101500351101501604101501530101500768101500143101500030101501064101500201101501081101501482101500621101501332101501585101501415101500662101501641101501534101500799101500968101500826101501006101501023101500029101501319101501138101501024101501127101501218101500460101501535101500907101500290101500569101501335101500828101501211101500391101500873101501074101500879101501623101500098101500972101501186101500807101500453101501475101500547101500732101500953101500489101501091101500536101500589101500341101500939101501079101500856101501384101501437101501261101500575101500562101500943101500882101500382101500281101500493101501441101501454101500948101500187101500792101500664101500486101501636101500978101501246101500950101500961101501564101501635101501309101500778101500580101500624101500192101501080101501013101501343101501561101501054101500370101500960101500297101500195101501506101501193101500279101500808101501235101501217101501411101500657101500204101500520101500742101500191101501423101501124101501067101500964101501152101500277101501047101500544101501057101501337101501197101500134101500933101500269101500459101500698101500524101500356101500395101500684101501126101500941101500054101500104101501378101500124101501642101501625101501202101501626101500435101501620101500885101501151101500415101500416101500629101501243101500760101501049101500289101500588101500577101501181101501410101501007101501570101500442101500101101501097101501262101500107101500199101500407101501543101501455101500593101500072101500040101501178101501298101501386101500724101501379101501157101501466101500338101501314101501368101501042101500973101500750101501194101500997101500811101500498101501516101501009101501471101501198101500721101501101101500727101501039101500770101500782101500739101501330101500602101500049101500842101500110101500478101500546101501209101501185101500835101501271101501523101500951101500120101500893101500363101500326101501589101500640101500006101500496101501474101501599101500155101500177101500945101501071101501070101501357101501313101500148101500970101500058101500217101500974101500472101501008101501553101500013101501301101501323101501412101500389101501059101500539101500364101500076101500263101501439101501603101501520101500133101500438101501134101501528101500582101500608101500615101501460101501345101501602101500381101500805101500330101500022101500761101500610101500658101500249101500897101500781101501501101500990101500975101500251101500111101500262101500639101500121101501503101501598101500646101501088101501275101500266101500003101501628101501295101500723101501354101500819101500252101500957101500494101500383101501130101500605101500693101500677101501417101500348101500390101500829101500611101500485101501189101501397101501340101501260101500560101500012101500234101500292101500307101500284101501207101500995101500533101500285101500762101501250101500295101501416101501351101500433101500565101501393101500675101501153101500172101501236101500980101500519101500982101501311101500535101500669101500345101501425101501435101500010101500009101501447101501369101501557101500113101500840101500525101500043101500468101500851101500623101500894101501509101500574101500448101500032101500393101501418101501618101501579101500526101501560101501352101501385101500848101500103101500102101501555101500347101500385101500625101500607101500534101500872101500991101501521101501117101500019101501104101501624101501489101500573101500410101501406101500080101501477101500272101500704101500904101500940101500665101500775101500586101501112101500331101501362101500763101501375101500810101500352101501055101500278101500169101501294101500780101500313101500942101501105101500198101500735101501253101500903101501452101500335101501251101501274101501219101500564101501440101500619101500017101500258101500868101500827101500077101500481101501536101501108101500795101501297101501076101500881101500636101501430101501095101500866101501606101501139101501113101500558101501288101500637101500304101500895101500820101501072101501402101500523101500987101501056101501312101500359101501304101501498101500772101500918101500947101500456101500283101500047101500248101500153101500815101500729101501229101501315101501094101500710101500790101500976101500139101501554101501617101500682101500554101500117101500767101500215101501644101501568101500793101501388101500672101501581101500705101500118101500181101500401101500469101500357101500061101501266101500301101500333101500288101500887101500063101501264101501531101500127101501327101500712101500699101501160101501310101501372101501041101500512101501277101500065101500919101500733101501118101500765101501353101500745101500219101501090101500207101500310101501426101500617101501610101500812101500273101500661101500325101500099101500930101501106101500981101500511101500452101500747101500298101501490101500184101501173101500838101500418101500800101500354101500837101500005101500869101501004101501215101501011101500366101501381101500616101500804101500864101501371101500878101500857101501450101500877101500528101501092101500748101501044101500591101500503101501492101500471101500222101500004101500026101501607101501540101500343101500018101500264101500436101500642101501403101501399101500211101500653101500315101500196101500579101500425101500718101500137101500581101501223101500280101500690101500346101500361101500633101500109101500572101501273101501326101500037101500167101500070101500318101500555101500075101501174101501284101501210101500651101500051101500308101500969101500996101501508101501546101500598101501420101501443101500916101500229101500250101500488101500654101500706101500253101500989101500899101500955101500599101500702101501030101500590101500233101501220101500966101500025101501249101501413101500668101501595101501291101500136101500413101501422101500758101500518101500540101500634101501499101501349101500752101500738101500609101500603101500437101501263101500934101500371101500465101500380101501525101500376101500846101500449101501002101500411101501176101500687101501367101501387101500059101500818101501587101501167101500920101500086101500247101500369101500296101501132101501038101501488101501182101500083101501596101500613101500937101501305101501632101500105101500797101500450101501063101501545101501068101501548101501058101500956101500208101500841101500467101500319101500530101501278101501502101501504101500567101500079101501200101500388101501542101500911101500502101501481101500783101500344101501419101501279101500302101500340101501356101501169101500674101501043101501020101501021101500015101500892101500365101501099101500427101500274101500962101500731101500447101500663101500165101500683101500971101500999101500954101500358101501226101501512101500630101500186101500774101500050101500088101500977101501325101500888101501538101500439101500161101500853101500924101500483101500060101500802101501168101500501101501045101501480101500852101500328101501230101501005101500648101501103101501141101501638101501285101500011101500156101501244101500396101501241101500816101501172101500221101501451101500855101501522101501519101500670101500548101501222101500863101501526101500131101501321101500128101500097101500759101501245101500713101500189101500150101500913101500225101500638101501389101500138101501077101500434101500311101501558101500865101500140101500183101501037101500935101501225101500479101500174101500324101500680101500220101500163101501497101500457101500791101500568101501541101500240101501400101500898101500071101501350101500145101501128101500515101501051101500337101501276101501586101500142101500081101500428101501465101501645101501195101500922101500235101500551101501258101501370101501567101501233101501476101501348101501069101501583101501187101501318101500212101500182101500033101500631101500622101501611101501161101500931101501032101500106101501559101501149101500082101501514101500514101501518101501136101501456101500256101500600101500527101501066101500151101500180101501121101500597101500491101500862101501065101501268101501605101500305101501577101500717101501576101501630101500175101500734101500374101501593101500168101500463101501637101500720101501338101501591101500789101500757101500814101500833101500944101500859101501398101500542101500849101501120101500967101500064101500824101501093101500917101501346101500529101501247101500023101501470101500379101501469101500681101501035101501116101501183101500655101501597101501123101500889101500126101500500101501308101500474101501302101501196101501360101500309101500691101501373101500108101501234101501336101501201101501515101500400101501355101500068101501428101500689101500373101500787101500210101500908101500218101500725101500845101501036101500360101501192101500728101500286101500949101501429101500282101501122101500900101500993101501061101501131101500594101500910101500458101501145101501609101500936101500464101500482101500543101500618101501272101501022101500737101500321101501073101501580101500576101500850101500626101500466101500736101500751101500612101500901101500635101501619101500756101501588101501053101500875101500929101500896101500645101501206101500667101501107101501286101500402101500194101501380101501446101500417101500764101500375101501507101500649101501175101500741101500676101501333101500707101501111101500753101500505101501485101500909101501629101500923101500265101500688101500740101501109101501110101501114101501473101500746101500490101500708101500091101500550101500678101500902101501376101500078101501216101500806101501239101500843101500946101500317101500984101501040101500444101500701101500926101500320101501221101500230101500164101500387101500883101500938101500517101500476101500355101500275101501458101501029101500414101500784101501487101501292101500125101501472101500213101501166101501342101500823101501608101501621101500045101500316101501562101500160101500652101501575101501027101501026101501392101500291101501364101500378101500726101500312101500979101501341101501483101501363101501135101500650101500171101500595101500398101501199101501283101500287101500858101501154101500046101500813101501062101500132101500386101500660101500538101500988101501424101501444101500487101500462101500905101500024101501328101501551101500552101500057101500089101500093101501407101500584101501565101501382101500246101500116101501431101500614101501016101500499101501242101501478101501505101500854101501615101500545101500509101500314101500173101500454101501433101501339101500446101501405101500959101501129101501612101500715101500685101501459101501590101500404101500831101500185101500087101500914101501374101500606101500709101501265101500928101500461101501365101500257101500239101500362101500722101500119101500329101501048101501257101500484101501414101501082101501442101501404101500495101501317101500214101500932101500659101501614101500798101500521101501087101500166101501438101501280101501159101500403101501191101500587101501572101501574101501486101501203101500226101501162101501578101501102101501150101501394101501028101500384101501164101500055101500994101501180101500788101500268101500860101501075101501140101501125101501163101500334101501212101501098101500755101501643101500925101501119101501436101500406101500871101500232101500193101500643101500561101501529101500504101500261101500571101500445101501484101500497101500508101500570101500377101501457101500557101501527101501646101500031101501461101500870101500231101500507101501495101500431101501493101501494101501622101500294101500516101501401101501270101500205101501566101500016101501003101501563101500244101501289101500122101500149101500541101501409101500141101500095101501640101500641101500271101501137101500339101501017101500985101500884101500259101501227101500067101500066101500697101500267101501214101501156101500440101500958101501331101501188101500803101500730101500779101501184101500135101501096101501306101501281101501448101500992101500260101500906101501329101500537101500190101500236101501255101501232101500336101501366101500209101500510101500694101500628101500700101500178101501084101500647101500159101501316101500874101501231101501408101500203101500007101500327101500112101501571101500771101501573101501395101501046101500553101500809101501179101500092101500766101500769101501143101500073101500372101501601101500129101501060101500090101501254101501434101500532101501511101500085101500596101500056101500306101501100101500927101500912101500409101500773101500821101500424101500890101500053101500822101500041101500506101500703101500176101500776101500817101500796101501322101500245101501224101501569101501359101500206101500492101501510101500048101500455101501383101501252101500475101500152101500522101500408101500477101501031101500620101500349101500921101500162101500656101500270101500353101501320101501115101500692101501213101500323101500679101501432101500188101501282101500394101500830101500399101501133101500716101500062101500039101501421101500711101500179101500880101500632101501537101500332101500531101500432101500583101501034101500242101501513101500197101500350101500254101501012101500422101501533101500556101501018101501634101501347101500300101501269101500170101500146101500002101500786101501524101500227101501517101500223101501633101500027101501237101500069101500419101500238101500876101500480101501170101500115101501142101500144101501259101500749101500114101500451101500096101500470101500686101501453101501165101501078101501639101501290101501000101501584101500861101501550101501299101501479101500998101500158101501592101500983101500952101500666101501549101501462101501307101500986101500549101501025101501238101501616101500604101500836101501544101501155101500368101501547101501052101500052101500801101501627101501539101501427101500423101500038101500241101500237101500563101500020101500035101501146101500293101501390101500644101501396101501300101501001101500601101500441101500429101500034101500243101500719101501582101501500101500094101501344101500754101500714101501324101500473101500074101500832101501208101501083101501287101501205101500084101500154101500255101500513101501631101500299101500915101500303101500412101501594101501468101500696101500228101501256101501144101501050101500123101501600101500785101500100101501190101501552101500627101501467101500743101500036101501177101501613101500224101501358101500794101500777101500042101500014101500157101500430101500673101500744101500130101500578101501391101501267101501228101500671101500963101501377101500322101500847101501171101500585101500276'`);


        return result;
    }

    async dairySahitySalePurchaseDMY(data: any) {
        // exec "NANDANERPTEST"."dbo"."Sel_RptDStoreSaleTaxSummaryGST"; 1 '103', '20201022', '20241022', '11512,11511'
        // exec "NANDANERPTEST"."dbo"."Sel_RptPurTaxSummaryGST"; 1 '103', '116', '20201022', '20241022'

        // --------- Day wise month wie and year wise
        let today = data.TRAN_DATE ?? moment().format("YYYYMMDD");
        let startOfMonth = moment(today, "YYYYMMDD").startOf('month').format("YYYYMMDD");
        let startOfYear = moment(today, "YYYYMMDD").startOf('year').format("YYYYMMDD");

        let saleSumD: any = await this.config.executeQuery(`Sel_RptDStoreSaleTaxSummaryGST  '103', '${today}', '${today}', '11512,11511'`);
        let saleSumM: any = await this.config.executeQuery(`Sel_RptDStoreSaleTaxSummaryGST  '103', '${startOfMonth}', '${today}', '11512,11511'`);
        let saleSumY: any = await this.config.executeQuery(`Sel_RptDStoreSaleTaxSummaryGST  '103', '${startOfYear}', '${today}', '11512,11511'`);

        let sumOfSaleArr: any = {};


        let sumOfSaleD: any = 0;
        let sumOfSaleM: any = 0;
        let sumOfSaleY: any = 0;

        await saleSumD.forEach(element => {
            let temp: any = 0;
            temp = parseFloat(element.OTHER_ADDEDAMT) + parseFloat(element.TAXABLE_AMT) + parseFloat(element.IGST_AMT) + parseFloat(element.CGST_AMT) + parseFloat(element.SGST_AMT);
            sumOfSaleD += temp
        });
        await saleSumM.forEach(element => {
            let temp: any = 0;
            temp = parseFloat(element.OTHER_ADDEDAMT) + parseFloat(element.TAXABLE_AMT) + parseFloat(element.IGST_AMT) + parseFloat(element.CGST_AMT) + parseFloat(element.SGST_AMT);
            sumOfSaleM += temp
        });
        await saleSumY.forEach(element => {
            let temp: any = 0;
            temp = parseFloat(element.OTHER_ADDEDAMT) + parseFloat(element.TAXABLE_AMT) + parseFloat(element.IGST_AMT) + parseFloat(element.CGST_AMT) + parseFloat(element.SGST_AMT);
            sumOfSaleY += temp
        });

        sumOfSaleArr["sumOfSaleD"] = sumOfSaleD;
        sumOfSaleArr["sumOfSaleM"] = sumOfSaleM;
        sumOfSaleArr["sumOfSaleY"] = sumOfSaleY;



        //-------- Purchase 
        let purchaseSumD: any = await this.config.executeQuery(`Sel_RptPurTaxSummaryGST '103', '116', '${today}', '${today}'`);
        let purchaseSumM: any = await this.config.executeQuery(`Sel_RptPurTaxSummaryGST '103', '116', '${startOfMonth}', '${today}'`);
        let purchaseSumY: any = await this.config.executeQuery(`Sel_RptPurTaxSummaryGST '103', '116', '${startOfYear}', '${today}'`);

        let sumOfPurchaseArr: any = {};


        let sumOfPurchaseD: any = 0;
        let sumOfPurchaseM: any = 0;
        let sumOfPurchaseY: any = 0;

        await purchaseSumD.forEach(element => {
            let temp: any = 0;
            temp = parseFloat(element.OTHER_ADDEDAMT) + parseFloat(element.TAXABLE_AMT) + parseFloat(element.IGST_AMT) + parseFloat(element.CGST_AMT) + parseFloat(element.SGST_AMT);
            sumOfPurchaseD += temp
        });
        await purchaseSumM.forEach(element => {
            let temp: any = 0;
            temp = parseFloat(element.OTHER_ADDEDAMT) + parseFloat(element.TAXABLE_AMT) + parseFloat(element.IGST_AMT) + parseFloat(element.CGST_AMT) + parseFloat(element.SGST_AMT);
            sumOfPurchaseM += temp
        });
        await purchaseSumY.forEach(element => {
            let temp: any = 0;
            temp = parseFloat(element.OTHER_ADDEDAMT) + parseFloat(element.TAXABLE_AMT) + parseFloat(element.IGST_AMT) + parseFloat(element.CGST_AMT) + parseFloat(element.SGST_AMT);
            sumOfPurchaseY += temp
        });

        sumOfPurchaseArr["sumOfPurchaseD"] = sumOfPurchaseD;
        sumOfPurchaseArr["sumOfPurchaseM"] = sumOfPurchaseM;
        sumOfPurchaseArr["sumOfPurchaseY"] = sumOfPurchaseY;

        return { ...sumOfSaleArr, ...sumOfPurchaseArr };
    }

    async cattleFeedProductionItemWise(data: any) {
        // --------- Day wise month wie and year wise
        let today = data.TRAN_DATE ?? moment().format("YYYYMMDD");
        let startOfMonth = moment(today, "YYYYMMDD").startOf('month').format("YYYYMMDD");
        let startOfYear = moment(today, "YYYYMMDD").startOf('year').format("YYYYMMDD");
        let result = {
            day: [],
            month: [],
            year: [],
        };


        //*----- Qty
        result["day"] = await this.config.executeQuery(`
            select MSTMATERIALS.NAME, MSTMATERIALS.CODE  , SUM(TRNCFEEDMATPOST .TOTAL_WEIGHT) AS TOTAL_WEIGHT from TRNCFEEDMATPOST 
LEFT JOIN MSTMATERIALS ON MSTMATERIALS.CODE = TRNCFEEDMATPOST .MAT_CODE
WHERE (TRNCFEEDMATPOST . TRAN_DATE BETWEEN	'${today}' AND '${today}' ) and 
MSTMATERIALS.STATUS_CODE=0 And MSTMATERIALS.MATERIAL_TYPE = 104 AND MSTMATERIALS.PROD_TYPE = 101
GROUP BY MSTMATERIALS.NAME, MSTMATERIALS.CODE  
            `);


        result["month"] = await this.config.executeQuery(`
            select MSTMATERIALS.NAME, MSTMATERIALS.CODE  , SUM(TRNCFEEDMATPOST .TOTAL_WEIGHT) AS TOTAL_WEIGHT from TRNCFEEDMATPOST 
LEFT JOIN MSTMATERIALS ON MSTMATERIALS.CODE = TRNCFEEDMATPOST .MAT_CODE
WHERE (TRNCFEEDMATPOST . TRAN_DATE BETWEEN	'${startOfMonth}' AND '${today}' ) and 
MSTMATERIALS.STATUS_CODE=0 And MSTMATERIALS.MATERIAL_TYPE = 104 AND MSTMATERIALS.PROD_TYPE = 101
GROUP BY MSTMATERIALS.NAME, MSTMATERIALS.CODE  
            `);


        result["year"] = await this.config.executeQuery(`
            select MSTMATERIALS.NAME, MSTMATERIALS.CODE  , SUM(TRNCFEEDMATPOST .TOTAL_WEIGHT) AS TOTAL_WEIGHT from TRNCFEEDMATPOST 
LEFT JOIN MSTMATERIALS ON MSTMATERIALS.CODE = TRNCFEEDMATPOST .MAT_CODE
WHERE (TRNCFEEDMATPOST . TRAN_DATE BETWEEN	'${startOfYear}' AND '${today}' ) and 
MSTMATERIALS.STATUS_CODE=0 And MSTMATERIALS.MATERIAL_TYPE = 104 AND MSTMATERIALS.PROD_TYPE = 101
GROUP BY MSTMATERIALS.NAME, MSTMATERIALS.CODE  
            `);

        return result;

    }
    async pumpDetailsDMY(data: any) {
        // --------- Day wise month wie and year wise
        let today = data.TRAN_DATE ?? moment().format("YYYYMMDD");
        let startOfMonth = moment(today, "YYYYMMDD").startOf('month').format("YYYYMMDD");
        let startOfYear = moment(today, "YYYYMMDD").startOf('year').format("YYYYMMDD");
        let result = {};

        //*----- 
        result["day_qty"] = await this.config.executeQuery(`
            SELECT 
  MSTMATERIALS.CODE, 
  MSTMATERIALS.NAME, 
  SUM(QTY) QTY, 
  SUM(TRNPUMPMATISALE.TAX_AMOUNT) TAX_AMOUNT, 
  SUM(AMOUNT) AS AMOUNT 
FROM 
  TRNPUMPMATISALE 
  LEFT OUTER JOIN MSTMATERIALS ON TRNPUMPMATISALE.MAT_CODE = MSTMATERIALS.CODE 
WHERE 
  TRAN_DATE BETWEEN '${today}' AND '${today}' 
  AND TRNPUMPMATISALE.STATUS_CODE = 0 
  AND MSTMATERIALS.CODE IN (
    1010500001, 1010500002, 1010500003, 
    1010500017, 1010500061, 1010500062, 
    1010500089
  ) 
GROUP BY 
  MSTMATERIALS.CODE, 
  MSTMATERIALS.NAME

            `);
        result["month_qty"] = await this.config.executeQuery(`
            SELECT 
  MSTMATERIALS.CODE, 
  MSTMATERIALS.NAME, 
  SUM(QTY) QTY, 
  SUM(TRNPUMPMATISALE.TAX_AMOUNT) TAX_AMOUNT, 
  SUM(AMOUNT) AS AMOUNT 
FROM 
  TRNPUMPMATISALE 
  LEFT OUTER JOIN MSTMATERIALS ON TRNPUMPMATISALE.MAT_CODE = MSTMATERIALS.CODE 
WHERE 
  TRAN_DATE BETWEEN '${startOfMonth}' AND '${today}' 
  AND TRNPUMPMATISALE.STATUS_CODE = 0 
  AND MSTMATERIALS.CODE IN (
    1010500001, 1010500002, 1010500003, 
    1010500017, 1010500061, 1010500062, 
    1010500089
  ) 
GROUP BY 
  MSTMATERIALS.CODE, 
  MSTMATERIALS.NAME

            `);


        result["year_qty"] = await this.config.executeQuery(`
            SELECT 
  MSTMATERIALS.CODE, 
  MSTMATERIALS.NAME, 
  SUM(QTY) QTY, 
  SUM(TRNPUMPMATISALE.TAX_AMOUNT) TAX_AMOUNT, 
  SUM(AMOUNT) AS AMOUNT 
FROM 
  TRNPUMPMATISALE 
  LEFT OUTER JOIN MSTMATERIALS ON TRNPUMPMATISALE.MAT_CODE = MSTMATERIALS.CODE 
WHERE 
  TRAN_DATE BETWEEN '${startOfYear}' AND '${today}' 
  AND TRNPUMPMATISALE.STATUS_CODE = 0 
  AND MSTMATERIALS.CODE IN (
    1010500001, 1010500002, 1010500003, 
    1010500017, 1010500061, 1010500062, 
    1010500089
  ) 
GROUP BY 
  MSTMATERIALS.CODE, 
  MSTMATERIALS.NAME

            `);

        return result;
    }

    // async getMatStock(data: any) {
    //     return await this.config.executeQuery(`select sum(QTY) from ${data.tableName} where MAT_CODE = ${data.MatCode}`)
    // }

    async getMatCodeWiseData(data: any) {
        const query = `
SELECT 
    MSTMATERIALS.CODE,
    MSTMATERIALS.NAME,
    MSTMATERIALS.MATERIAL_TYPE,
    MSTMATERIALS.UNIT_CODE,
    MSTMATERIALS.MIN_QTY,
    MSTMATERIALS.MAX_QTY,
    SUM(TRN.QTY) AS MAT_STOCK,
    TRN.MAT_RATE AS RATE
FROM 
    MSTMATERIALS
LEFT JOIN 
    ${data.data.tableName} AS TRN 
ON 
    TRN.MAT_CODE = MSTMATERIALS.CODE
WHERE 
    MSTMATERIALS.MATERIAL_TYPE IN (${data.data.MatTypes}) AND TRN.TRAN_DATE BETWEEN '${data.data.FROM}' AND '${data.data.TO}'
GROUP BY 
    MSTMATERIALS.CODE, 
    MSTMATERIALS.NAME,
    MSTMATERIALS.MATERIAL_TYPE,
    MSTMATERIALS.UNIT_CODE,
    MSTMATERIALS.MIN_QTY,
    MSTMATERIALS.MAX_QTY,
    TRN.MAT_RATE
`;
        let Response = await this.config.executeQuery(query);
        return Response
    }

    createFolder(folderPath: string): string {
        if (!folderPath) {
            throw new BadRequestException('Folder path must be provided.');
        }

        const fullPath = path.join(this.baseDir, folderPath);
        if (fs.existsSync(fullPath)) {
            throw new BadRequestException(`Folder '${folderPath}' already exists.`);
        }

        // Create the nested folder structure if it doesn't exist
        fs.mkdirSync(fullPath, { recursive: true });
        return `Folder '${folderPath}' created successfully.`;
    }

    // Create a new file within a folder
    createFile(folderPath: string, fileName: string, content: string): string {
        const fullFolderPath = path.join(this.baseDir, folderPath);

        // Ensure the folder exists before creating the file
        if (!fs.existsSync(fullFolderPath)) {
            throw new BadRequestException(`Folder '${folderPath}' does not exist in the drive.`);
        }

        const filePath = path.join(fullFolderPath, fileName);

        // Write content to the file
        fs.writeFileSync(filePath, content);
        return `File '${fileName}' created in folder '${folderPath}' successfully.`;
    }

    // List files in a specific folder
    listFiles(folderPath: string): string[] {
        const fullFolderPath = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(fullFolderPath)) {
            throw new BadRequestException(`Folder '${folderPath}' does not exist.`);
        }

        return fs.readdirSync(fullFolderPath).filter(file => {
            return fs.statSync(path.join(fullFolderPath, file)).isFile();
        });
    }

    // Retrieve all folders inside the base directory
    getAllFolders(): string[] {
        const folders = fs.readdirSync(this.baseDir).filter(file =>
            fs.statSync(path.join(this.baseDir, file)).isDirectory()
        );
        return folders;
    }

    // Save uploaded file to a specific folder
    uploadFile(folderName: string, file: Express.Multer.File): string {
        if (!folderName) {
            throw new BadRequestException('Folder name must be provided.');
        }
        if (!file) {
            throw new BadRequestException('File must be provided.');
        }

        const folderPath = path.join(this.baseDir, folderName);
        if (!fs.existsSync(folderPath)) {
            throw new BadRequestException(`Folder '${folderName}' does not exist.`);
        }

        const filePath = path.join(folderPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return `File '${file.originalname}' uploaded successfully to folder '${folderName}'.`;
    }

    // Method to get all files and folders recursively
    private getAllItems(dirPath: string): any[] {
        const items = fs.readdirSync(dirPath);
        let results = [];

        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                results.push({
                    name: item,
                    path: itemPath,
                    type: 'folder',
                    size: this.calculateFolderSize(itemPath),
                    lastModified: stats.mtime,
                });
                // Recursively add subfolder items
                results = results.concat(this.getAllItems(itemPath));
            } else {
                results.push({
                    name: item,
                    path: itemPath,
                    type: 'file',
                    size: stats.size,
                    lastModified: stats.mtime,
                });
            }
        });

        return results;
    }

    // Calculate folder size
    private calculateFolderSize(dirPath: string): number {
        let totalSize = 0;
        const items = fs.readdirSync(dirPath);

        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                totalSize += this.calculateFolderSize(itemPath);
            } else {
                totalSize += stats.size;
            }
        });

        return totalSize;
    }
    // Search both files and folders
    public searchItems(searchTerm: string): any[] {
        const allItems = this.getAllItems(this.baseDir);
        return allItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Helper function to recursively get all files
    private getAllFiles(dirPath: string, filesArray: string[] = []): string[] {
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                this.getAllFiles(filePath, filesArray);
            } else {
                filesArray.push(filePath.replace(this.baseDir + path.sep, ''));
            }
        });

        return filesArray;
    }

    // Retrieve the drive structure in a hierarchical format
    getDriveStructure(): any {
        return this.buildStructure(this.baseDir);
    }

    // Helper function to recursively build the structure
    private buildStructure(dirPath: string): any {
        const items = fs.readdirSync(dirPath);
        const structure = [];

        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                structure.push({
                    name: item,
                    type: 'folder',
                    size: this.calculateFolderSize(itemPath), // Calculate folder size recursively
                    lastModified: stats.mtime, // Last modified date
                    subfolder: this.buildStructure(itemPath), // Recursive call for subfolders
                });
            } else {
                structure.push({
                    name: item,
                    type: 'file',
                    size: stats.size, // File size in bytes
                    lastModified: stats.mtime, // Last modified date
                });
            }
        });

        return structure;
    }

    // Delete a specific file in a folder
    deleteFile(folderPath: string): string {
        if (!folderPath) {
            throw new BadRequestException('Folder name and file name must be provided.');
        }

        const filePath = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException(`File  does not exist in folder '${folderPath}'.`);
        }

        fs.unlinkSync(filePath);
        return `File  deleted successfully from folder '${folderPath}'.`;
    }

    // Delete an entire folder and its contents
    deleteFolder(folderPath: string): string {
        if (!folderPath) {
            throw new BadRequestException('Folder name must be provided.');
        }

        const folderToDelete = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(folderToDelete)) {
            throw new NotFoundException(`Folder '${folderPath}' does not exist.`);
        }
        fs.rmSync(folderToDelete, { recursive: true, force: true });
        return `Folder '${folderPath}' and its contents deleted successfully.`;
    }

    // Download a specific file from a folder
    downloadFile(folderPath: string): StreamableFile {
        if (!folderPath) {
            throw new BadRequestException('Folder name and file name must be provided.');
        }

        const filePath = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException(`File  does not exist in folder '${folderPath}'.`);
        }

        const file = fs.createReadStream(filePath);
        return new StreamableFile(file);
    }

    // Download an entire folder as a zip file
    async downloadFolder(folderPath: string): Promise<StreamableFile> {
        if (!folderPath) {
            throw new BadRequestException('Folder name must be provided.');
        }

        const folderToZip = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(folderToZip)) {
            throw new NotFoundException(`Folder '${folderPath}' does not exist.`);
        }

        const zipFileName = `${folderPath.replace(/\//g, '_')}.zip`;
        const zipFilePath = path.join(this.baseDir, zipFileName);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip');

        return new Promise((resolve, reject) => {
            archive.pipe(output);
            archive.directory(folderToZip, false);
            archive.finalize();

            output.on('close', () => {
                const zipFileStream = fs.createReadStream(zipFilePath);
                resolve(new StreamableFile(zipFileStream));
            });

            archive.on('error', (err) => {
                reject(err);
            });
        });
    }
    // Rename a file or folder
    rename(oldPath: string, newName: string): void {
        const fullOldPath = path.join(this.baseDir, oldPath);
        const fullNewPath = path.join(this.baseDir, path.dirname(oldPath), newName);

        if (!fs.existsSync(fullOldPath)) {
            throw new NotFoundException('File or folder does not exist');
        }

        fs.renameSync(fullOldPath, fullNewPath);

    }

    async getWeightTranData(data) {
        let result = await this.config.executeQuery(`select dbo.FORMAT_DATE(TRAN_DATE) AS PRN_TRANDATE,SUBSTRING(CONVERT(VARCHAR,TRAN_NO),4,4) +'-'+ SUBSTRING(CONVERT(VARCHAR,TRAN_NO),13,6) STRAN_NO,    
* from TRNWEIGHTTRACKH where TRAN_DATE between ${data.params[3]} AND ${data.params[4]}`);
        let nevi = await this.config.executeQuery(`Exec GET_VOUTYPE_FROM_MENUDOC ${data.params[0]}, 92801`);
        let obj = new Array();
        obj.push(result)
        obj.push(nevi);
        console.log(obj)
        return obj;
    }

    async getVechicalData(data) {
        let date = moment(data.data.From_Date, 'DD/MM/YYYY').format('YYYYMMDD');
        let result = await this.config.executeQuery(`select * from TRNWEIGHTTRACKH where TRAN_DATE = ${date} and VEHICLE_NO='${data.data.Vechical_no}'`);
        return result;
    }


    async checkGrnVechicalData(data) {
        let result = await this.config.executeQuery(`select * from TRNWEIGHTTRACKH where REF_TRANNO = ${data.data.TRAN_NO} and VEHICLE_NO='${data.data.Vechical_no}'`);
        return result;
    }
    async InsertWeightTrackData(data) {
        let queryArray = new Array();

        let obj = data.data;
        let TRAN_DATE = moment(obj.From_Date, 'DD/MM/YYYY').format('YYYYMMDD');
        let TRANNO = 0
        if (obj?.TRAN_NO == 0) {
            let object = {
                name: 'Get_Next_Trans_No',
                params: [104, 928, 1, 0, TRAN_DATE, 'TRNWEIGHTTRACKH']
            }
            let tran = await this.config.execSpWithParams(object);
            TRANNO = tran[0][''];
        } else {
            await this.config.executeQuery(`DELETE FROM TRNWEIGHTTRACKH where TRAN_NO = ${obj.TRAN_NO}`);
            TRANNO = obj.TRAN_NO;
        }
        console.log('TRAN_NO', TRANNO);
        let insertObj = new Object();
        insertObj['TRAN_NO'] = TRANNO;
        insertObj['TRAN_DATE'] = TRAN_DATE
        insertObj['TRAN_SUBTYPE'] = 1;
        insertObj['VEHICLE_NO'] = obj.Vechical_no;
        insertObj['IN_TIME'] = obj.In_Time;
        insertObj['OUT_TIME'] = obj.Out_Time;
        insertObj['BLANK_WEIGHT'] = obj.In_Weight
        insertObj['FULL_WEIGHT'] = obj.Out_Weight
        insertObj['TYPE'] = 1;
        insertObj['STATUS_CODE'] = 0
        insertObj['tableName'] = 'TRNWEIGHTTRACKH';

        //Insert into TRNPRCHPOH
        queryArray.push(await this.config.insertData(insertObj));
        return await this.config.executeInsertQuery(queryArray);

    }

    async InsertGrnWeightTrack(data) {
        let queryArray = new Array();

        console.log(data);

        let obj = data.data.weightdata;
        let GrnData = data.data.grndata;
        let TRAN_DATE = moment(obj.From_Date, 'DD/MM/YYYY').format('YYYYMMDD');
        let TRANNO = 0
        if (obj?.TRAN_NO == 0) {
            let object = {
                name: 'Get_Next_Trans_No',
                params: [104, 928, 1, 0, TRAN_DATE, 'TRNWEIGHTTRACKH']
            }
            let tran = await this.config.execSpWithParams(object);
            TRANNO = tran[0][''];
        } else {
            await this.config.executeQuery(`DELETE FROM TRNWEIGHTTRACKH where TRAN_NO = ${obj.TRAN_NO}`);
            TRANNO = obj.TRAN_NO;
        }
        console.log('TRAN_NO', TRANNO);
        let insertObj = new Object();
        insertObj['TRAN_NO'] = TRANNO;
        insertObj['TRAN_DATE'] = TRAN_DATE
        insertObj['TRAN_SUBTYPE'] = 1;
        insertObj['VEHICLE_NO'] = obj.Vechical_no;
        insertObj['IN_TIME'] = obj.In_Time;
        insertObj['OUT_TIME'] = obj.Out_Time;
        insertObj['BLANK_WEIGHT'] = obj.In_Weight
        insertObj['FULL_WEIGHT'] = obj.Out_Weight
        insertObj['STATUS_CODE'] = 0
        insertObj['TYPE'] = 2;
        insertObj['PARTY_NAME'] = GrnData.SUBGL_LONGNAME;
        insertObj['PURCHASE_NO'] = GrnData.STRAN_NO;
        insertObj['PURCHASE_DATE'] = GrnData.TRAN_DATE;
        insertObj['MATERIAL_NAME'] = GrnData.MAT_NAME
        insertObj['MAT_CODE'] = GrnData.MAT_CODE
        insertObj['REF_TRANNO'] = GrnData.TRAN_NO;
        insertObj['tableName'] = 'TRNWEIGHTTRACKH';

        //Insert into TRNPRCHPOH
        queryArray.push(await this.config.insertData(insertObj));
        return await this.config.executeInsertQuery(queryArray);

    }
    async DATACONVERTMATPOST(data: any) {
        let array = await this.config.executeQueryOLDDB(`
        SELECT MAT_CODE, SUM(QTY) AS QTY, UNIT_CODE
        FROM ${data.TABLE_NAME}
        WHERE tran_date < '20240331'
        GROUP BY MAT_CODE, UNIT_CODE;
        `);
        let TRAN_NO = await this.config.executeQuery(`Get_Next_Trans_No  ${data.COMPANY_ID}, 101, 1, 15, 20240331, ${data.TABLE_NAME};`)
        let SR_NO = 0
        for (let item of array) {
            SR_NO++
            item.QTY = item.QTY < 0 ? 0 : item.QTY;
            console.log(`INSERT INTO ${data.TABLE_NAME} (TRAN_NO, MAT_CODE, QTY, UNIT_CODE,STATUS_CODE ,SR_NO ,TRAN_DATE ) VALUES(${TRAN_NO[0]['']},${item.MAT_CODE},${item.QTY},'${item.UNIT_CODE}',0,${SR_NO},'20240331')`)
            await this.config.executeQuery(`INSERT INTO ${data.TABLE_NAME} (TRAN_NO, MAT_CODE, QTY, UNIT_CODE,STATUS_CODE ,SR_NO ,TRAN_DATE ) VALUES(${TRAN_NO[0]['']},${item.MAT_CODE},${item.QTY},'${item.UNIT_CODE}',0,${SR_NO},'20240331')`)
        }
    }
    // *********************** insert and update Masters  ************************//
    async insert_glsubgl(data) {
        let tableName = 'MSTACCTGLSUB';
        let queryArray = new Array();

        if (data.SUB_GLACNO == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'SUB_GLACNO',9,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['SUB_GLACNO'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
        } else {
            //********* update *********//
            let codeValue = data.SUB_GLACNO;
            delete data['SUB_GLACNO'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        SUB_GLACNO: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.config.updateData(dataset));
        }
        return await this.config.executeInsertQuery(queryArray);

    }

    async insert_MstAcctGlSubDept(data) {
        let queryArray = new Array();

        let tableName = 'MSTACCTGLSUBDEPT';

        if (data.SUB_GLACNO == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'SUB_GLACNO',9,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['SUB_GLACNO'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
        } else {
            //********* update *********//
            let codeValue = data.SUB_GLACNO;
            delete data['SUB_GLACNO'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.config.updateData(dataset));
        }
        return await this.config.executeInsertQuery(queryArray);

    }

    // सिस्टीम --> मुख्यकिर्द विभाग --> पोटकिर्द खाती --> व्यापारी येणे - बाय प्रोडक्ट
    async insert_SupplierBiProduct(data) {
        let queryArray = new Array();

        let tableName1 = 'MSTACCTGLSUB';
        let tableName2 = 'MSTACCTGLSUBDEPT';

        let data_table1 = data['MSTACCTGLSUB'];
        let data_table2 = data['MSTACCTGLSUBDEPT'];

        if (data_table1.SUB_GLACNO == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data_table1.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName1},'SUB_GLACNO',9,'${prefix[0]['TYPE_CODE']}'`,
            );
            data_table1['SUB_GLACNO'] = a[0][''];
            data_table1['tableName'] = tableName1;
            console.log(data_table1);

            queryArray.push(await this.config.insertData(data_table1));

            data_table2['SUB_GLACNO'] = a[0][''];
            data_table2['tableName'] = tableName2;
            console.log(data_table2);

            queryArray.push(await this.config.insertData(data_table2));

            return await this.config.executeInsertQuery(queryArray);
        } else {
            //********* update *********//
            let data_table1 = data['MSTACCTGLSUB'];
            let data_table2 = data['MSTACCTGLSUBDEPT'];

            let codeValue = data_table1.SUB_GLACNO;
            delete data_table1['SUB_GLACNO'];

            let dataset = {};
            dataset = {
                data: data_table1,
                condition: [
                    {
                        SUB_GLACNO: codeValue,
                    },
                ],
                tableName: tableName1,
            };
            let tb1_result = await this.config.updateData(dataset);

            let dataset2 = {};
            dataset2 = {
                data: data_table2,
                condition: [
                    {
                        SUB_GLACNO: codeValue,
                    },
                ],
                tableName: tableName2,
            };
            let tb2_result = await this.config.updateData(dataset2);
            return { tb1_result, tb2_result };
        }
    }

    // सिस्टीम --> मुख्यकिर्द विभाग --> पोटकिर्द खाती --> पशू मिञ
    async insert_PashuMitra(data) {
        let queryArray = new Array();

        let tableName1 = 'MSTACCTGLSUB';
        let tableName2 = 'MSTACCTGLSUBPASHUFRIEND';

        let data_table1 = data['MSTACCTGLSUB'];
        let data_table2 = data['MSTACCTGLSUBPASHUFRIEND'];

        if (data_table1.SUB_GLACNO == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data_table1.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName1},'SUB_GLACNO',9,'${prefix[0]['TYPE_CODE']}'`,
            );
            data_table1['SUB_GLACNO'] = a[0][''];
            data_table1['tableName'] = tableName1;
            console.log(data_table1);

            queryArray.push(await this.config.insertData(data_table1));

            data_table2['SUB_GLACNO'] = a[0][''];
            data_table2['tableName'] = tableName2;
            console.log(data_table2);

            queryArray.push(await this.config.insertData(data_table2));

            return await this.config.executeInsertQuery(queryArray);
        } else {
            //********* update *********//
            let data_table1 = data['MSTACCTGLSUB'];
            let data_table2 = data['MSTACCTGLSUBPASHUFRIEND'];

            let codeValue = data_table1.SUB_GLACNO;
            delete data_table1['SUB_GLACNO'];

            let dataset = {};
            dataset = {
                data: data_table1,
                condition: [
                    {
                        SUB_GLACNO: codeValue,
                    },
                ],
                tableName: tableName1,
            };
            let tb1_result = await this.config.updateData(dataset);

            let dataset2 = {};
            dataset2 = {
                data: data_table2,
                condition: [
                    {
                        SUB_GLACNO: codeValue,
                    },
                ],
                tableName: tableName2,
            };
            let tb2_result = await this.config.updateData(dataset2);
            return { tb1_result, tb2_result };
        }
    }

    async insert_CnfRateTaxs(data) {
        let tableName = 'CNFRATETAXS';
        let queryArray = new Array();

        console.log(data);
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            console.log(data);

            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            console.log(data);
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_CNFREPORTD(data) {
        let tableName = 'CNFREPORTD';
        let queryArray = new Array();

        for (let item of data.CNFREPORTD) {

            if (item.CODE == undefined) {
                //********* insert *********//
                let prefix = await this.MSTDocWiseNevigation({
                    menu_doc_no: item.MenuDocNo,
                });

                let a = await this.config.executeQuery(
                    `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
                );
                item['CODE'] = a[0][''];
                // item['SYS_TIME'] = moment().format('YYYYMMDD');
                item['tableName'] = tableName;
                queryArray.push(await this.config.insertData(item));
                return await this.config.executeInsertQuery(queryArray);

            } else {
                //********* update *********//
                let codeValue = item.CODE;
                delete item['CODE'];

                let dataset = {};
                dataset = {
                    data: item,
                    condition: [
                        {
                            CODE: codeValue,
                        },
                    ],
                    tableName: tableName,
                };
                return await this.config.updateData(dataset);
            }
        }

    }

    async insert_CnfTdsTypes(data) {
        let tableName = 'CNFTDSTYPES';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_CnfRateTds(data) {
        let tableName = 'CNFRATETDS';   
        let queryArray = new Array();


        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }
    async insert_MstMaterials(data) {
        let tableName = 'MSTMATERIALS';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',10,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);
        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_CnfGstRateCategory(data) {
        let queryArray = new Array();

        let tableName = 'CNFGSTRATECATEGORY';
        console.log(data);
        if (data.isInsert == true) {
            //********* insert *********//
            data['tableName'] = tableName;
            let temp = await this.config.executeQuery(`SELECT coalesce(MAX(CODE), 100) + 1 FROM CNFGSTRATECATEGORY`);
            data["CODE"] = temp[0]['']
            console.log(data);

            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            console.log(data);
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_GstRateCategory(data) {
        data = data.CNFRATEGST;
        let tableName = 'CNFRATEGST';
        let queryArray = new Array();

        console.log(data);
        for (let item of data) {
            if (item.isInsert == true) {
                //********* insert *********//

                item['tableName'] = tableName;
                console.log(item);

                queryArray.push(await this.config.insertData(item));
                return await this.config.executeInsertQuery(queryArray);

            } else {
                //********* update *********//
                console.log(item);
                let codeValue = item.CODE;
                delete item['CODE'];

                let dataset = {};
                dataset = {
                    data: item,
                    condition: [
                        {
                            CODE: codeValue,
                        },
                    ],
                    tableName: tableName,
                };
                await this.config.updateData(dataset);
            }
        }
    }

    async insert_CnfRateExcise(data) {
        let tableName = 'CNFRATEEXCISE';
        let queryArray = new Array();

        console.log(data);
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',7,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            console.log(data);

            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            console.log(data);
            let codeValue = data.CODE;

            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_CNFPOSTKEYSGL(data) {
        let tableName = 'CNFPOSTKEYSGL';

        //********* update *********//
        for (let item of data.CNFPOSTKEYSGL) {

            // console.log(item[0].POSTKEY_CODE);
            let codeValue = item.POSTKEY_CODE;
            delete item['CODE'];

            let dataset = {};
            dataset = {
                data: item,
                condition: [
                    {
                        POSTKEY_CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            await this.config.updateData(dataset);
        }
    }

    async insert_MSTBIPRODITEMRATES(data) {
        let tableName = 'MSTBIPRODITEMRATES';
        let queryArray = new Array();


        for (let item of data.MSTBIPRODITEMRATES) {
            if (item.EFF_DATE) {

                //let a = await this.config.executeQuery(`select max(DEPT_CODE)+1  from MSTBIPRODITEMRATES`);
                //item['DEPT_CODE'] = a[0][''];
                // data['SYS_TIME'] = moment().format('YYYYMMDD');
                item['tableName'] = tableName;

                queryArray.push(await this.config.insertData(item));
                return await this.config.executeInsertQuery(queryArray);

            }
            // console.log(item[0].POSTKEY_CODE);
            else {
                let codeValue = [item.EFF_DATE, item.DEPT_CODE];
                delete item['DEPT_CODE'];

                let dataset = {};
                dataset = {
                    data: item,
                    condition: [
                        {
                            EFF_DATE: codeValue[0],
                            DEPT_CODE: codeValue[1]
                        },
                    ],
                    tableName: tableName,
                };
                await this.config.updateData(dataset);
            }
        }

    }

    async insert_CnfServiceCode(data) {
        let tableName = 'CNFSERVICEACODE';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstAcctConst(data) {
        let tableName = 'MSTACCTCONST';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '',${tableName},'CODE',4,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstCommTerms(data) {
        let queryArray = new Array();

        let prefix = await this.MSTDocWiseNevigation({
            menu_doc_no: data.MenuDocNo,
        });
        // prefix not in SP when eat the insert in old site
        let tableName = 'MSTCOMMTERMS';

        if (data.CODE == undefined) {
            //********* insert *********//
            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '',${tableName},'CODE',3,''`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstCommunit(data) {
        let tableName = 'MSTCOMMUNIT';
        let queryArray = new Array();


        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',5,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstMatGroup(data) {
        let tableName = 'MSTMATGROUP';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstMatLocation(data) {
        let tableName = 'MSTMATLOCATION';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }
    async insert_MstMSTCOMMGODOWN(data) {
        let tableName = 'MSTCOMMGODOWN';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            // let a = await this.config.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`)
            let a = await this.config.executeQuery(
                `select coalesce (max(CODE), 400) + 1 from MSTCOMMGODOWN where CODE > 399`,
            ); //---- new sub loactions insert from 400
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstPashuCenter(data) {
        let tableName = 'MSTPASHUCENTER';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '',${tableName},'CODE',4,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstPashuTypes(data) {
        let tableName = 'MSTPASHUTYPES';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstPashuDhan(data) {

        let tableName = 'MSTACCTGLSUB';
        let queryArray = new Array();
        for (let item of data) {
            if (item.SUB_GLACNO == undefined) {
                //********* insert *********//
                let prefix = await this.MSTDocWiseNevigation({
                    menu_doc_no: item.MenuDocNo,
                });

                let a = await this.config.executeQuery(
                    `Get_Next_Master_Code '101','${tableName}','SUB_GLACNO',9,'${prefix[0]['TYPE_CODE']}'`,
                );
                item['SUB_GLACNO'] = a[0][''];
                // item['SYS_TIME'] = moment().format('YYYYMMDD');
                item['tableName'] = tableName;
                queryArray.push(await this.config.insertData(item));
                return await this.config.executeInsertQuery(queryArray);

            } else {
                //********* update *********//
                let codeValue = item.SUB_GLACNO;
                delete item['SUB_GLACNO'];

                let dataset = {};
                dataset = {
                    data: item,
                    condition: [
                        {
                            SUB_GLACNO: codeValue,
                        },
                    ],
                    tableName: tableName,
                };
                return await this.config.updateData(dataset);
            }
        }
    }
    async insert_MstPashuLabhutpadak(data) {
        let tableName = 'MSTPASHULABHUTPADAK';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }
    async insert_MstPashuVaccieType(data) {
        // let prefix = await this.MSTDocWiseNevigation(
        //     {
        //         "menu_doc_no": data.MenuDocNo
        //     }
        // );

        // console.log(prefix);

        // let a = await this.config.executeQuery(`Get_Next_Master_Code '101','MSTPASHUVACCINETYPE','CODE',5,''`) // prefix is null in old site insert, if fill this value then get error
        // data['CODE'] = a[0][''];
        // // data['SYS_TIME'] = moment().format('YYYYMMDD');
        // data['tableName'] = 'MSTPASHUVACCINETYPE';
        // ;

        // return await this.config.insertData(data);

        let tableName = 'MSTPASHUVACCINETYPE';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',5,''`,
            ); // prefix is null in old site insert, if fill this value then get error
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push(await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insert_MstBiprodDepartment(data) {
        let tableName = 'MSTBIPRODDEPARTMENT';
        let queryArray = new Array();
        console.log(data);
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            console.log(data);

            queryArray.push( await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            console.log(data);
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }
    async MSTCOMMTRANSPORT(data) {
        let tableName = 'MSTCOMMTRANSPORT';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push( await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.CODE;
            delete data['CODE'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }

    async insertMSTACCTGLSUBTDS(data) {
        let tableName = 'MSTACCTGLSUBTDS';
        let queryArray = new Array();

        if (data.SUB_GLACNO == undefined) {
            //********* insert *********//
            let a = await this.config.executeQuery(
                `select max(SUB_GLACNO)+1  from MSTACCTGLSUBTDS`,
            );
            data['SUB_GLACNO'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            queryArray.push( await this.config.insertData(data));
            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
            let codeValue = data.SUB_GLACNO;
            delete data['SUB_GLACNO'];

            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        SUB_GLACNO: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.updateData(dataset);
        }
    }
}
