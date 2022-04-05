import React, { FC } from 'react';

import setMargin from '../common/utils/setMargin';
import styled from 'styled-components';

const ToastContainer = styled.div<{
	width: string;
	height: string;
	margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
}>`
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	display: flex;
	flex-direction: column;
	border: 1px solid #d6d6d6;
	border-radius: 0.2rem;
	padding: 1rem;
	cursor: pointer;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 20px 0 rgba(0, 0, 0, 0.15);
	margin: ${(props) => setMargin(props.margin)};
`;

const HeaderWrapper = styled.div`
	border-bottom: 1px solid #d6d6d6;
	display: flex;
	margin-bottom: 0.5rem;
`;

interface Props {
	onClick?: () => void;
	Header: FC;
	Body: FC;
	width?: string;
	height?: string;
	margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
}

const Toast: FC<Props> = ({ width = 'auto', height = 'auto', onClick, margin, Header, Body }) => (
	<ToastContainer width={width} height={height} onClick={onClick} margin={margin}>
		<HeaderWrapper>
			<Header />
		</HeaderWrapper>
		<Body />
	</ToastContainer>
);

export default Toast;
