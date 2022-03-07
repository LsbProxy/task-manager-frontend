import React, { FC, useContext } from 'react';

import { Container } from 'react-bootstrap';
import Loader from '../Loader';
import { LoaderContext } from '../../common/context/LoaderContextProvider';
import Navigationbar from '../Navigationbar';

const MainLayout: FC = ({ children }) => {
	const { isLoading } = useContext(LoaderContext);

	return (
		<div>
			<Container fluid>
				<Navigationbar />
				{isLoading && <Loader />}
				<div className={isLoading ? 'invisible' : ''}>{children}</div>
			</Container>
		</div>
	);
};

export default MainLayout;
