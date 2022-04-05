import React, { FC, createContext, useContext, useState } from 'react';

import Modal from '../../components/Modal';

export type ModalState = {
	show: boolean;
	ModalContentComponent: FC<{
		hideModal: () => void;
		setModalState: (state: ModalState) => void;
	}>;
};

interface ModalStore {
	state: ModalState;
	setState: (state: ModalState) => void;
}

const ModalContext = createContext<ModalStore>({
	state: { ModalContentComponent: () => null, show: false },
	setState: () => void 0,
});

export const useModal = (): ModalStore => useContext(ModalContext);

const ModalContextProvider: FC = ({ children }) => {
	const [state, setState] = useState<ModalState>({
		show: false,
		ModalContentComponent: () => null,
	});

	const hideModal = () => setState({ ModalContentComponent: () => null, show: false });

	return (
		<ModalContext.Provider value={{ state, setState }}>
			<Modal show={state.show} onHide={hideModal}>
				<state.ModalContentComponent hideModal={hideModal} setModalState={setState} />
			</Modal>
			{children}
		</ModalContext.Provider>
	);
};

export default ModalContextProvider;
