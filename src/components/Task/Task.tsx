import { Col, Row, Toast, ToastContainer } from 'react-bootstrap';
import React, { FC, useState } from 'react';

import EditTaskModal from './EditTaskModal';
import { Task as ITask } from '../../common/services/TaskService';

interface Props {
	id: string;
	title: string;
	description: string;
	updateTaskInGrid: (task: ITask, removeTaskFromGrid?: boolean) => void;
}

const Task: FC<Props> = ({ id, title, description, updateTaskInGrid }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<EditTaskModal
				id={id}
				isOpen={isModalOpen}
				openCloseModal={setIsModalOpen}
				updateTaskInGrid={updateTaskInGrid}
			/>
			<ToastContainer className="p-1">
				<Toast
					style={{ maxHeight: '250px', minHeight: '100px' }}
					key={id}
					onClick={() => setIsModalOpen(true)}
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
};

export default Task;
