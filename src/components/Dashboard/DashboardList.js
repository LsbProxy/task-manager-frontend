import { join, isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Col, Container, Row, Toast, ToastContainer } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LoaderContext } from '../../common/context/LoaderContextProvider';

import dashboardService from '../../common/services/DashboardService/DashboardService';

class DashboardList extends Component {
    constructor() {
        super();

        this.state = {
            dashboards: [],
        };
    }

    componentDidMount() {
        this.fetchDashboards();
    }

    openDashboard = (id) => () => {
        const { history } = this.props;
        history.push(`/dashboard/${id}`);
    };

    fetchDashboards = async () => {
        const { showLoader } = this.context;
        try {
            const dashboards = await dashboardService.listDashboards();
            this.setState({ dashboards });
        } catch (e) {
            console.log(e);
        } finally {
            showLoader(false);
        }
    };

    renderDashboards = () => {
        const { dashboards } = this.state;

        if (isEmpty(dashboards)) {
            return 'No Dashboards';
        }

        return (
            <ToastContainer className="p-3">
                {dashboards.map(({ id, title, description, createdDate, members }) => (
                    <Toast key={id} onClick={this.openDashboard(id)}>
                        <Toast.Header closeButton={false}>
                            <strong className="me-auto">{title}</strong>
                            <small>Created: {new Date(createdDate).toLocaleString()}</small>
                        </Toast.Header>
                        <Toast.Body>
                            <Container>
                                <Row>
                                    <Col>
                                        <Row>Description:</Row>
                                        <Col>{description}</Col>
                                    </Col>
                                    <Col>
                                        <Row>Members:</Row>
                                        <Col>{join(members, ', ')}</Col>
                                    </Col>
                                </Row>
                            </Container>
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        );
    };

    render() {
        return <Row>{this.renderDashboards()}</Row>;
    }
}

DashboardList.contextType = LoaderContext;

export default withRouter(DashboardList);
