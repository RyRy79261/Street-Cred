export enum CCRCoreEvents{
    CLAIMRACEREQUESTED          = "ClaimRaceRequested",
    CLAIMRACECONCLUDED          = "ClaimRaceConcluded",
    REVOKECLAIMREQUESTED        = "RevokeClaimRequested",
    CURATORAPPLICATION          = "CuratorApplication",
    CURATORAPPLICATIONCONCLUDED = "CuratorApplicationConcluded"
}

export enum CCRCoreFactoryEvents{
    CCRPUBLISHED                = "CCRPublished"
}

export enum EthClaimsEvents{
    CLAIMSET                    = "ClaimSet",
    CLAIMREMOVED                = "ClaimRemoved"
}

export enum CCRCoreMethods{
    name                    = "name",
    curatorCount            = "curatorCount",
    isCurator               = "isCurator",
    requestClaimRace        = "requestClaimRace",
    cancelClaimRace         = "cancelClaimRace",
    revokeClaim             = "revokeClaim",
    getClaimState           = "getClaimState",
    getCuratorState         = "getCuratorState",
    addCurator              = "addCurator",
    joinCurators            = "joinCurators",
    initiateRevokeClaim     = "initiateRevokeClaim",
    initiateClaimRace       = "initiateClaimRace",
    voteOnClaim             = "voteOnClaim",
    voteOnApplicant         = "voteOnApplicant",
    calcQuorum              = "calcQuorum"
}

export enum CCRCoreFactoryMethods{
    deployCCR               = "deployCCR",
    getRegistry             = "getRegistry"
}

export enum EthClaimsRegistryMethods{
    setClaim                = "setClaim",
    setSelfClaim            = "setSelfClaim",
    getClaim                = "getClaim",
    removeClaim             = "removeClaim"
}