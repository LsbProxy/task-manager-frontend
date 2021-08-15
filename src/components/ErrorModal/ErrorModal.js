import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import { Alert, Button, Modal } from 'react-bootstrap';

class ErrorModal extends Component {
    constructor() {
        super();

        this.state = {
            show: true,
        };
    }

    setShow = (show) => this.setState({ show });

    handleClose = () => {
        const { resetErrorBoundary } = this.props;

        resetErrorBoundary();
        this.setShow(false);
    };

    render() {
        const {
            error: { message, stack },
        } = this.props;
        const { show } = this.state;

        return (
            <Modal
                show={show}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
                centered
                size="xl"
            >
                <Modal.Header closeButton />
                <Modal.Body>
                    <Alert variant="danger">{message}</Alert>
                    <Alert variant="warning">{stack}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ErrorModal.propTypes = {
    resetErrorBoundary: func.isRequired,
    error: shape({
        message: string.isRequired,
        stack: string.isRequired,
    }).isRequired,
};

export default ErrorModal;
