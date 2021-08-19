import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Row, Toast, ToastContainer } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LoaderContext } from '../../common/context/LoaderContextProvider';

import dashboardService from '../../common/services/DashboardService/DashboardService';
import redirectToHomePage from '../../common/utils/redirectToHomePage';

class SprintList extends Component {
    constructor() {
        super();

        this.state = {
            dashboard: {},
        };
    }

    componentDidMount() {
        this.fetchDashboard();
    }

    componentDidUpdate({
        match: {
            params: { id },
        },
    }) {
        const {
            match: {
                params: { id: currentId },
            },
        } = this.props;
        if (currentId !== id) {
            this.fetchDashboard();
            return true;
        }

        return false;
    }

    openSprint = (id) => () => {
        const { history } = this.props;
        history.push(`/sprint/${id}`);
    };

    fetchDashboard = async () => {
        const { showLoader } = this.context;
        try {
            const {
                match: {
                    params: { id },
                },
            } = this.props;

            redirectToHomePage(Number.isNaN(id));

            showLoader(true);
            const dashboard = await dashboardService.getDashboard(id);
            this.setState({ dashboard });
            showLoader(false);
        } catch (e) {
            console.log(e);
        }
    };

    renderDashboardSprints = () => {
        const {
            dashboard: { sprints, title: dashboardTitle },
        } = this.state;

        if (isEmpty(sprints)) {
            return `No Sprints in ${dashboardTitle}.`;
        }

        return (
            <ToastContainer className="p-3">
                {sprints.map(({ id, title, description, createdDate }) => (
                    <Toast key={id} onClick={this.openSprint(id)}>
                        <Toast.Header closeButton={false}>
                            <strong className="me-auto">{title}</strong>
                            <small>Created: {new Date(createdDate).toLocaleString()}</small>
                        </Toast.Header>
                        <Toast.Body>{description}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        );
    };

    render() {
        return <Row>{this.renderDashboardSprints()}</Row>;
    }
}

SprintList.contextType = LoaderContext;

export default withRouter(SprintList);
