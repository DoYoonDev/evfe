import React, { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';

import { ERROR_MESSAGE } from '@/constants/error-messges';

interface State {
  page: number;
  pageSize: number;
  search: {
    id: string;
    koText: string;
    enText: string;
    isActive: boolean;
  };
}

type Action =
  | { type: 'SET_PAGE'; payload: State['page'] }
  | { type: 'SET_PAGE_SIZE'; payload: number } 
  | { type: 'SET_SEARCH'; payload: State['search'] };

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

const MessageStateContext = createContext<State | null>(null);
const MessageDispatchContext = createContext<Dispatch | null>(null);

const initialState: State = {
  page: 0,
  pageSize: 10,
  search: {
    id: '',
    koText: '',
    enText: '',
    isActive: true,
  },
};

export const useMessageState = () => {
  const context = useContext(MessageStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useMessageDispatch = () => {
  const context = useContext(MessageDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useMessageActions = () => {
  const dispatch = useMessageDispatch();
  return useMemo(() => ({
    setPage: (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
    setPageSize: (size: number) => dispatch({ type: 'SET_PAGE_SIZE', payload: size }),
    setSearch: (search: State['search']) => dispatch({ type: 'SET_SEARCH', payload: search }),
  }), [dispatch]);
};

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MessageStateContext.Provider value={state}>
      <MessageDispatchContext.Provider value={dispatch}>
        {children}
      </MessageDispatchContext.Provider>
    </MessageStateContext.Provider>
  );
};
