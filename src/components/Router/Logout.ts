import { FC, useContext } from 'react';

import { LoaderContext } from '../../common/context/LoaderContextProvider';

const Logout: FC = () => {
	const { showLoader } = useContext(LoaderContext);

	showLoader(true);
	window.localStorage.removeItem('user');
	window.location.href = '/login';
	showLoader(false);

	return null;
};

export default Logout;
