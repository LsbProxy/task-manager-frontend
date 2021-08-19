import React, { useState, createContext } from 'react';
import { Modal } from 'react-bootstrap';

export const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
    const [state, setState] = useState({ show: false, ModalContentComponent: null });

    const hideModal = () => setState((newState) => ({ ...newState, show: false }));

    return (
        <ModalContext.Provider value={{ state, setState }}>
            {state.ModalContentComponent && (
                <Modal show={state.show} onHide={hideModal} keyboard={false} size="xl">
                    <state.ModalContentComponent hideModal={hideModal} setModalState={setState} />
                </Modal>
            )}
            {children}
        </ModalContext.Provider>
    );
};
export default ModalContextProvider;
