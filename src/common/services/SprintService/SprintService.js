import HttpService from '../HttpService/HttpService';

const route = 'sprints/';

class SprintService {
    constructor() {
        this.HttpService = new HttpService(true);
    }

    getSprint = async (id) => this.HttpService.get(`${route}${id}/`);

    createSprint = async (data) => this.HttpService.post(route, data);

    updateSprint = async (data) => this.HttpService.put(`${route}${data.id}/`, data);
}

const sprintService = new SprintService();

export default sprintService;
