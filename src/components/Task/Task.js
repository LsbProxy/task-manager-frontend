import React, { Component } from 'react';
import { map, split } from 'lodash';
import {
    Button,
    Card,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    FloatingLabel,
    Form,
    Modal,
    Row,
    Toast,
    ToastContainer,
} from 'react-bootstrap';
import OutsideClickHandler from 'react-outside-click-handler';

import taskService from '../../common/services/TaskService/TaskService';
import Loader from '../Loader/Loader';
import commentService from '../../common/services/CommentService/CommentService';
import taskStatus from '../../common/utils/taskStatus';

class Task extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: {
                author: '',
                description: '',
                status: taskStatus.todo.label,
                assignedTo: '',
                createdDate: null,
                updatedDate: null,
            },
            user: JSON.parse(window.localStorage.getItem('user')),
            comment: '',
            show: false,
            isLoading: false,
            focusTitle: false,
            focusDescription: false,
            focusComment: false,
        };
    }

    fetchData = async () => {
        const { id, handleError } = this.props;

        try {
            this.showLoader(true);
            const task = await taskService.getTask(id);
            this.setState({ task });
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

    updateStatus = (status) => () => {
        const { task } = this.state;
        this.setState({ task: { ...task, status } }, this.handleSubmit);
    };

    deleteTask = async () => {
        const { updateTaskInGrid, handleError, addNotification } = this.props;

        try {
            const { task } = this.state;

            this.showLoader(true);
            await taskService.deleteTask(task.id);
            updateTaskInGrid(task, true);
            addNotification(`Successfully deleted ${task.title}`);
        } catch (e) {
            handleError(e);
        } finally {
            this.showLoader();
        }
    };

    handleSubmit = async () => {
        try {
            const { task } = this.state;

            this.showLoader(true);
            const updatedTask = await taskService.updateTask(task);

            this.setState({ task: updatedTask, focusDescription: false, focusTitle: false });
            this.props.addNotification(`Successfully updated ${updatedTask.title}`);
        } catch (e) {
            this.props.handleError(e);
        } finally {
            this.showLoader();
        }
    };

    handleSubmitComment = async () => {
        try {
            const {
                comment: content,
                task: { id: taskId },
                user: { username: author },
                task,
            } = this.state;

            const newComment = { content, author, task: taskId };

            this.showLoader(true);
            const comment = await commentService.createComment(newComment);
            this.setState({ task: { comments: [...task.comments, comment] }, comment: '' });
        } catch (e) {
            this.props.handleError(e);
        } finally {
            this.showLoader();
        }
    };

    focusInput =
        (inputName, focus = false) =>
        () => {
            if (focus !== this.state[inputName]) {
                this.setState({ [inputName]: focus });
            }
        };

    openTaskModal = async () => {
        this.setState({ show: true }, this.fetchData);
    };

    hideModal = () => {
        const { task } = this.state;
        const { updateTaskInGrid } = this.props;

        const { comments, ...rest } = task;

        updateTaskInGrid({ ...rest });

        this.setState({ show: false, comment: '' });
    };

    renderDeleteButton = () => (
        <Row className="p-1">
            <Button variant="danger" onClick={this.deleteTask}>
                <strong>Delete Task</strong>
            </Button>
        </Row>
    );

    renderLeftPanel = () => (
        <Col md={{ span: 8 }}>
            {this.renderDescription()}
            {this.renderComments()}
        </Col>
    );

    renderRightPanel = () => {
        const {
            task: { status, createdDate, updatedDate, author, assignedTo },
        } = this.state;
        const created = new Date(createdDate).toLocaleString();
        const updated = new Date(updatedDate).toLocaleString();

        return (
            <Col md={{ span: 4 }}>
                <Card style={{ height: '100%' }}>
                    <Card.Body>
                        <Row>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={<strong>{status}</strong>}
                            >
                                {map(taskStatus, ({ label }) => (
                                    <Dropdown.Item key={label} onClick={this.updateStatus(label)}>
                                        {label}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Row>
                        <Row className="p-1">
                            <small>Assigned to: {assignedTo}</small>
                        </Row>
                        <Row className="p-1">
                            <small>Author: {author}</small>
                        </Row>
                        <Row className="p-1">
                            <small>Last updated: {updated}</small>
                        </Row>
                        <Row className="p-1">
                            <small>Created: {created}</small>
                        </Row>
                        {this.renderDeleteButton()}
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    renderModalBody = () => (
        <Row>
            {this.renderLeftPanel()}
            {this.renderRightPanel()}
        </Row>
    );

    renderDescription = () => {
        const {
            task: { description },
            focusDescription,
            isLoading,
        } = this.state;

        return (
            <Row>
                <Col>
                    <OutsideClickHandler onOutsideClick={this.focusInput('focusDescription')}>
                        <Form onSubmit={this.handleSubmit}>
                            <FloatingLabel controlId="floatingTextarea2" label="Description">
                                <Form.Control
                                    as="textarea"
                                    style={{ height: '300px' }}
                                    placeholder="Description"
                                    name="task.description"
                                    value={description}
                                    onChange={this.handleChange}
                                    onFocus={this.focusInput('focusDescription', true)}
                                />
                            </FloatingLabel>
                            {focusDescription && (
                                <Button
                                    disabled={isLoading || !focusDescription}
                                    className="mt-2"
                                    variant="primary"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            )}
                        </Form>
                    </OutsideClickHandler>
                </Col>
            </Row>
        );
    };

    renderComments = () => {
        const {
            task: { comments },
        } = this.state;

        return (
            <Row className="mt-4">
                <Col sm={{ span: 12 }}>
                    <strong>Comments</strong>
                </Col>
                <Col>
                    {map(comments, ({ author, content, createdDate }) => (
                        <Card key={`${author}.${createdDate}`} className="mt-2">
                            <Card.Header>
                                <small>
                                    <strong>{author}</strong>
                                </small>
                                <small className="float-end">
                                    {new Date(createdDate).toLocaleString()}
                                </small>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="text-wrap">{content}</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    {this.renderNewComment()}
                </Col>
            </Row>
        );
    };

    renderNewComment = () => {
        const { comment, focusComment, isLoading } = this.state;

        return (
            <OutsideClickHandler onOutsideClick={this.focusInput('focusComment')}>
                <Form className="mt-2" onSubmit={this.handleSubmitComment}>
                    <FloatingLabel controlId="floatingTextarea2" label="Leave a comment here...">
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here..."
                            style={focusComment ? { height: '100px' } : {}}
                            name="comment"
                            value={comment}
                            onChange={this.handleChange}
                            onFocus={this.focusInput('focusComment', true)}
                        />
                    </FloatingLabel>
                    {focusComment && (
                        <Button
                            disabled={!comment || isLoading || !focusComment}
                            className="mt-2"
                            variant="primary"
                            type="submit"
                        >
                            Submit
                        </Button>
                    )}
                </Form>
            </OutsideClickHandler>
        );
    };

    renderModalHeader = () => {
        const {
            task: { title },
            isLoading,
            focusTitle,
        } = this.state;

        return (
            <Container style={{ paddingLeft: 0 }}>
                <Row>
                    <Col>
                        <OutsideClickHandler onOutsideClick={this.focusInput('focusTitle')}>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Control
                                    size="lg"
                                    type="text"
                                    placeholder="Title"
                                    name="task.title"
                                    value={title}
                                    onChange={this.handleChange}
                                    onFocus={this.focusInput('focusTitle', true)}
                                />
                                {focusTitle && (
                                    <Button
                                        disabled={isLoading || !focusTitle}
                                        className="mt-2"
                                        variant="primary"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                )}
                            </Form>
                        </OutsideClickHandler>
                    </Col>
                </Row>
            </Container>
        );
    };

    renderTaskModal = () => {
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
                            <Modal.Header closeButton>{this.renderModalHeader()}</Modal.Header>
                            <Modal.Body>{this.renderModalBody()}</Modal.Body>
                        </>
                    )}
                </Modal>
            )
        );
    };

    render() {
        const { id, title, description } = this.props;

        return (
            <>
                {this.renderTaskModal()}
                <ToastContainer className="p-1">
                    <Toast
                        style={{ maxHeight: '250px', minHeight: '100px' }}
                        key={id}
                        onClick={this.openTaskModal}
                    >
                        <Toast.Header closeButton={false}>
                            <strong className="me-auto text-truncate">{title}</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <Row>
                                <Col className="text-truncate">{description}</Col>
                            </Row>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </>
        );
    }
}

export default Task;
