import { filter, findIndex, get, isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Button, Col, Row, ToastContainer } from 'react-bootstrap';
import { useRouteMatch } from 'react-router-dom';
import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { ModalContext } from '../../common/context/ModalContextProvider';

import dashboardService from '../../common/services/DashboardService/DashboardService';
import redirectToHomePage from '../../common/utils/redirectToHomePage';
import CreateSprintModal from './CreateSprintModal';
import Sprint from './Sprint';

const calculateHeight = () => {
    const navHeight = get(document.querySelector('nav'), 'clientHeight', 0);

    return window.innerHeight - navHeight;
};

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

    fetchDashboard = async () => {
        const { showLoader } = this.props;
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

    updateSprintInGrid = (sprint, removeFromGrid) => {
        const { dashboard } = this.state;
        const newState = { dashboard: { ...dashboard } };

        if (removeFromGrid) {
            newState.dashboard.sprints = filter(dashboard.sprints, ({ id }) => id !== sprint.id);
        } else {
            const index = findIndex(dashboard.sprints, ({ id }) => id === sprint.id);
            newState.dashboard.sprints[index] = sprint;
        }

        this.setState(newState);
    };

    openCreateSprintModal = () => {
        this.props.setModalState({
            show: true,
            ModalContentComponent: (props) => (
                <CreateSprintModal
                    {...props}
                    refreshGrid={this.fetchDashboard}
                    dashboardId={get(this.state, 'dashboard.id')}
                />
            ),
        });
    };

    renderSprints = () => {
        const {
            dashboard: { sprints },
        } = this.state;
        const { showLoader } = this.props;

        if (isEmpty(sprints)) {
            return 'No Sprints';
        }

        return sprints.map((sprint) => (
            <Sprint
                key={sprint.id}
                sprint={sprint}
                updateSprintInGrid={this.updateSprintInGrid}
                showLoader={showLoader}
            />
        ));
    };

    renderSidebar = () => {
        const { isLoading } = this.props;

        return (
            <Col sm="2" className="border border-bottom-0 border-top-0">
                <Row className="p-3">
                    <Button size="lg" disabled={isLoading} onClick={this.openCreateSprintModal}>
                        Create Sprint
                    </Button>
                </Row>
            </Col>
        );
    };

    render() {
        return (
            <Row style={{ height: calculateHeight() }}>
                {this.renderSidebar()}
                <Col sm="10" className="pb-5">
                    <ToastContainer>{this.renderSprints()}</ToastContainer>
                </Col>
            </Row>
        );
    }
}

export default () => {
    const match = useRouteMatch();
    return (
        <ModalContext.Consumer>
            {({ state: modal, setState: setModalState }) => (
                <LoaderContext.Consumer>
                    {({ isLoading, showLoader }) => (
                        <SprintList
                            isLoading={isLoading}
                            showLoader={showLoader}
                            setModalState={setModalState}
                            modal={modal}
                            match={match}
                        />
                    )}
                </LoaderContext.Consumer>
            )}
        </ModalContext.Consumer>
    );
};
