import React, { ChangeEvent, FC } from 'react';

import styled from 'styled-components';

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 0.5rem;
`;

const InputElement = styled.textarea<{ height: string }>`
	height: ${(props) => props.height};
	padding: 0.5rem;
	border-radius: 0.2rem;
	border: none;
	margin-bottom: 0.5rem;
	outline: 1px solid #d6d6d6;
	&:focus {
		outline: 4px solid #b1d1f8;
	}
`;

const Label = styled.label`
	margin-bottom: 0.5rem;
`;

interface Props {
	name: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	onFocus?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder: string;
	label?: string;
	height?: string;
}

const Description: FC<Props> = ({
	height = '300px',
	label,
	value,
	onChange,
	onFocus,
	placeholder,
	name,
}) => (
	<InputGroup>
		{label && <Label>{label}</Label>}
		<InputElement
			value={value}
			onChange={onChange}
			onFocus={onFocus}
			placeholder={placeholder}
			name={name}
			height={height}
		/>
	</InputGroup>
);

export default Description;
