import { createContext, ReactNode, useContext, useReducer } from 'react';
import { type TreeItem } from 'react-complex-tree';

import { ERROR_MESSAGE } from '@/constants/error-messges';
import type { Menu } from '@/types/common/menu.ts';

type State = {
  menus: Menu[];
  selectedMenu: TreeItem<Menu> | null;
};

type Action =
  | { type: 'SET_MENUS'; payload: State['menus'] }
  | { type: 'SET_SELECTED_MENU'; payload: State['selectedMenu'] };

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MENUS':
      return { ...state, menus: action.payload };
    case 'SET_SELECTED_MENU':
      return { ...state, selectedMenu: action.payload };
    default:
      return state;
  }
};

const MenuStateContext = createContext<State | null>(null);
const MenuDispatchContext = createContext<Dispatch | null>(null);

const initialState: State = {
  menus: [],
  selectedMenu: null,
};

export const useMenuState = () => {
  const context = useContext(MenuStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useMenuDispatch = () => {
  const context = useContext(MenuDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MenuStateContext.Provider value={state}>
      <MenuDispatchContext.Provider value={dispatch}>
        {children}
      </MenuDispatchContext.Provider>
    </MenuStateContext.Provider>
  );
};
