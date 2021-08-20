import React, { useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';

import Loader from '../Loader/Loader';
import sprintService from '../../common/services/SprintService/SprintService';

const CreateSprintModal = ({ hideModal, refreshGrid, dashboardId }) => {
    const [state, setState] = useState({
        title: '',
        description: '',
        isLoading: false,
    });

    const showLoader = (isLoading = false) => setState((newState) => ({ ...newState, isLoading }));

    const handleChange = ({ target: { name, value } }) => {
        setState({ ...state, [name]: value });
    };

    const handleCreateSprint = async () => {
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
            showLoader();
        } catch (e) {
            showLoader();
            console.log(e);
        }
    };

    const renderModalBody = () => {
        const { title, description, isLoading } = state;

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
                    </Form>
                )}
            </Modal.Body>
        );
    };

    const renderModalFooter = () => (
        <Modal.Footer>
            <Button className="mt-2" variant="primary" onClick={handleCreateSprint}>
                Create
            </Button>
        </Modal.Footer>
    );

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
