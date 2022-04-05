import React, { FC } from 'react';

import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { useNotification } from '../common/context/NotificationContextProvider';

const size = {
	sm: {
		width: '20%',
	},
	md: {
		width: '80%',
	},
	lg: {
		width: '90%',
	},
};

const Backdrop = styled.div<{ show: boolean; centered: boolean; zIndex: number }>`
	display: ${(props) => (props.show ? 'flex' : 'none')};
	align-items: ${(props) => (props.centered ? 'center' : 'flex-start')};
	${(props) => (props.centered ? '' : 'padding-top: 4rem;')}
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	position: fixed;
	z-index: ${(props) => props.zIndex};
`;

const ModalContainer = styled.div<{
	size: 'sm' | 'md' | 'lg';
}>`
	width: ${(props) => size[props.size].width};
	background-color: #fff;
	border-radius: 0.3rem;
	padding: 1rem;
	@media (max-width: 768px) {
		width: 90%;
	}
	overflow: auto;
	max-height: 90%;
`;

const CloseButton = styled.button`
	position: relative;
	top: 0;
	left: calc(100% - 1.5rem);
	font-size: 1.5rem;
	border: none;
	background-color: transparent;
	color: #999;
	&:hover {
		color: #000;
	}
`;

interface Props {
	show: boolean;
	onHide: () => void;
	size?: 'sm' | 'md' | 'lg';
	centered?: boolean;
	closeButton?: boolean;
	zIndex?: number;
	isNotification?: boolean;
}

const Modal: FC<Props> = ({
	show,
	onHide,
	size = 'md',
	centered = false,
	closeButton = true,
	zIndex = 2,
	isNotification = false,
	children,
}) => {
	const {
		state: { show: notificationDisplayed },
	} = useNotification();

	return (
		<Backdrop show={show} centered={centered} zIndex={zIndex}>
			<OutsideClickHandler
				onOutsideClick={() => {
					if (notificationDisplayed && !isNotification) {
						return;
					}
					onHide();
				}}
				display="contents"
			>
				<ModalContainer size={size}>
					{closeButton && <CloseButton onClick={onHide}>X</CloseButton>}
					{children}
				</ModalContainer>
			</OutsideClickHandler>
		</Backdrop>
	);
};

export default Modal;
