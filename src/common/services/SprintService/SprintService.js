import { each, isEmpty } from 'lodash';

import { mapStatusToApi, mapStatusToClient } from '../../utils/taskStatus';
import HttpService from '../HttpService/HttpService';

const route = 'sprints/';

class SprintService {
    constructor() {
        this.HttpService = new HttpService(true);
    }

    mapData = (sprint, toApi = false) => {
        const data = { ...sprint };

        if (!isEmpty(data.tasks)) {
            each(data.tasks, (task, index) => {
                data.tasks[index] = {
                    ...task,
                    status: toApi ? mapStatusToApi(task.status) : mapStatusToClient(task.status),
                };
            });
        }

        return data;
    };

    getSprint = async (id) => {
        const sprint = await this.HttpService.get(`${route}${id}/`);
        return this.mapData(sprint);
    };

    createSprint = async (data) => this.HttpService.post(route, data);

    updateSprint = async (data) => {
        const response = await this.HttpService.put(
            `${route}${data.id}/`,
            this.mapData(data, true),
        );
        return this.mapData(response);
    };

    deleteSprint = async (id) => this.HttpService.delete(`${route}${id}/`);
}

const sprintService = new SprintService();

export default sprintService;
