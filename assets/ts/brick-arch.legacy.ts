import { Project/*, ToolbarItem */} from "./projects";
document.addEventListener("DOMContentLoaded", initialise);

function initialise() {
    // const canvas = document.getElementById("arch-drawing-area");
    const container: HTMLDivElement = document.getElementById("brick-arch-container") as HTMLDivElement;
    const brickDivisionSel: HTMLSelectElement = document.getElementById("brick-division-toolbar-select") as HTMLSelectElement;
    const riseOrSkewSel: HTMLSelectElement = document.getElementById("rise-or-skew-toolbar-select") as HTMLSelectElement;

    const resizeObserver = new ResizeObserver(() => {
        const typeSelect: HTMLSelectElement = document.getElementById("arch-type-toolbar-select") as HTMLSelectElement;
        if (!typeSelect) {
            console.error("No arch type select element.");
            return;
        }
        const type = typeSelect.value;
        let tmpArch = createArchInstance(type);
        if (!tmpArch) {
            console.error("Failed to create arch instance.");
            return;
        }
        tmpArch.refreshCanvas();
    });

    resizeObserver.observe(container);

    let archInstance: Arch | null;

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



    Array.prototype.forEach.call(document.getElementById("arch-parameters-form").elements, element => {
        element.addEventListener("change", refreshCanvas);
    });

    archInstance = createArchInstance(archTypeSel.value);
    refreshCanvas();
}

class Arch extends Project {
    public toolbar: HTMLFormElement;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D | null;
    protected axes: HTMLElement;
    protected grid: HTMLElement;
    protected margin: number;
    protected drawingData!: ArchDrawingParameters;
    // protected toolbarContent?: ToolbarItem[];

    constructor(container: HTMLDivElement) {
        super(container);

        this.appId = "brick-arch";
        this.appTitle = "Brick Arch";
        
        this.buildContent();

        // this.container = container;
        // this.content = container.querySelector(".project-content");
        // this.toolbar = container.querySelector("#arch-parameters-form");
        this.toolbar = document.createElement("form") as HTMLFormElement;
        this.toolbar.setAttribute("id", "arch-parameters-form");
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "arch-drawing-area");
        this.ctx = this.canvas.getContext('2d');
        this.axes = document.createElement("div");
        this.axes.setAttribute("id", "arch-axes");
        this.grid = document.createElement("div");
        this.grid.setAttribute("id", "arch-grid");
        this.margin = 50;
        // this.drawingData = {};
        
        // Build the toolbar
        const canvasContainer = document.createElement("div");
        canvasContainer.classList.add("canvas-container");

        this.toolbar.innerHTML = `
            <label for="arch-type-toolbar-select">Arch Type:</label>
            <select name="type" id="arch-type-toolbar-select">
                <option value="flat">Flat-Gauge</option>
                <option value="radial">Radial</option>
                <option value="semicircle">Semicircular</option>
                <option value="bullseye">Bullseye</option>
            </select>
            <span id="brick-width-or-count-toolbar-item" class="arch-toolbar-item arch-toolbar-item-with-select flat-toolbar-item radial-toolbar-item semicircle-toolbar-item bullseye-toolbar-item">
                <label for="brick-width-or-count-input">Brick width:</label>
                <input type="number" id="brick-width-or-count-input" name="brick-width-or-count" value="65" min="1">
                <select id="brick-division-toolbar-select" name="brick-division-select">
                    <option value="width">mm wide</option>
                    <option value="count">bricks wide</option>
                </select>
            </span>
            <span id="joint-size-toolbar-item" class="arch-toolbar-item flat-toolbar-item radial-toolbar-item semicircle-toolbar-item bullseye-toolbar-item">
                <label for="joint-size-input">Joint size:</label>
                <input type="number" id="joint-size-input" name="joint-size" value="10", min="1">
            </span>
            <span id="opening-toolbar-item" class="arch-toolbar-item flat-toolbar-item radial-toolbar-item semicircle-toolbar-item bullseye-toolbar-item">
                <label for="opening-toolbar-input">Base length:</label>
                <input type="number" id="opening-toolbar-input" name="opening" value="800" step="50" min="100">
            </span>
            <span id="height-toolbar-item" class="arch-toolbar-item flat-toolbar-item radial-toolbar-item semicircle-toolbar-item bullseye-toolbar-item">
                <label for="height-toolbar-input">Height:</label>
                <input type="number" id="height-toolbar-input" name="height" value="210" step="5" min="50">
            </span>
            <span id="skew-toolbar-item" class="arch-toolbar-item arch-toolbar-item-with-select flat-toolbar-item">
                <label for="skew-toolbar-input">Skew:</label>
                <input type="number" id="skew-toolbar-input" name="skew" value="20" min="1">
                <select id="skew-units-toolbar-select" name="skew-units-select">
                    <option value="deg">&nbsp;&deg;</option>
                    <option value="mm">mm</option>
                </select>
            </span>
            <span id="base-rise-toolbar-item" class="arch-toolbar-item flat-toolbar-item">
                <label for="base-rise-toolbar-input">Base rise:</label>
                <input type="number" id="base-rise-toolbar-input" name="base-rise" value="0" min="0">
            </span>
            <span id="top-rise-toolbar-item" class="arch-toolbar-item flat-toolbar-item">
                <label for="top-rise-toolbar-input">Top rise:</label>
                <input type="number" id="top-rise-toolbar-input" name="top-rise" value="0" min="0">
            </span>
            <span id="rise-or-skew-toolbar-item" class="arch-toolbar-item arch-toolbar-item-with-select radial-toolbar-item hidden">
                <label for="rise-or-skew-toolbar-input">Rise:</label>
                <input type="number" id="rise-or-skew-toolbar-input" name="rise-or-skew" value="20" min="1">
                <select name="rise-or-skew-select" id="rise-or-skew-toolbar-select">
                    <option value="rise">Rise (mm)</option>
                    <option value="deg">Skew (&deg;)</option>
                    <option value="mm">Skew (mm)</option>
                </select>
            </span>    
        `;

        const archTypeSel: HTMLSelectElement = this.toolbar.elements.namedItem("arch-type-toolbar-select") as HTMLSelectElement;

        archTypeSel.addEventListener("change", (e: Event) => {
            let archInstance: Arch | null = this.createArchInstance(e.target.value);
            selectArchToolbar(e.target.value);
        });

        this.content.appendChild(this.toolbar);
        canvasContainer.appendChild(this.canvas);
        canvasContainer.appendChild(this.axes);
        canvasContainer.appendChild(this.grid);
        this.content.appendChild(canvasContainer);
    }

    protected createArchInstance(type: string): Arch | null {
        const container: HTMLDivElement = document.getElementById("brick-arch-container") as HTMLDivElement;
        if (!container) {
            console.error("No container element.");
            return null;
        }
        switch (type) {
            case "flat":
                return new FlatArch(container);
            case "radial":
                return new RadialArch(container, type);
            case "semicircle":
                return new RadialArch(container, type);
            case "bullseye":
                return new RadialArch(container, type);
            default:
                console.error("Unknown arch type.");
                return null;
        }
    }

    protected selectArchToolbar(name) {
        // Hide all items
        this.toolbar.querySelectorAll(".arch-toolbar-item").forEach(item => {
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

    // protected generateData(): void {
    //     this.drawingData["drawingHeight"] = 315;
    //     this.drawingData["drawingWidth"] = 1000;
    //     this.drawingData["pieces"] = [{
    //         "bl": [100, 0],
    //         "br": [900, 0],
    //         "tr": [1000, 215],
    //         "tl": [0, 215]
    //     }];
    // }

    public refreshCanvas(): void {
        this.generateData();

        // this.dumpDrawingData();

        this.margin = Math.max(Math.round(this.drawingData["drawingHeight"] / 300), Math.round(this.drawingData["drawingWidth"] / 500)) * 50;

        this.canvas.height = this.drawingData["drawingHeight"] + (2 * this.margin);
        this.canvas.width = this.drawingData["drawingWidth"] + (2 * this.margin);

        this.drawShapes();
        this.adjustAxes();
        this.adjustViewport();
    }

    protected drawShapes(): void {
        const ctx = this.ctx;
        const pieces = this.drawingData["pieces"];

        if (!ctx) {
            console.error("2D context is null - can't draw shapes.");
            return;
        }

        ctx.translate(this.margin, this.margin);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // for (let piece of this.drawingData["pieces"]) {
        for (let i = 0; i < pieces.length; i++) {
            ctx.beginPath();
            ctx.lineTo(pieces[i]["bl"][0], pieces[i]["bl"][1]);
            ctx.lineTo(pieces[i]["br"][0], pieces[i]["br"][1]);
            ctx.lineTo(pieces[i]["tr"][0], pieces[i]["tr"][1]);
            ctx.lineTo(pieces[i]["tl"][0], pieces[i]["tl"][1]);
            ctx.closePath();
            ctx.stroke();
        }
    }

    protected adjustViewport(): void {
        const windowHeight = document.body.getBoundingClientRect().height;
        const titleBarHeight = this.toolbar.getBoundingClientRect().height;
        const toolbarHeight = this.toolbar.getBoundingClientRect().height;
        // const realCanvasHeight = this.canvas.parentElement.getBoundingClientRect().height;

        let maxHeight: number;
        if (this.container.classList.contains("maximised")) {
            maxHeight = windowHeight - titleBarHeight - toolbarHeight;
        } else {
            maxHeight = windowHeight * 0.6 - titleBarHeight - toolbarHeight;
        }

        var scale = Math.min(
            this.content.getBoundingClientRect().width / this.canvas.width,
            maxHeight / this.canvas.height
        );

        if (this.canvas.parentElement != null) {
            this.canvas.parentElement.style.width = `${this.canvas.width}px`;
            this.canvas.parentElement.style.height = `${this.canvas.height}px`;
            this.canvas.parentElement.style.transform = `scale(${scale})`;
            this.canvas.parentElement.style.transformOrigin = "top left";
        }

        let axesToggleBox = this.container.querySelector("#axes-toggle-box");
        if (axesToggleBox instanceof HTMLDivElement) {
            axesToggleBox.style.transform = `scale(${1 / scale})`;
        }
    }

    // Utility methods
    protected dumpDrawingData(): void {
        for (let key in this.drawingData) {
            const typedKey = key as keyof ArchDrawingParameters;
            const value = this.drawingData[typedKey];
            // console.log(`${key}: ${value} - ${typeof value}`);
            const displayValue = Array.isArray(value) ? `[$value.length} items]` : value;
            console.log(`${key}: ${displayValue} - ${typeof value}`);
        }
    }
}

// Can contain curves but is derived from linear measurements
export class FlatArch extends Arch {
    protected drawingData!: FlatArchDrawingParameters;

    constructor(container: HTMLDivElement) {
        super(container);
    }

    protected generateData(): void {
        // Calculate coordinates of pieces
        let bc: Point | null, bl: Point, br: Point,
            tc: Point | null, tr: Point, tl: Point;
        
        for (let i = 0; i < brickCount; i++) {
            // Plot bottom pieces
            if (baseRise <= 0 || !baseHalfAngle || !baseOrigin || !baseRadius || !baseBrickAngle || !baseJointAngle) {
                bl = [skewLength + (baseBrickWidth + jointSize) * i, 0];
                br = [skewLength + (baseBrickWidth + jointSize) * i + baseBrickWidth, 0];
            } else {
                let baseCurrentAngle = (Math.PI / 2) + baseHalfAngle - (baseBrickAngle / 2);
                bc = this.calculateEndpoint(baseOrigin[0], baseOrigin[1], baseRadius, baseCurrentAngle);

                bl = this.calculateEndpoint(bc[0], bc[1], baseBrickWidth / 2, baseCurrentAngle + (Math.PI / 2));
                br = this.calculateEndpoint(bc[0], bc[1], baseBrickWidth / 2, baseCurrentAngle - (Math.PI / 2));

                baseCurrentAngle -= baseBrickAngle + baseJointAngle;
            }
            // Plot top pieces
            if (topRise <= 0 || !topHalfAngle || !topBrickAngle || !topJointAngle || !topOrigin || !topRadius) {
                tl = [(topBrickWidth + jointSize) * i, height]
                tr = [(topBrickWidth + jointSize) * i + topBrickWidth, height];
            } else {
                let topCurrentAngle = (Math.PI / 2) + topHalfAngle - (topBrickAngle / 2);
                tc = this.calculateEndpoint(topOrigin[0], topOrigin[1], topRadius, topCurrentAngle);
                tc = tc

                tl = this.calculateEndpoint(tc[0], tc[1], topBrickWidth / 2, topCurrentAngle + (Math.PI / 2));
                tr = this.calculateEndpoint(tc[0], tc[1], topBrickWidth / 2, topCurrentAngle - (Math.PI / 2));

                topCurrentAngle -= topBrickAngle + topJointAngle;
            }

            this.drawingData.pieces.push({
                "bl": bl,
                "br": br,
                "tr": tr,
                "tl": tl
            });
        }
    }

    // Temporary logic until individual pieces are added - base class will contain master drawShapes function
    protected traceOutline(): void {
        const ctx = this.ctx;
        const dd = this.drawingData;

        if (!(ctx instanceof CanvasRenderingContext2D) || !dd["baseOrigin"] || !dd["baseRadius"] || !dd["baseFullAngle"]
           || !dd["topOrigin"] || !dd["topRadius"] || !dd["topFullAngle"]) {
            return
        }

        ctx.translate(this.margin, this.margin);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        ctx.beginPath();
        ctx.lineTo(dd["skewLength"], 0);
        if (dd["baseRise"] == 0) {
            ctx.lineTo(dd["skewLength"] + dd["opening"], 0);
        } else {
            ctx.arc(dd["baseOrigin"][0], dd["baseOrigin"][1], dd["baseRadius"], (Math.PI / 2) + (dd["baseFullAngle"] / 2), (Math.PI / 2) - (dd["baseFullAngle"] / 2), true);
        }
        ctx.lineTo(dd["opening"] + dd["skewLength"] * 2, dd["height"]);
        if (dd["topRise"] == 0) {
            ctx.lineTo(0, dd["height"]);
        } else {
            ctx.arc(dd["topOrigin"][0], dd["topOrigin"][1], dd["topRadius"], (Math.PI / 2) - (dd["topFullAngle"] / 2), (Math.PI / 2) + (dd["topFullAngle"] / 2));
        }
        ctx.closePath();
        ctx.stroke();
    }
}

export class RadialArch extends Arch {
    protected type: "radial" | "semicircle" | "bullseye";
    protected drawingData!: RadialArchDrawingParameters;
    constructor(canvas: HTMLDivElement, type: "radial" | "semicircle" | "bullseye") {
        super(canvas);
        this.type = type;
    }

    protected generateData(): void {
        // Calculate pieces
        let baseCurrentAngle = (Math.PI / 2) + skewAngle - (baseBrickAngle / 2);
        let topCurrentAngle = (Math.PI / 2) + skewAngle - (topBrickAngle / 2);

        if (this.type === "bullseye") {
            baseCurrentAngle -= (Math.PI) - baseBrickAngle / 2;
            topCurrentAngle -= (Math.PI) - topBrickAngle / 2;
        }

        let bc: Point, tc: Point, bl: Point,
            br: Point, tr: Point, tl: Point;

        for (let i = 0; i < brickCount; i++) {
            bc = this.calculateEndpoint(origin[0], origin[1], baseRadius, baseCurrentAngle);
            tc = this.calculateEndpoint(origin[0], origin[1], topRadius, topCurrentAngle);
            
            if (this.type !== "semicircle" || i > 0) {
                bl = this.calculateEndpoint(bc[0], bc[1], baseBrickWidth / 2, baseCurrentAngle + (Math.PI / 2));
                tl = this.calculateEndpoint(tc[0], tc[1], topBrickWidth / 2, topCurrentAngle + (Math.PI / 2));
            } else {
                bl = [height, 0];
                tl = [0, 0];
            }

            if (this.type !== "semicircle" || i < brickCount - 1) {
                br = this.calculateEndpoint(bc[0], bc[1], baseBrickWidth / 2, baseCurrentAngle - (Math.PI / 2));
                tr = this.calculateEndpoint(tc[0], tc[1], topBrickWidth / 2, topCurrentAngle - (Math.PI / 2));
            } else {
                br = [height + opening, 0];
                tr = [2 * height + opening, 0];
            }

            this.drawingData["pieces"].push({
                "bl": bl,
                "br": br,
                "tr": tr,
                "tl": tl
            });
            baseCurrentAngle -= baseBrickAngle + baseJointAngle;
            topCurrentAngle -= topBrickAngle + topJointAngle;
        }

    }

    // Temporary logic until individual pieces are added - base class will contain master drawShapes function
    protected traceOutline(): void {
        const ctx = this.ctx;
        const dd = this.drawingData;

    }

}


