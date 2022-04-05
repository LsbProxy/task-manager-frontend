import React, { FC, useCallback } from 'react';
import { findIndex, map } from 'lodash';

import Comment from './Comment';
import Container from '../../Container';
import { Comment as IComment } from '../../../common/services/CommentService';
import NewComment from './NewComment';
import { Task } from '../../../common/services/TaskService';
import Text from '../../Text';

interface Props {
	task: Task;
	updateTask: (task: Task) => void;
}

const CommentSection: FC<Props> = ({ task, updateTask }) => {
	const updateComments = useCallback(
		(index: number, comment?: IComment) => {
			const newTask: Task = { ...task };

			if (comment) {
				newTask.comments[index] = comment;
			} else {
				newTask.comments.splice(index, 1);
			}

			return newTask;
		},
		[task],
	);

	const getCommentIndex = (id: string) => {
		return findIndex(task.comments, (comment: IComment) => id === comment.id);
	};

	return (
		<Container>
			<Text margin={{ bottom: 1 }}>Comments</Text>
			<Container>
				{map(task.comments, (comment: IComment) => (
					<Comment
						key={comment.id}
						comment={comment}
						getIndex={getCommentIndex}
						updateTask={updateTask}
						updateComments={updateComments}
					/>
				))}
				<NewComment task={task} updateTask={updateTask} />
			</Container>
		</Container>
	);
};

export default CommentSection;
