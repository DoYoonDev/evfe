import React, { createContext, ReactNode, useContext, useReducer } from 'react';

import { ERROR_MESSAGE } from '@/constants/error-messges';

interface State {
  isOpen: boolean;
}

type Action = { type: 'OPEN' } | { type: 'CLOSE' };

type Dispatch = React.Dispatch<Action>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

const DialogStateContext = createContext<State | null>(null);
const DialogDispatchContext = createContext<Dispatch | null>(null);

export const useDialogState = () => {
  const context = useContext(DialogStateContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

export const useDialogDispatch = () => {
  const context = useContext(DialogDispatchContext);
  if (!context) throw new Error(ERROR_MESSAGE.PROVIDER_NOT_FOUND);
  return context;
};

const initialState: State = {
  isOpen: false,
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DialogStateContext.Provider value={state}>
      <DialogDispatchContext.Provider value={dispatch}>
        {children}
      </DialogDispatchContext.Provider>
    </DialogStateContext.Provider>
  );
};
