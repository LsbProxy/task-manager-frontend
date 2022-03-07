import { Alert, Modal } from 'react-bootstrap';
import React, { FC, createContext, useState } from 'react';
import { first, get, isEmpty } from 'lodash';

export interface Error {
	error: string[];
	message: string;
}

interface NotificationStore {
	closeNotification: () => void;
	addNotification: (notification: string) => void;
	handleError: (err: Error) => void;
}

interface State {
	show: boolean;
	success: boolean;
	notification?: string;
}

export const NotificationContext = createContext<NotificationStore>({
	closeNotification: () => void 0,
	addNotification: (notification: string) => void notification,
	handleError: (err: Error) => void err,
});

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
		<NotificationContext.Provider value={{ closeNotification, addNotification, handleError }}>
			{state.notification && (
				<Modal show={state.show} onHide={closeNotification} keyboard={false} centered>
					<Modal.Body>
						<Alert variant={state.success ? 'success' : 'danger'} className="text-wrap m-auto">
							{state.notification}
						</Alert>
					</Modal.Body>
				</Modal>
			)}
			{children}
		</NotificationContext.Provider>
	);
};
export default NotificationContextProvider;
