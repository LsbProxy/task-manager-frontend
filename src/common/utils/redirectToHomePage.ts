const redirectToHomePage = (redirect = false): void => {
	if (redirect) {
		window.location.href = '/';
	}
};

export default redirectToHomePage;
