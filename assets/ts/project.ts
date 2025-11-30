// Defines a skeleton "window" to contain projects to be showcased on the website

export abstract class Project {
    appId: string;
    appTitle: string;
    protected container: HTMLDivElement;
    titlebar: HTMLDivElement;
    content: HTMLDivElement;

    constructor (appId: string, appTitle: string, container: HTMLDivElement) {
        // Placeholder values
        this.appId = appId;
        this.appTitle = appTitle;

        // Container element for app
        this.container = container;
        this.container.innerHTML = '';

        // Build titlebar
        this.titlebar = this.buildTitlebar();

        // Populate container with toolbar and body
        this.container.appendChild(this.titlebar);
        
        this.content = document.createElement("div");
        this.content.setAttribute("id", `${this.appId}-content`);
        this.content.classList.add("project-content");
        this.container.appendChild(this.content);
    }

    protected buildTitlebar(): HTMLDivElement {
        // Create and populate titlebar
        const titlebar = document.createElement("div");
        titlebar.classList.add("project-title-bar");

        // Titlebar icon
        const titlebarIcon = document.createElement("img");
        titlebarIcon.classList.add("project-window-icon");
        titlebarIcon.height = 18;
        titlebarIcon.setAttribute("src", `${this.appId}-icon.png`);
        titlebar.appendChild(titlebarIcon);

        // "Window title"
        const titlebarTitle = document.createElement("h2");
        titlebarTitle.innerText = this.appTitle;
        titlebar.appendChild(titlebarTitle);

        // "Window controls"
        const titlebarControls = document.createElement("span");
        titlebarControls.classList.add("project-window-controls");

        // Minimise button
        const titlebarMinimiseChk = document.createElement("input");
        titlebarMinimiseChk.type = "checkbox";
        titlebarMinimiseChk.setAttribute("id", `${this.appId}-minimise`);
        titlebarMinimiseChk.setAttribute("hidden", "");
        titlebarMinimiseChk.classList.add("project-window-minimise");
        titlebarMinimiseChk.addEventListener("change", e => {
            const checkbox: HTMLInputElement | null = e.target as HTMLInputElement;
            const projectWindow: HTMLDivElement | null = this.container;
            if (!checkbox || !projectWindow) {
                console.error("Missing checkbox or project window.");
                return;
            }

            const maximiseButton: HTMLInputElement | null = projectWindow.querySelector(".project-window-maximise");
            const content: HTMLDivElement | null = projectWindow.querySelector(".project-content");
            if (!maximiseButton || !content) {
                return;
            }
            // Un-maximise the window
            if (maximiseButton.checked) {
                maximiseButton.checked = false;
                projectWindow.classList.remove("maximised");
            }

            if (checkbox.checked) {
                this.container.classList.add("minimised");
                content.classList.add("minimised");
            } else {
                this.container.classList.remove("minimised");
                content.classList.remove("minimised");
            }
        });
        titlebarControls.appendChild(titlebarMinimiseChk);

        const titlebarMinimiseLbl = document.createElement("label");
        titlebarMinimiseLbl.htmlFor = `${this.appId}-minimise`;
        titlebarMinimiseLbl.classList.add("project-minimise-btn");
        titlebarControls.appendChild(titlebarMinimiseLbl);

        const titlebarMinimiseImg = document.createElement("img");
        titlebarMinimiseImg.src = "minimise-btn.png";
        titlebarMinimiseImg.width = 16;
        titlebarMinimiseImg.height = 16;
        titlebarMinimiseLbl.appendChild(titlebarMinimiseImg);

        // Maximise button
        const titlebarMaximiseChk = document.createElement("input");
        titlebarMaximiseChk.type = "checkbox";
        titlebarMaximiseChk.setAttribute("id", `${this.appId}-maximise`);
        titlebarMaximiseChk.setAttribute("hidden", "");
        titlebarMaximiseChk.classList.add("project-window-maximise");
        titlebarMaximiseChk.addEventListener("change", e => {
            const checkbox: HTMLInputElement | null = e.target as HTMLInputElement;
            const projectWindow: HTMLDivElement | null = this.container;
            const minimiseButton: HTMLInputElement | null = projectWindow.querySelector(".project-window-minimise");
            const content: HTMLDivElement | null = projectWindow.querySelector(".project-content");

            if (!checkbox || !projectWindow || !minimiseButton || !content) {
                console.error("No project window or minimise button found.");
                return;
            }

            // Un-minimise the window
            if (minimiseButton.checked) {
                minimiseButton.checked = false;
                content.classList.remove("minimised");
            }

            if (checkbox.checked) {
                projectWindow.classList.add("maximised");
            } else {
                projectWindow.classList.remove("maximised");
            }
        });
        titlebarControls.appendChild(titlebarMaximiseChk);

        const titlebarMaximiseLbl = document.createElement("label");
        titlebarMaximiseLbl.htmlFor = `${this.appId}-maximise`;
        titlebarMaximiseLbl.classList.add("project-maximise-btn");
        titlebarControls.appendChild(titlebarMaximiseLbl);

        const titlebarMaximiseImg = document.createElement("img");
        titlebarMaximiseImg.src = "maximise-btn.png";
        titlebarMaximiseImg.width = 16;
        titlebarMaximiseImg.height = 16;
        titlebarMaximiseLbl.appendChild(titlebarMaximiseImg);

        // Close button
        const titlebarCloseImg = document.createElement("img");
        titlebarCloseImg.src = "close-btn.png";
        titlebarCloseImg.classList.add("project-window-close");
        titlebarCloseImg.width = 16;
        titlebarCloseImg.height = 16;
        titlebarControls.appendChild(titlebarCloseImg);

        titlebar.appendChild(titlebarControls);

        return titlebar;
    }
}

