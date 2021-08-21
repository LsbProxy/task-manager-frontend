import { first, isEmpty } from 'lodash';
import React, { useState, createContext } from 'react';
import { Alert, Modal } from 'react-bootstrap';

export const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {
    const [state, setState] = useState({ show: false, success: false, notification: null });

    const closeNotification = () => setState({ show: false, notification: null });

    const addNotification = (notification) => setState({ show: true, success: true, notification });

    const handleError = (err) => {
        if (err && (!isEmpty(err.error) || err.message)) {
            let error = first(err.error) || err.message;

            if (err.error && err.error.length > 1) {
                error = err.error.join(`\n`);
            }

            setState({ show: true, success: false, notification: error });
        }
    };

    return (
        <NotificationContext.Provider value={{ closeNotification, addNotification, handleError }}>
            {state.notification && (
                <Modal show={state.show} onHide={closeNotification} keyboard={false} centered>
                    <Modal.Body>
                        <Alert
                            variant={state.success ? 'success' : 'danger'}
                            className="text-wrap m-auto"
                        >
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
