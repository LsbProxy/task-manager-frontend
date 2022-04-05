import React, { FC } from 'react';

import Loader from '../Loader';
import styled from 'styled-components';
import { useLoader } from '../../common/context/LoaderContextProvider';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Container = styled.div<{ visible: boolean }>`
	display: ${(props) => (props.visible ? 'block' : 'none')};
	width: 30%;
	@media (max-width: 768px) {
		width: 100%;
	}
`;

const PublicLayout: FC = ({ children }) => {
	const { isLoading } = useLoader();

	return (
		<Wrapper>
			{isLoading && <Loader centered={true} />}
			<Container visible={!isLoading}>{children}</Container>
		</Wrapper>
	);
};

export default PublicLayout;
