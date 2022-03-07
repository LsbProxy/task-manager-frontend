import { Alert, Button, Modal } from 'react-bootstrap';
import React, { FC } from 'react';

const show = true;

const Page404: FC = () => {
	const handleClose = () => {
		window.location.href = '/';
	};

	return (
		<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered size="sm">
			<Modal.Header closeButton />
			<Modal.Body>
				<Alert variant="warning">Page doesn&apos;t exist!</Alert>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleClose}>ok</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default Page404;
