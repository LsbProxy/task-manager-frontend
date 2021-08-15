import React from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';

const show = true;

export default function Page404() {
    const handleClose = () => {
        window.location.href = '/';
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size="sm"
        >
            <Modal.Header closeButton />
            <Modal.Body>
                <Alert variant="warning">Page doesn&apos;t exist!</Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>ok</Button>
            </Modal.Footer>
        </Modal>
    );
}
