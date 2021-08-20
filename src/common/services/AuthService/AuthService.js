import HttpService from '../HttpService/HttpService';

const routes = {
    login: 'login/',
    refresh: 'login/refresh/',
    users: 'users/',
};

class AuthService {
    constructor() {
        this.HttpService = new HttpService();
        this.AuthorizedHttpService = new HttpService(true);
    }

    login = async (email, password) => this.HttpService.post(routes.login, { email, password });

    refreshToken = async (refresh) => this.AuthorizedHttpService.post(routes.refresh, { refresh });

    getUsers = async () => this.AuthorizedHttpService.get(routes.users);
}

const authService = new AuthService();

export default authService;
