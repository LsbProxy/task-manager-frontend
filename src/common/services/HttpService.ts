import {
	camelCase,
	capitalize,
	each,
	isEmpty,
	isObject,
	isPlainObject,
	replace,
	snakeCase,
	toLower,
} from 'lodash';

const { REACT_APP_API_ENDPOINT } = process.env;

interface Error {
	code: string;
	message: string;
}

interface MappedError {
	isApiError: boolean;
	message: string;
}

interface Json {
	[K: string]: string | number | boolean | Json;
}

export interface IHttpService {
	requiresAuthHeader: boolean;
	fetchData: <T>(route: string, request: RequestInit) => Promise<T>;
	mapError: (err: Error) => void;
	convertKeysToCamelCase: (json: Json | Json[]) => Json | Json[];
	convertKeysToSnakeCase: (json: Json | Json[]) => Json | Json[];
	constructRoute: (route: string) => string;
	constructRequest: (method: string, data?: Record<string, Json>) => RequestInit;
	get: <T>(route: string) => Promise<T>;
	post: <T, R>(route: string, data: R) => Promise<T>;
	put: <T>(route: string, data: Partial<T> | T) => Promise<T>;
	delete: <T>(route: string) => Promise<T>;
}

class HttpService implements IHttpService {
	requiresAuthHeader: boolean;

	constructor(requiresAuthHeader = false) {
		this.requiresAuthHeader = requiresAuthHeader;
	}

	fetchData = <T>(route: string, request: RequestInit): Promise<T> =>
		fetch(route, request)
			.then((response) => {
				window.localStorage.setItem('lastTimeStamp', JSON.stringify(new Date()));

				if (response.status >= 400) {
					return response.json().then((json) => {
						throw json;
					});
				}

				if (response.status === 204) {
					return {} as T;
				}

				return response.json().then((json) => this.convertKeysToCamelCase(json)) as Promise<T>;
			})
			.catch((err) => this.mapError(err));

	mapError = (err: Error) => {
		if (err.code === 'token_not_valid') {
			window.location.href = '/logout';
		}

		const mappedError: Record<string, MappedError[]> = { error: [] };

		each(err, (value: string | Record<string, Record<string, string>>, key: string) => {
			if (isObject(value)) {
				each(value, (val: string) => {
					const loweredValue: string = toLower(val);
					const message: string =
						loweredValue.indexOf('this field') > -1
							? capitalize(replace(loweredValue, 'this field', key))
							: val;
					mappedError.error.push({ message, isApiError: true });
				});
			} else {
				mappedError.error.push({ message: value as string, isApiError: true });
			}
		});

		if (isEmpty(mappedError.error) && err.message) {
			mappedError.error.push({ message: err.message, isApiError: true });
		}

		throw mappedError;
	};

	convertKeysToCamelCase = (json: Json | Json[]) => {
		const data: Json | Json[] = isPlainObject(json) ? {} : [];

		for (const [key, value] of Object.entries(json)) {
			if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
				(data as Json)[camelCase(key)] = value;
			} else {
				(data as Json)[camelCase(key)] = this.convertKeysToCamelCase(
					(json as Json)[key] as Json,
				) as Json;
			}
		}

		return data;
	};

	convertKeysToSnakeCase = (json: Json | Json[]) => {
		const data: Json | Json[] = isPlainObject(json) ? {} : [];

		for (const [key, value] of Object.entries(json)) {
			if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
				(data as Json)[snakeCase(key)] = value;
			} else {
				(data as Json)[snakeCase(key)] = this.convertKeysToSnakeCase(
					(json as Json)[key] as Json,
				) as Json;
			}
		}

		return data;
	};

	constructRequest = (method: string, data?: Record<string, Json>) => {
		const request: RequestInit = {
			method,
			mode: 'cors',
			referrerPolicy: 'no-referrer',
			cache: 'no-cache',
			credentials: 'same-origin',
			redirect: 'follow',
			headers: { 'Content-Type': 'application/json' },
		};

		if (this.requiresAuthHeader) {
			const user = JSON.parse(window.localStorage.getItem('user') || '{}');
			request.headers = {
				...request.headers,
				authorization: `Bearer ${user.tokens.access}`,
			};
		}

		if (data) {
			request.body = JSON.stringify(this.convertKeysToSnakeCase(data));
		}

		return request;
	};

	constructRoute = (route: string) => REACT_APP_API_ENDPOINT + route;

	get = async <T>(route: string): Promise<T> =>
		this.fetchData(this.constructRoute(route), this.constructRequest('GET'));

	post = async <T>(route: string, data = {}): Promise<T> =>
		this.fetchData<T>(this.constructRoute(route), this.constructRequest('POST', data));

	put = async <T>(route: string, data = {}): Promise<T> =>
		this.fetchData(this.constructRoute(route), this.constructRequest('PUT', data));

	delete = async <T>(route: string): Promise<T> =>
		this.fetchData(this.constructRoute(route), this.constructRequest('DELETE'));
}

export default HttpService;
