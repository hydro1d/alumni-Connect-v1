const API_URL = 'http://localhost:5000/api';

export const getAuthToken = () => localStorage.getItem('token');
export const getUserInfo = () => JSON.parse(localStorage.getItem('user'));
export const isAuthenticated = () => !!getAuthToken();
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};

export const fetchAPI = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    // Set headers
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401 && endpoint !== '/auth/login') {
                logout(); // Auto logout on invalid token
            }
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Protect Routes logic checking auth state before rendering page content
export const checkAuth = (allowedRoles = []) => {
    if (!isAuthenticated()) {
        window.location.href = '/';
        return null;
    }
    
    const user = getUserInfo();
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.location.href = '/src/dashboard.html';
        return null;
    }
    
    return user;
};

// UI Helpers
export const showToast = (message, type = 'success') => {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast toast-top toast-end z-50';
        document.body.appendChild(toastContainer);
    }

    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const toast = document.createElement('div');
    toast.className = `alert ${alertClass} shadow-lg mb-2 cursor-pointer transition-opacity duration-300`;
    toast.innerHTML = `<div><span>${message}</span></div>`;
    
    toastContainer.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);

    toast.onclick = () => toast.remove();
};

// Theme Management
export const initTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
};

export const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dim' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

// Call initTheme right away so it applies fast
initTheme();
