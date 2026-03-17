/**
 * ThemeController.js
 * Handles light/dark theme switching with persistence
 */

export class ThemeController {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-icon');
        this.themeText = this.themeToggle?.querySelector('.theme-text');

        // Load saved theme or default to dark
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(this.currentTheme);

        // Bind toggle event
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update button appearance
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('.theme-icon');
            const text = this.themeToggle.querySelector('.theme-text');

            if (theme === 'dark') {
                // In dark mode, show Sun icon (to switch to light)
                if (icon) icon.textContent = '☀';
                if (text) text.textContent = 'LIGHT';
                this.themeToggle.classList.remove('light-mode');
            } else {
                // In light mode, show Moon icon (to switch to dark)
                if (icon) icon.textContent = '☾';
                if (text) text.textContent = 'DARK';
                this.themeToggle.classList.add('light-mode');
            }
        }

        // Dispatch event for components that need to react
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    getTheme() {
        return this.currentTheme;
    }

    isDark() {
        return this.currentTheme === 'dark';
    }
}
