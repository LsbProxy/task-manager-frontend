import setMargin from '../common/utils/setMargin';
import styled from 'styled-components';

interface Props {
	align?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
	margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
	wrap?: 'wrap' | 'nowrap';
	flex?: number;
	width?: string;
	height?: string;
}

const Container = styled.div<Props>`
	display: flex;
	flex-direction: column;
	justify-content: ${(props) => props.align || 'center'};
	align-content: ${(props) => props.align || 'center'};
	flex: 1;
	margin: ${(props: Props) => setMargin(props.margin)};
	${(props) => (props.flex ? `flex: ${props.flex};` : '')}
	${(props) => (props.width ? `width: ${props.width};` : '')}
	${(props) => (props.height ? `height: ${props.height};` : '')}
	flex-wrap: ${(props) => (props.wrap ? props.wrap : 'nowrap')};
`;

export default Container;
