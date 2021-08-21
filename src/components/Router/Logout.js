import { useContext } from 'react';
import { LoaderContext } from '../../common/context/LoaderContextProvider';

export default function Logout() {
    const { showLoader } = useContext(LoaderContext);

    showLoader(true);
    window.localStorage.removeItem('user');
    window.location.href = '/login';
    showLoader(false);

    return null;
}
