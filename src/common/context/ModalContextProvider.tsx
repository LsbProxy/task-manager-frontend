import React, { FC, createContext, useState } from 'react';

import { Modal } from 'react-bootstrap';

export type ModalState = {
	show: boolean;
	ModalContentComponent?: FC<{
		hideModal: () => void;
		setModalState: (state: ModalState) => void;
	}>;
};

interface ModalStore {
	state: ModalState;
	setState: (state: ModalState) => void;
}

export const ModalContext = createContext<ModalStore>({
	state: { show: false },
	setState: () => void 0,
});

const ModalContextProvider: FC = ({ children }) => {
	const [state, setState] = useState<ModalState>({
		show: false,
		ModalContentComponent: () => null,
	});

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
