import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SQL } from 'src/database/sql.sql';
@Injectable()
export class CommonService {
    constructor(private sql: SQL) {
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
        return await this.sql.selectAll(details);
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
        return await this.sql.selectAll(details);
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
        return await this.sql.selectAll(details);
    }




    //get Common and generic function data
    async getHelpList(data) {
        let object =
        {
            name: 'Get_HelpList',
            params: [data.COMPANYID, data.TableName, data.CompanyidColumn, data.HelpColumnNames, data.HelpColumnFilter, data.SortOrder, data.ExecFlag]
        }
        return await this.sql.execSpWithParams(object);

    }

    //Menu Navigation Button Access as per user data
    async getUserAccess(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        }

        return await this.sql.execSpWithParams(object);

    }


    async GET_VOUTYPE_FROM_MENUDOC(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        }
        return await this.sql.execSpWithParams(object);
    }

    /*common endpoint for all sp*/
    async getSpData(data) {
        let object = {
            name: data.SPname,
            params: data.params,
        }
        return await this.sql.execSpWithParams(object, data.multiflag);
    }

    /*common endpoint for all sp*/
    async getSp(data) {
        let object = {
            name: data.SPname,
        }
        return await this.sql.execOnlySp(object);
    }
    //-------------------- Menu Nav Details ----------------//
    async menuNavDetails() {
        ///Get Module details
        let modules = await this.sql.executeUserQuery(`select MODULE_NO as id,MODULE_NAME as label from Modules where STATUS_CODE = 0`);
        for (let item of modules) {
            let subArray = await this.sql.executeUserQuery(`select MODULE_NO as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = 0`);
            if (subArray.length != 0) {
                item['subItems'] = subArray;
                if (subArray.length != 0) {
                    for (let ele of subArray) {
                        if (ele.link == null || ele.link == "") {
                            delete ele.link
                        }
                        let subSubArray = await this.sql.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele.id}`);
                        if (subSubArray.length != 0) {
                            ele['subItems'] = subSubArray;
                            if (subSubArray.length != 0) {
                                for (let ele1 of subSubArray) {
                                    if (ele1.link == null || ele1.link == "") {
                                        delete ele1.link
                                    }
                                    let subSub1Array = await this.sql.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele1.id}`);
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
        return await this.sql.execUserSpWithParams(object, data.multiflag);
    }
}
