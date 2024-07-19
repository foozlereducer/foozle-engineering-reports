// cookieManager.js
import { parse } from 'cookie';

export const getAuthTokenFromCookies = (req) => {
    const cookies = parse(req.headers.cookie || '');
    const authCookie = cookies.auth ? JSON.parse(cookies.auth) : null;
    return authCookie?.token;
};

export const setAuthCookie = (res, token, user) => {
    res.cookie('auth', JSON.stringify({ token, user }), {
        httpOnly: true,
        sameSite: 'strict',
        secure: true, // set to true if you're using https
        maxAge: 60 * 60 * 24 * 30, // expires in 30 days
    });
};
