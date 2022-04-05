import Button, { ButtonGroup } from '../Button';
import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import sprintService, { Sprint } from '../../common/services/SprintService';

import Container from '../Container';
import Description from '../Description';
import Input from '../Input';
import Loader from '../Loader';
import Row from '../Row';
import { updateSprint } from '../../features/sprintSlice';
import { useDispatch } from 'react-redux';

interface Props {
	sprintId: string;
	hideModal: () => void;
}

const EditSprintModal: FC<Props> = ({ sprintId, hideModal }) => {
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
	const { addNotification, handleError } = useNotification();
	const dispatch = useDispatch();

	const fetchData = useCallback(async () => {
		try {
			showLoader(true);
			const sprint = await sprintService.getSprint(sprintId);
			setSprint(sprint);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [sprintId]);

	useEffect(() => {
		fetchData();
	}, []);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setSprint((currentSprint) => ({ ...currentSprint, [name]: value }));

	const handleDescriptionChange = ({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) =>
		setSprint((currentSprint) => ({ ...currentSprint, [name]: value }));

	const handleSubmit = useCallback(async () => {
		try {
			showLoader(true);
			const updatedSprint = await sprintService.updateSprint(sprint);

			setSprint(updatedSprint);
			dispatch(updateSprint({ sprint }));
			hideModal();
			addNotification(`Successfully updated ${updatedSprint.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [sprint]);

	return (
		<Container style={{ minHeight: '400px' }}>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<Container>
						<Container>
							<Row>
								<Container>
									<Input
										type="text"
										placeholder="Title"
										name="title"
										value={sprint.title}
										onChange={handleChange}
									/>
								</Container>
							</Row>
						</Container>
					</Container>
					<Container>
						<Row>
							<Container>
								<Description
									placeholder="Description"
									name="description"
									value={sprint.description}
									onChange={handleDescriptionChange}
								/>
							</Container>
						</Row>
					</Container>
					<Row align="flex-end">
						<ButtonGroup gap="0.5rem">
							<Button variant="outline-primary" onClick={hideModal}>
								Cancel
							</Button>
							<Button onClick={handleSubmit}>Save</Button>
						</ButtonGroup>
					</Row>
				</>
			)}
		</Container>
	);
};

export default EditSprintModal;
