import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoaderContextProvider from './common/context/LoaderContextProvider';

import ErrorModal from './components/Errors/ErrorModal';
import Router from './components/Router/Router';

function App() {
    return (
        <div className="App">
            <LoaderContextProvider>
                <ErrorBoundary FallbackComponent={ErrorModal}>
                    <Router />
                </ErrorBoundary>
            </LoaderContextProvider>
        </div>
    );
}

export default App;
