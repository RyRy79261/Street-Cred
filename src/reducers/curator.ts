import createReducer from './createReducer';
import { Action, ActionType, Vote, Curator } from '../model/model';
//TODO : return proper state
export const curatorList = createReducer([], {
    [ActionType.GET_CURATORS](state: Curator[], action: Action<string>) {
        return [state, action.payload];
    },
    [ActionType.VOTE_CURATOR](state: Curator, action: Action<Vote>) {
        return [state, action.payload];
    },
    [ActionType.APPLY_TO_CURATE](state: Curator[], action: Action<Curator>) {
        return [state, action.payload]
    }
});
