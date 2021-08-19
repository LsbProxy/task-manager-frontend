import HttpService from '../HttpService/HttpService';

const routes = {
    login: 'login/',
    refresh: 'login/refresh/',
};

class AuthService {
    constructor() {
        this.HttpService = new HttpService();
    }

    login = async (email, password) => this.HttpService.post(routes.login, { email, password });

    refreshToken = async (refresh) => {
        const httpService = new HttpService(true);
        return httpService.post(routes.refresh, { refresh });
    };
}

const authService = new AuthService();

export default authService;
