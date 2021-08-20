import React, { useState, useEffect } from 'react';
import { filter, map } from 'lodash';
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';

import dashboardService from '../../common/services/DashboardService/DashboardService';
import Loader from '../Loader/Loader';

const CreateDashboardModal = ({ hideModal, refreshGrid }) => {
    const [state, setState] = useState({
        title: '',
        description: '',
        members: [],
        isLoading: false,
    });

    const showLoader = (isLoading = false) => setState((newState) => ({ ...newState, isLoading }));

    const fetchMembers = async () => {
        try {
            showLoader(true);
            const { members } = await dashboardService.getDashboard();
            setState((newState) => ({ ...newState, assignedtTo: members[0], members }));
            showLoader(false);
        } catch (e) {
            showLoader(false);
            console.log(e);
        }
    };

    useEffect(() => {
        // fetchMembers();
    }, []);

    const handleChange = ({ target: { name, value } }) => {
        setState({ ...state, [name]: value });
    };

    const handleMembersChange = ({ target: { name, value } }) => {
        const { members } = state;
        let newValue = [...members];

        if (members.indexOf(value) > -1) {
            newValue = filter(members, (member) => member !== value);
        } else {
            newValue.push(value);
        }

        setState({ ...state, [name]: newValue });
    };

    const handleCreateDashboard = async () => {
        try {
            const { title, description, members } = state;

            showLoader(true);
            await dashboardService.createDashboard({
                title,
                description,
                members,
            });
            hideModal();
            refreshGrid();
            showLoader();
        } catch (e) {
            showLoader();
            console.log(e);
        }
    };

    const renderModalBody = () => {
        const { title, description, members, isLoading } = state;

        return (
            <Modal.Body style={{ minHeight: '300px' }}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <Form>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={title}
                            onChange={handleChange}
                        />
                        <FloatingLabel
                            className="pt-1"
                            controlId="floatingTextarea2"
                            label="Description"
                        >
                            <Form.Control
                                as="textarea"
                                style={{ height: '300px' }}
                                placeholder="Description"
                                name="description"
                                value={description}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                        <Row className="pt-1">
                            <Col sm="3">
                                <Form.Label>Members:</Form.Label>
                                <Form.Control
                                    multiple
                                    as="select"
                                    name="members"
                                    value={members}
                                    onChange={handleMembersChange}
                                >
                                    {map(['admin', 'user'], (member) => (
                                        <option key={member} value={member}>
                                            {member}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal.Body>
        );
    };

    const renderModalFooter = () => (
        <Modal.Footer>
            <Button className="mt-2" variant="primary" onClick={handleCreateDashboard}>
                Create
            </Button>
        </Modal.Footer>
    );

    const renderModalHeader = () => (
        <Modal.Header closeButton>
            <strong>Create Dashboard</strong>
        </Modal.Header>
    );

    return (
        <>
            {renderModalHeader()}
            {renderModalBody()}
            {renderModalFooter()}
        </>
    );
};

export default CreateDashboardModal;
