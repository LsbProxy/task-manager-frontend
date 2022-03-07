import React, { FC, useCallback, useEffect } from 'react';

import LoaderContextProvider from './common/context/LoaderContextProvider';
import ModalContextProvider from './common/context/ModalContextProvider';
import NotificationContextProvider from './common/context/NotificationContextProvider';
import Router from './components/Router/Router';
import authService from './common/services/AuthService';
import { get } from 'lodash';

const halfHour = 300000;
const refreshTokenLimit = 290000;

const App: FC = () => {
	const user = JSON.parse(window.localStorage.getItem('user') || '{}');
	const refreshToken = get(user, 'tokens.refresh');

	const setAutoRefreshInterval = useCallback(() => {
		if (refreshToken) {
			return setInterval(async () => {
				const tokens = await authService.refreshToken(refreshToken);
				window.localStorage.setItem('user', JSON.stringify({ ...user, tokens }));
			}, refreshTokenLimit);
		}
	}, [user, refreshToken]);

	const setIdleCounter = useCallback(() => {
		if (user) {
			return setInterval(() => {
				const parsedLastTimeStamp = Date.parse(
					JSON.parse(window.localStorage.getItem('lastTimeStamp') || '{}'),
				);
				const lastTimeStamp = new Date(parsedLastTimeStamp).getMilliseconds();
				const currentTimeStamp = new Date().getMilliseconds();
				const idleTime = currentTimeStamp - lastTimeStamp;

				if (idleTime > halfHour) {
					window.location.href = '/logout';
				}
			}, halfHour);
		}
	}, [user]);

	useEffect(() => {
		const refreshInterval = setAutoRefreshInterval();
		const idleCount = setIdleCounter();
		return () => {
			refreshInterval && clearInterval(refreshInterval);
			idleCount && clearInterval(idleCount);
		};
	}, []);

	return (
		<div className="App">
			<NotificationContextProvider>
				<ModalContextProvider>
					<LoaderContextProvider>
						<Router />
					</LoaderContextProvider>
				</ModalContextProvider>
			</NotificationContextProvider>
		</div>
	);
};

export default App;
