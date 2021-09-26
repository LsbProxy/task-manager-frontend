import { filter, findIndex, isEmpty, map, startCase, get } from 'lodash';
import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { useRouteMatch } from 'react-router-dom';

import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { ModalContext } from '../../common/context/ModalContextProvider';
import { NotificationContext } from '../../common/context/NotificationContextProvider';
import sprintService from '../../common/services/SprintService/SprintService';
import taskService from '../../common/services/TaskService/TaskService';
import redirectToHomePage from '../../common/utils/redirectToHomePage';
import taskStatus from '../../common/utils/taskStatus';
import DraggableContainer from '../Draggable/DraggableContainer';
import DraggableProvider from '../Draggable/DraggableProvider';
import CreateTaskModal from './CreateTaskModal';
import Task from './Task';

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
        const { showLoader, handleError } = this.props;
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
            handleError(e);
        } finally {
            showLoader(false);
        }
    };

    openCreateTaskModal = () => {
        const { handleError, setModalState, addNotification } = this.props;

        setModalState({
            show: true,
            ModalContentComponent: (props) => (
                <CreateTaskModal
                    dashboardId={get(this.state, 'sprint.dashboard')}
                    sprintId={get(this.state, 'sprint.id')}
                    refreshGrid={this.fetchSprint}
                    handleError={handleError}
                    addNotification={addNotification}
                    {...props}
                />
            ),
        });
    };

    updateTaskStatus = async (newStatus, { item }) => {
        const { showLoader, handleError } = this.props;

        try {
            const { sprint } = this.state;

            const newState = { sprint: { ...sprint } };
            const updatedTask = { ...item, status: newStatus };
            const taskIndex = findIndex(sprint.tasks, ({ id }) => id === updatedTask.id);

            newState.sprint.tasks[taskIndex] = updatedTask;

            showLoader(true);
            await taskService.updateTask(updatedTask);

            this.setState(newState);
        } catch (e) {
            handleError(e);
        } finally {
            showLoader(false);
        }
    };

    updateTaskInGrid = (task, removeTaskFromGrid) => {
        const { sprint } = this.state;
        const newState = { sprint: { ...sprint } };

        if (removeTaskFromGrid) {
            newState.sprint.tasks = filter(sprint.tasks, ({ id }) => id !== task.id);
        } else {
            const taskIndex = findIndex(sprint.tasks, ({ id }) => id === task.id);
            newState.sprint.tasks[taskIndex] = task;
        }

        this.setState(newState);
    };

    renderDraggableColumnContainer = (column) => {
        const {
            sprint: { tasks },
        } = this.state;
        const { handleError, addNotification } = this.props;

        return (
            <Col key={column} sm="2" className="border border-bottom-0 border-top-0">
                <Row id="draggableRowLabel">
                    <div className="border-bottom border-top">
                        <strong>{startCase(column)}</strong>
                    </div>
                </Row>
                <Row>
                    <DraggableContainer
                        id={column}
                        items={filter(tasks, (task) => task.status === column)}
                        itemProps={{
                            updateTaskInGrid: this.updateTaskInGrid,
                            addNotification,
                            handleError,
                        }}
                        ItemComponent={Task}
                        updateItem={this.updateTaskStatus}
                        handleChange={this.updateTaskInGrid}
                    />
                </Row>
            </Col>
        );
    };

    renderDraggableContainers = () => {
        const {
            sprint: { tasks, title: sprintTitle },
        } = this.state;

        if (isEmpty(tasks)) {
            return `No Tasks in ${sprintTitle || 'Sprint'}.`;
        }

        return (
            <DraggableProvider>
                {map(taskStatus, ({ label }) => this.renderDraggableColumnContainer(label))}
            </DraggableProvider>
        );
    };

    renderSidebar = () => {
        const { isLoading } = this.props;

        return (
            <Col sm="2" className="border border-bottom-0 border-top-0">
                <Row className="p-3">
                    <Button size="lg" disabled={isLoading} onClick={this.openCreateTaskModal}>
                        Create Task
                    </Button>
                </Row>
            </Col>
        );
    };

    render() {
        return (
            <Row>
                {this.renderSidebar()}
                {this.renderDraggableContainers()}
            </Row>
        );
    }
}

export default () => {
    const match = useRouteMatch();
    return (
        <NotificationContext.Consumer>
            {({ handleError, addNotification }) => (
                <ModalContext.Consumer>
                    {({ state: modal, setState: setModalState }) => (
                        <LoaderContext.Consumer>
                            {({ isLoading, showLoader }) => (
                                <TaskGrid
                                    isLoading={isLoading}
                                    showLoader={showLoader}
                                    setModalState={setModalState}
                                    modal={modal}
                                    match={match}
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
};
