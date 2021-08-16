import HttpService from '../HttpService/HttpService';

const route = 'tasks/';

class TaskService {
    constructor() {
        this.HttpService = new HttpService(true);
    }

    listTasks = async () => this.HttpService.get(route);

    getTask = async (id) => this.HttpService.get(`${route}${id}/`);

    createTask = async (data) => this.HttpService.post(route, data);

    updateTask = async (data) => this.HttpService.put(`${route}${data.id}/`, data);
}

const taskService = new TaskService();

export default taskService;
