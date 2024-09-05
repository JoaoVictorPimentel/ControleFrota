export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token; 
}

export function getToken() {
    return localStorage.getItem('token');
}