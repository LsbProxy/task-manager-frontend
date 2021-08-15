import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function PublicLayout({ children }) {
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>{children}</Col>
                </Row>
            </Container>
        </div>
    );
}

PublicLayout.defaultProps = {
    children: null,
};

PublicLayout.propTypes = {
    children: PropTypes.element,
};
