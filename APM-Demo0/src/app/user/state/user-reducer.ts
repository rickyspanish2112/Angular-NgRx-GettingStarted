import { User } from '../user';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserActionTypes } from './user-actions';

export interface State extends fromRoot.State {
  user: UserState;
}

export interface UserState {
  maskUserName: boolean;
  user: User;
}

const initialState: UserState = {
  maskUserName: true,
  user: null
};

const getUserFeatureState = createFeatureSelector<UserState>('users');

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName
);

export function reducer(state = initialState, action): UserState {
  switch (action.type) {
    case UserActionTypes.MaskUserName:
    console.log('Existing state: ' + JSON.stringify(state));
    console.log('payload: ' + action.payload);
      return {
        ...state,
        maskUserName: action.payload
      };

    default:
      return state;
  }
}
