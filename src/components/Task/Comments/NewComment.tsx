import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Error, NotificationContext } from '../../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useContext, useState } from 'react';

import { LoaderContext } from '../../../common/context/LoaderContextProvider';
import OutsideClickHandler from 'react-outside-click-handler';
import { Task } from '../../../common/services/TaskService';
import { User } from '../../../common/services/AuthService';
import commentService from '../../../common/services/CommentService';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

interface Props {
	task: Task;
	updateTask: (task: Task) => void;
}

const NewComent: FC<Props> = ({ task, updateTask }) => {
	const [comment, setComment] = useState('');
	const [focusComment, setFocusComment] = useState(false);
	const { showLoader, isLoading } = useContext(LoaderContext);
	const { handleError } = useContext(NotificationContext);

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
		<OutsideClickHandler onOutsideClick={() => setFocusComment(false)}>
			<Form className="mt-2" onSubmit={handleSubmitComment}>
				<FloatingLabel controlId="floatingTextarea2" label="Leave a comment here...">
					<Form.Control
						as="textarea"
						placeholder="Leave a comment here..."
						style={focusComment ? { height: '100px' } : {}}
						name="comment"
						value={comment}
						onChange={({ target: { value } }) => setComment(value)}
						onFocus={() => setFocusComment(true)}
					/>
				</FloatingLabel>
				{focusComment && (
					<Button
						disabled={!comment || isLoading || !focusComment}
						className="mt-2"
						variant="primary"
						type="submit"
					>
						Submit
					</Button>
				)}
			</Form>
		</OutsideClickHandler>
	);
};

export default NewComent;
