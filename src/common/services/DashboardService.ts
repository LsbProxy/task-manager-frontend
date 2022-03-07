import HttpService, { IHttpService } from './HttpService';

import { Sprint } from './SprintService';

const route = 'dashboards/';

export interface Dashboard {
	id: string;
	title: string;
	description: string;
	createdDate: string;
	updatedDate: string;
	members: string[];
	sprints: Sprint[];
}

export interface CreateDashboard {
	title: string;
	description: string;
	members: string[];
}

interface IDashboardService {
	AuthorizedHttpService: IHttpService;
	listDashboards: () => Promise<Dashboard[]>;
	getDashboard: (id: string) => Promise<Dashboard>;
	createDashboard: (data: CreateDashboard) => Promise<Dashboard>;
	updateDashboard: (data: Dashboard) => Promise<Dashboard>;
	deleteDashboard: (id: string) => Promise<Dashboard>;
}

class DashboardService implements IDashboardService {
	AuthorizedHttpService: IHttpService;

	constructor(httpService: typeof HttpService) {
		this.AuthorizedHttpService = new httpService(true);
	}

	listDashboards = async (): Promise<Dashboard[]> =>
		this.AuthorizedHttpService.get<Dashboard[]>(route);

	getDashboard = async (id: string): Promise<Dashboard> =>
		this.AuthorizedHttpService.get<Dashboard>(`${route}${id}/`);

	createDashboard = async (data: CreateDashboard): Promise<Dashboard> =>
		this.AuthorizedHttpService.post<Dashboard, CreateDashboard>(route, data);

	updateDashboard = async (data: Dashboard): Promise<Dashboard> =>
		this.AuthorizedHttpService.put<Dashboard>(`${route}${data.id}/`, data);

	deleteDashboard = async (id: string): Promise<Dashboard> =>
		this.AuthorizedHttpService.delete<Dashboard>(`${route}${id}/`);
}

const dashboardService = new DashboardService(HttpService);

export default dashboardService;
