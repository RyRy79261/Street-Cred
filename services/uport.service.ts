import { Connect, SimpleSigner } from 'uport-connect';


// Request credentials to login
export default class uPortService {
    private uport: any;
    public web3: any;

    constructor() {
        this.uport = new Connect('CCR Manager - StreetCred', {
            clientId: '2ozRcEoFKBLthSH5e9cfs4jX3vYgLjZupXM',
            network: 'rinkeby',
            signer: SimpleSigner('a314950dfc65040ba288691c1031151d5fbb49080390106b77ad7c18b8a376aa')
        })
        this.getWeb3()
    }

    public getWeb3() {
        this.web3 = this.uport.getWeb3();
    }

    public async login() {
        const credentials = await this.uport.requestCredentials({
            requested: ['name', 'phone', 'country'],
            notifications: true // We want this if we want to recieve credentials
        });
        return credentials;
    }

    public async artifactsToContract(artifacts: any) {
        const contractAbstraction = await this.web3.eth.contract(artifacts.abi);
        return contractAbstraction;
    }

    public getTransactionReceiptMined(txHash: string) {
        
        async (_error, _txHash) => {
            if (_error) { reject(_error); }
            // Request placed
            let error, result;
            [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
            if (!result.blockNumber) {
                reject(error); }
    }
}


