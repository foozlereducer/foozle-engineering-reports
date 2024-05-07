export const authSaveCookieController = (Auth) => async (req, res, next) => {
    try {
        Auth.storeAuthData(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const authIsAuthenticatedController = (Auth) => async (req, res, next) => {
    try {
        Auth.isAuthenticated(req, res, next);
        res.status(200).send('Made it to the Auth controller');
    } catch (error) {
        next(error);
    }
}
