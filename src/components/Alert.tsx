import React, { FC } from 'react';

import styled from 'styled-components';

const colors = {
	warning: {
		text: '#664d',
		bg: '#ffecb5',
	},
	danger: {
		text: '#842029',
		bg: '#f8d7da',
	},
	success: {
		text: '#0f5132',
		bg: '#badbcc',
	},
};

interface Props {
	variant: 'danger' | 'warning' | 'success';
	show?: boolean;
	dismissible?: boolean;
	onClose?: () => void;
}

const AlertContainer = styled.div<Props>`
	display: ${(props) => (props.show ? 'block' : 'none')};
	padding: 1rem;
	margin-top: 1rem;
	margin-bottom: 1rem;
	border-radius: 0.3rem;
	border: none;
	color: ${(props) => colors[props.variant].text};
	background-color: ${(props) => colors[props.variant].bg};
	word-break: break-word;
`;

AlertContainer.defaultProps = {
	show: true,
	dismissible: false,
	onClose: () => void 0,
};

const Button = styled.button`
	float: right;
	font-weight: bold;
	font-size: 1.5rem;
	border-radius: 0.3rem;
	border: none;
	color: ${colors.warning.text};
	background-color: ${colors.warning.bg};
	&:hover {
		filter: brightness(115%);
	}
`;

const Alert: FC<Props> = (props) => (
	<AlertContainer {...props}>
		{props.dismissible ? (
			<Button
				onClick={(e) => {
					e.preventDefault();
					props.onClose && props.onClose();
				}}
			>
				X
			</Button>
		) : null}
		{props.children}
	</AlertContainer>
);

export default Alert;
