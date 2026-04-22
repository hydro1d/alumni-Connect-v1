import { getUserInfo, logout, toggleTheme } from './api.js';

export const loadNavbar = () => {
    const user = getUserInfo();
    const navContainer = document.getElementById('navbar-container');
    if (!navContainer || !user) return;

    navContainer.innerHTML = `
        <div class="sticky top-0 z-50 pt-4 px-4 lg:px-8 fade-in">
            <div class="navbar glass-panel rounded-full px-6 flex justify-between shadow-lg mx-auto max-w-7xl">
                <div class="flex-1 flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl pb-1 shadow-md">
                        A
                    </div>
                    <a href="/src/dashboard.html" class="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden sm:flex">
                        AlumniConnect
                    </a>
                </div>
                
                <div class="flex-none hidden lg:flex">
                    <ul class="menu menu-horizontal px-1 gap-2 font-medium tracking-wide">
                        <li><a href="/src/dashboard.html" class="hover:text-primary transition-colors">Dashboard</a></li>
                        <li><a href="/src/alumni.html" class="hover:text-primary transition-colors">Alumni Directory</a></li>
                        <li><a href="/src/jobs.html" class="hover:text-primary transition-colors">Job Board</a></li>
                    </ul>
                </div>

                <div class="flex-none flex items-center gap-3">
                    <label class="swap swap-rotate btn btn-ghost btn-circle btn-sm">
                        <input type="checkbox" id="theme-toggle" />
                        <!-- sun icon -->
                        <svg class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                        <!-- moon icon -->
                        <svg class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                    </label>

                    <div class="dropdown dropdown-end">
                        <label tabindex="0" class="btn btn-ghost btn-circle avatar hover:ring-2 ring-primary transition-all">
                            <div class="w-9 rounded-full bg-gradient-to-br from-primary to-neutral text-white flex items-center justify-center shadow-md">
                                <span class="text-lg font-semibold">${user.name.charAt(0).toUpperCase()}</span>
                            </div>
                        </label>
                        <ul tabindex="0" class="mt-4 z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-64 border border-base-200">
                            <li class="px-4 py-3 border-b border-base-200 mb-2">
                                <span class="font-bold text-lg leading-tight">${user.name}</span>
                                <span class="text-xs text-primary font-semibold uppercase tracking-wider">${user.role}</span>
                            </li>
                            <li class="mb-1"><a href="/src/profile.html" class="justify-between px-4 py-2 hover:bg-base-200 rounded-lg">View Profile<span class="badge badge-sm badge-primary">New</span></a></li>
                            <li class="mb-1"><a href="/src/dashboard.html" class="px-4 py-2 hover:bg-base-200 rounded-lg md:hidden">Dashboard</a></li>
                            <li class="mb-1"><a href="/src/alumni.html" class="px-4 py-2 hover:bg-base-200 rounded-lg md:hidden">Directory</a></li>
                            <li class="mb-1"><a href="/src/jobs.html" class="px-4 py-2 hover:bg-base-200 rounded-lg md:hidden">Job Board</a></li>
                            <li><a id="logout-btn" class="text-error px-4 py-2 hover:bg-error/10 hover:text-error rounded-lg font-medium mt-2">Sign Out</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dim') themeToggle.checked = true;

    themeToggle.addEventListener('change', toggleTheme);
    document.getElementById('logout-btn').addEventListener('click', logout);
};