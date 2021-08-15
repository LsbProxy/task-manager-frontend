import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import Page404 from './Page404';
import routes from './routes';
import isLoadingContext from '../../common/context/isLoadingContext';

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                {routes.map(
                    ({ layout: Layout, component: Component, exact = false, path, isPublic }) => (
                        <Route key={path} exact={exact} path={path}>
                            {(() => {
                                const user = window.localStorage.getItem('user');

                                if (!isPublic && !user) {
                                    return <Redirect to="/login" />;
                                }

                                if (user && path === '/login') {
                                    return <Redirect to="/" />;
                                }

                                return (
                                    <isLoadingContext.Consumer>
                                        {({ isLoading, toggleLoading }) => (
                                            <Layout>
                                                {isLoading ? (
                                                    <Spinner
                                                        animation="border"
                                                        variant="primary"
                                                        style={{
                                                            position: 'absolute',
                                                            top: 'calc(50% - 16px)',
                                                            left: 'calc(50% - 16px)',
                                                        }}
                                                    />
                                                ) : (
                                                    Component && (
                                                        <Component toggleLoading={toggleLoading} />
                                                    )
                                                )}
                                            </Layout>
                                        )}
                                    </isLoadingContext.Consumer>
                                );
                            })()}
                        </Route>
                    ),
                )}
                <Route component={Page404} />
            </Switch>
        </BrowserRouter>
    );
}
