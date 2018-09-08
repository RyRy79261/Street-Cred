import createReducer from './createReducer';
import { Action, ActionType, Registry } from '../model/model';

export const registryList = createReducer([], {
    [ActionType.GET_REGISTRIES](state: Registry[], action: Action<null>) {
        return [state, action.payload];
    },
    [ActionType.CREATE_REGISTRY](state: Registry[], action: Action<Registry>) {
        return [state, action.payload];
    }
});
