import * as ClaimActions from './claim';
import * as CuratorActions from './curator';
import * as RegistryActions from './registry';

export const ActionCreators = Object.assign({}, ClaimActions, CuratorActions, RegistryActions);
