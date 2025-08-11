import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// สร้าง theme store
function createThemeStore() {
	const { subscribe, set, update } = writable('light');

	// Helper function to apply theme to DOM and localStorage
	const applyTheme = (theme) => {
		if (browser) {
			localStorage.setItem('theme', theme);
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	};

	return {
		subscribe,
		// ตั้งค่า theme
		setTheme: (theme) => {
			applyTheme(theme);
			set(theme);
		},
		// สลับ theme
		toggleTheme: () => {
			update((currentTheme) => {
				const newTheme = currentTheme === 'light' ? 'dark' : 'light';
				applyTheme(newTheme);
				return newTheme;
			});
		},
		// โหลด theme จาก localStorage
		initTheme: () => {
			if (browser) {
				const stored = localStorage.getItem('theme');
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const theme = stored || (prefersDark ? 'dark' : 'light');

				applyTheme(theme);
				set(theme);
			}
		}
	};
}

export const theme = createThemeStore();