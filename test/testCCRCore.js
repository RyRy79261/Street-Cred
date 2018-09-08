const CCRCore = artifacts.require('./CCRCore.sol');
const CCRCoreFactory = artifacts.require('./CCRCoreFactory.sol');
const EthClaimsRegistry = artifacts.require('./EthereumClaimsRegistry.sol');

contract('CCR Core', accounts =>{
    const [
        firstAcc,
        secondAcc,
        thirdAcc,
        forthAcc,
        fifthAcc,
        sixthAcc,
        seventhAcc
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

    it('Should create & cancel a claim request', async () => {
        await CCRCoreInstance.requestClaimRace(claim, {from: sixthAcc});
        let [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(sixthAcc, claim);

        assert.equal(pending, true, "Request not created");

        await CCRCoreInstance.cancelClaimRace(claim, {from: sixthAcc});
        [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(sixthAcc, claim);

        assert.equal(pending, false, "Request was not canceled");
    })

    it('Should initialise a revoke claim race', async () => {
        await CCRCoreInstance.revokeClaim(claim, {from: secondAcc});
        let [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(secondAcc, claim);
        assert.equal(pending, true, "Race not initialised");
        assert.equal(revoke, true, "Revoke state not initialised");
    })

    it('Should revoke claim after quorum', async () => {
        await CCRCoreInstance.voteOnClaim(secondAcc, claim, true, {from: firstAcc});
        let [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(sixthAcc, claim);
        await CCRCoreInstance.voteOnClaim(secondAcc, claim, true, {from: forthAcc});
        [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(sixthAcc, claim);
        assert.equal(pending, false, "Race not complete");
    })

    it('Reject non curator manual revoke claim access', async () => {
        try{
            await CCRCoreInstance.initiateRevokeClaim(firstAcc, claim, {from: seventhAcc})
        }
        catch (error) {
            assert.equal(error.message.indexOf('Not a curator') >= 0, true, "Expected throw not found")
        }
    })

    it('Should issue a failed claim once quorum is reached', async () => {
        await CCRCoreInstance.requestClaimRace(claim, {from: seventhAcc});
        let [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(seventhAcc, claim);

        assert.equal(pending, true, "Request not created");
        await CCRCoreInstance.voteOnClaim(seventhAcc, claim, false, {from: firstAcc});
        await CCRCoreInstance.voteOnClaim(seventhAcc, claim, false, {from: thirdAcc});
        [pending, revoke, supporting, contesting] = await CCRCoreInstance.getClaimState(seventhAcc, claim);
        assert.equal(pending, false, "Quorum not reached");
        const result = await EthClaimsRegistryInstance.getClaim(CCRCoreInstance.address, seventhAcc, claimAsBytes32);
        assert.equal(result, falseAsBytes32);
    })
    
    it('Should deny curator rights once a negative quorum is reached', async () => {
        await CCRCoreInstance.joinCurators({from: seventhAcc});
        let [pending, validated, supporting, contesting] = await CCRCoreInstance.getCuratorState(seventhAcc);
        assert.equal(pending, true, "Vote not open successfully");
        await CCRCoreInstance.voteOnApplicant(seventhAcc, false, {from: firstAcc});
        await CCRCoreInstance.voteOnApplicant(seventhAcc, false, {from: secondAcc});
        [pending, validated, supporting, contesting] = await CCRCoreInstance.getCuratorState(seventhAcc);
        assert.equal(pending, false, "Negative vot not completed")
    })

    it('It should reject a non curator from voting on claims', async () => {
        await CCRCoreInstance.requestClaimRace(claim, {from: seventhAcc});
        try{
            await CCRCoreInstance.voteOnClaim(seventhAcc, claim, false, {from: seventhAcc});
        } catch (error) {
            assert.equal(error.message.indexOf('Not a curator') >= 0, true, "Expected throw not found")
        }
    })

    it('It should reject a non curator from voting on curator applications', async () => {
        await CCRCoreInstance.joinCurators({from: seventhAcc});
        try{
            await CCRCoreInstance.voteOnApplicant(seventhAcc, true, {from: seventhAcc});
        } catch (error) {
            assert.equal(error.message.indexOf('Not a curator') >= 0, true, "Expected throw not found")
        }
    })

    it('It should reject a non curator from manually initialising claim races', async () => {
        try{
            await CCRCoreInstance.initiateClaimRace(firstAcc, claim, {from: seventhAcc});
        } catch (error) {
            assert.equal(error.message.indexOf('Not a curator') >= 0, true, "Expected throw not found")
        }
    })

    it('It should reject a non curator from manually initialising revoke claim races', async () => {
        try{
            await CCRCoreInstance.initiateRevokeClaim(firstAcc, claim, {from: seventhAcc});
        } catch (error) {
            assert.equal(error.message.indexOf('Not a curator') >= 0, true, "Expected throw not found")
        }
    })

    it('It should reject a non curator from manually initialising curator races', async () => {
        try{
            await CCRCoreInstance.addCurator(seventhAcc, {from: seventhAcc});
        } catch (error) {
            assert.equal(error.message.indexOf('Not a curator') >= 0, true, "Expected throw not found")
        }
    })
});