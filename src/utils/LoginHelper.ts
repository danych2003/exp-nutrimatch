import { jwtDecode } from 'jwt-decode';

export function isLoggedIn(): boolean {
    const token = getCookie("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return !!(decoded.exp && decoded.exp * 1000 > Date.now());
    } catch (error) {
        console.error('Token error:', error);
        return false;
    }
}

export function extractUserNameFromJwt(token: string): string {
    try {
        const decoded = jwtDecode(token);
        return <string>decoded.sub;
    } catch (error) {
        console.error('Token error:', error);
        throw new Error('Token not found');
    }
}

export function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}