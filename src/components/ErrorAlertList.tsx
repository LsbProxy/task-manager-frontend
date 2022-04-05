import React, { FC } from 'react';

import Alert from './Alert';
import { get } from 'lodash';
import styled from 'styled-components';

const ScrollableContainer = styled.div`
	max-height: 15rem;
	overflow: auto;
`;

export interface AlertError {
	message?: string;
	field?: string;
	error?: string;
	standalone?: boolean;
	isApiError?: boolean;
	invalid?: boolean;
}

export type Errors = (string | AlertError)[];

interface Props {
	errors: Errors;
}

const ErrorAlertList: FC<Props> = ({ errors }) => (
	<ScrollableContainer>
		{errors.map((err) => {
			const invalid: boolean = get(err, 'invalid', false);
			const error: string =
				typeof err === 'string'
					? err
					: get(err, 'message') || get(err, 'field') || get(err, 'error');
			const isStandalone: boolean = get(err, 'standalone', false) || get(err, 'isApiError', false);

			return (
				<Alert variant="danger" key={error}>
					{!isStandalone && error ? (
						<>
							<strong>{error}</strong>
							{` is ${invalid ? 'invalid' : 'required'}.`}
						</>
					) : (
						<strong>{error || 'Error - Something went wrong'}</strong>
					)}
				</Alert>
			);
		})}
	</ScrollableContainer>
);

export default ErrorAlertList;
