import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoaderContextProvider from './common/context/LoaderContextProvider';
import ModalContextProvider from './common/context/ModalContextProvider';

import ErrorModal from './components/Errors/ErrorModal';
import Router from './components/Router/Router';

function App() {
    return (
        <div className="App">
            <ModalContextProvider>
                <LoaderContextProvider>
                    <ErrorBoundary FallbackComponent={ErrorModal}>
                        <Router />
                    </ErrorBoundary>
                </LoaderContextProvider>
            </ModalContextProvider>
        </div>
    );
}

export default App;
