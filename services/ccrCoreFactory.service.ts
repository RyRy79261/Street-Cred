import uPortService from './uport.service';
const ccrCoreFactoryAbi = require('../build/contracts/CCRCoreFactory.json')
const ccrCoreAbi = require('../build/contracts/CCRCore.json')
const factoryAddress = "0xc9ed21ffcc88a5072454c43bdfdbbe3430888b19"

export class CCRCoreFactoryService {
    private factoryContract: any;
    private uportService: uPortService;
    public registryList: string[];
    constructor(uportService: uPortService) {
        this.uportService = uportService;
        this.init();
    }

    private async init() {
        let contract: any = this.uportService.artifactsToContract(ccrCoreFactoryAbi);
        this.factoryContract = contract.at(factoryAddress);
        this.registryList = await this.getRegistries();
    }

    public deployCCR(_name: string) {
        return new Promise((resolve, reject) => {
            this.factoryContract.deployCCR(_name, 2, async (_error: any, _txHash: string) => {
                if (_error) { reject(_error); }
                // Request placed
                let error: any, result: any;
                result = await this.uportService.getTransactionReceiptMined(_txHash)
                if (!result.blockNumber) { reject(error); }
                this.registryList = await this.getRegistries();
                resolve(result)
            })
        })
    }

    public getRegistries(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.factoryContract.getRegistry(async (_error: any, _result: string[]) => {
                if (_error) { reject(_error); }
                // Request placed
                resolve(_result)
            })
        })
    }

    public getEvents(_topic: string, _eventName: string, _publisherAddress: string): any {
        return new Promise((resolve, reject) => {
            this.factoryContract[_eventName]({_publisher:_publisherAddress}, async (_error: any, _result: any) => {
                if (_error) { reject(_error); }
                // Request placed
                resolve(_result)
            })
        })
    }
}