import HttpService, { IHttpService } from './HttpService';
import { each, isEmpty } from 'lodash';
import { mapStatusToApi, mapStatusToClient } from '../utils/taskStatus';

import { Task } from './TaskService';

const route = 'sprints/';

export interface Sprint {
	id: string;
	title: string;
	description: string;
	createdDate: string;
	updatedDate: string;
	endDate: string;
	dashboard: string;
	tasks: Task[];
}

export interface CreateSprint {
	title: string;
	description: string;
	dashboard: string;
}

interface ISprintService {
	AuthorizedHttpService: IHttpService;
	getSprint: (id: string) => Promise<Sprint>;
	createSprint: (data: CreateSprint) => Promise<Sprint>;
	updateSprint: (data: Sprint) => Promise<Sprint>;
	deleteSprint: (id: string) => Promise<Sprint>;
	mapData: (sprint: Sprint, toApi: boolean) => Sprint;
}

class SprintService implements ISprintService {
	AuthorizedHttpService: IHttpService;

	constructor(httpService: typeof HttpService) {
		this.AuthorizedHttpService = new httpService(true);
	}

	mapData = (sprint: Sprint, toApi = false): Sprint => {
		const data: Sprint = { ...sprint };

		if (!isEmpty(data.tasks)) {
			each(data.tasks, (task: Task, index: number) => {
				data.tasks[index] = {
					...task,
					status: toApi ? mapStatusToApi(task.status) : mapStatusToClient(task.status),
				};
			});
		}

		return data;
	};

	getSprint = async (id: string): Promise<Sprint> => {
		const sprint = await this.AuthorizedHttpService.get<Sprint>(`${route}${id}/`);
		return this.mapData(sprint);
	};

	createSprint = async (data: CreateSprint): Promise<Sprint> =>
		this.AuthorizedHttpService.post<Sprint, CreateSprint>(route, data);

	updateSprint = async (data: Sprint): Promise<Sprint> => {
		const response = await this.AuthorizedHttpService.put<Sprint>(
			`${route}${data.id}/`,
			this.mapData(data, true),
		);
		return this.mapData(response);
	};

	deleteSprint = async (id: string): Promise<Sprint> =>
		this.AuthorizedHttpService.delete<Sprint>(`${route}${id}/`);
}

const sprintService = new SprintService(HttpService);

export default sprintService;
