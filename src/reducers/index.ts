
import { combineReducers } from 'redux';
import * as ClaimReducer from './claim';
import * as CuratorReducer from './curator';
import * as RegistryReducer from './registry';
import { Registry } from '../model/model';

export interface RootState {
  registries: Array<Registry>;
}

export default combineReducers<RootState>({
  ...ClaimReducer,
  ...CuratorReducer,
  ...RegistryReducer
});