import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { LoaderContext } from '../../../common/context/LoaderContextProvider';
import Loader from '../../Loader/Loader';

export default function PublicLayout({ children }) {
    const { isLoading } = useContext(LoaderContext);

    return (
        <div>
            <Container fluid>
                {isLoading && <Loader />}
                <div className={isLoading ? 'invisible' : ''}>{children}</div>
            </Container>
        </div>
    );
}
