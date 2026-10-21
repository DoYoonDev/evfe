import React, { createContext, ReactNode, useContext, useReducer } from 'react';

import { ERROR_MESSAGE } from '@/constants/error-messges';

interface State {
  codeGroup: {
    page: number;
    search: {
      id: string;
      name: string;
      description: string;
      isActive: boolean;
    };
  };
}

type Action =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SEARCH'; payload: State['codeGroup']['search'] };

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        codeGroup: { ...state.codeGroup, page: action.payload },
      };
    case 'SET_SEARCH':
      return {
        ...state,
        codeGroup: { ...state.codeGroup, search: action.payload },
      };
    default:
      return state;
  }
};

const CodeGroupStateContext = createContext<State | null>(null);
const CodeGroupDispatchContext = createContext<Dispatch | null>(null);

const initialState: State = {
  codeGroup: {
    page: 0,
    search: {
      id: '',
      name: '',
      description: '',
      isActive: true,
    },
  },
};

export const useCodeGroupState = () => {
  const context = useContext(CodeGroupStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useCodeGroupDispatch = () => {
  const context = useContext(CodeGroupDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const CodeGroupProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CodeGroupStateContext.Provider value={state}>
      <CodeGroupDispatchContext.Provider value={dispatch}>
        {children}
      </CodeGroupDispatchContext.Provider>
    </CodeGroupStateContext.Provider>
  );
};
