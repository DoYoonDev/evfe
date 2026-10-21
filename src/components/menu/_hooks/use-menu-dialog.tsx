import React, { createContext, useContext, useReducer } from 'react';
import { TreeItem } from 'react-complex-tree';

import { ERROR_MESSAGE } from '@/constants/error-messges';
import type { Menu } from '@/types/common/menu.ts';

interface State {
  isOpen: boolean;
  menuName: string | null;
  parentMenu: TreeItem<Menu> | null;
}

type Action =
  | { type: 'OPEN'; payload: State['parentMenu'] }
  | { type: 'CLOSE' }
  | { type: 'SET_MENU'; payload: State['menuName'] };

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        isOpen: true,
        parentMenu: action.payload,
      };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'SET_MENU':
      return { ...state, isOpen: true, menuName: action.payload };
    default:
      return state;
  }
};

const MenuDialogStateContext = createContext<State | null>(null);
const MenuDialogDispatchContext = createContext<Dispatch | null>(null);

export const useMenuDialogState = () => {
  const context = useContext(MenuDialogStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useMenuDialogDispatch = () => {
  const context = useContext(MenuDialogDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

const initialState: State = {
  isOpen: false,
  menuName: null,
  parentMenu: null,
};

export const MenuDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MenuDialogStateContext.Provider value={state}>
      <MenuDialogDispatchContext.Provider value={dispatch}>
        {children}
      </MenuDialogDispatchContext.Provider>
    </MenuDialogStateContext.Provider>
  );
};
