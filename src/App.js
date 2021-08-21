import React, { Component } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import LoaderContextProvider from './common/context/LoaderContextProvider';
import ModalContextProvider from './common/context/ModalContextProvider';
import NotificationContextProvider from './common/context/NotificationContextProvider';
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

    componentWillUnmount = () => {
        clearInterval(this.refresh);
        clearInterval(this.idleCount);
    };

    render() {
        return (
            <div className="App">
                <NotificationContextProvider>
                    <ModalContextProvider>
                        <LoaderContextProvider>
                            <ErrorBoundary FallbackComponent={ErrorModal}>
                                <Router />
                            </ErrorBoundary>
                        </LoaderContextProvider>
                    </ModalContextProvider>
                </NotificationContextProvider>
            </div>
        );
    }
}

export default App;
