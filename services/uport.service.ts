import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('CCR Manager - StreetCred', {
    clientId: '2ozRcEoFKBLthSH5e9cfs4jX3vYgLjZupXM',
    network: 'rinkeby',
    signer: SimpleSigner('a314950dfc65040ba288691c1031151d5fbb49080390106b77ad7c18b8a376aa')
})

// Request credentials to login
class uPortService {
    constructor(){}

    async function login() {
        uport.requestCredentials({
            requested: ['name', 'phone', 'country'],
            notifications: true // We want this if we want to recieve credentials
        })
    }

}


