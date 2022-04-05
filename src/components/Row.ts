import setMargin from '../common/utils/setMargin';
import styled from 'styled-components';

interface Props {
	align?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
	margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
	wrap?: 'wrap' | 'nowrap';
	flex?: number;
	width?: string;
	height?: string;
	gap?: string;
}

const Row = styled.div<Props>`
	display: flex;
	${(props) => (props.flex ? `flex: ${props.flex};` : '')}
	${(props) => (props.width ? `width: ${props.width};` : '')}
	${(props) => (props.height ? `height: ${props.height};` : '')}
	justify-content: ${(props) => props.align || 'center'};
	align-content: ${(props) => props.align || 'center'};
	flex-wrap: ${(props) => (props.wrap ? props.wrap : 'nowrap')};
	margin: ${(props) => setMargin(props.margin)};
	${(props) => (props.gap ? `gap: ${props.gap};` : '')}
	@media (max-width: 786px) {
		flex-direction: column;
	}
`;

export default Row;
