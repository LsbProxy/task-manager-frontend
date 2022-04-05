import { Error, useNotification } from '../../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';

import Button from '../../Button';
import Description from '../../Description';
import OutsideClickHandler from 'react-outside-click-handler';
import { Task } from '../../../common/services/TaskService';
import { User } from '../../../common/services/AuthService';
import commentService from '../../../common/services/CommentService';
import { useLoader } from '../../../common/context/LoaderContextProvider';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

interface Props {
	task: Task;
	updateTask: (task: Task) => void;
}

const NewComent: FC<Props> = ({ task, updateTask }) => {
	const [comment, setComment] = useState('');
	const [focusComment, setFocusComment] = useState(false);
	const { showLoader, isLoading } = useLoader();
	const { handleError } = useNotification();

	const handleSubmitComment = useCallback(
		async (e: ChangeEvent<HTMLFormElement>) => {
			try {
				e.preventDefault();
				showLoader(true);
				const newComment = await commentService.createComment({
					content: comment,
					author: user.username,
					task: task.id,
				});

				setComment('');
				setFocusComment(false);
				updateTask({ ...task, comments: [...task.comments, newComment] });
			} catch (e) {
				handleError(e as Error);
			} finally {
				showLoader(false);
			}
		},
		[task, comment, user],
	);

	return (
		<OutsideClickHandler onOutsideClick={() => setFocusComment(false)} display="contents">
			<form onSubmit={handleSubmitComment}>
				<Description
					placeholder="Leave a comment here..."
					height={focusComment ? '100px' : '50px'}
					name="comment"
					value={comment}
					onChange={({ target: { value } }) => setComment(value)}
					onFocus={() => setFocusComment(true)}
				/>
				{focusComment && (
					<Button disabled={!comment || isLoading || !focusComment} variant="primary" type="submit">
						Submit
					</Button>
				)}
			</form>
		</OutsideClickHandler>
	);
};

export default NewComent;
