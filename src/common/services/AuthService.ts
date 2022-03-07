import HttpService, { IHttpService } from './HttpService';

export type Tokens = {
	access: string;
	refresh: string;
};

export interface User {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	tokens: Tokens;
}

export interface RegisterUser {
	username: string;
	password: string;
	password2: string;
	email: string;
	firstName: string;
	lastName: string;
}

interface AuthServiceInterface {
	HttpService: IHttpService;
	AuthorizedHttpService: IHttpService;
	login: (email: string, password: string) => Promise<User>;
	register: (user: RegisterUser) => Promise<User>;
	refreshToken: (refresh: string) => Promise<Tokens>;
	getUsers: () => Promise<User[]>;
}

const routes = {
	register: 'register/',
	login: 'login/',
	refresh: 'login/refresh/',
	users: 'users/',
};

class AuthService implements AuthServiceInterface {
	HttpService: IHttpService;
	AuthorizedHttpService: IHttpService;

	constructor(httpService: typeof HttpService) {
		this.HttpService = new httpService();
		this.AuthorizedHttpService = new httpService(true);
	}

	login = async (email: string, password: string): Promise<User> =>
		this.HttpService.post<User, { email: string; password: string }>(routes.login, {
			email,
			password,
		});

	register = async ({
		username,
		password,
		password2,
		email,
		firstName,
		lastName,
	}: RegisterUser): Promise<User> =>
		this.HttpService.post<User, RegisterUser>(routes.register, {
			username,
			password,
			password2,
			email,
			firstName,
			lastName,
		});

	refreshToken = async (refresh: string): Promise<Tokens> =>
		this.AuthorizedHttpService.post<Tokens, { refresh: string }>(routes.refresh, { refresh });

	getUsers = async () => this.AuthorizedHttpService.get<User[]>(routes.users);
}

const authService = new AuthService(HttpService);

export default authService;
