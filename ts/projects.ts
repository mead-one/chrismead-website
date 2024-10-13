document.addEventListener("DOMContentLoaded", initialise);

function initialise() {
    // const canvas = document.getElementById("arch-drawing-area");
    const container = document.getElementById("arch");
    const archTypeSel = document.getElementById("arch-type-toolbar-select");
    const brickDivisionSel = document.getElementById("brick-division-toolbar-select");
    const riseOrSkewSel = document.getElementById("rise-or-skew-toolbar-select");

    const resizeObserver = new ResizeObserver(() => {
        const type = document.getElementById("arch-type-toolbar-select").value;
        let tmpArch = createArchInstance(type);
        tmpArch.refreshCanvas();
    });

    resizeObserver.observe(container);

    let archInstance;

    archTypeSel.addEventListener("change", e => {
        archInstance = createArchInstance(e.target.value);
        selectArchToolbar(e.target.value);
    });

    brickDivisionSel.addEventListener("change", e => {
        switch (e.target.value) {
            case "width":
                e.target.parentElement.querySelector("label").innerText = "Brick width:";
                break;
            case "count":
                e.target.parentElement.querySelector("label").innerText = "Number of bricks:";
        }
    });

    riseOrSkewSel.addEventListener("change", e=> {
        switch (e.target.value) {
            case "rise":
                e.target.parentElement.querySelector("label").innerText = "Rise:";
                break;
            case "deg":
            case "mm":
                e.target.parentElement.querySelector("label").innerText = "Skew:";
        }
    });

    document.getElementById("axes-visibility-chk").addEventListener("change", e => {
        document.getElementById("arch-axes").style.visibility = e.target.checked ? "visible" : "hidden";
    });

    document.getElementById("grid-visibility-chk").addEventListener("change", e => {
        document.getElementById("arch-grid").style.visibility = e.target.checked ? "visible" : "hidden";
    });

    document.querySelectorAll(".project-window-minimise").forEach(element => {
        element.addEventListener("change", e => {
            const projectWindow = e.target.parentElement.parentElement.parentElement;
            const maximiseButton = e.target.parentElement.querySelector(".project-window-maximise");
            const content = projectWindow.querySelector(".project-content");
            // Un-maximise the window
            if (maximiseButton.checked) {
                maximiseButton.checked = false;
                projectWindow.classList.remove("maximised");
            }

            if (e.target.checked) {
                container.classList.add("minimised");
                content.classList.add("minimised");
            } else {
                container.classList.remove("minimised");
                content.classList.remove("minimised");
            }
        });
    });

    document.querySelectorAll(".project-window-maximise").forEach(element => {
        element.addEventListener("change", e => {
            const projectWindow = e.target.parentElement.parentElement.parentElement;
            const minimiseButton = e.target.parentElement.querySelector(".project-window-minimise");
            const content = projectWindow.querySelector(".project-content");
            // Un-minimise the window
            if (minimiseButton.checked) {
                minimiseButton.checked = false;
                content.classList.remove("minimised");
            }

            if (e.target.checked) {
                projectWindow.classList.add("maximised");
            } else {
                projectWindow.classList.remove("maximised");
            }
            archInstance.refreshCanvas();
        });
    });

    document.querySelectorAll(".project-window-close").forEach(element=> {
        element.addEventListener("click", e => {
            const windowName = e.target.parentElement.parentElement.querySelector("h2").innerText;
            if (confirm(`Really close ${windowName}?\nYou will need to refresh the page to use it again.`)) {
                e.target.parentElement.parentElement.parentElement.remove();
            }
        });
    });

    document.getElementById("brick-arch-content").addEventListener("transitionend", (e) => {
        if (e.propertyName == "transform" && e.target.style.transform == "scaleY(1)") {
            refreshCanvas();
        }
    });

    function refreshCanvas() {
        if (archInstance) {
            archInstance.refreshCanvas();
        }
    }

    function selectArchToolbar(name) {
        // Hide all items
        archInstance.toolbar.querySelectorAll(".arch-toolbar-item").forEach(item => {
            item.classList.add("hidden");
        });

        let selector;
        
        switch (name) {
            case "flat":
                selector = ".flat-toolbar-item";
                archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Base width:";
                break;
            case "radial":
                selector = ".radial-toolbar-item";
                archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Opening:";
                break;
            case "semicircle":
                selector = ".semicircle-toolbar-item";
                archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Opening:";
                break;
            case "bullseye":
                selector = ".bullseye-toolbar-item";
                archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Inner diameter:";
                break;
            default:
                selector = "";
        }
        archInstance.toolbar.querySelectorAll(selector).forEach(item => {
            item.classList.remove("hidden");
        });
    }

    function createArchInstance(type) {
        switch (type) {
            case "flat":
                return new FlatArch(container);
            case "radial":
            case "semicircle":
            case "bullseye":
                return new RadialArch(container, type);
            default:
                console.error("Unknown arch type.");
        }
    }

    Array.prototype.forEach.call(document.getElementById("arch-parameters-form").elements, element => {
        element.addEventListener("change", refreshCanvas);
    });

    archInstance = createArchInstance(archTypeSel.value);
    refreshCanvas();
}

