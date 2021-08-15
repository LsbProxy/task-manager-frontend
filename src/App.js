import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import isLoadingContext from './common/context/isLoadingContext';

import ErrorModal from './components/ErrorModal/ErrorModal';
import Router from './components/Router/Router';

function App() {
    const [isLoading, useLoading] = useState(false);
    const toggleLoading = (value) => useLoading(value);

    return (
        <div className="App">
            <isLoadingContext.Provider value={{ isLoading, toggleLoading }}>
                <ErrorBoundary FallbackComponent={ErrorModal}>
                    <Router />
                </ErrorBoundary>
            </isLoadingContext.Provider>
        </div>
    );
}

export default App;
