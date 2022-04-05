import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import ErrorAlertList, { Errors } from '../ErrorAlertList';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import sprintService, { CreateSprint } from '../../common/services/SprintService';

import Button from '../Button';
import Container from '../Container';
import Description from '../Description';
import Input from '../Input';
import Loader from '../Loader';
import Row from '../Row';
import Text from '../Text';
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
	const { handleError, addNotification } = useNotification();

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setSprint((currentSprint) => ({ ...currentSprint, [name]: value }));

	const handleDescriptionChange = ({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) =>
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
			<Container>
				<Text>
					<strong>Create Sprint</strong>
				</Text>
			</Container>
			<Container style={{ minHeight: '300px' }}>
				{isLoading ? (
					<Loader />
				) : (
					<form>
						<ErrorAlertList errors={errors} />
						<Input
							type="text"
							placeholder="Title"
							name="title"
							value={sprint.title}
							onChange={handleChange}
						/>
						<Description
							placeholder="Description"
							name="description"
							value={sprint.description}
							onChange={handleDescriptionChange}
						/>
					</form>
				)}
			</Container>
			<Row align="flex-end">
				<Button variant="primary" onClick={handleCreateSprint} disabled={isSubmit && !sprint.title}>
					Create
				</Button>
			</Row>
		</>
	);
};

export default CreateSprintModal;
