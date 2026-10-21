import React, { createContext, ReactNode, useContext, useReducer } from 'react';

import { ERROR_MESSAGE } from '@/constants/error-messges';

type State = {
  code: {
    page: number;
    search: {
      id: string;
      groupId: string;
      name: string;
      description: string;
      isActive: boolean;
    }
  };
};

type Action =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SEARCH'; payload: State['code']['search'] }

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, code: { ...state.code, page: action.payload } };
    case 'SET_SEARCH':
      return { ...state, code: { ...state.code, search: action.payload } };
    default:
      return state;
  }
};

const CodeStateContext = createContext<State | null>(null);
const CodeDispatchContext = createContext<Dispatch | null>(null);

const initialState: State = {
  code: {
    page: 0,
    search: {
      id: '',
      groupId: '',
      name: '',
      description: '',
      isActive: true,
    },
  },
};

export const useCodeState = () => {
  const context = useContext(CodeStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useCodeDispatch = () => {
  const context = useContext(CodeDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CodeStateContext.Provider value={state}>
      <CodeDispatchContext.Provider value={dispatch}>
        {children}
      </CodeDispatchContext.Provider>
    </CodeStateContext.Provider>
  );
};
