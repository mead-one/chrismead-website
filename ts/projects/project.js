"use strict";
// Defines a skeleton "window" to contain projects to be showcased on the website
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
var Project = /** @class */ (function () {
    function Project(container) {
        // Container element for app
        this.container = container;
        this.container.innerHTML = "";
        // Create and populate titlebar     
        this.titlebar = document.createElement("div");
        this.titlebar.classList.add("project-title-bar");
        // Titlebar icon
        var titlebarIcon = document.createElement("img");
        titlebarIcon.classList.add("project-window-icon");
        titlebarIcon.height = 18;
        titlebarIcon.setAttribute("src", "/static/img/".concat(this.appId, "-icon.png"));
        this.titlebar.appendChild(titlebarIcon);
        // "Window title"
        var titlebarTitle = document.createElement("h2");
        titlebarTitle.innerText = this.appTitle;
        this.titlebar.appendChild(titlebarTitle);
        // "Window controls"
        var titlebarControls = document.createElement("span");
        titlebarControls.classList.add("project-window-controls");
        // Minimise button
        var titlebarMinimiseChk = document.createElement("input");
        titlebarMinimiseChk.type = "checkbox";
        titlebarMinimiseChk.setAttribute("id", "".concat(this.appId, "-minimise"));
        titlebarMinimiseChk.setAttribute("hidden", "");
        titlebarMinimiseChk.classList.add("project-window-minimise");
        titlebarControls.appendChild(titlebarMinimiseChk);
        var titlebarMinimiseLbl = document.createElement("label");
        titlebarMinimiseLbl.htmlFor = "".concat(this.appId, "-minimise");
        titlebarMinimiseLbl.classList.add("project-minimise-btn");
        titlebarControls.appendChild(titlebarMinimiseLbl);
        var titlebarMinimiseImg = document.createElement("img");
        titlebarMinimiseImg.src = "/static/img/minimise-btn.png";
        titlebarMinimiseImg.width = 16;
        titlebarMinimiseImg.height = 16;
        titlebarMinimiseLbl.appendChild(titlebarMinimiseImg);
        // Maximise button
        var titlebarMaximiseChk = document.createElement("input");
        titlebarMaximiseChk.type = "checkbox";
        titlebarMaximiseChk.setAttribute("id", "".concat(this.appId, "-maximise"));
        titlebarMaximiseChk.setAttribute("hidden", "");
        titlebarMaximiseChk.classList.add("project-window-maximise");
        titlebarControls.appendChild(titlebarMaximiseChk);
        var titlebarMaximiseLbl = document.createElement("label");
        titlebarMaximiseLbl.htmlFor = "".concat(this.appId, "-maximise");
        titlebarMaximiseLbl.classList.add("project-maximise-btn");
        titlebarControls.appendChild(titlebarMaximiseLbl);
        var titlebarMaximiseImg = document.createElement("img");
        titlebarMaximiseImg.src = "/static/img/maximise_btn.png";
        titlebarMaximiseImg.width = 16;
        titlebarMaximiseImg.height = 16;
        titlebarMaximiseLbl.appendChild(titlebarMaximiseImg);
        // Close button
        var titlebarCloseImg = document.createElement("img");
        titlebarCloseImg.src = "/static/img/close-btn.png";
        titlebarCloseImg.classList.add("project-window-close");
        titlebarCloseImg.width = 16;
        titlebarCloseImg.height = 16;
        titlebarControls.appendChild(titlebarCloseImg);
        this.titlebar.appendChild(titlebarControls);
        // Populate container with toolbar and body
        container.appendChild(this.titlebar);
        this.content = document.createElement("div");
        this.content.setAttribute("id", "".concat(this.appId, "-content"));
        this.content.classList.add("project-content");
        container.appendChild(this.content);
    }
    // Generate default HTML for toolbar
    Project.prototype.getDefaultToolbarHtml = function () {
        return "div class=\"default-toolbar-content\">Default Toolbar</div>";
    };
    // Generate default HTML for body
    Project.prototype.getDefaultBodyHtml = function () {
        return "<div class=\"default-body-content\">Default Content</div>";
    };
    return Project;
}());
exports.Project = Project;
