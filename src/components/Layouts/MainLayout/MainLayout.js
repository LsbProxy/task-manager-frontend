import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Navigationbar from '../../Navbar/Navigationbar';

export default function MainLayout() {
    return (
        <div>
            <Container fluid>
                <Navigationbar />
                <Row>
                    <Col>Main Layout</Col>
                </Row>
            </Container>
        </div>
    );
}
