import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import routes from './routes';

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                {routes.map(({ component, exact = false, path, layout: Layout }) => (
                    <Route exact={exact} path={path}>
                        <Layout>{component}</Layout>
                    </Route>
                ))}
            </Switch>
        </BrowserRouter>
    );
}
