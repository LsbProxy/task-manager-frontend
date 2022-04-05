import React, { ChangeEvent, FC } from 'react';

import styled from 'styled-components';

interface Props {
	type: 'text' | 'email' | 'password';
	name: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	label?: string;
	size?: 'sm' | 'md' | 'lg';
}

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

const InputElement = styled.input`
	padding: 0.5rem;
	border-radius: 0.2rem;
	border: none;
	outline: 1px solid #d6d6d6;
	&:focus {
		outline: 4px solid #b1d1f8;
	}
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
`;

const Input: FC<Props> = ({ label, value, onChange, onFocus, type, placeholder, name }) => (
	<InputGroup>
		{label && <label>{label}</label>}
		<InputElement
			type={type}
			value={value}
			onChange={onChange}
			onFocus={onFocus}
			placeholder={placeholder}
			name={name}
		/>
	</InputGroup>
);

export default Input;
