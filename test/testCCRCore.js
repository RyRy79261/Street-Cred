const CCRCore = artifacts.require('./CCRCore.sol');
const CCRCoreFactory = artifacts.require('./CCRCoreFactory.sol');
const EthClaimsRegistry = artifacts.require('./EthereumClaimsRegistry.sol');

contract('CCR Core', accounts =>{
    const [
        firstAcc,
        secondAcc,
        thirdAcc,
        forthAcc,
        fifthAcc
    ] = accounts
    let CCRCoreFactoryInstance,
    CCRCoreInstance,
    EthClaimsRegistryInstance

    const name = "CCR testing";
    const quorum = 2;
    const claim = "Claim Testing"
    const claimAsBytes32 = "0x93dae851c186b2093d0af6ca4d2fb9d189a7f814b6ed373859c9cb099728ec08";

    const trueAsBytes32 = "0x6273151f959616268004b58dbb21e5c851b7b8d04498b4aabee12291d22fc034";
    const falseAsBytes32 = "0xba9154e0baa69c78e0ca563b867df81bae9d177c4ea1452c35c84386a70f0f7a";

    before('Initialize ecosystem', async () => {
        EthClaimsRegistryInstance = await EthClaimsRegistry.new();
        CCRCoreFactoryInstance = await CCRCoreFactory.new(EthClaimsRegistryInstance.address);
    })

    it('Deploy From Factory', async function () {
        await CCRCoreFactoryInstance.deployCCR(name, quorum, {from: firstAcc})
        const deployedCCR = await CCRCoreFactoryInstance.getRegistry();
        CCRCoreInstance = CCRCore.at(deployedCCR[0]);
        assert.equal(await CCRCoreInstance.name.call(), name)
    })

    it('Create claim request', async function () {
        assert.equal(false, true);
    })

    it('Voting on claim', async function () {
        assert.equal(false, true);
    })

    it('Has set claim in registry', async function () {
        assert.equal(false, true);
    })

    it('User applies as curator', async function () {
        assert.equal(false, true);
    })

    it('Curator Votes on applicant', async function () {
        assert.equal(false, true);
    })

    it('Curator adds curator through vote', async function () {
        assert.equal(false, true);
    })

    it('Adding a 4th curator on quorum set to 50% sets required votes to 2', async function () {
        assert.equal(false, true);
    })

    it('Curator issues claim on account', async function () {
        assert.equal(false, true);
    })

    it('Requesting curator cant cast same vote twice', async function () {
        assert.equal(false, true);
    })

    it('Should reach quorum with 4 curators on second vote', async function () {
        assert.equal(false, true);
    })

});