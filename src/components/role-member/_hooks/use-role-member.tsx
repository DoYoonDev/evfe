import { createContext, ReactNode, useContext, useReducer } from 'react';

import { ERROR_MESSAGE } from '@/constants/error-messges';
import type { Role } from '@/types/admin/role.ts';

interface State {
  selectedRole: Role | null;
}

type Action = { type: 'SET_SELECTED_ROLE'; payload: State['selectedRole'] };

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SELECTED_ROLE':
      return { ...state, selectedRole: action.payload };
    default:
      return state;
  }
};

const RoleMemberStateContext = createContext<State | null>(null);
const RoleMemberDispatchContext = createContext<Dispatch | null>(null);

const initialState: State = {
  selectedRole: null,
};

export const useRoleMemberState = () => {
  const context = useContext(RoleMemberStateContext);
 if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useRoleMemberDispatch = () => {
  const context = useContext(RoleMemberDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const RoleMemberProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RoleMemberStateContext.Provider value={state}>
      <RoleMemberDispatchContext.Provider value={dispatch}>
        {children}
      </RoleMemberDispatchContext.Provider>
    </RoleMemberStateContext.Provider>
  );
};
