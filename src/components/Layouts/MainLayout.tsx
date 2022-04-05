import React, { FC } from 'react';

import Loader from '../Loader';
import Navigationbar from '../Navigationbar';
import styled from 'styled-components';
import { useLoader } from '../../common/context/LoaderContextProvider';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const Container = styled.div<{ visible: boolean }>`
	display: ${(props) => (props.visible ? 'flex' : 'none')};
	height: 100%;
`;

const MainLayout: FC = ({ children }) => {
	const { isLoading } = useLoader();

	return (
		<Wrapper>
			<Navigationbar />
			{isLoading && <Loader centered={true} />}
			<Container visible={!isLoading}>{children}</Container>
		</Wrapper>
	);
};

export default MainLayout;
