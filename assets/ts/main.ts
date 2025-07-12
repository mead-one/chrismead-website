window.addEventListener("DOMContentLoaded", initialise);

function initialise() {
    // Theme toggle
    const themeToggle: HTMLButtonElement | null = document.querySelector("button.theme-toggle");
    const themeIcon = document.getElementById("themeIcon");
    const body: HTMLBodyElement = document.body;

    // Check for saved theme preference or default to system preference
    const savedTheme: string | null = localStorage.getItem("theme");
    const systemPrefersDark: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Project image viewers
    const projectImageViewers: NodeListOf<HTMLDivElement> = document.querySelectorAll("div.image-viewer");

    // Set initial theme
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (systemPrefersDark) {
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    } else {
        body.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }

    // Theme toggle event listener
    themeToggle.addEventListener("click", () => {
        const currentTheme: string = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(newTheme);
    });

    // Update theme icon
    function updateThemeIcon(theme: string) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem("theme")) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href')) as HTMLElement;
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        });
    });

    // Set scroll direction on project image viewers
    for (let projectImageViewer of projectImageViewers) {
        projectImageViewer.addEventListener("wheel", (e: WheelEvent) => {
            e.preventDefault();
            projectImageViewer.scrollLeft += e.deltaY;
        });
    }
}
