import React, { ChangeEvent, FC } from 'react';

import styled from 'styled-components';

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 0.5rem;
`;

const SelectElement = styled.select<Partial<Props>>`
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

export interface Option {
	value: string;
	label: string;
}

interface Props {
	multiple?: boolean;
	options: Option[];
	name: string;
	value: string | string[];
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	label?: string;
}

const Select: FC<Props> = ({ label, value, onChange, name, options, multiple = false }) => (
	<InputGroup>
		{label && <Label>{label}</Label>}
		<SelectElement value={value} onChange={onChange} name={name} multiple={multiple}>
			{options.map(({ value, label }) => (
				<option key={value} value={value}>
					{label}
				</option>
			))}
		</SelectElement>
	</InputGroup>
);

export default Select;
