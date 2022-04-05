import setMargin from '../common/utils/setMargin';
import styled from 'styled-components';

interface Props {
	align?: 'right' | 'left' | 'center';
	margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
	wrap?: 'wrap' | 'nowrap';
	color?: string;
}

const Text = styled.p<Props>`
	font-size: 1rem;
	${(props) => (props.color ? `color: ${props.color};` : '')}
	text-align: ${(props) => (props.align ? props.align : 'left')};
	white-space: ${(props) => (props.wrap ? props.wrap : 'nowrap')};
	word-break: break-word;
	user-select: none;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: ${(props) => setMargin(props.margin)};
`;

export default Text;
