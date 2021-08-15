export default function logout() {
    window.localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
}
