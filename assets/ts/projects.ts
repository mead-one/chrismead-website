// Defines a skeleton "window" to contain projects to be showcased on the website

// enum ToolbarItemType {
//     Button,
//     Checkbox,
//     Radio,
//     Text,
//     Select,
//     Span
// }
//
// interface SelectChoice {
//     value: string;
//     label: string;
// }
//
// export interface ToolbarItem {
//     id: string;
//     name: string;
//     label: string;
//     type: ToolbarItemType;
//     choices?: SelectChoice[]; // Only used for select
//     classList?: string[]; // Only used for span
// }

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
        titlebarIcon.setAttribute("src", `/img/${this.appId}-icon.png`);
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
        titlebarControls.appendChild(titlebarMinimiseChk);

        const titlebarMinimiseLbl = document.createElement("label");
        titlebarMinimiseLbl.htmlFor = `${this.appId}-minimise`;
        titlebarMinimiseLbl.classList.add("project-minimise-btn");
        titlebarControls.appendChild(titlebarMinimiseLbl);

        const titlebarMinimiseImg = document.createElement("img");
        titlebarMinimiseImg.src = "/img/minimise-btn.png";
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
        titlebarMaximiseImg.src = "/img/maximise-btn.png";
        titlebarMaximiseImg.width = 16;
        titlebarMaximiseImg.height = 16;
        titlebarMaximiseLbl.appendChild(titlebarMaximiseImg);

        // Close button
        const titlebarCloseImg = document.createElement("img");
        titlebarCloseImg.src = "/img/close-btn.png";
        titlebarCloseImg.classList.add("project-window-close");
        titlebarCloseImg.width = 16;
        titlebarCloseImg.height = 16;
        titlebarControls.appendChild(titlebarCloseImg);

        titlebar.appendChild(titlebarControls);

        return titlebar;
    }

    // protected onMinimise(): void {
    //     // TODO: Minimise window
    //     const projectWindow = e.target.parentElement.parentElement.parentElement;
    //     const maximiseButton = e.target.parentElement.querySelector(".project-window-maximise");
    //     const content = projectWindow.querySelector(".project-content");
    //     // Un-maximise the window
    //     if (maximiseButton.checked) {
    //         maximiseButton.checked = false;
    //         projectWindow.classList.remove("maximised");
    //     }
    //
    //     if (e.target.checked) {
    //         this.container.classList.add("minimised");
    //         content.classList.add("minimised");
    //     } else {
    //         this.container.classList.remove("minimised");
    //         content.classList.remove("minimised");
    //     }
    // }
    //
    // protected onMaximise(): void {
    //     // TODO: Maximise window
    // }
    //
    // protected onClose(): void {
    //     // TODO: Close window
    // }
}

