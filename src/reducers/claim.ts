import createReducer from './createReducer';
import { Action, ActionType, Vote, ClaimRace, Registry, ClaimList } from '../model/model';

export const claimList = createReducer([], {
    [ActionType.GET_CLAIMS](state: ClaimList, action: Action<string>) {
        return [state, action.payload];
    },
    [ActionType.VOTE_CLAIM](state: ClaimRace, action: Action<Vote>) {
        return [state, action.payload];
    },
    [ActionType.CREATE_CLAIM](state: Registry, action: Action<ClaimRace>) {
        return [state, action.payload]
    }
});
