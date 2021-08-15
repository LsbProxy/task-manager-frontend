import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorModal from './components/ErrorModal/ErrorModal';
import Router from './components/Router/Router';

function App() {
    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorModal}>
                <Router />
            </ErrorBoundary>
        </div>
    );
}

export default App;
