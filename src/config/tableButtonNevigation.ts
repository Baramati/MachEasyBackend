import {Config} from './config'

export class buttonNevigation{
    constructor(private config : Config){}
    async index(code){
        let dataSet = {
            "table" : "CNFMASTTYPES",
            "view" : [
                "NAVIGATION_OPTIONS"
            ],
            "condition" : [{
                "CODE" : code,
                "type" : 'AND'
            }]
        }
        
        let result = await this.config.selectAll(dataSet)
        // return result
    }
}