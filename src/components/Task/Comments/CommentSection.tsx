import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Error, NotificationContext } from '../../../common/context/NotificationContextProvider';
import React, { FC, useCallback, useContext, useState } from 'react';
import commentService, { Comment } from '../../../common/services/CommentService';
import { findIndex, map } from 'lodash';

import { LoaderContext } from '../../../common/context/LoaderContextProvider';
import NewComment from './NewComment';
import OutsideClickHandler from 'react-outside-click-handler';
import { Task } from '../../../common/services/TaskService';
import { User } from '../../../common/services/AuthService';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

interface EditedComment {
	id: string;
	content: string;
}

interface Props {
	task: Task;
	updateTask: (task: Task) => void;
}

const CommentSection: FC<Props> = ({ task, updateTask }) => {
	const [editedComment, setEditedComment] = useState<EditedComment>({ id: '', content: '' });
	const { addNotification, handleError } = useContext(NotificationContext);
	const { isLoading, showLoader } = useContext(LoaderContext);

	const updateComments = useCallback(
		(index: number, comment?: Comment) => {
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

	const handleEditComment = (id: string, content: string) =>
		setEditedComment({ id, content } as EditedComment);

	const handleDeleteComment = useCallback(
		(id: string) => async () => {
			try {
				const index = findIndex(task.comments, (comment: Comment) => id === comment.id);

				if (index < 0) {
					return;
				}

				showLoader(true);
				await commentService.deleteComment(id);

				updateTask(updateComments(index));
				addNotification('Successfully deleted comment');
			} catch (e) {
				handleError(e as Error);
			} finally {
				showLoader(false);
			}
		},
		[task],
	);

	const editComment = useCallback(async () => {
		try {
			const index = findIndex(task.comments, ({ id }: Comment) => id === editedComment.id);

			if (index < 0) {
				return;
			}

			const updatedComment = { ...task.comments[index], ...editedComment };

			showLoader(true);
			const newComment = await commentService.updateComment(updatedComment);

			updateTask(updateComments(index, newComment));
			setEditedComment({ id: '', content: '' } as EditedComment);
			addNotification('Successfully updated comment');
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [editedComment, task]);

	const renderCommentActionButtons = (author: string, id: string, content: string) =>
		user.username === author && (
			<div className="float-end">
				<Button
					className="mx-1"
					size="sm"
					variant="outline-secondary"
					onClick={() => handleEditComment(id, content)}
				>
					Edit
				</Button>
				<Button size="sm" variant="outline-danger" onClick={handleDeleteComment(id)}>
					Delete
				</Button>
			</div>
		);

	const renderCommentBody = (content: string, id: string) => (
		<Card.Body>
			<Row>
				<Col className="text-wrap">
					{editedComment.id === id ? (
						<OutsideClickHandler
							onOutsideClick={() => setEditedComment({ id: '', content: '' } as EditedComment)}
						>
							<Form.Control
								as="textarea"
								placeholder="Leave a comment here..."
								style={{ height: '100px' }}
								name="content"
								value={editedComment.content}
								onChange={({ target: { value } }) => handleEditComment(id, value)}
							/>
							<Button
								disabled={!editedComment.content || isLoading}
								className="mt-2"
								variant="primary"
								onClick={editComment}
							>
								Save
							</Button>
						</OutsideClickHandler>
					) : (
						content
					)}
				</Col>
			</Row>
		</Card.Body>
	);

	return (
		<Row className="mt-4">
			<Col sm={{ span: 12 }}>
				<strong>Comments</strong>
			</Col>
			<Col>
				{map(task.comments, ({ author, content, createdDate, updatedDate, id }: Comment) => {
					const created = new Date(createdDate).toLocaleString();
					const edited = new Date(updatedDate).toLocaleString();

					return (
						<Card key={`${author}.${createdDate}`} className="mt-2">
							<Card.Header>
								<div className="float-start">
									<small>
										<strong>{author}</strong>
									</small>
									<small className="px-2 text-secondary">{created}</small>
									{created !== edited && <small className="px-2 text-info">edited: {edited}</small>}
								</div>
								{renderCommentActionButtons(author, id, content)}
							</Card.Header>
							{renderCommentBody(content, id)}
						</Card>
					);
				})}
				<NewComment task={task} updateTask={updateTask} />
			</Col>
		</Row>
	);
};

export default CommentSection;
