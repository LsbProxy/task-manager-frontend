const { REACT_APP_API_ENDPOINT } = process.env;

class HttpService {
    fetch = (...params) =>
        fetch(...params).then((response) => {
            if (response.status > 400) {
                return response.json().then((error) => {
                    throw error;
                });
            }

            return response.json();
        });

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
