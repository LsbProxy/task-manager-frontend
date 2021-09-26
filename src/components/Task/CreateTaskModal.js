import React, { useState, useEffect } from 'react';
import { isEmpty, map } from 'lodash';
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
import ErrorAlertList from '../Errors/ErrorAlertList';

const CreateTaskModal = ({
    dashboardId,
    sprintId,
    hideModal,
    refreshGrid,
    handleError,
    addNotification,
}) => {
    const [state, setState] = useState({
        author: '',
        assignedTo: '',
        title: '',
        description: '',
        status: taskStatus.todo.label,
        members: [],
        user: JSON.parse(window.localStorage.getItem('user')),
        isLoading: false,
        isSubmit: false,
        errors: [],
    });

    const showLoader = (isLoading = false) => setState((newState) => ({ ...newState, isLoading }));

    const fetchMembers = async () => {
        try {
            showLoader(true);
            const { members } = await dashboardService.getDashboard(dashboardId);
            setState((newState) => ({ ...newState, assignedTo: members[0], members }));
        } catch (e) {
            handleError(e);
        } finally {
            showLoader(false);
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

    const validateTask = () => {
        const { title } = state;
        const errors = [];

        if (!title) {
            errors.push('Title');
        }

        setState((newState) => ({ ...newState, isSubmit: true, errors }));

        return isEmpty(errors);
    };

    const handleCreateTask = async () => {
        if (!validateTask()) {
            return;
        }

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
            addNotification(`Successfully created ${title}`);
        } catch (e) {
            handleError(e);
        } finally {
            showLoader();
        }
    };

    const renderModalBody = () => {
        const { title, description, assignedTo, status, isLoading, errors } = state;

        return (
            <Modal.Body style={{ minHeight: '300px' }}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <Form>
                        <ErrorAlertList errors={errors} />
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

    const renderModalFooter = () => {
        const { isSubmit, title } = state;

        return (
            <Modal.Footer>
                <Button
                    className="mt-2"
                    variant="primary"
                    onClick={handleCreateTask}
                    disabled={isSubmit && !title}
                >
                    Create
                </Button>
            </Modal.Footer>
        );
    };

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
