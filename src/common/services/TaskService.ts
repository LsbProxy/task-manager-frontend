import HttpService, { IHttpService } from './HttpService';
import { mapStatusToApi, mapStatusToClient } from '../utils/taskStatus';

import { Comment } from './CommentService';

const route = 'tasks/';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: string;
	createdDate: string;
	updatedDate: string;
	author: string;
	assignedTo: string;
	sprint: string;
	comments: Comment[];
	dashboard: string;
}

export interface CreateTask {
	title: string;
	description: string;
	assignedTo: string;
	status: string;
	author: string;
	dashboard: string;
	sprint: string;
}

interface ITaskService {
	AuthorizedHttpService: IHttpService;
	listTasks: () => Promise<Task[]>;
	getTask: (id: string) => Promise<Task>;
	createTask: (data: CreateTask) => Promise<Task>;
	updateTask: (data: Task) => Promise<Task>;
	deleteTask: (id: string) => Promise<Task>;
	mapData: (task: Task, toApi: boolean) => Task;
}

class TaskService implements ITaskService {
	AuthorizedHttpService: IHttpService;

	constructor(httpService: typeof HttpService) {
		this.AuthorizedHttpService = new httpService(true);
	}

	mapData = (task: Task, toApi = false): Task => ({
		...task,
		status: toApi ? mapStatusToApi(task.status) : mapStatusToClient(task.status),
	});

	listTasks = async (): Promise<Task[]> => this.AuthorizedHttpService.get<Task[]>(route);

	getTask = async (id: string): Promise<Task> => {
		const response = await this.AuthorizedHttpService.get<Task>(`${route}${id}/`);
		return this.mapData(response);
	};

	createTask = async (data: CreateTask): Promise<Task> => {
		const response = await this.AuthorizedHttpService.post<Task, CreateTask>(
			route,
			this.mapData(data as Task, true),
		);
		return this.mapData(response);
	};

	updateTask = async (data: Task): Promise<Task> => {
		const response = await this.AuthorizedHttpService.put<Task>(
			`${route}${data.id}/`,
			this.mapData(data, true),
		);
		return this.mapData(response);
	};

	deleteTask = async (id: string): Promise<Task> =>
		this.AuthorizedHttpService.delete<Task>(`${route}${id}/`);
}

const taskService = new TaskService(HttpService);

export default taskService;
