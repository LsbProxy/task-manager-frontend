import React, { useState, createContext } from 'react';

export const LoaderContext = createContext();

const LoaderContextProvider = ({ children }) => {
    const [isLoading, showLoader] = useState(false);

    return (
        <LoaderContext.Provider
            value={{
                isLoading,
                showLoader,
            }}
        >
            {children}
        </LoaderContext.Provider>
    );
};
export default LoaderContextProvider;
