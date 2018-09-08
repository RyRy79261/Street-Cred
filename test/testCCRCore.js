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

    it('Create claim request', async () => {
        await CCRCoreInstance.requestClaimRace(claim, {from: secondAcc});
        const [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(secondAcc, claim);

        assert.equal(pending, true, "Request not created");
    })

    it('Voting on claim', async  () => {
        await CCRCoreInstance.voteOnClaim(secondAcc, claim, true, {from: firstAcc});
        const [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(secondAcc, claim);
        // console.log(pending, revoke, supporting, contesting)
        assert.equal(pending, false, "Vote still open, quorum no reached");
    })

    it('Has set claim in registry', async  () => {
        const result = await EthClaimsRegistryInstance.getClaim(CCRCoreInstance.address, secondAcc, claimAsBytes32);
        assert.equal(result, trueAsBytes32);
    })

    it('User applies as curator', async  () =>{
        await CCRCoreInstance.joinCurators({from: secondAcc});
        const [pending, validated, supporting, contesting] = await CCRCoreInstance.getCuratorState(secondAcc);
        assert.equal(pending, true, "Vote not open successfully");
    })

    it('Curator Votes on applicant', async () => {
        await CCRCoreInstance.voteOnApplicant(secondAcc, true, {from: firstAcc});
        const [pending, validated, supporting, contesting] = await CCRCoreInstance.getCuratorState(secondAcc);
        assert.equal(pending, false, "Vote did not reach quorum");
        assert.equal(validated, true, "User did not successfully be validated");
    })

    it('Curator adds curator manually', async () => {
        await CCRCoreInstance.addCurator(thirdAcc, {from: secondAcc});
        const [pending, validated, supporting, contesting] = await CCRCoreInstance.getCuratorState(thirdAcc);
        assert.equal(pending, false, "Vote did not reach quorum");
        assert.equal(validated, true, "User did not successfully be validated");
    })

    it('Adding a 4th curator on quorum set to 50% sets required votes to 2', async () => {
        await CCRCoreInstance.addCurator(forthAcc, {from: thirdAcc});
        const [pending, validated, supporting, contesting] = await CCRCoreInstance.getCuratorState(forthAcc);
        assert.equal(pending, false, "Vote did not reach quorum");
        assert.equal(validated, true, "User did not successfully be validated");
        const curatorCount =  await CCRCoreInstance.curatorCount.call();
        const quorumResult = await CCRCoreInstance.calcQuorum(curatorCount.toNumber(), quorum)
        assert.equal(quorumResult, 2, "Quorum incorrectly calculated")
    })

    it('Curator issues claim on account', async () => {
        await CCRCoreInstance.initiateClaimRace(fifthAcc, claim, {from: forthAcc});
        const [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(fifthAcc, claim);
        assert.equal(pending, true, "Quorum reached incorrectly");
    })

    it('Requesting curator cant cast same vote twice', async () => {
        try {
            await CCRCoreInstance.voteOnClaim(fifthAcc, claim, true, {from: forthAcc});
        }
        catch (error) {
            assert.equal(error.message.indexOf('Already cast vote') >= 0, true, "Expected throw not found")
        }
    })

    it('Should reach quorum with 4 curators on second vote', async () => {
        await CCRCoreInstance.voteOnClaim(fifthAcc, claim, true, {from: firstAcc});
        const [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(fifthAcc, claim);

        assert.equal(pending, false, "Quorum not reached");
    })

});