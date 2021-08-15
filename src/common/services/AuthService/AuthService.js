import HttpService from '../HttpService/HttpService';

const routes = {
    login: 'login/',
};

class AuthService {
    constructor() {
        this.HttpService = new HttpService();
    }

    login = async (email, password) => this.HttpService.post(routes.login, { email, password });
}

const authService = new AuthService();

export default authService;
