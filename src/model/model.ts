
export interface Vote {
    against: boolean, //against or for
    target: string
}

export interface ClaimRace {
    pending: boolean,
    statement: string, //what they are stating in claim
    target: string, //the registry its applying to
    address: string, //claim submitters address
    owner: boolean //whether user is owner
}

export interface ClaimSet {
    statement: string, //what they are stating in claim
    target: number, //the registry its applying to
    address: string,
    value: number //bool whether they are in or not
}

export interface ClaimList {
    claimRaces: ClaimRace[],
    claimSets: ClaimSet[]
}

export interface Curator {
    address: string,
    pending: boolean,
    validated: boolean,
    target: string, //the registry its applying to,
    owner: boolean //whether user is owner
}

export interface Registry {
    name: string,
    address: string,
    amCurator: boolean,
    claimList: ClaimList,
    curators: Curator[]
}

export enum ActionType {
    GET_REGISTRY,
    GET_REGISTRIES,
    CREATE_REGISTRY,
    GET_CLAIM,
    GET_CLAIMS,
    VOTE_CLAIM,
    CREATE_CLAIM,
    GET_CURATOR,
    GET_CURATORS,
    VOTE_CURATOR,
    APPLY_TO_CURATE   
}

export interface Action<T> {
    type: ActionType;
    payload: T;
}