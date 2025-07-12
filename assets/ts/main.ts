window.addEventListener("DOMContentLoaded", initialise);

function initialise() {
    // Theme toggle
    const themeToggle: HTMLButtonElement | null = document.querySelector("button.theme-toggle");
    const body: HTMLBodyElement = document.body as HTMLBodyElement;

    // Check for saved theme preference or default to system preference
    const savedTheme: string | null = localStorage.getItem("theme");
    const systemPrefersDark: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Elements to scroll horizontally
    const imageViewers: NodeListOf<HTMLDivElement> = document.querySelectorAll("div.image-viewer");
    const codeBlocks: NodeListOf<HTMLPreElement> = document.querySelectorAll(".highlight>pre");

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
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme: string | null = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem("theme", newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Update theme icon
    function updateThemeIcon(theme: string) {
        const themeIcon = document.getElementById("themeIcon");
        if (!themeIcon) {
            return;
        }
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

    // Set scroll direction on image viewers
    for (let imageViewer of imageViewers) {
        imageViewer.addEventListener("wheel", (event: WheelEvent) => {
            // Scroll normally if contents are not overflowing
            if (imageViewer.scrollWidth <= imageViewer.clientWidth) {
                return;
            }

            event.preventDefault();
            const delta: number = event.deltaY;
            imageViewer.scrollLeft += delta;
        });
    }

    // Set scroll direction on code blocks
    for (let codeBlock of codeBlocks) {
        codeBlock.addEventListener("wheel", (event: WheelEvent) => {
            // Scroll normally if contents are not overflowing
            if (codeBlock.scrollWidth <= codeBlock.clientWidth) {
                return;
            }

            event.preventDefault();
            const delta: number = event.deltaY;
            codeBlock.scrollLeft += delta;
        });
    }
}
