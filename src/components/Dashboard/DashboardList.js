import { filter, findIndex, get, isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Button, Col, Row, ToastContainer } from 'react-bootstrap';

import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { ModalContext } from '../../common/context/ModalContextProvider';
import { NotificationContext } from '../../common/context/NotificationContextProvider';
import dashboardService from '../../common/services/DashboardService/DashboardService';
import CreateDashboardModal from './CreateDashboardModal';
import Dashboard from './Dashboard';

const calculateHeight = () => {
    const navHeight = get(document.querySelector('nav'), 'clientHeight', 0);

    return window.innerHeight - navHeight;
};

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

    fetchDashboards = async () => {
        const { showLoader, handleError } = this.props;
        try {
            const dashboards = await dashboardService.listDashboards();
            this.setState({ dashboards });
        } catch (e) {
            handleError(e);
        } finally {
            showLoader(false);
        }
    };

    updateDashboardInGrid = (dashboard, removeFromGrid) => {
        const { dashboards } = this.state;
        const newState = { dashboards: [...dashboards] };

        if (removeFromGrid) {
            newState.dashboards = filter(dashboards, ({ id }) => id !== dashboard.id);
        } else {
            const index = findIndex(dashboards, ({ id }) => id === dashboard.id);
            newState.dashboards[index] = dashboard;
        }

        this.setState(newState);
    };

    openCreateDashboardModal = () => {
        const { handleError, setModalState, addNotification } = this.props;

        setModalState({
            show: true,
            ModalContentComponent: (props) => (
                <CreateDashboardModal
                    refreshGrid={this.fetchDashboards}
                    handleError={handleError}
                    addNotification={addNotification}
                    {...props}
                />
            ),
        });
    };

    renderDashboards = () => {
        const { dashboards } = this.state;
        const { showLoader, handleError, addNotification } = this.props;

        if (isEmpty(dashboards)) {
            return 'No Dashboards';
        }

        return dashboards.map((dashboard) => (
            <Dashboard
                key={dashboard.id}
                dashboard={dashboard}
                updateDashboardInGrid={this.updateDashboardInGrid}
                showLoader={showLoader}
                handleError={handleError}
                addNotification={addNotification}
            />
        ));
    };

    renderSidebar = () => {
        const { isLoading } = this.props;

        return (
            <Col sm="2" className="border border-bottom-0 border-top-0">
                <Row className="p-3">
                    <Button size="lg" disabled={isLoading} onClick={this.openCreateDashboardModal}>
                        Create Dashboard
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
                    <ToastContainer>{this.renderDashboards()}</ToastContainer>
                </Col>
            </Row>
        );
    }
}

export default () => (
    <NotificationContext.Consumer>
        {({ handleError, addNotification }) => (
            <ModalContext.Consumer>
                {({ state: modal, setState: setModalState }) => (
                    <LoaderContext.Consumer>
                        {({ isLoading, showLoader }) => (
                            <DashboardList
                                isLoading={isLoading}
                                showLoader={showLoader}
                                setModalState={setModalState}
                                modal={modal}
                                handleError={handleError}
                                addNotification={addNotification}
                            />
                        )}
                    </LoaderContext.Consumer>
                )}
            </ModalContext.Consumer>
        )}
    </NotificationContext.Consumer>
);
