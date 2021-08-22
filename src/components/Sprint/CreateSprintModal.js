import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';

import Loader from '../Loader/Loader';
import sprintService from '../../common/services/SprintService/SprintService';
import ErrorAlertList from '../Errors/ErrorAlertList';

const CreateSprintModal = ({
    hideModal,
    refreshGrid,
    dashboardId,
    handleError,
    addNotification,
}) => {
    const [state, setState] = useState({
        title: '',
        description: '',
        isLoading: false,
        isSubmit: false,
        errors: [],
    });

    const showLoader = (isLoading = false) => setState((newState) => ({ ...newState, isLoading }));

    const handleChange = ({ target: { name, value } }) => {
        setState({ ...state, [name]: value });
    };

    const validateSprint = () => {
        const { title } = state;
        const errors = [];

        if (!title) {
            errors.push('Title');
        }

        setState((newState) => ({ ...newState, isSubmit: true, errors }));

        return isEmpty(errors);
    };

    const handleCreateSprint = async () => {
        if (!validateSprint()) {
            return;
        }

        try {
            const { title, description } = state;

            showLoader(true);
            await sprintService.createSprint({
                title,
                description,
                dashboard: dashboardId,
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
        const { title, description, isLoading, errors } = state;

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
                    </Form>
                )}
            </Modal.Body>
        );
    };

    const renderModalFooter = () => {
        const { title, isSubmit } = state;

        return (
            <Modal.Footer>
                <Button
                    className="mt-2"
                    variant="primary"
                    onClick={handleCreateSprint}
                    disabled={isSubmit && !title}
                >
                    Create
                </Button>
            </Modal.Footer>
        );
    };

    const renderModalHeader = () => (
        <Modal.Header closeButton>
            <strong>Create Sprint</strong>
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

export default CreateSprintModal;
