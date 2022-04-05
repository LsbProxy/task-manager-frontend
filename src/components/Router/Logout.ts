import { FC } from 'react';
import { useLoader } from './../../common/context/LoaderContextProvider';

const Logout: FC = () => {
	const { showLoader } = useLoader();

	showLoader(true);
	window.localStorage.removeItem('user');
	window.location.href = '/login';
	showLoader(false);

	return null;
};

export default Logout;
