import HttpService from '../HttpService/HttpService';

const route = 'dashboards/';

class DashboardService {
    constructor() {
        this.HttpService = new HttpService(true);
    }

    listDashboards = async () => this.HttpService.get(route);

    getDashboard = async (id) => this.HttpService.get(`${route}${id}/`);

    createDashboard = async (data) => this.HttpService.post(route, data);

    updateDashboard = async (data) => this.HttpService.put(`${route}${data.id}/`, data);

    deleteDashboard = async (id) => this.HttpService.delete(`${route}${id}/`);
}

const dashboardService = new DashboardService();

export default dashboardService;
