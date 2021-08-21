import HttpService from '../HttpService/HttpService';

const routes = {
    register: 'register/',
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

    register = async (username, password, password2, email, firstName, lastName) =>
        this.HttpService.post(routes.register, {
            username,
            password,
            password2,
            email,
            firstName,
            lastName,
        });

    refreshToken = async (refresh) => this.AuthorizedHttpService.post(routes.refresh, { refresh });

    getUsers = async () => this.AuthorizedHttpService.get(routes.users);
}

const authService = new AuthService();

export default authService;
