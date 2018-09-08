import { Action, ActionType, Registry} from '../model/model';

const emptyRegistry = {name: '', address: '', amCurator: false, claimList: {claimRaces: [], claimSets: []}, curators: []};

export function getRegistries(): Action<Registry[]> {
    //web3 call
    return {
        type: ActionType.GET_REGISTRIES,
        payload: [emptyRegistry]
    };
}

export function addRegistry(name: string): Action<Registry> {
    //web3 call
    var registry = {name: name, address: '', amCurator: true, claimList: {claimRaces: [], claimSets: []}, curators: []};
    return {
        type: ActionType.CREATE_REGISTRY,
        payload: registry
    };
}

