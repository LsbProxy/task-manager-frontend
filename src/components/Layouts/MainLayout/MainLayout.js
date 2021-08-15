import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Navigationbar from '../../Navbar/Navigationbar';

export default function MainLayout({ children }) {
    return (
        <div>
            <Container fluid>
                <Navigationbar />
                <Row>
                    <Col>{children}</Col>
                </Row>
            </Container>
        </div>
    );
}

MainLayout.defaultProps = {
    children: null,
};

MainLayout.propTypes = {
    children: PropTypes.elementType,
};
