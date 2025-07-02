import { Project } from "./projects";
document.addEventListener("DOMContentLoaded", initialise);

declare global {
    var Arch: FlatArch;
}

function initialise() {
    const container = document.getElementById("brick-arch-container");

    if (container instanceof HTMLDivElement) {
        globalThis.Arch = new FlatArch(container);
    } else {
        console.error(`No div with id "brick-arch-container"!`);
    }

    // OLD INITIALISE
    //
    // // const canvas = document.getElementById("arch-drawing-area");
    // const container = document.getElementById("arch");
    // const archTypeSel = document.getElementById("arch-type-toolbar-select");
    // const brickDivisionSel = document.getElementById("brick-division-toolbar-select");
    // const riseOrSkewSel = document.getElementById("rise-or-skew-toolbar-select");
    //
    // const resizeObserver = new ResizeObserver(() => {
    //     const type = document.getElementById("arch-type-toolbar-select").value;
    //     let tmpArch = createArchInstance(type);
    //     tmpArch.refreshCanvas();
    // });
    //
    // resizeObserver.observe(container);
    //
    // let archInstance;
    //
    // archTypeSel.addEventListener("change", e => {
    //     archInstance = createArchInstance(e.target.value);
    //     selectArchToolbar(e.target.value);
    // });
    //
    // brickDivisionSel.addEventListener("change", e => {
    //     switch (e.target.value) {
    //         case "width":
    //             e.target.parentElement.querySelector("label").innerText = "Brick width:";
    //             break;
    //         case "count":
    //             e.target.parentElement.querySelector("label").innerText = "Number of bricks:";
    //     }
    // });
    //
    // riseOrSkewSel.addEventListener("change", e=> {
    //     switch (e.target.value) {
    //         case "rise":
    //             e.target.parentElement.querySelector("label").innerText = "Rise:";
    //             break;
    //         case "deg":
    //         case "mm":
    //             e.target.parentElement.querySelector("label").innerText = "Skew:";
    //     }
    // });
    //
    // document.getElementById("axes-visibility-chk").addEventListener("change", e => {
    //     document.getElementById("arch-axes").style.visibility = e.target.checked ? "visible" : "hidden";
    // });
    //
    // document.getElementById("grid-visibility-chk").addEventListener("change", e => {
    //     document.getElementById("arch-grid").style.visibility = e.target.checked ? "visible" : "hidden";
    // });
    //
    // document.querySelectorAll(".project-window-minimise").forEach(element => {
    //     element.addEventListener("change", e => {
    //         const projectWindow = e.target.parentElement.parentElement.parentElement;
    //         const maximiseButton = e.target.parentElement.querySelector(".project-window-maximise");
    //         const content = projectWindow.querySelector(".project-content");
    //         // Un-maximise the window
    //         if (maximiseButton.checked) {
    //             maximiseButton.checked = false;
    //             projectWindow.classList.remove("maximised");
    //         }
    //
    //         if (e.target.checked) {
    //             container.classList.add("minimised");
    //             content.classList.add("minimised");
    //         } else {
    //             container.classList.remove("minimised");
    //             content.classList.remove("minimised");
    //         }
    //     });
    // });
    //
    // document.querySelectorAll(".project-window-maximise").forEach(element => {
    //     element.addEventListener("change", e => {
    //         const projectWindow = e.target.parentElement.parentElement.parentElement;
    //         const minimiseButton = e.target.parentElement.querySelector(".project-window-minimise");
    //         const content = projectWindow.querySelector(".project-content");
    //         // Un-minimise the window
    //         if (minimiseButton.checked) {
    //             minimiseButton.checked = false;
    //             content.classList.remove("minimised");
    //         }
    //
    //         if (e.target.checked) {
    //             projectWindow.classList.add("maximised");
    //         } else {
    //             projectWindow.classList.remove("maximised");
    //         }
    //         archInstance.refreshCanvas();
    //     });
    // });
    //
    // document.querySelectorAll(".project-window-close").forEach(element=> {
    //     element.addEventListener("click", e => {
    //         const windowName = e.target.parentElement.parentElement.querySelector("h2").innerText;
    //         if (confirm(`Really close ${windowName}?\nYou will need to refresh the page to use it again.`)) {
    //             e.target.parentElement.parentElement.parentElement.remove();
    //         }
    //     });
    // });
    //
    // document.getElementById("brick-arch-content").addEventListener("transitionend", (e) => {
    //     if (e.propertyName == "transform" && e.target.style.transform == "scaleY(1)") {
    //         refreshCanvas();
    //     }
    // });
    //
    // function refreshCanvas() {
    //     if (archInstance) {
    //         archInstance.refreshCanvas();
    //     }
    // }
    //
    // function selectArchToolbar(name) {
    //     // Hide all items
    //     archInstance.toolbar.querySelectorAll(".arch-toolbar-item").forEach(item => {
    //         item.classList.add("hidden");
    //     });
    //
    //     let selector;
    //    
    //     switch (name) {
    //         case "flat":
    //             selector = ".flat-toolbar-item";
    //             archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Base width:";
    //             break;
    //         case "radial":
    //             selector = ".radial-toolbar-item";
    //             archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Opening:";
    //             break;
    //         case "semicircle":
    //             selector = ".semicircle-toolbar-item";
    //             archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Opening:";
    //             break;
    //         case "bullseye":
    //             selector = ".bullseye-toolbar-item";
    //             archInstance.toolbar.querySelector("#opening-toolbar-item label").innerText = "Inner diameter:";
    //             break;
    //         default:
    //             selector = "";
    //     }
    //     archInstance.toolbar.querySelectorAll(selector).forEach(item => {
    //         item.classList.remove("hidden");
    //     });
    // }
    //
    // function createArchInstance(type) {
    //     switch (type) {
    //         case "flat":
    //             return new FlatArch(container);
    //         case "radial":
    //         case "semicircle":
    //         case "bullseye":
    //             return new RadialArch(container, type);
    //         default:
    //             console.error("Unknown arch type.");
    //     }
    // }
    //
    // Array.prototype.forEach.call(document.getElementById("arch-parameters-form").elements, element => {
    //     element.addEventListener("change", refreshCanvas);
    // });
    //
    // archInstance = createArchInstance(archTypeSel.value);
    // refreshCanvas();
    //
    // END OF OLD INITIALISE
}

interface ArchDrawingPiece {
    bl: [number, number];
    br: [number, number];
    tr: [number, number];
    tl: [number, number];
}

interface ArchDrawingParameters {
    drawingHeight: number;
    drawingWidth: number;
    opening: number;
    height: number;
    skewAngle: number; // in radians
    skewLength: number;
    brickCount: number;
    baseBrickWidth: number;
    baseBrickAngle: number | null;
    baseJointAngle: number | null;
    topBrickWidth: number;
    topBrickAngle: number | null;
    topJointAngle: number | null;
    baseRadius: number | null;
    baseFullAngle: number | null;
    topRadius: number | null;
    topFullAngle: number | null;
    pieces: Array<ArchDrawingPiece>;
}

interface FlatArchDrawingParameters extends ArchDrawingParameters {
    baseOrigin: [number, number] | null;
    baseRise: number;
    topRise: number;
    topOrigin: [number, number] | null;
}

interface RadialArchDrawingParameters extends ArchDrawingParameters {
    rise: number;
    origin: [number, number] | null;
    fullAngle: number;
}

class Arch extends Project {
    protected toolbar: HTMLFormElement;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D | null;
    protected axes: HTMLElement;
    protected grid: HTMLElement;
    protected margin: number;
    protected drawingData!: ArchDrawingParameters;

    constructor(container: HTMLDivElement) {
        super(container);

        this.appId = "brick-arch";
        this.appTitle = "Brick Arch";

        // this.container = container;
        // this.content = container.querySelector(".project-content");
        // this.toolbar = container.querySelector("#arch-parameters-form");
        this.toolbar = document.createElement("form") as HTMLFormElement;
        this.toolbar.setAttribute("id", "arch-parameters-form");
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "#arch-drawing-area");
        this.ctx = this.canvas.getContext('2d');
        this.axes = document.createElement("div");
        this.axes.setAttribute("id", "arch-axes");
        this.grid = document.createElement("div");
        this.grid.setAttribute("id", "#arch-grid");
        this.margin = 50;
        // this.drawingData = {};
    }

    protected generateData(): void {
        this.drawingData["drawingHeight"] = 315;
        this.drawingData["drawingWidth"] = 1000;
        this.drawingData["pieces"] = [{
            "bl": [100, 0],
            "br": [900, 0],
            "tr": [1000, 215],
            "tl": [0, 215]
        }];
    }

    protected refreshCanvas(): void {
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

    protected adjustAxes(): void {
        function generatePrecision(n: number): number {
            const nums = [10, 12.5, 25, 50];
            return nums[n % 4] * Math.pow(10, Math.floor(n / 4));
        }

        function nearestPrecision(distance: number, freq: number): number {
            let estimatedPrecision = Math.round(distance / freq);

            let n = 0;
            let currentPrecision = generatePrecision(n);
            let closestPrecision = currentPrecision;

            while (currentPrecision <= estimatedPrecision) {
                closestPrecision = currentPrecision;
                n++;
                currentPrecision = generatePrecision(n);
            }

            let nextPrecision = generatePrecision(n);
            if (Math.abs(nextPrecision - estimatedPrecision) < Math.abs(closestPrecision - estimatedPrecision)) {
                closestPrecision = nextPrecision;
            } else {
                n--;
            }

            return closestPrecision; //n; 
        }

        // Scaling
        let precision = Math.max(
            nearestPrecision(this.drawingData["drawingWidth"], 10),
            nearestPrecision(this.drawingData["drawingHeight"], 8)
        );
        var axesLabelSize = Math.max(Math.round(this.canvas.height / 40), Math.round(this.canvas.width / 50));

        this.axes.innerHTML = "";
        this.grid.innerHTML = "";

        const xAxis = document.createElement("div");
        xAxis.className = "axis x";
        xAxis.style.top = `${this.canvas.height - this.margin + 1}px`;
        xAxis.style.width = `${this.canvas.width}px`;
        this.axes.appendChild(xAxis);

        const yAxis = document.createElement("div");
        yAxis.className = "axis y";
        yAxis.style.left = `${this.margin -2}px`;
        yAxis.style.height = `${this.canvas.height}px`;
        this.axes.appendChild(yAxis);

        // Label the axes
        for (let i = 0; i <= this.canvas.width; i += precision) {
            const label = document.createElement("div");
            label.className = "axis-label x";
            label.style.left = `${this.margin + i - 1}px`;
            label.style.top = `${this.canvas.height - this.margin + axesLabelSize}px`;
            label.style.fontSize = `${axesLabelSize}px`;
            label.innerHTML = i.toString();
            this.axes.appendChild(label);

            const grid = document.createElement("div");
            grid.className = "grid y";
            grid.style.left = `${i + this.margin - 1}px`;
            grid.style.height = `${this.canvas.height}px`;
            this.grid.appendChild(grid);
        }
        
        for (let i = 0; i <= this.canvas.height; i += precision) {
            const label = document.createElement("div");
            label.className = "axis-label y";
            label.style.top = `${this.canvas.height - this.margin - i}px`;
            label.style.right = `${this.canvas.width - this.margin + axesLabelSize}px `;
            label.style.fontSize = `${axesLabelSize}px`;
            label.innerHTML = i.toString();
            this.axes.appendChild(label);

            const grid = document.createElement("div");
            grid.className = "grid x";
            grid.style.top = `${this.canvas.height - i - this.margin}px`;
            grid.style.width = `${this.canvas.width}px`;
            this.grid.appendChild(grid);
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

    protected degToRad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    protected radToDeg(rad: number): number {
        return rad * (180 / Math.PI);
    }

    // Cast a distance at an angle from a point
    protected calculateEndpoint(originX: number, originY: number, distance: number, angle: number): [number, number] {
        let pointX = originX + distance * Math.cos(angle);
        let pointY = originY + distance * Math.sin(angle);

        return [pointX, pointY];
    }

    // Conversion between lengths of chord and arc, using radius
    protected arcLengthToChordLength(arcLength: number, radius: number): number {
        return 2 * radius * Math.sin(arcLength / (2 * radius));
    }

    protected chordLengthToArcLength(chord: number, radius: number): number {
        return 2 * radius * Math.asin(chord / (2 * radius));
    }

    // Conversion between arc angle and arc Length
    protected arcAngleToArcLength(angle: number, radius: number): number {
        return angle * radius;
    }

    protected arcLengthToArcAngle(arcLength: number, radius: number): number {
        return arcLength / radius;
    }

    // Conversion between lengths of arc and tangent, using radius
    protected arcLengthToTangentLength(arcLength: number, radius: number): number {
        return radius * Math.tan(arcLength / radius);
    }

    protected tangentLengthToArcLength(tangent: number, radius: number): number {
        return radius * Math.atan(tangent / radius);
    }

    // Count number of bricks from maximum length of piece, length of joint between, and whether to include last joint
    // (for bullseye arches)
    protected countBricks(fullLength: number, maxLength: number, jointWidth: number, includeLastJoint: boolean | null): number {
        if (typeof includeLastJoint === "undefined" || !includeLastJoint) {
            fullLength += jointWidth;
        }

        return Math.ceil(fullLength / (maxLength + jointWidth));
    }
}

// Can contain curves but is derived from linear measurements
export class FlatArch extends Arch {
    protected drawingData!: FlatArchDrawingParameters;

    constructor(container: HTMLDivElement) {
        super(container);
    }

    protected generateData(): void {
        // Reading toolbar and calculations
        let elements: HTMLFormControlsCollection = this.toolbar.elements;
        let openingInput: HTMLInputElement = elements.namedItem("opening") as HTMLInputElement;
        let heightInput: HTMLInputElement = elements.namedItem("height") as HTMLInputElement;
        let skewInput: HTMLInputElement = elements.namedItem("skew") as HTMLInputElement;
        let skewUnitsSelect: HTMLSelectElement = elements.namedItem("skew-units-select") as HTMLSelectElement;
        let baseRiseInput: HTMLInputElement = elements.namedItem("base-rise") as HTMLInputElement;
        let topRiseInput: HTMLInputElement = elements.namedItem("top-rise") as HTMLInputElement;
        let brickDivisionSelect: HTMLSelectElement = elements.namedItem("brick-division-select") as HTMLSelectElement;
        let brickDivisionValueInput: HTMLInputElement = elements.namedItem("brick-width-or-count") as HTMLInputElement;
        let jointSizeInput: HTMLInputElement = elements.namedItem("joint-size") as HTMLInputElement;

        let opening: number = parseInt(openingInput.value);
        let height = parseInt(heightInput.value);
        let skew = parseInt(skewInput.value);
        let skewLength: number, skewAngle: number;
        if (skewUnitsSelect.value === "deg") {
            skewAngle = this.degToRad(skew);
            skewLength = this.degToLength(skew, height);
        } else {
            skewLength = skew;
            skewAngle = this.lengthToRad(skew, height);
        }
        let fullLength = opening + 2 * skewLength;
        let baseRise = parseInt(baseRiseInput.value);

        let baseRadius: number | null, baseOrigin: [number, number] | null, baseHalfAngle: number | null;
        if (baseRise > 0) {
            baseRadius = ((((opening / 2) ** 2) / baseRise) + baseRise) / 2;
            baseOrigin = [fullLength / 2, baseRise - baseRadius];
            baseHalfAngle = Math.atan((opening / 2) / (baseRadius - baseRise));
        } else {
            baseRadius = baseOrigin = baseHalfAngle = null;
        }

        let topRise = parseInt(topRiseInput.value);

        let topRadius: number | null, topOrigin: [number, number] | null, topHalfAngle: number | null;
        if (topRise > 0) {
            topRadius = ((((fullLength / 2) ** 2) / topRise) + topRise) / 2;
            topOrigin = [fullLength / 2, height + topRise - topRadius];
            topHalfAngle = Math.atan((fullLength / 2) / (topRadius - topRise));
        } else {
            topRadius = topOrigin = topHalfAngle = null;
        }

        let brickDivisionValue = parseInt(brickDivisionValueInput.value);
        let brickDivisionMethod = brickDivisionSelect.value;
        let jointSize = parseInt(jointSizeInput.value);
        
        let brickCount: number, topBrickAngle: number | null, topBrickWidth: number, topJointAngle: number | null,
            topFullArcLength: number | null, topJointArcLength: number | null;
        if (brickDivisionMethod === "width") {
            if (topRise <= 0 || !topRadius) {
                brickCount = this.countBricks(fullLength, brickDivisionValue, jointSize, false);
                if (brickCount % 2 === 0) {
                    brickCount++;
                }
                let justBricks = fullLength - (jointSize * (brickCount - 1));
                topBrickWidth = justBricks / brickCount;
                topBrickAngle = topJointAngle = topFullArcLength = topJointArcLength = null;
            } else {
                topFullArcLength = this.chordLengthToArcLength(fullLength, topRadius);
                topJointArcLength = this.chordLengthToArcLength(jointSize, topRadius);
                let maxBrickArcLength = this.tangentLengthToArcLength(brickDivisionValue, topRadius);
                brickCount = this.countBricks(topFullArcLength, maxBrickArcLength, topJointArcLength, false);
                if (brickCount % 2 === 0) {
                    brickCount++;
                }
            }
        } else {
            brickCount = brickDivisionValue;
            if (brickDivisionMethod === "count" && topRadius) {
                topFullArcLength = this.chordLengthToArcLength(fullLength, topRadius);
                topJointArcLength = this.chordLengthToArcLength(jointSize, topRadius);
            } else {
                topFullArcLength = topJointArcLength = null;
            }
        }

        // Calculate top brick size
        if (topRise <= 0 || !topFullArcLength || !topJointArcLength || !topRadius) {
            let topJustBricks = fullLength - (brickCount - 1) * jointSize;
            topBrickWidth = topJustBricks / brickCount;
            topBrickAngle = topJointAngle = null;
        } else {
            let justBricksArcLength = topFullArcLength - (topJointArcLength * (brickCount - 1));
            let topBrickArcLength = justBricksArcLength / brickCount;
            topBrickAngle = this.arcLengthToArcAngle(topBrickArcLength, topRadius);
            topBrickWidth = this.arcLengthToTangentLength(this.arcAngleToArcLength(topBrickAngle, topRadius), topRadius);
            topJointAngle = this.arcLengthToArcAngle(topJointArcLength, topRadius);
        }

        // Calculate base brick size
        let baseFullArcLength: number, baseJointArcLength: number, baseBrickAngle: number | null,
            baseBrickWidth: number, baseJointAngle: number | null;
        if (baseRise <= 0 || baseRadius == null) {
            let baseJustBricks = opening - (brickCount - 1) * jointSize;
            baseBrickWidth = baseJustBricks / brickCount;
            baseBrickAngle = null;
            baseJointAngle = null;
        } else {
            baseFullArcLength = this.chordLengthToArcLength(opening, baseRadius);
            baseJointArcLength = this.chordLengthToArcLength(jointSize, baseRadius);
            let justBricksArcLength = baseFullArcLength - (baseJointArcLength * (brickCount - 1));
            let baseBrickArcLength = justBricksArcLength / brickCount;
            baseBrickAngle = this.arcLengthToArcAngle(baseBrickArcLength, baseRadius);
            baseBrickWidth = this.arcLengthToTangentLength(this.arcAngleToArcLength(baseBrickAngle, baseRadius), baseRadius);
            baseJointAngle = this.arcLengthToArcAngle(baseJointArcLength, baseRadius);
        }

        this.drawingData = {
            // Dimensions of drawing 
            drawingHeight: height + topRise,
            drawingWidth: fullLength,

            // Store measurements in object
            opening: opening,
            height: height,
            skewLength: skewLength,
            skewAngle: skewAngle,
            baseRise: baseRise,
            baseRadius: baseRadius,
            baseOrigin: baseOrigin,
            baseFullAngle: (baseRise > 0 && baseHalfAngle) ? baseHalfAngle * 2 : null,
            baseBrickAngle: baseBrickAngle,
            topRise: topRise,
            topRadius: (topRise > 0) ? topRadius: null,
            topOrigin: (topRise > 0) ? topOrigin: null,
            topFullAngle: (topRise > 0 && topHalfAngle) ? topHalfAngle * 2 : null,
            topBrickAngle: (topRise > 0) ? topBrickAngle : null,

            brickCount: brickCount,
            baseBrickWidth: baseBrickWidth,
            topBrickWidth: topBrickWidth,
            baseJointAngle: baseJointAngle,
            topJointAngle: topJointAngle,

            // Clear pieces
            pieces: [],
        }

        // Calculate coordinates of pieces
        let bc: [number, number] | null, bl: [number, number], br: [number, number],
            tc: [number, number] | null, tr: [number, number], tl: [number, number];
        
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

    // Conversion between angle and actual length of skew of flat arches using actual height of arch
    protected degToLength(deg: number, height: number): number {
        return Math.tan(this.degToRad(deg)) * height;
    }

    protected radToLength(rad: number, height: number): number {
        return Math.tan(rad) * height;
    }

    protected lengthToDeg(length:number, height: number): number {
        return this.radToDeg(this.lengthToRad(length, height));
    }

    protected lengthToRad(length: number, height: number): number {
        return Math.atan(length / height);
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
        // Reading toolbar and calculations
        let openingInput: HTMLInputElement = this.toolbar.elements.namedItem("opening") as HTMLInputElement;
        let heightInput: HTMLInputElement = this.toolbar.elements.namedItem("height") as HTMLInputElement;
        let riseOrSkewInput: HTMLInputElement = this.toolbar.elements.namedItem("rise-or-skew") as HTMLInputElement;
        let riseOrSkewSelect: HTMLSelectElement = this.toolbar.elements.namedItem("rise-or-skew-select") as HTMLSelectElement;
        let brickDivisionInput: HTMLInputElement = this.toolbar.elements.namedItem("brick-width-or-count") as HTMLInputElement;
        let brickDivisionSelect: HTMLSelectElement = this.toolbar.elements.namedItem("brick-division-select") as HTMLSelectElement;
        let jointSizeInput: HTMLInputElement = this.toolbar.elements.namedItem("joint-size") as HTMLInputElement;

        let opening = parseInt(openingInput.value);
        let height = parseInt(heightInput.value);
        if (opening == null || height == null) {
            console.error("Null value for opening or height");
            return;
        }

        let rise: number, baseRadius: number | null, topRadius: number | null, skewAngle: number, skewLength: number,
            origin: [number, number] | null, fullAngle: number, drawingWidth: number, drawingHeight: number;
        switch (this.type) {
            case "radial":
                let measurement = parseInt(riseOrSkewInput.value);
                switch (riseOrSkewSelect.value) {
                    case "rise":
                        rise = measurement;
                        if (rise > 0) {
                            baseRadius = ((((opening / 2) ** 2) / rise) + rise) / 2;
                            topRadius = (baseRadius != null) ? baseRadius + height : null;
                            skewAngle = Math.atan((opening / 2) / (baseRadius - rise));
                            skewLength = this.radToLength(skewAngle, height);
                            origin = [(opening / 2) + skewLength, rise - baseRadius];
                            fullAngle = skewAngle * 2;
                        } else {
                            skewLength = skewAngle = fullAngle = 0;
                            baseRadius = topRadius = origin = null;
                        }
                        break;
                    case "deg":
                        skewAngle = this.degToRad(measurement);
                        if (skewAngle > 0) {
                            fullAngle = skewAngle * 2;
                            skewLength = this.radToLength(skewAngle, height);
                            baseRadius = (opening / 2) / Math.sin(skewAngle);
                            topRadius = (baseRadius != null) ? baseRadius + height : null;
                            rise = baseRadius - (opening / 2 / Math.tan(skewAngle));
                            origin = [(opening / 2) + skewLength, rise - baseRadius];
                        } else {
                            skewLength = skewAngle = fullAngle = rise = 0;
                            baseRadius = topRadius = origin = null;
                        }
                        break;
                    case "mm":
                        skewLength = measurement;
                        if (skewLength > 0) {
                            skewAngle = this.lengthToRad(skewLength, height);
                            baseRadius = (opening / 2) / Math.sin(skewAngle);
                            topRadius = (baseRadius != null) ? baseRadius + height : null;
                            rise = baseRadius - (opening / 2 / Math.tan(skewAngle));
                            fullAngle = skewAngle * 2;
                            origin = [(opening / 2) + skewLength, rise - baseRadius];
                        } else {
                            skewLength = skewAngle = fullAngle = rise = 0;
                            baseRadius = topRadius = origin = null;
                        }
                        break;
                    default:
                        console.error("Unrecognised rise/skew choice on radial arch.");
                        return;
                }

                if (baseRadius && topRadius && origin) {
                    drawingWidth = this.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2 - skewAngle)[0];
                    drawingHeight = this.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2)[1]; //rise + height;
                } else {
                    drawingWidth = opening + 2 * this.margin;
                    drawingHeight = height + 2 * this.margin;
                }

                break;
            case "semicircle":
                baseRadius = opening / 2;
                topRadius = baseRadius + height;
                skewAngle = this.degToRad(90);
                skewLength = height;
                rise = opening / 2;
                origin = [topRadius, 0];
                fullAngle = Math.PI;
                drawingWidth = 2 * topRadius;
                drawingHeight = topRadius;
                break;
            case "bullseye":
                baseRadius = opening / 2;
                topRadius = baseRadius + height;
                skewAngle = this.degToRad(180);
                skewLength = 0;
                rise = opening + height;
                origin = [topRadius, topRadius];
                fullAngle = 2 * Math.PI;
                drawingWidth = 2 * topRadius;
                drawingHeight = 2 * topRadius;
                break;
            default:
                console.error(`Unrecognised arch type: ${this.type}`);
                return;
        }

        if (fullAngle === null || baseRadius === null || topRadius === null || origin === null) {
            throw TypeError("Unexpected null value.");
        }

        let brickDivisionValue = parseInt(brickDivisionInput.value);
        let brickDivisionMethod = brickDivisionSelect.value;
        let jointSize = parseInt(jointSizeInput.value);
        let brickCount;

        let topArcLength = this.arcAngleToArcLength(fullAngle, topRadius);
        let topJointArcLength = this.tangentLengthToArcLength(jointSize, topRadius);

        if (brickDivisionMethod === "width") {
            let topBrickMaxArcLength = this.tangentLengthToArcLength(brickDivisionValue, topRadius);
            brickCount = this.countBricks(topArcLength, topBrickMaxArcLength, topJointArcLength, this.type === "bullseye" ? true : false);
            if (this.type !== "bullseye" && brickCount % 2 === 0) {
                brickCount++;
            }
        } else {
            brickCount = brickDivisionValue;
        }

        let topJustBricksArc = topArcLength - ((this.type === "bullseye" ? brickCount : brickCount - 1) * topJointArcLength);
        let topBrickArcLength = topJustBricksArc / brickCount;
        let topBrickWidth = this.arcLengthToTangentLength(topBrickArcLength, topRadius);
        let topBrickAngle = this.arcLengthToArcAngle(topBrickArcLength, topRadius);
        let topJointAngle = this.arcLengthToArcAngle(topJointArcLength, topRadius);
        // console.log(`Arc length: ${topArcLength}, 
        
        let baseArcLength = this.arcAngleToArcLength(fullAngle, baseRadius);
        let baseJointArcLength = this.tangentLengthToArcLength(jointSize, baseRadius);
        let baseJointAngle = this.arcLengthToArcAngle(baseJointArcLength, baseRadius);
        let baseJustBricksArc = baseArcLength - ((this.type === "bullseye" ? brickCount : brickCount - 1) * baseJointArcLength);
        let baseBrickArcLength = baseJustBricksArc / brickCount;
        let baseBrickAngle = this.arcLengthToArcAngle(baseBrickArcLength, baseRadius);
        let baseBrickWidth = this.arcLengthToTangentLength(baseBrickArcLength, baseRadius);

        // Dimensions of drawing
        this.drawingData = {
            drawingWidth: drawingWidth,
            drawingHeight: drawingHeight,

            // Store measurements in object
            opening: opening,
            height: height,
            rise: rise,
            skewAngle: skewAngle,
            skewLength: skewLength,
            baseRadius: baseRadius,
            topRadius: topRadius,
            origin: origin,
            fullAngle: fullAngle,
            brickCount: brickCount,
            baseBrickWidth: baseBrickWidth,
            topBrickWidth: topBrickWidth,
            baseBrickAngle: baseBrickAngle,
            topBrickAngle: topBrickAngle,
            baseJointAngle: baseJointAngle,
            topJointAngle: topJointAngle,
            baseFullAngle: null,
            topFullAngle: null,

            // Clear pieces
            pieces: []
        };

        // Calculate pieces
        let baseCurrentAngle = (Math.PI / 2) + skewAngle - (baseBrickAngle / 2);
        let topCurrentAngle = (Math.PI / 2) + skewAngle - (topBrickAngle / 2);

        if (this.type === "bullseye") {
            baseCurrentAngle -= (Math.PI) - baseBrickAngle / 2;
            topCurrentAngle -= (Math.PI) - topBrickAngle / 2;
        }

        let bc: [number, number], tc: [number, number], bl: [number, number],
            br: [number, number], tr: [number, number], tl: [number, number];

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

        if (dd["baseBrickAngle"] == null || dd["topBrickAngle"] == null || dd["baseJointAngle"] == null || dd["topJointAngle"] == null) {
            return;
        }

        if (!(ctx instanceof CanvasRenderingContext2D) || !dd["origin"] || !dd["baseRadius"] || !dd["topRadius"]) {
            return;
        }
        ctx.translate(this.margin, this.margin);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Temporary logic until individual pieces are added
        switch (this.type) {
            case "radial":
                ctx.beginPath();
                let point0 = this.calculateEndpoint(dd["origin"][0], dd["origin"][1], dd["baseRadius"], (Math.PI / 2) + dd["skewAngle"]);
                ctx.lineTo(point0[0], point0[1]);
                ctx.arc(dd["origin"][0], dd["origin"][1], dd["baseRadius"], (Math.PI / 2) + dd["skewAngle"], (Math.PI / 2) - dd["skewAngle"], true);
                let point2 = this.calculateEndpoint(dd["origin"][0], dd["origin"][1], dd["topRadius"], (Math.PI / 2) - dd["skewAngle"]);
                ctx.lineTo(point2[0], point2[1]);
                // ctx.lineTo(dd["skewLength"] * 2 + dd["opening"], Math.sin(dd["skewAngle"]) * dd["height"]);
                ctx.arc(dd["origin"][0], dd["origin"][1], dd["topRadius"], Math.PI / 2 - dd["skewAngle"], Math.PI / 2 + dd["skewAngle"]);
                ctx.closePath();
                ctx.stroke();
    
                break;
            case "semicircle":
                ctx.beginPath();
                ctx.lineTo(0,0);
                ctx.lineTo(dd["height"], 0);
                ctx.arc(dd["origin"][0], dd["origin"][1], dd["baseRadius"], (Math.PI / 2) + (dd["fullAngle"] / 2), (Math.PI / 2) - (dd["fullAngle"] / 2), true);
                ctx.lineTo(2 * dd["topRadius"], 0);
                ctx.arc(dd["origin"][0], dd["origin"][1], dd["topRadius"], (Math.PI / 2) - (dd["fullAngle"] / 2), (Math.PI / 2) + (dd["fullAngle"] / 2));
                ctx.stroke();
                break;
            case "bullseye":
                ctx.beginPath();
                ctx.arc(dd["origin"][0], dd["origin"][1], dd["baseRadius"], 0, 2 * Math.PI);
                ctx.stroke();
    
                ctx.beginPath();
                ctx.arc(dd["origin"][0], dd["origin"][1], dd["topRadius"], 0, 2 * Math.PI);
                ctx.stroke();
                break;
            default:
        }
    
        console.log(`Skew angle: ${this.radToDeg(dd["skewAngle"])}`);
        if (dd["baseFullAngle"] == null || dd["topFullAngle"] == null || dd["baseBrickAngle"] == null || dd["topBrickAngle"] == null) {
            return;
        }
        let currentBaseAngle = (Math.PI / 2) + dd["skewAngle"] - (dd["baseBrickAngle"] / 2);
        let currentTopAngle = (Math.PI / 2) + dd["skewAngle"] - (dd["topBrickAngle"] / 2);
        for (let i = 0; i < dd["brickCount"]; i++) {
            let bc = this.calculateEndpoint(dd["origin"][0], dd["origin"][1], dd["baseRadius"], currentBaseAngle);
            let bl = this.calculateEndpoint(bc[0], bc[1], dd["baseBrickWidth"] / 2, currentBaseAngle + (Math.PI / 2));
            let br = this.calculateEndpoint(bc[0], bc[1], dd["baseBrickWidth"] / 2, currentBaseAngle - (Math.PI / 2));
            let tc = this.calculateEndpoint(dd["origin"][0], dd["origin"][1], dd["topRadius"], currentTopAngle);
            let tl = this.calculateEndpoint(tc[0], tc[1], dd["topBrickWidth"] / 2, currentTopAngle + (Math.PI / 2));
            let tr = this.calculateEndpoint(tc[0], tc[1], dd["topBrickWidth"] / 2, currentTopAngle - (Math.PI / 2));
    
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.setLineDash([]);
            ctx.lineTo(bl[0], bl[1]);
            ctx.lineTo(tl[0], tl[1]);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.setLineDash([5, 15]);
            ctx.lineTo(bc[0], bc[1]);
            ctx.lineTo(tc[0], tc[1]);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.setLineDash([]);
            ctx.lineTo(br[0], br[1]);
            ctx.lineTo(tr[0], tr[1]);
            ctx.stroke();
    
            currentBaseAngle -= dd["baseBrickAngle"] + dd["baseJointAngle"];
            currentTopAngle -= dd["topBrickAngle"] + dd["topJointAngle"];
        }
    }

    // Conversion between angle and actual length of skew of radial arches using angular height of arch
    protected degToLength(deg: number, height: number): number {
        return Math.sin(this.degToRad(deg)) * height;
    }

    protected radToLength(rad: number, height: number): number {
        return Math.sin(rad) * height;
    }

    protected lengthToDeg(length: number, height: number): number {
        return this.radToDeg(this.lengthToRad(length, height));
    }

    protected lengthToRad(length: number, height: number): number {
        return Math.asin(length / height);
    }
}

