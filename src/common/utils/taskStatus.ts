export type StatusKey = 'todo' | 'inProgress' | 'waiting' | 'duplicate' | 'done';

export type TaskStatusLabel = 'TODO' | 'IN PROGRESS' | 'WAITING' | 'DUPLICATE' | 'DONE';

export type TaskStatusValue = 'TD' | 'IP' | 'WA' | 'DU' | 'DN';

export interface TaskStatus {
	value: string;
	label: string;
}

const taskStatus: Record<StatusKey, TaskStatus> = {
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

export const mapStatusToApi = (label: string): string => {
	const item = Object.values(taskStatus).find((i) => i.label === label);
	return item ? item.value : '';
};

export const mapStatusToClient = (value: string): string => {
	const item = Object.values(taskStatus).find((i) => i.value === value);
	return item ? item.label : '';
};

export default taskStatus;
