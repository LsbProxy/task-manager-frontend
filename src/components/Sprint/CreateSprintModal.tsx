import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import ErrorAlertList, { Errors } from '../ErrorAlertList';
import React, { ChangeEvent, FC, useCallback, useContext, useState } from 'react';
import sprintService, { CreateSprint } from '../../common/services/SprintService';

import Loader from '../Loader';
import { isEmpty } from 'lodash';

interface Props {
	hideModal: () => void;
	refreshGrid: () => void;
	dashboardId: string;
}

const CreateSprintModal: FC<Props> = ({ hideModal, refreshGrid, dashboardId }) => {
	const [sprint, setSprint] = useState<CreateSprint>({
		title: '',
		description: '',
		dashboard: dashboardId,
	});
	const [isLoading, showLoader] = useState(false);
	const [isSubmit, setIsSubmit] = useState(false);
	const [errors, setErrors] = useState<Errors>([]);
	const { handleError, addNotification } = useContext(NotificationContext);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setSprint((currentSprint) => ({ ...currentSprint, [name]: value }));

	const validateSprint = useCallback(() => {
		const errors = [];

		if (!sprint.title) {
			errors.push('Title');
		}

		setIsSubmit(true);
		setErrors(errors);

		return isEmpty(errors);
	}, [sprint]);

	const handleCreateSprint = useCallback(async () => {
		if (!validateSprint()) {
			return;
		}

		try {
			showLoader(true);
			await sprintService.createSprint(sprint);

			hideModal();
			refreshGrid();
			addNotification(`Successfully created ${sprint.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [sprint]);

	return (
		<>
			<Modal.Header closeButton>
				<strong>Create Sprint</strong>
			</Modal.Header>
			<Modal.Body style={{ minHeight: '300px' }}>
				{isLoading ? (
					<Loader />
				) : (
					<Form>
						<ErrorAlertList errors={errors} />
						<Form.Control
							type="text"
							placeholder="Title"
							name="title"
							value={sprint.title}
							onChange={handleChange}
						/>
						<FloatingLabel className="pt-1" controlId="floatingTextarea2" label="Description">
							<Form.Control
								as="textarea"
								style={{ height: '300px' }}
								placeholder="Description"
								name="description"
								value={sprint.description}
								onChange={handleChange}
							/>
						</FloatingLabel>
					</Form>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button
					className="mt-2"
					variant="primary"
					onClick={handleCreateSprint}
					disabled={isSubmit && !sprint.title}
				>
					Create
				</Button>
			</Modal.Footer>
		</>
	);
};

export default CreateSprintModal;
