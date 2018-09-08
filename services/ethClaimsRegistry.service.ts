import uPortService from './uport.service';
const ethereumClaimsRegistryAbi = require('../build/contracts/EthereumClaimsRegistry.json')

export default class EthClaimsRegistryService {
    private contractInstance: any;
    constructor(uportService: uPortService){
        this.contractInstance = uportService.artifactsToContract(ethereumClaimsRegistryAbi);
    }


}
