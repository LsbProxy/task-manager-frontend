import { mapStatusToApi, mapStatusToClient } from '../../utils/taskStatus';
import HttpService from '../HttpService/HttpService';

const route = 'tasks/';

class TaskService {
    constructor() {
        this.HttpService = new HttpService(true);
    }

    mapData = (task, toApi = false) => ({
        ...task,
        status: toApi ? mapStatusToApi(task.status) : mapStatusToClient(task.status),
    });

    listTasks = async () => this.HttpService.get(route);

    getTask = async (id) => {
        const response = await this.HttpService.get(`${route}${id}/`);
        return this.mapData(response);
    };

    createTask = async (data) => {
        const response = await this.HttpService.post(route, this.mapData(data, true));
        return this.mapData(response);
    };

    updateTask = async (data) => {
        const response = await this.HttpService.put(
            `${route}${data.id}/`,
            this.mapData(data, true),
        );
        return this.mapData(response);
    };

    deleteTask = async (id) => this.HttpService.delete(`${route}${id}/`);
}

const taskService = new TaskService();

export default taskService;
