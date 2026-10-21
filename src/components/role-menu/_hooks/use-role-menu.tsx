import { createContext, ReactNode, useContext, useReducer } from 'react';

import { ERROR_MESSAGE } from '@/constants/error-messges';
import type { Role, RoleMenu } from '@/types/admin/role.ts';

interface State {
  selectedRole: Role | null;
  roleMenus: RoleMenu[];
}

type Action =
  | { type: 'SET_SELECTED_ROLE'; payload: State['selectedRole'] }
  | { type: 'SET_ROLE_MENUS'; payload: State['roleMenus'] };

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SELECTED_ROLE':
      return { ...state, selectedRole: action.payload };
    case 'SET_ROLE_MENUS':
      return { ...state, roleMenus: action.payload };
    default:
      return state;
  }
};

const RoleMenuStateContext = createContext<State | null>(null);
const RoleMenuDispatchContext = createContext<Dispatch | null>(null);

const initialState: State = {
  selectedRole: null,
  roleMenus: [],
};

export const useRoleMenuState = () => {
  const context = useContext(RoleMenuStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useRoleMenuDispatch = () => {
  const context = useContext(RoleMenuDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const RoleMenuProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RoleMenuStateContext.Provider value={state}>
      <RoleMenuDispatchContext.Provider value={dispatch}>
        {children}
      </RoleMenuDispatchContext.Provider>
    </RoleMenuStateContext.Provider>
  );
};
