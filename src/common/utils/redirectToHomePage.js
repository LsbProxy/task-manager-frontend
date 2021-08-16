const redirectToHomePage = (redirect = false) => {
    if (redirect) {
        window.location.href = '/';
    }
};

export default redirectToHomePage;
