import uPortService from './uport.service';
const ethereumClaimsRegistryAbi = require('../build/contracts/EthereumClaimsRegistry.json')

export default class EthClaimsRegistryService {
    private contractInstance: any;
    private uportService: any;
    constructor(uportService: uPortService){
        var contractInstance : any = uportService.artifactsToContract(ethereumClaimsRegistryAbi);
        this.contractInstance = contractInstance.at('0xc9ed21ffcc88a5072454c43bdfdbbe3430888b19');
        this.uportService = uportService;
    }

    public async runMethod(_index: number, _functionName: string, _param: Array<any>, _transact: boolean){
        return new Promise((resolve, reject)  =>{
            this.contractInstance[_index][_functionName](..._param, async (_error: any, _result: any) => {
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
