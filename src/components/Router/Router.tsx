import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import React, { FC } from 'react';

import Page404 from './Page404';
import routes from './routes';

const Router: FC = () => (
	<BrowserRouter>
		<Switch>
			{routes.map(({ layout: Layout, component: Component, exact = false, path, isPublic }) => (
				<Route key={path} exact={exact} path={path}>
					{(() => {
						const user = window.localStorage.getItem('user');

						if (!isPublic && !user) {
							return <Redirect to="/login" />;
						}

						if (user && path === '/login') {
							return <Redirect to="/" />;
						}

						return <Layout>{Component && <Component />}</Layout>;
					})()}
				</Route>
			))}
			<Route component={Page404} />
		</Switch>
	</BrowserRouter>
);

export default Router;
