import React, { Component } from 'react';
import { split } from 'lodash';
import { Button, Col, Container, FloatingLabel, Form, Modal, Row, Toast } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Loader from '../Loader/Loader';
import sprintService from '../../common/services/SprintService/SprintService';

class Sprint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sprint: {
                title: '',
                description: '',
                createdDate: null,
                updatedDate: null,
            },
            show: false,
            isLoading: false,
        };
    }

    fetchData = async () => {
        const {
            sprint: { id },
        } = this.props;

        try {
            this.showLoader(true);
            const sprint = await sprintService.getSprint(id);
            this.setState({ sprint });
            this.showLoader();
        } catch (e) {
            this.showLoader();
            console.log(e);
        }
    };

    showLoader = (isLoading = false) => this.setState({ isLoading });

    handleChange = ({ target: { name, value } }) => {
        if (name.indexOf('.') > -1) {
            const [obj, field] = split(name, '.');
            const item = { ...this.state[obj] };

            this.setState({
                [obj]: {
                    ...item,
                    [field]: value,
                },
            });
        } else {
            this.setState({ [name]: value });
        }
    };

    deleteSprint = async (e) => {
        const { updateSprintInGrid, sprint, showLoader } = this.props;

        try {
            e.stopPropagation();

            showLoader(true);
            await sprintService.deleteSprint(sprint.id);
            const { sprints, ...rest } = sprint;
            updateSprintInGrid({ ...rest }, true);
            showLoader(false);
        } catch (err) {
            showLoader(false);
            console.log(err);
        }
    };

    handleSubmit = async () => {
        try {
            const { sprint } = this.state;

            this.showLoader(true);
            const updatedSprint = await sprintService.updateSprint(sprint);

            this.setState(
                {
                    sprint: updatedSprint,
                },
                this.hideModal,
            );
            this.showLoader(false);
        } catch (e) {
            this.showLoader(false);
            console.log(e);
        }
    };

    openEditSprintModal = async (e) => {
        e.stopPropagation();
        this.setState({ show: true }, this.fetchData);
    };

    openSprint = (id) => () => {
        const { history } = this.props;

        history.push(`/sprint/${id}`);
    };

    hideModal = () => {
        const { sprint } = this.state;
        const { updateSprintInGrid } = this.props;
        const { sprints, ...rest } = sprint;

        updateSprintInGrid({ ...rest });
        this.setState({ show: false });
    };

    renderEditButton = () => (
        <Button className="m-1" onClick={this.openEditSprintModal} size="sm" variant="warning">
            <strong>Edit</strong>
        </Button>
    );

    renderDeleteButton = () => (
        <Button className="m-1" variant="danger" size="sm" onClick={this.deleteSprint}>
            <strong>Delete Sprint</strong>
        </Button>
    );

    renderModalBody = () => (
        <Modal.Body>
            <Row>
                <Col>
                    <FloatingLabel controlId="floatingTextarea2" label="Description">
                        <Form.Control
                            as="textarea"
                            style={{ height: '200px' }}
                            placeholder="Description"
                            name="sprint.description"
                            value={this.state.sprint.description}
                            onChange={this.handleChange}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
        </Modal.Body>
    );

    renderModalHeader = () => (
        <Modal.Header closeButton>
            <Container style={{ paddingLeft: 0 }}>
                <Row>
                    <Col>
                        <Form.Control
                            size="lg"
                            type="text"
                            placeholder="Title"
                            name="sprint.title"
                            value={this.state.sprint.title}
                            onChange={this.handleChange}
                        />
                    </Col>
                </Row>
            </Container>
        </Modal.Header>
    );

    renderModalFooter = () => (
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.hideModal}>
                <strong>Cancel</strong>
            </Button>
            <Button onClick={this.handleSubmit}>
                <strong>Save</strong>
            </Button>
        </Modal.Footer>
    );

    renderSprintModal = () => {
        const { show, isLoading } = this.state;

        return (
            show && (
                <Modal show={show} onHide={this.hideModal} keyboard={false} size="xl">
                    {isLoading ? (
                        <Modal.Body style={{ minHeight: '400px' }}>
                            <Loader />
                        </Modal.Body>
                    ) : (
                        <>
                            {this.renderModalHeader()}
                            {this.renderModalBody()}
                            {this.renderModalFooter()}
                        </>
                    )}
                </Modal>
            )
        );
    };

    render() {
        const {
            sprint: { id, title, description, createdDate },
        } = this.props;

        return (
            <>
                {this.renderSprintModal()}
                <Toast
                    key={id}
                    style={{ height: '230px' }}
                    className="d-inline-block m-1"
                    onClick={this.openSprint(id)}
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">{title}</strong>
                        <small>Created: {new Date(createdDate).toLocaleString()}</small>
                    </Toast.Header>
                    <Toast.Body>
                        <Container>
                            <Row>
                                <Col>
                                    {this.renderEditButton()}
                                    {this.renderDeleteButton()}
                                </Col>
                            </Row>
                            <Row className="pt-4">
                                <Col>
                                    <Row>Description:</Row>
                                    <Col className="text-truncate">{description}</Col>
                                </Col>
                            </Row>
                        </Container>
                    </Toast.Body>
                </Toast>
            </>
        );
    }
}

export default withRouter(Sprint);
