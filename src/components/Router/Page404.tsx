import React, { FC } from 'react';

import Alert from '../Alert';
import Button from '../Button';
import Container from '../Container';
import Modal from '../Modal';

const show = true;

const Page404: FC = () => {
	const handleClose = () => {
		window.location.href = '/';
	};

	return (
		<Modal show={show} onHide={handleClose} centered={true} size="sm">
			<Container>
				<Alert variant="warning">Page doesn&apos;t exist!</Alert>
				<Button onClick={handleClose}>OK</Button>{' '}
			</Container>
		</Modal>
	);
};

export default Page404;
