import React, { FC, useContext } from 'react';

import { Container } from 'react-bootstrap';
import Loader from '../Loader';
import { LoaderContext } from '../../common/context/LoaderContextProvider';

const PublicLayout: FC = ({ children }) => {
	const { isLoading } = useContext(LoaderContext);

	return (
		<div>
			<Container fluid>
				{isLoading && <Loader />}
				<div className={isLoading ? 'invisible' : ''}>{children}</div>
			</Container>
		</div>
	);
};

export default PublicLayout;
