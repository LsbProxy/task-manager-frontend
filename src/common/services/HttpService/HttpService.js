import { camelCase, each, isObject, isPlainObject } from 'lodash';
import { setTimeStamp } from '../../utils/idleCounter';

const { REACT_APP_API_ENDPOINT } = process.env;

class HttpService {
    constructor(requiresAuthHeader = false) {
        this.requiresAuthHeader = requiresAuthHeader;
    }

    fetch = (...params) =>
        fetch(...params).then((response) => {
            setTimeStamp();

            if (response.status > 400) {
                return response.json().then((err) => this.mapError(err));
            }

            if (response.status === 204) {
                return {};
            }

            return response.json().then((json) => this.convertKeysToCamelCase(json));
        });

    mapError = (err) => {
        if (err.code === 'token_not_valid') {
            window.location.href = '/logout';
        }

        throw err;
    };

    convertKeysToCamelCase = (json) => {
        const data = isPlainObject(json) ? {} : [];

        each(json, (value, key) => {
            if (isObject(value)) {
                data[camelCase(key)] = this.convertKeysToCamelCase(json[key]);
            } else {
                data[camelCase(key)] = value;
            }
        });

        return data;
    };

    constructRequest = (method, data) => {
        const request = {
            method,
            mode: 'cors',
            referrerPolicy: 'no-referrer',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: { 'Content-Type': 'application/json' },
        };

        if (this.requiresAuthHeader) {
            const user = JSON.parse(window.localStorage.getItem('user'));
            request.headers.authorization = `Bearer ${user.tokens.access}`;
        }

        if (data) {
            request.body = JSON.stringify(data);
        }

        return request;
    };

    constructRoute = (route) => REACT_APP_API_ENDPOINT + route;

    get = async (route) => this.fetch(this.constructRoute(route), this.constructRequest('GET'));

    post = async (route, data = {}) =>
        this.fetch(this.constructRoute(route), this.constructRequest('POST', data));

    put = async (route, data = {}) =>
        this.fetch(this.constructRoute(route), this.constructRequest('PUT', data));

    delete = async (route) =>
        this.fetch(this.constructRoute(route), this.constructRequest('DELETE'));
}

export default HttpService;
