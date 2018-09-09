export const name = () => { return {} }

export const curatorCount = () => { return {} }

export const isCurator = (_subject: string) => { 
    return {
        subject: _subject
    } 
}

export const requestClaimRace = (_claim: string) => { 
    return {
        claim: _claim
    } 
}

export const cancelClaimRace = (_claim: string) => { 
    return {
        claim: _claim
    } 
}

export const revokeClaim = (_claim: string) => { 
    return {
        claim: _claim
    } 
}

export const getClaimState = (_subject: string, _claim: string) => { 
    return {
        subject: _subject,
        claim: _claim
    } 
}

export const getCuratorState = (_subject: string) => { 
    return {
        subject: _subject
    }
}

export const addCurator = (_newCurator: string) => { 
    return {
        newCurator: _newCurator
    } 
}

export const joinCurators = () => { return {} }

export const initiateRevokeClaim = (_subject: string, _claim: string) => { 
    return {
        subject: _subject,
        claim: _claim
    } 
}

export const initiateClaimRace = (_subject: string, _claim: string) => { 
    return {
        subject: _subject,
        claim: _claim
    } 
}

export const voteOnClaim = (_subject: string, _claim: string, _support: string) => { 
    return {
        subject: _subject,
        claim: _claim,
        support: _support
    } 
}

export const voteOnApplicant = (_subject: string, _support: string) => { 
    return {
        subject: _subject,
        support: _support
    } 
}

export const calcQuorum = (_voterCount: string, _quorum: string) => { 
    return {
        voterCount: _voterCount,
        quorum: _quorum
    } 
}