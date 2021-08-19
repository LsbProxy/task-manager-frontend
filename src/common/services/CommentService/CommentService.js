import HttpService from '../HttpService/HttpService';

const route = 'comments/';

class CommentService {
    constructor() {
        this.HttpService = new HttpService(true);
    }

    getComment = async (id) => this.HttpService.get(`${route}${id}/`);

    createComment = async (data) => this.HttpService.post(route, data);

    updateComment = async (data) => this.HttpService.put(`${route}${data.id}/`, data);

    deleteComment = async (id) => this.HttpService.delete(`${route}${id}/`);
}

const commentService = new CommentService();

export default commentService;
