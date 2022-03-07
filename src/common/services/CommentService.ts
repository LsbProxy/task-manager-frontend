import HttpService, { IHttpService } from './HttpService';

const route = 'comments/';

interface CreateComment {
	content: string;
	author: string;
	task: string;
}

interface ICommentService {
	AuthorizedHttpService: IHttpService;
	getComment: (id: string) => Promise<Comment>;
	createComment: (data: CreateComment) => Promise<Comment>;
	updateComment: (data: Comment) => Promise<Comment>;
	deleteComment: (id: string) => Promise<Comment>;
}

export interface Comment {
	id: string;
	author: string;
	content: string;
	createdDate: string;
	updatedDate: string;
	task: string;
}

class CommentService implements ICommentService {
	AuthorizedHttpService: IHttpService;

	constructor(httpService: typeof HttpService) {
		this.AuthorizedHttpService = new httpService(true);
	}

	getComment = async (id: string): Promise<Comment> =>
		this.AuthorizedHttpService.get<Comment>(`${route}${id}/`);

	createComment = async (data: CreateComment): Promise<Comment> =>
		this.AuthorizedHttpService.post<Comment, CreateComment>(route, data);

	updateComment = async (data: Comment): Promise<Comment> =>
		this.AuthorizedHttpService.put<Comment>(`${route}${data.id}/`, data);

	deleteComment = async (id: string): Promise<Comment> =>
		this.AuthorizedHttpService.delete<Comment>(`${route}${id}/`);
}

const commentService = new CommentService(HttpService);

export default commentService;
