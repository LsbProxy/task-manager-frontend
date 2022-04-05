import Button, { ButtonGroup } from '../../Button';
import { Error, useNotification } from '../../../common/context/NotificationContextProvider';
import React, { FC, useCallback, useState } from 'react';
import commentService, { Comment as IComment } from '../../../common/services/CommentService';

import Container from '../../Container';
import Description from '../../Description';
import OutsideClickHandler from 'react-outside-click-handler';
import Row from '../../Row';
import { Task } from '../../../common/services/TaskService';
import Text from '../../Text';
import { User } from '../../../common/services/AuthService';
import styled from 'styled-components';
import { useLoader } from '../../../common/context/LoaderContextProvider';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

const CommentContainer = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid #d6d6d6;
	border-radius: 0.2rem;
	margin-bottom: 0.5rem;
`;

const Header = styled(Row)`
	display: flex;
	background-color: #d6d6d6;
	padding: 0.5rem;
`;

const Body = styled(Row)`
	padding: 0.5rem;
`;

interface EditedComment {
	id: string;
	content: string;
}

interface Props {
	comment: IComment;
	getIndex: (id: string) => number;
	updateTask: (task: Task) => void;
	updateComments: (index: number, comment?: IComment) => Task;
}

const Comment: FC<Props> = ({ comment, getIndex, updateTask, updateComments }) => {
	const [editedComment, setEditedComment] = useState<EditedComment>({ id: '', content: '' });
	const { addNotification, handleError } = useNotification();
	const { isLoading, showLoader } = useLoader();

	const created = new Date(comment.createdDate).toLocaleString();
	const edited = new Date(comment.updatedDate).toLocaleString();

	const handleEditComment = (id: string, content: string) =>
		setEditedComment({ id, content } as EditedComment);

	const handleDeleteComment = useCallback(
		(id: string) => async () => {
			try {
				const index = getIndex(id);

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
		[],
	);

	const editComment = useCallback(async () => {
		try {
			const index = getIndex(editedComment.id);

			if (index < 0) {
				return;
			}

			const updatedComment = { ...comment, ...editedComment };

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
	}, [editedComment]);

	const renderCommentActionButtons = (author: string, id: string, content: string) =>
		user.username === author && (
			<ButtonGroup gap="0.5rem">
				<Button size="sm" variant="outline-info" onClick={() => handleEditComment(id, content)}>
					Edit
				</Button>
				<Button size="sm" variant="outline-warning" onClick={handleDeleteComment(id)}>
					Delete
				</Button>
			</ButtonGroup>
		);

	const renderCommentBody = (content: string, id: string) =>
		editedComment.id === id ? (
			<Container>
				<OutsideClickHandler
					onOutsideClick={() => setEditedComment({ id: '', content: '' } as EditedComment)}
					display="contents"
				>
					<Description
						placeholder="Leave a comment here..."
						height="100px"
						name="content"
						value={editedComment.content}
						onChange={({ target: { value } }) => handleEditComment(id, value)}
					/>
					<Button
						disabled={!editedComment.content || isLoading}
						variant="primary"
						onClick={editComment}
					>
						Save
					</Button>
				</OutsideClickHandler>
			</Container>
		) : (
			<Text wrap="wrap">{content}</Text>
		);

	return (
		<CommentContainer key={`${comment.author}.${comment.createdDate}`}>
			<Header align="space-between">
				<Row align="space-between">
					<Text>
						<small>
							<strong>{comment.author}</strong>
						</small>
					</Text>
					<Text margin={{ left: 1 }}>
						<small>{created}</small>
					</Text>
					{created !== edited && (
						<Text color="#00d5ff" margin={{ left: 1 }}>
							<small>edited: {edited}</small>
						</Text>
					)}
				</Row>
				{renderCommentActionButtons(comment.author, comment.id, comment.content)}
			</Header>
			<Body align="flex-start">{renderCommentBody(comment.content, comment.id)}</Body>
		</CommentContainer>
	);
};

export default Comment;
