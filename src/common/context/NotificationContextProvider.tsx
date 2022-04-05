import React, { FC, createContext, useContext, useState } from 'react';
import { first, get, isEmpty } from 'lodash';

import Alert from '../../components/Alert';
import Container from '../../components/Container';
import Modal from '../../components/Modal';

export interface Error {
	error: string[];
	message: string;
}

interface NotificationStore {
	closeNotification: () => void;
	addNotification: (notification: string) => void;
	handleError: (err: Error) => void;
	state: State;
}

interface State {
	show: boolean;
	success: boolean;
	notification?: string;
}

const NotificationContext = createContext<NotificationStore>({
	closeNotification: () => void 0,
	addNotification: (notification: string) => void notification,
	handleError: (err: Error) => void err,
	state: { show: false, success: false },
});

export const useNotification = (): NotificationStore => useContext(NotificationContext);

const NotificationContextProvider: FC = ({ children }) => {
	const [state, setState] = useState<State>({ show: false, success: false });

	const closeNotification = () => setState({ ...state, show: false, notification: '' });

	const addNotification = (notification: string) =>
		setState({ show: true, success: true, notification });

	const handleError = (err: Error) => {
		if (err && (!isEmpty(err.error) || err.message)) {
			let error = first(err.error) || err.message;

			if (err.error && err.error.length > 1) {
				error = err.error.join('\n');
			}

			setState({ show: true, success: false, notification: get(error, 'message') });
		}
	};

	return (
		<NotificationContext.Provider
			value={{ closeNotification, addNotification, handleError, state }}
		>
			{state.notification && (
				<Modal
					show={state.show}
					onHide={closeNotification}
					centered={true}
					size="sm"
					zIndex={3}
					isNotification={true}
				>
					<Container>
						<Alert variant={state.success ? 'success' : 'danger'}>{state.notification}</Alert>
					</Container>
				</Modal>
			)}
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationContextProvider;
