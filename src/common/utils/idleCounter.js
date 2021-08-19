export function setTimeStamp() {
    window.localStorage.setItem('lastTimeStamp', JSON.stringify(new Date()));
}

export default function idleCounter() {
    const user = JSON.parse(window.localStorage.getItem('user'));

    clearInterval(this.idleCount);

    if (user) {
        this.idleCount = setInterval(() => {
            const parsedLastTimeStamp = Date.parse(
                JSON.parse(window.localStorage.getItem('lastTimeStamp')),
            );
            const lastTimeStamp = new Date(parsedLastTimeStamp);
            const newTimeStamp = new Date();

            if (newTimeStamp - lastTimeStamp > 30000) {
                window.location.href = '/logout';
            }
        }, 30000);
    }
}
