import React, { Component } from 'react';
import { filter, join, map, split } from 'lodash';
import { Button, Col, Container, FloatingLabel, Form, Modal, Row, Toast } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Loader from '../Loader/Loader';
import dashboardService from '../../common/services/DashboardService/DashboardService';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dashboard: {
                title: '',
                description: '',
                members: [],
                createdDate: null,
                updatedDate: null,
            },
            user: JSON.parse(window.localStorage.getItem('user')),
            show: false,
            isLoading: false,
        };
    }

    fetchData = async () => {
        const {
            dashboard: { id },
            handleError,
        } = this.props;

        try {
            this.showLoader(true);
            const dashboard = await dashboardService.getDashboard(id);
            this.setState({ dashboard });
        } catch (e) {
            handleError(e);
        } finally {
            this.showLoader();
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

    handleMembersChange = ({ target: { name, value } }) => {
        const {
            dashboard: { members },
            user,
        } = this.state;
        let newValue = [...members];

        if (members.indexOf(value) > -1 && value !== user.username) {
            newValue = filter(members, (member) => member !== value);
        } else {
            newValue.push(value);
        }

        this.handleChange({ target: { name, value: newValue } });
    };

    deleteDashboard = async (e) => {
        const { updateDashboardInGrid, dashboard, showLoader, handleError, addNotification } =
            this.props;

        try {
            e.stopPropagation();

            showLoader(true);
            await dashboardService.deleteDashboard(dashboard.id);
            const { sprints, ...rest } = dashboard;
            updateDashboardInGrid({ ...rest }, true);
            addNotification(`Successfully deleted ${dashboard.title}`);
        } catch (err) {
            handleError(err);
        } finally {
            showLoader(false);
        }
    };

    handleSubmit = async () => {
        try {
            const { dashboard } = this.state;

            this.showLoader(true);
            const updatedDashboard = await dashboardService.updateDashboard(dashboard);

            this.setState(
                {
                    dashboard: updatedDashboard,
                },
                this.hideModal,
            );

            this.props.addNotification(`Successfully updated ${updatedDashboard.title}`);
        } catch (e) {
            this.props.handleError(e);
        } finally {
            this.showLoader(false);
        }
    };

    openEditDashboardModal = async (e) => {
        e.stopPropagation();
        this.setState({ show: true }, this.fetchData);
    };

    openDashboard = (id) => () => {
        const { history } = this.props;

        history.push(`/dashboard/${id}`);
    };

    hideModal = () => {
        const { dashboard } = this.state;
        const { updateDashboardInGrid } = this.props;
        const { sprints, ...rest } = dashboard;

        updateDashboardInGrid({ ...rest });
        this.setState({ show: false });
    };

    renderEditButton = () => (
        <Button className="m-1" onClick={this.openEditDashboardModal} size="sm" variant="warning">
            <strong>Edit</strong>
        </Button>
    );

    renderDeleteButton = () => (
        <Button className="m-1" variant="danger" size="sm" onClick={this.deleteDashboard}>
            <strong>Delete Dashboard</strong>
        </Button>
    );

    renderModalBody = () => {
        const {
            dashboard: { description, members },
        } = this.state;
        const {
            dashboard: { members: propsMembers },
        } = this.props;

        return (
            <Modal.Body>
                <Row>
                    <Col>
                        <FloatingLabel controlId="floatingTextarea2" label="Description">
                            <Form.Control
                                as="textarea"
                                style={{ height: '200px' }}
                                placeholder="Description"
                                name="dashboard.description"
                                value={description}
                                onChange={this.handleChange}
                            />
                        </FloatingLabel>
                        <Row className="pt-1">
                            <Col sm="3">
                                <Form.Label>Members:</Form.Label>
                                <Form.Control
                                    multiple
                                    as="select"
                                    name="dashboard.members"
                                    value={members}
                                    onChange={this.handleMembersChange}
                                >
                                    {map(propsMembers, (member) => (
                                        <option key={member} value={member}>
                                            {member}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
        );
    };

    renderModalHeader = () => {
        const {
            dashboard: { title },
        } = this.state;

        return (
            <Modal.Header closeButton>
                <Container style={{ paddingLeft: 0 }}>
                    <Row>
                        <Col>
                            <Form.Control
                                size="lg"
                                type="text"
                                placeholder="Title"
                                name="dashboard.title"
                                value={title}
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal.Header>
        );
    };

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

    renderDashboardModal = () => {
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
            dashboard: { id, title, description, createdDate, members },
        } = this.props;

        return (
            <>
                {this.renderDashboardModal()}
                <Toast
                    key={id}
                    style={{ height: '230px' }}
                    className="d-inline-block m-1"
                    onClick={this.openDashboard(id)}
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
                            <Row>
                                <Col>
                                    <Row>Members:</Row>
                                    <Col className="text-truncate">{join(members, ', ')}</Col>
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

export default withRouter(Dashboard);
