import { Action, ActionType, ClaimRace, Registry, Vote } from '../model/model';

export function getClaims(regsitry: Registry): Action<string> {
    
    return {
        type: ActionType.GET_CLAIMS,
        payload: regsitry.address
    };
}

export function makeClaim(claim: ClaimRace): Action<ClaimRace> {
    //web3 call
    return {
        type: ActionType.CREATE_CLAIM,
        payload: claim
    };
}

export function voteOnClaim(vote: Vote, claimRace: ClaimRace): Action<Vote> {
    //web3 call
    return {
        type: ActionType.VOTE_CLAIM,
        payload: vote
    };
}