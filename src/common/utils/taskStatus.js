import { find } from 'lodash';

const taskStatus = {
    todo: {
        value: 'TD',
        label: 'TODO',
    },
    inProgress: {
        value: 'IP',
        label: 'IN PROGRESS',
    },
    waiting: {
        value: 'WA',
        label: 'WAITING',
    },
    duplicate: {
        value: 'DU',
        label: 'DUPLICATE',
    },
    done: {
        value: 'DN',
        label: 'DONE',
    },
};

export const mapStatusToApi = (label) => {
    const { value } = find(taskStatus, { label });
    return value;
};

export const mapStatusToClient = (value) => {
    const { label } = find(taskStatus, { value });
    return label;
};

export default taskStatus;
