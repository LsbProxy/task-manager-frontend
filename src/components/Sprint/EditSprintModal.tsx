import { Button, Col, Container, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react';
import sprintService, { Sprint } from '../../common/services/SprintService';

import Loader from '../Loader';

interface Props {
	isOpen: boolean;
	openCloseModal: (value: boolean) => void;
	sprintId: string;
	updateSprintInGrid: (sprint: Sprint, removeFromGrid?: boolean) => void;
}

const EditSprintModal: FC<Props> = ({ isOpen, openCloseModal, sprintId, updateSprintInGrid }) => {
	const [sprint, setSprint] = useState<Sprint>({
		id: '',
		title: '',
		description: '',
		createdDate: '',
		updatedDate: '',
		endDate: '',
		dashboard: '',
		tasks: [],
	});
	const [isLoading, showLoader] = useState(false);
	const { addNotification, handleError } = useContext(NotificationContext);

	const fetchData = useCallback(async () => {
		if (!isOpen) {
			return;
		}
		try {
			showLoader(true);
			const sprint = await sprintService.getSprint(sprintId);
			setSprint(sprint);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [sprintId, isOpen]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setSprint((currentSprint) => ({ ...currentSprint, [name]: value }));

	const handleSubmit = useCallback(async () => {
		try {
			showLoader(true);
			const updatedSprint = await sprintService.updateSprint(sprint);

			setSprint(updatedSprint);
			updateSprintInGrid(sprint);
			openCloseModal(false);
			addNotification(`Successfully updated ${updatedSprint.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [sprint]);

	return (
		<Modal show={isOpen} onHide={() => openCloseModal(false)} keyboard={false} size="xl">
			{isLoading ? (
				<Modal.Body style={{ minHeight: '400px' }}>
					<Loader />
				</Modal.Body>
			) : (
				<>
					<Modal.Header closeButton>
						<Container style={{ paddingLeft: 0 }}>
							<Row>
								<Col>
									<Form.Control
										size="lg"
										type="text"
										placeholder="Title"
										name="title"
										value={sprint.title}
										onChange={handleChange}
									/>
								</Col>
							</Row>
						</Container>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col>
								<FloatingLabel controlId="floatingTextarea2" label="Description">
									<Form.Control
										as="textarea"
										style={{ height: '200px' }}
										placeholder="Description"
										name="description"
										value={sprint.description}
										onChange={handleChange}
									/>
								</FloatingLabel>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="outline-secondary" onClick={() => openCloseModal(false)}>
							<strong>Cancel</strong>
						</Button>
						<Button onClick={handleSubmit}>
							<strong>Save</strong>
						</Button>
					</Modal.Footer>
				</>
			)}
		</Modal>
	);
};

export default EditSprintModal;
