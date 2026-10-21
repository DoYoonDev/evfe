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

const RoleStateContext = createContext<State | null>(null);
const RoleDispatchContext = createContext<Dispatch | null>(null);

const initialState: State = {
  selectedRole: null
};

export const useRoleState = () => {
  const context = useContext(RoleStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useRoleDispatch = () => {
  const context = useContext(RoleDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RoleStateContext.Provider value={state}>
      <RoleDispatchContext.Provider value={dispatch}>
        {children}
      </RoleDispatchContext.Provider>
    </RoleStateContext.Provider>
  );
};
