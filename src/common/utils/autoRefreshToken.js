import { get } from 'lodash';
import authService from '../services/AuthService/AuthService';

export default function autoRefreshToken() {
    const user = JSON.parse(window.localStorage.getItem('user'));
    const refreshToken = get(user, 'tokens.refresh');

    clearInterval(this.refresh);

    if (refreshToken) {
        this.refresh = setInterval(async () => {
            const tokens = await authService.refreshToken(refreshToken);
            window.localStorage.setItem('user', JSON.stringify({ ...user, tokens }));
        }, 29000);
    }
}
