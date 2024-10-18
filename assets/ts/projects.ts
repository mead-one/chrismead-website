// Defines a skeleton "window" to contain projects to be showcased on the website

export class Project {
    public appId: string;
    public appTitle: string;
    public container: HTMLDivElement;
    protected titlebar: HTMLDivElement;
    protected content: HTMLDivElement;

    constructor (container: HTMLDivElement) {
        // Container element for app
        this.container = container;
        this.container.innerHTML = "";
        
        // Create and populate titlebar     
        this.titlebar = document.createElement("div");
        this.titlebar.classList.add("project-title-bar");

        // Titlebar icon
        const titlebarIcon = document.createElement("img");
        titlebarIcon.classList.add("project-window-icon");
        titlebarIcon.height = 18;
        titlebarIcon.setAttribute("src", `/static/img/${this.appId}-icon.png`);
        this.titlebar.appendChild(titlebarIcon);

        // "Window title"
        const titlebarTitle = document.createElement("h2");
        titlebarTitle.innerText = this.appTitle;
        this.titlebar.appendChild(titlebarTitle);

        // "Window controls"
        const titlebarControls = document.createElement("span");
        titlebarControls.classList.add("project-window-controls");

        // Minimise button
        const titlebarMinimiseChk = document.createElement("input");
        titlebarMinimiseChk.type = "checkbox";
        titlebarMinimiseChk.setAttribute("id", `${this.appId}-minimise`);
        titlebarMinimiseChk.setAttribute("hidden", "");
        titlebarMinimiseChk.classList.add("project-window-minimise");
        titlebarControls.appendChild(titlebarMinimiseChk);

        const titlebarMinimiseLbl = document.createElement("label");
        titlebarMinimiseLbl.htmlFor = `${this.appId}-minimise`;
        titlebarMinimiseLbl.classList.add("project-minimise-btn");
        titlebarControls.appendChild(titlebarMinimiseLbl);

        const titlebarMinimiseImg = document.createElement("img");
        titlebarMinimiseImg.src = "/static/img/minimise-btn.png";
        titlebarMinimiseImg.width = 16;
        titlebarMinimiseImg.height = 16;
        titlebarMinimiseLbl.appendChild(titlebarMinimiseImg);

        // Maximise button
        const titlebarMaximiseChk = document.createElement("input");
        titlebarMaximiseChk.type = "checkbox";
        titlebarMaximiseChk.setAttribute("id", `${this.appId}-maximise`);
        titlebarMaximiseChk.setAttribute("hidden", "");
        titlebarMaximiseChk.classList.add("project-window-maximise");
        titlebarControls.appendChild(titlebarMaximiseChk);

        const titlebarMaximiseLbl = document.createElement("label");
        titlebarMaximiseLbl.htmlFor = `${this.appId}-maximise`;
        titlebarMaximiseLbl.classList.add("project-maximise-btn");
        titlebarControls.appendChild(titlebarMaximiseLbl);

        const titlebarMaximiseImg = document.createElement("img");
        titlebarMaximiseImg.src = "/static/img/maximise_btn.png";
        titlebarMaximiseImg.width = 16;
        titlebarMaximiseImg.height = 16;
        titlebarMaximiseLbl.appendChild(titlebarMaximiseImg);

        // Close button
        const titlebarCloseImg = document.createElement("img");
        titlebarCloseImg.src = "/static/img/close-btn.png";
        titlebarCloseImg.classList.add("project-window-close");
        titlebarCloseImg.width = 16;
        titlebarCloseImg.height = 16;
        titlebarControls.appendChild(titlebarCloseImg);

        this.titlebar.appendChild(titlebarControls);

        // Populate container with toolbar and body
        container.appendChild(this.titlebar);
        
        this.content = document.createElement("div");
        this.content.setAttribute("id", `${this.appId}-content`);
        this.content.classList.add("project-content");
        container.appendChild(this.content);
    }

    // Generate default HTML for toolbar
    protected getDefaultToolbarHtml(): string {
        return `div class="default-toolbar-content">Default Toolbar</div>`;
    }

    // Generate default HTML for body
    protected getDefaultBodyHtml(): string {
        return `<div class="default-body-content">Default Content</div>`;
    }
}

