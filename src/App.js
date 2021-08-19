import React, { Component } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoaderContextProvider from './common/context/LoaderContextProvider';
import ModalContextProvider from './common/context/ModalContextProvider';
import autoRefreshToken from './common/utils/autoRefreshToken';
import idleCounter from './common/utils/idleCounter';

import ErrorModal from './components/Errors/ErrorModal';
import Router from './components/Router/Router';

class App extends Component {
    constructor() {
        super();

        this.autoRefreshToken = autoRefreshToken.bind(this);
        this.idleCounter = idleCounter.bind(this);
    }

    componentDidMount() {
        this.autoRefreshToken();
        this.idleCounter();
    }

    render() {
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
}

export default App;
