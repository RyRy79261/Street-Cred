import { Action, ActionType, Registry} from '../model/model';
import  CCRCoreFactoryService from '../services/ccrCoreFactory.service';

const emptyRegistry = {name: '', address: '', amCurator: false, claimList: {claimRaces: [], claimSets: []}, curators: []};

export function getRegistries(uportService: any): Action<Registry[]> {
    //web3 call
    let ccrCoreFactory = new CCRCoreFactoryService(uportService);
    let returnRegs = [emptyRegistry];
    ccrCoreFactory.getRegistries().then((registries) => {
        registries.forEach(reg =>  emptyRegistry.name = reg);
    });
    return {
        type: ActionType.GET_REGISTRIES,
        payload: returnRegs
    };
}

export function addRegistry(name: string): Action<Registry> {

    var registry = {name: name, address: '', amCurator: true, claimList: {claimRaces: [], claimSets: []}, curators: []};
    return {
        type: ActionType.CREATE_REGISTRY,
        payload: registry
    };
}

