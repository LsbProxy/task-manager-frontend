import React, { FC } from 'react';

import EditTaskModal from './EditTaskModal';
import Text from '../Text';
import Toast from '../Toast';
import { useModal } from '../../common/context/ModalContextProvider';

interface Props {
	id: string;
	title: string;
	description: string;
}

const Task: FC<Props> = ({ id, title, description }) => {
	const { setState: setModalState } = useModal();
	return (
		<Toast
			height="150px"
			margin={0.5}
			key={id}
			onClick={() =>
				setModalState({
					show: true,
					ModalContentComponent: (props) => <EditTaskModal {...props} id={id} />,
				})
			}
			Header={() => (
				<Text>
					<strong>{title}</strong>
				</Text>
			)}
			Body={() => <Text wrap="wrap">{description ? description : 'No description'}</Text>}
		/>
	);
};

export default Task;
