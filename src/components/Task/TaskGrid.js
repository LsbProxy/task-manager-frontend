import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Row, Toast, ToastContainer } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import { LoaderContext } from '../../common/context/LoaderContextProvider';
import sprintService from '../../common/services/SprintService/SprintService';
import redirectToHomePage from '../../common/utils/redirectToHomePage';

class TaskGrid extends Component {
    constructor() {
        super();

        this.state = {
            sprint: {},
        };
    }

    componentDidMount() {
        this.fetchSprint();
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
            this.fetchSprint();
            return true;
        }

        return false;
    }

    fetchSprint = async () => {
        const { showLoader } = this.context;
        try {
            const {
                match: {
                    params: { id },
                },
            } = this.props;

            redirectToHomePage(Number.isNaN(id));

            showLoader(true);
            const sprint = await sprintService.getSprint(id);
            this.setState({ sprint });
        } catch (e) {
            console.log(e);
        } finally {
            showLoader(false);
        }
    };

    renderTasks = () => {
        const {
            sprint: { tasks, title: sprintTitle },
        } = this.state;

        if (isEmpty(tasks)) {
            return `No Tasks in ${sprintTitle}.`;
        }

        return (
            <ToastContainer className="p-3">
                {tasks.map((task) => this.renderTask(task))}
            </ToastContainer>
        );
    };

    renderTask = ({ id, title, description, createdDate }) => (
        <Toast key={id}>
            <Toast.Header closeButton={false}>
                <strong className="me-auto">{title}</strong>
                <small>Created: {new Date(createdDate).toLocaleString()}</small>
            </Toast.Header>
            <Toast.Body>{description}</Toast.Body>
        </Toast>
    );

    render() {
        return <Row>{this.renderTasks()}</Row>;
    }
}

TaskGrid.contextType = LoaderContext;

export default withRouter(TaskGrid);
