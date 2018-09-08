import uPortService from './uport.service';
const ccrCoreAbi = require('../build/contracts/CCRCore.json')

export class CCRCoreFactoryService {
    private contractInstance: any;
    private uportService: uPortService;

    private ccrContractArray: any[];

    constructor(uportService: uPortService) {
        this.uportService = uportService;
        this.init();
    }
    
    private async init() {
        this.contractInstance = await this.uportService.artifactsToContract(ccrCoreAbi);
    }

    public async fetchAllCCR(_addresses: string[]){
        for(let i in _addresses){
            this.ccrContractArray.push(await this.contractInstance.at(_addresses[i]))
        }
    }    
    
    public async fetchCCR(_address: string){
        return await this.contractInstance.at(_address);
    }

    public async getEvents(_index: number, _topic: string, _eventName: string, _publisherAddress: string) {
        return new Promise((resolve, reject) => {
            this.ccrContractArray[_index][_eventName]({_publisher:_publisherAddress}, async (_error: any, _result: any) => {
                if (_error) { reject(_error); }
                // Request placed
                resolve(_result)
            })
        })
    }

    public async runMethod(_index: number, _functionName: string, _param: Array<any>, _transact: boolean){
        return new Promise((resolve, reject)  =>{
            this.ccrContractArray[_index][_functionName](..._param, async (_error: any, _result: any) => {
                if (_error) { reject(_error); }
                // Request placed
                if(_transact){
                    let error: any, result: any;
                    result = await this.uportService.getTransactionReceiptMined(_result)
                    if (!result.blockNumber) { reject(error); }
                    resolve(result)
                }else{
                    resolve(_result)
                }
            });
        })
    }
}