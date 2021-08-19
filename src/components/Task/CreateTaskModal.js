import React, { useState, useEffect } from 'react';
import { map } from 'lodash';
import {
    Button,
    Col,
    Dropdown,
    DropdownButton,
    FloatingLabel,
    Form,
    InputGroup,
    Modal,
    Row,
} from 'react-bootstrap';

import taskService from '../../common/services/TaskService/TaskService';
import taskStatus from '../../common/utils/taskStatus';
import dashboardService from '../../common/services/DashboardService/DashboardService';
import Loader from '../Loader/Loader';

const CreateTaskModal = ({ dashboardId, sprintId, hideModal, refreshGrid }) => {
    const [state, setState] = useState({
        author: '',
        assignedTo: '',
        title: '',
        description: '',
        status: taskStatus.todo.label,
        members: [],
        user: JSON.parse(window.localStorage.getItem('user')),
        isLoading: false,
    });

    const showLoader = (isLoading = false) => setState((newState) => ({ ...newState, isLoading }));

    const fetchMembers = async () => {
        try {
            showLoader(true);
            const { members } = await dashboardService.getDashboard(dashboardId);
            setState((newState) => ({ ...newState, assignedtTo: members[0], members }));
            showLoader(false);
        } catch (e) {
            showLoader(false);
            console.log(e);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleChange = ({ target: { name, value } }) => {
        setState({ ...state, [name]: value });
    };

    const handleDropdownItemClick = (name, value) => () =>
        handleChange({ target: { name, value } });

    const handleCreateTask = async () => {
        try {
            const { title, description, assignedTo, status, user } = state;

            showLoader(true);
            await taskService.createTask({
                title,
                description,
                assignedTo,
                status,
                author: user.username,
                dashboard: dashboardId,
                sprint: sprintId,
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
        const { title, description, assignedTo, status, isLoading } = state;

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
                                <FloatingLabel controlId="floatingSelect" label="Assigned to:">
                                    <Form.Select
                                        onChange={handleChange}
                                        name="assignedTo"
                                        value={assignedTo}
                                    >
                                        {map(state.members, (member) => (
                                            <option key={member} value={member}>
                                                {member}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col sm="3" className="my-auto pt-1">
                                <InputGroup>
                                    <InputGroup.Text>Status:</InputGroup.Text>
                                    <DropdownButton
                                        id="dropdown-basic-button"
                                        title={<strong>{status}</strong>}
                                        value={status}
                                    >
                                        {map(taskStatus, ({ label }) => (
                                            <Dropdown.Item
                                                key={label}
                                                onClick={handleDropdownItemClick('status', label)}
                                            >
                                                {label}
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal.Body>
        );
    };

    const renderModalFooter = () => (
        <Modal.Footer>
            <Button className="mt-2" variant="primary" onClick={handleCreateTask}>
                Create
            </Button>
        </Modal.Footer>
    );

    const renderModalHeader = () => (
        <Modal.Header closeButton>
            <strong>Create Task</strong>
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

export default CreateTaskModal;
