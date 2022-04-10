import styled from 'styled-components';

interface Color {
	text: string;
	bg: string;
	hoverBg: string;
	border?: string;
}

const colors: Record<string, Color> = {
	primary: {
		text: '#fff',
		bg: '#0b5ed7',
		hoverBg: '#2478f2',
	},
	secondary: {
		text: '#000',
		bg: '#ffc107',
		hoverBg: '#facc43',
	},
	warning: {
		text: '#fff',
		bg: '#dc3545',
		hoverBg: '#e35664',
	},
	'outline-primary': {
		text: '#0b5ed7',
		bg: 'transparent',
		hoverBg: '#f7f7f7',
	},
	'outline-warning': {
		text: '#ff081f',
		bg: 'transparent',
		hoverBg: '#f7f7f7',
		border: '#ff081f',
	},
	'outline-info': {
		text: '#00d5ff',
		bg: 'transparent',
		hoverBg: '#f7f7f7',
		border: '#00d5ff',
	},
};

const fontSize = {
	sm: 0.75,
	md: 1,
	lg: 1.2,
};

export const ButtonGroup = styled.div<{ gap?: string }>`
	display: flex;
	justify-content: space-between;
	${(props) => (props.gap ? `gap: ${props.gap};` : '')}
`;

interface Props {
	variant?:
		| 'primary'
		| 'outline-primary'
		| 'secondary'
		| 'warning'
		| 'outline-info'
		| 'outline-warning';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
}

const Button = styled.button<Props>`
	font-size: ${(props) => props.size && fontSize[props.size]}rem;
	font-weight: 500;
	padding: 0.5rem;
	border-radius: 0.3rem;
	border: none;
	color: ${(props) => props.variant && colors[props.variant].text};
	background-color: ${(props) => props.variant && colors[props.variant].bg};
	${(props) =>
		props.variant &&
		colors[props.variant].border &&
		`border: 1px solid ${colors[props.variant].border};`}
	&:hover {
		background-color: ${(props) => props.variant && colors[props.variant].hoverBg};
	}
	cursor: pointer;
`;

Button.defaultProps = {
	variant: 'primary',
	size: 'md',
	disabled: false,
};

export default Button;
