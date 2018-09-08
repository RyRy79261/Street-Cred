import { Action, ActionType, Curator, Registry, Vote } from '../model/model';

export function getCurators(regsitry: Registry): Action<string> {
    return {
        type: ActionType.GET_CURATORS,
        payload: regsitry.address
    };
}

export function voteCurator(curator: Curator, vote: Vote): Action<Vote> {
    return {
        type: ActionType.VOTE_CURATOR,
        payload: vote
    };
}

export function applyToCurate(curator: Curator): Action<Curator> {
    return {
        type: ActionType.APPLY_TO_CURATE,
        payload: curator
    };
}