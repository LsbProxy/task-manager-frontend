import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { LoaderContext } from '../../../common/context/LoaderContextProvider';
import Loader from '../../Loader/Loader';

import Navigationbar from '../../Navbar/Navigationbar';

export default function MainLayout({ children }) {
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
}
