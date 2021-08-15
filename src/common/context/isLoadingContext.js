import { createContext } from 'react';

const isLoadingContext = createContext({ isLoading: false, toggleLoading: () => {} });

export default isLoadingContext;
