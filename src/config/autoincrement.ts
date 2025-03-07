import {Config} from './config';
export class AutoIncrement{
    constructor(private config:Config){}
    async index(data){
             console.log(data);
        let getRecord = data.data
        let columnName = data.column
        let lastRecord:any = '';
        if(getRecord.length != 0){
            lastRecord = getRecord[0][columnName];
        }else{
            lastRecord ='';

        }

        console.log(lastRecord);

        if(lastRecord != ''){
            lastRecord = lastRecord + 1;
        }else{
            lastRecord = 105;
        }

        return lastRecord;
    }
}