document.addEventListener("DOMContentLoaded", initialise);

class Arch {
    constructor(container) {
        this.container = container;
        this.content = container.querySelector(".project-content");
        this.toolbar = container.querySelector("#arch-parameters-form");
        this.canvas = container.querySelector("#arch-drawing-area");
        this.ctx = this.canvas.getContext('2d');
        this.axes = container.querySelector("#arch-axes");
        this.grid = container.querySelector("#arch-grid");
        this.margin = 50;
        this.drawingData = {
            drawingHeight: undefined,
            drawingWidth: undefined,
            opening: undefined,
            height: undefined,
            skewAngle: undefined, // in radians
            skewLength: undefined,
            brickCount: undefined,
            baseBrickWidth: undefined,
            baseBrickAngle: undefined,
            baseJointAngle: undefined,
            topBrickWidth: undefined,
            topBrickAngle: undefined,
            topJointAngle: undefined,
            baseRise: undefined,
            baseRadius: undefined,
            baseFullAngle: undefined,
            baseBrickAngle: undefined,
            topRadius: undefined,
            topFullAngle: undefined,
            topBrickAngle: undefined,
            pieces: []
        };
    }

    refreshCanvas() {
        this.generateData();

        // this.dumpDrawingData();

        this.margin = Math.max(Math.round(this.drawingData["drawingHeight"] / 300), Math.round(this.drawingData["drawingWidth"] / 500)) * 50;

        this.canvas.height = this.drawingData["drawingHeight"] + (2 * this.margin);
        this.canvas.width = this.drawingData["drawingWidth"] + (2 * this.margin);

        this.drawShapes();
        this.adjustAxes();
        this.adjustViewport();
    }

    drawShapes() {
        const ctx = this.ctx;
        const pieces = this.drawingData["pieces"];
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

    adjustAxes() {
        function generatePrecision(n) {
            const nums = [10, 12.5, 25, 50];
            return nums[n % 4] * Math.pow(10, Math.floor(n / 4));
        }

        function nearestPrecision(distance, freq) {
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
            label.innerHTML = i;
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
            label.innerHTML = i;
            this.axes.appendChild(label);

            const grid = document.createElement("div");
            grid.className = "grid x";
            grid.style.top = `${this.canvas.height - i - this.margin}px`;
            grid.style.width = `${this.canvas.width}px`;
            this.grid.appendChild(grid);
        }
    }

    adjustViewport() {
        const windowHeight = document.body.getBoundingClientRect().height;
        const titleBarHeight = this.toolbar.getBoundingClientRect().height;
        const toolbarHeight = this.toolbar.getBoundingClientRect().height;
        const realCanvasHeight = this.canvas.parentElement.getBoundingClientRect().height;

        let maxHeight;
        if (this.container.classList.contains("maximised")) {
            maxHeight = windowHeight - titleBarHeight - toolbarHeight;
        } else {
            maxHeight = windowHeight * 0.6 - titleBarHeight - toolbarHeight;
        }

        var scale = Math.min(
            this.content.getBoundingClientRect().width / this.canvas.width,
            maxHeight / this.canvas.height
        );

        this.canvas.parentElement.style.width = `${this.canvas.width}px`;
        this.canvas.parentElement.style.height = `${this.canvas.height}px`;
        this.canvas.parentElement.style.transform = `scale(${scale})`;
        this.canvas.parentElement.style.transformOrigin = "top left";
        this.container.querySelector("#axes-toggle-box").style.transform = `scale(${1 / scale})`;
    }

    // Utility methods
    dumpDrawingData() {
        for (let key in this.drawingData) {
            console.log(`${key}: ${this.drawingData[key]} - ${typeof this.drawingData[key]}`);
        }
    }

    degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    radToDeg(rad) {
        return rad * (180 / Math.PI);
    }

    // Cast a distance at an angle from a point
    calculateEndpoint(originX, originY, distance, angle) {
        let pointX = originX + distance * Math.cos(angle);
        let pointY = originY + distance * Math.sin(angle);

        return [pointX, pointY];
    }

    // Conversion between lengths of chord and arc, using radius
    arcLengthToChordLength(arcLength, radius) {
        return 2 * radius * Math.sin(arcLength / (2 * radius));
    }

    chordLengthToArcLength(chord, radius) {
        return 2 * radius * Math.asin(chord / (2 * radius));
    }

    // Conversion between arc angle and arc Length
    arcAngleToArcLength(angle, radius) {
        return angle * radius;
    }

    arcLengthToArcAngle(arcLength, radius) {
        return arcLength / radius;
    }

    // Conversion between lengths of arc and tangent, using radius
    arcLengthToTangentLength(arcLength, radius) {
        return radius * Math.tan(arcLength / radius);
    }

    tangentLengthToArcLength(tangent, radius) {
        return radius * Math.atan(tangent / radius);
    }

    // Count number of bricks from maximum length of piece, length of joint between, and whether to include last joint
    // (for bullseye arches)
    countBricks(fullLength, maxLength, jointWidth, includeLastJoint) {
        if (typeof includeLastJoint === "undefined" || !includeLastJoint) {
            fullLength += jointWidth;
        }

        return Math.ceil(fullLength / (maxLength + jointWidth));
    }
}

// Can contain curves but is derived from linear measurements
class FlatArch extends Arch {
    constructor(canvas) {
        super(canvas);
        this.drawingData["baseOrigin"] = [undefined, undefined];
        this.drawingData["baseFullAngle"] = undefined; // in radians
        this.drawingData["topRise"] = undefined;
        this.drawingData["topOrigin"] = [undefined, undefined];
        this.drawingData["baseFullAngle"] = undefined;
    }

    generateData() {
        // Reading toolbar and calculations
        let opening = parseInt(this.toolbar.elements["opening"].value);
        let height = parseInt(this.toolbar.elements["height"].value);
        let skew = parseInt(this.toolbar.elements["skew"].value);
        let skewLength, skewAngle;
        if (this.toolbar.elements["skew-units-select"].value === "deg") {
            skewAngle = this.degToRad(skew);
            skewLength = this.degToLength(skew, height);
        } else {
            skewLength = skew;
            skewAngle = this.lengthToRad(skew, height);
        }
        let fullLength = opening + 2 * skewLength;
        let baseRise = parseInt(this.toolbar.elements["base-rise"].value);

        let baseRadius, baseOrigin, baseHalfAngle;
        if (baseRise > 0) {
            baseRadius = ((((opening / 2) ** 2) / baseRise) + baseRise) / 2;
            baseOrigin = [fullLength / 2, baseRise - baseRadius];
            baseHalfAngle = Math.atan((opening / 2) / (baseRadius - baseRise));
        }

        let topRise = parseInt(this.toolbar.elements["top-rise"].value);

        let topRadius, topOrigin, topHalfAngle;
        if (topRise > 0) {
            topRadius = ((((fullLength / 2) ** 2) / topRise) + topRise) / 2;
            topOrigin = [fullLength / 2, height + topRise - topRadius];
            topHalfAngle = Math.atan((fullLength / 2) / (topRadius - topRise));
        }

        let brickDivisionValue = parseInt(this.toolbar.elements["brick-width-or-count"].value);
        let brickDivisionMethod = this.toolbar.elements["brick-division-select"].value;
        let jointSize = parseInt(this.toolbar.elements["joint-size"].value);
        
        let brickCount, topBrickAngle, topBrickWidth, topJointAngle, topFullArcLength, topJointArcLength;
        if (brickDivisionMethod === "width") {
            if (topRise <= 0) {
                brickCount = this.countBricks(fullLength, brickDivisionValue, jointSize, false);
                if (this.type !== "bullseye" && brickCount % 2 === 0) {
                    brickCount++;
                }
                let justBricks = fullLength - (jointSize * (brickCount - 1));
                topBrickWidth = justBricks / brickCount;
                topBrickAngle = topJointAngle = "n/a";
            } else {
                topFullArcLength = this.chordLengthToArcLength(fullLength, topRadius);
                topJointArcLength = this.chordLengthToArcLength(jointSize, topRadius);
                let maxBrickArcLength = this.tangentLengthToArcLength(brickDivisionValue, topRadius);
                brickCount = this.countBricks(topFullArcLength, maxBrickArcLength, topJointArcLength, false);
                if (this.type !== "bullseye" && brickCount % 2 === 0) {
                    brickCount++;
                }
            }
        } else {
            brickCount = brickDivisionValue;
            if (brickDivisionMethod === "count") {
                topFullArcLength = this.chordLengthToArcLength(fullLength, topRadius);
                topJointArcLength = this.chordLengthToArcLength(jointSize, topRadius);
            }
        }

        // Calculate top brick size
        if (topRise <= 0) {
            let topJustBricks = fullLength - (brickCount - 1) * jointSize;
            topBrickWidth = topJustBricks / brickCount;
        } else {
            let justBricksArcLength = topFullArcLength - (topJointArcLength * (brickCount - 1));
            let topBrickArcLength = justBricksArcLength / brickCount;
            topBrickAngle = this.arcLengthToArcAngle(topBrickArcLength, topRadius);
            topBrickWidth = this.arcLengthToTangentLength(this.arcAngleToArcLength(topBrickAngle, topRadius), topRadius);
            topJointAngle = this.arcLengthToArcAngle(topJointArcLength, topRadius);
        }

        // Calculate base brick size
        let baseFullArcLength, baseJointArcLength, baseBrickAngle, baseBrickWidth, baseJointAngle;
        if (baseRise <= 0) {
            let baseJustBricks = opening - (brickCount - 1) * jointSize;
            baseBrickWidth = baseJustBricks / brickCount;
        } else {
            baseFullArcLength = this.chordLengthToArcLength(opening, baseRadius);
            baseJointArcLength = this.chordLengthToArcLength(jointSize, baseRadius);
            let justBricksArcLength = baseFullArcLength - (baseJointArcLength * (brickCount - 1));
            let baseBrickArcLength = justBricksArcLength / brickCount;
            baseBrickAngle = this.arcLengthToArcAngle(baseBrickArcLength, baseRadius);
            baseBrickWidth = this.arcLengthToTangentLength(this.arcAngleToArcLength(baseBrickAngle, baseRadius), baseRadius);
            baseJointAngle = this.arcLengthToArcAngle(baseJointArcLength, baseRadius);
        }

        // Dimensions of drawing 
        this.drawingData["drawingHeight"] = height + topRise;
        this.drawingData["drawingWidth"] = fullLength;

        // Store measurements in object
        this.drawingData["opening"] = opening;
        this.drawingData["height"] = height;
        this.drawingData["skewLength"] = skewLength;
        this.drawingData["skewAngle"] = skewAngle;
        this.drawingData["baseRise"] = baseRise;
        if (baseRise) {
            this.drawingData["baseRadius"] = baseRadius;
            this.drawingData["baseOrigin"] = baseOrigin;
            this.drawingData["baseFullAngle"] = baseHalfAngle * 2;
            this.drawingData["baseBrickAngle"] = baseBrickAngle;
        }
        this.drawingData["topRise"] = topRise;
        if (topRise) {
            this.drawingData["topRadius"] = topRadius;
            this.drawingData["topOrigin"] = topOrigin;
            this.drawingData["topFullAngle"] = topHalfAngle * 2;
            this.drawingData["topBrickAngle"] = topBrickAngle;
        }

        this.drawingData["brickCount"] = brickCount;
        this.drawingData["baseBrickWidth"] = baseBrickWidth;
        this.drawingData["topBrickAngle"] = topBrickAngle;
        this.drawingData["topBrickWidth"] = topBrickWidth;
        this.drawingData["topBrickAngle"] = topBrickAngle;
        this.drawingData["baseJointAngle"] = baseJointAngle;
        this.drawingData["topJointAngle"] = topJointAngle;

        // Clear pieces
        this.drawingData["pieces"] = [];

        // Calculate coordinates of pieces
        // Plot bottom pieces
        if (baseRise <= 0) {
            for (let i = 0; i < brickCount; i++) {
                let piece = {};
                piece["bl"] = [skewLength + (baseBrickWidth + jointSize) * i, 0];
                piece["br"] = [skewLength + (baseBrickWidth + jointSize) * i + baseBrickWidth, 0];
                this.drawingData["pieces"].push(piece);
            }
        } else {
            let baseCurrentAngle = (Math.PI / 2) + baseHalfAngle - (baseBrickAngle / 2);
            for (let i = 0; i < brickCount; i++) {
                let piece = {};
                piece["bc"] = this.calculateEndpoint(baseOrigin[0], baseOrigin[1], baseRadius, baseCurrentAngle);

                piece["bl"] = this.calculateEndpoint(piece["bc"][0], piece["bc"][1], baseBrickWidth / 2, baseCurrentAngle + (Math.PI / 2));
                piece["br"] = this.calculateEndpoint(piece["bc"][0], piece["bc"][1], baseBrickWidth / 2, baseCurrentAngle - (Math.PI / 2));

                this.drawingData["pieces"].push(piece);
                baseCurrentAngle -= baseBrickAngle + baseJointAngle;
            }
        }

        // Plot top pieces
        if (topRise <= 0) {
            for (let i = 0; i < brickCount; i++) {
                this.drawingData["pieces"][i]["tl"] = [(topBrickWidth + jointSize) * i, height]
                this.drawingData["pieces"][i]["tr"] = [(topBrickWidth + jointSize) * i + topBrickWidth, height];
            }
        } else {
            let topCurrentAngle = (Math.PI / 2) + topHalfAngle - (topBrickAngle / 2);
            for (let i = 0; i < brickCount; i++) {
                let tc = this.calculateEndpoint(topOrigin[0], topOrigin[1], topRadius, topCurrentAngle);
                this.drawingData["pieces"][i]["tc"] = tc

                this.drawingData["pieces"][i]["tl"] = this.calculateEndpoint(tc[0], tc[1], topBrickWidth / 2, topCurrentAngle + (Math.PI / 2));
                this.drawingData["pieces"][i]["tr"] = this.calculateEndpoint(tc[0], tc[1], topBrickWidth / 2, topCurrentAngle - (Math.PI / 2));

                topCurrentAngle -= topBrickAngle + topJointAngle;
            } 
        }
    }

    // Temporary logic until individual pieces are added - base class will contain master drawShapes function
    traceOutline() {
        const ctx = this.ctx;
        const dd = this.drawingData;
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
    degToLength(deg, height) {
        return Math.tan(this.degToRad(deg)) * height;
    }

    radToLength(rad, height) {
        return Math.tan(rad) * height;
    }

    lengthToDeg(length, height) {
        return this.radToDeg(lengthToRad(length, height));
    }

    lengthToRad(length, height) {
        return Math.atan(length / height);
    }
}

class RadialArch extends Arch {
    constructor(canvas, type) {
        super(canvas);
        this.type = type;
        this.drawingData["rise"] = undefined;
        this.drawingData["skewAngle"] = undefined;
        this.drawingData["skewLength"] = undefined;
        this.drawingData["origin"] = undefined;
        this.drawingData["fullAngle"] = undefined;
        this.drawingData["baseRadius"] = undefined;
        this.drawingData["topRadius"] = undefined;
    }

    generateData() {
        // Reading toolbar and calculations
        let opening = parseInt(this.toolbar.elements["opening"].value);
        let height = parseInt(this.toolbar.elements["height"].value);

        let rise, baseRadius, topRadius, skewAngle, skewLength, origin, fullAngle, drawingWidth, drawingHeight;
        switch (this.type) {
            case "radial":
                let measurement = parseInt(this.toolbar.elements["rise-or-skew"].value);
                switch (this.toolbar.elements["rise-or-skew-select"].value) {
                    case "rise":
                        rise = measurement;
                        if (rise > 0) {
                            baseRadius = ((((opening / 2) ** 2) / rise) + rise) / 2;
                            topRadius = (baseRadius != "n/a") ? baseRadius + height : "n/a";
                            skewAngle = Math.atan((opening / 2) / (baseRadius - rise));
                            skewLength = this.radToLength(skewAngle, height);
                            origin = [(opening / 2) + skewLength, rise - baseRadius];
                            fullAngle = skewAngle * 2;
                        } else {
                            skewLength = skewAngle = fullAngle = 0;
                            baseRadius = topRadius = origin = "n/a";
                        }
                        break;
                    case "deg":
                        skewAngle = this.degToRad(measurement);
                        if (skewAngle > 0) {
                            fullAngle = skewAngle * 2;
                            skewLength = this.radToLength(skewAngle, height);
                            baseRadius = (opening / 2) / Math.sin(skewAngle);
                            topRadius = (baseRadius != "n/a") ? baseRadius + height : "n/a";
                            rise = baseRadius - (opening / 2 / Math.tan(skewAngle));
                            fullAngle = skewAngle * 2
                            origin = [(opening / 2) + skewLength, rise - baseRadius];
                        } else {
                            skewLength = skewAngle = fullAngle = rise = 0;
                            baseRadius = topRadius = origin = "n/a";
                        }
                        break;
                    case "mm":
                        skewLength = measurement;
                        if (skewLength > 0) {
                            skewAngle = this.lengthToRad(skewLength, height);
                            baseRadius = (opening / 2) / Math.sin(skewAngle);
                            topRadius = (baseRadius != "n/a") ? baseRadius + height : "n/a";
                            rise = baseRadius - (opening / 2 / Math.tan(skewAngle));
                            fullAngle = skewAngle * 2;
                            origin = [(opening / 2) + skewLength, rise - baseRadius];
                        } else {
                            skewLength = skewAngle = fullAngle = rise = 0;
                            baseRadius = topRadius = origin = "n/a";
                        }
                        break;
                    default:
                }
                drawingWidth = this.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2 - skewAngle)[0];
                drawingHeight = this.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2)[1]; //rise + height;

                break;
            case "semicircle":
                baseRadius = opening / 2;
                topRadius = (baseRadius != "n/a") ? baseRadius + height : "n/a";
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
                topRadius = (baseRadius != "n/a") ? baseRadius + height : "n/a";
                skewAngle = this.degToRad(180);
                skewLength = 0;
                rise = opening + height;
                origin = [topRadius, topRadius];
                fullAngle = 2 * Math.PI;
                drawingWidth = 2 * topRadius;
                drawingHeight = 2 * topRadius;
                break;
            default:
        }

        let brickDivisionValue = parseInt(this.toolbar.elements["brick-width-or-count"].value);
        let brickDivisionMethod = this.toolbar.elements["brick-division-select"].value;
        let jointSize = parseInt(this.toolbar.elements["joint-size"].value);
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
        this.drawingData["drawingWidth"] = drawingWidth;
        this.drawingData["drawingHeight"] = drawingHeight;

        // Store measurements in object
        this.drawingData["opening"] = opening;
        this.drawingData["height"] = height;
        this.drawingData["rise"] = rise;
        this.drawingData["skewAngle"] = skewAngle;
        this.drawingData["skewLength"] = skewLength;
        this.drawingData["baseRadius"] = baseRadius;
        this.drawingData["topRadius"] = topRadius;
        this.drawingData["origin"] = origin;
        this.drawingData["fullAngle"] = fullAngle;
        this.drawingData["brickCount"] = brickCount;
        this.drawingData["baseBrickWidth"] = baseBrickWidth;
        this.drawingData["topBrickWidth"] = topBrickWidth;
        this.drawingData["baseBrickAngle"] = baseBrickAngle;
        this.drawingData["topBrickAngle"] = topBrickAngle;
        this.drawingData["baseJointAngle"] = baseJointAngle;
        this.drawingData["topJointAngle"] = topJointAngle;

        // Clear pieces
        this.drawingData["pieces"] = [];

        // Calculate pieces
        let baseCurrentAngle = (Math.PI / 2) + skewAngle - (baseBrickAngle / 2);
        let topCurrentAngle = (Math.PI / 2) + skewAngle - (topBrickAngle / 2);

        if (this.type === "bullseye") {
            baseCurrentAngle -= (Math.PI) - baseBrickAngle / 2;
            topCurrentAngle -= (Math.PI) - topBrickAngle / 2;
        }

        for (let i = 0; i < brickCount; i++) {
            let piece = {};
            piece["baseAngle"] = baseCurrentAngle;
            piece["topAngle"] = topCurrentAngle
            piece["bc"] = this.calculateEndpoint(origin[0], origin[1], baseRadius, baseCurrentAngle);
            piece["tc"] = this.calculateEndpoint(origin[0], origin[1], topRadius, topCurrentAngle);
            
            if (this.type !== "semicircle" || i > 0) {
                piece["bl"] = this.calculateEndpoint(piece["bc"][0], piece["bc"][1], baseBrickWidth / 2, baseCurrentAngle + (Math.PI / 2));
                piece["tl"] = this.calculateEndpoint(piece["tc"][0], piece["tc"][1], topBrickWidth / 2, topCurrentAngle + (Math.PI / 2));
            } else {
                piece["bl"] = [height, 0];
                piece["tl"] = [0, 0];
            }

            if (this.type !== "semicircle" || i < brickCount - 1) {
                piece["br"] = this.calculateEndpoint(piece["bc"][0], piece["bc"][1], baseBrickWidth / 2, baseCurrentAngle - (Math.PI / 2));
                piece["tr"] = this.calculateEndpoint(piece["tc"][0], piece["tc"][1], topBrickWidth / 2, topCurrentAngle - (Math.PI / 2));
            } else {
                piece["br"] = [height + opening, 0];
                piece["tr"] = [2 * height + opening, 0];
            }

            this.drawingData["pieces"].push(piece);
            baseCurrentAngle -= baseBrickAngle + baseJointAngle;
            topCurrentAngle -= topBrickAngle + topJointAngle;
        }

    }

    // Temporary logic until individual pieces are added - base class will contain master drawShapes function
    traceOutline() {
        const ctx = this.ctx;
        const dd = this.drawingData;
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
        let currentAngle = (Math.PI / 2) + dd["skewAngle"] - (dd["brickAngle"] / 2);
        for (let i = 0; i < dd["brickCount"]; i++) {
            let bc = this.calculateEndpoint(dd["origin"][0], dd["origin"][1], dd["baseRadius"], currentAngle);
            let bl = this.calculateEndpoint(bc[0], bc[1], dd["baseBrickWidth"] / 2, currentAngle + (Math.PI / 2));
            let br = this.calculateEndpoint(bc[0], bc[1], dd["baseBrickWidth"] / 2, currentAngle - (Math.PI / 2));
            let tc = this.calculateEndpoint(dd["origin"][0], dd["origin"][1], dd["topRadius"], currentAngle);
            let tl = this.calculateEndpoint(tc[0], tc[1], dd["topBrickWidth"] / 2, currentAngle + (Math.PI / 2));
            let tr = this.calculateEndpoint(tc[0], tc[1], dd["topBrickWidth"] / 2, currentAngle - (Math.PI / 2));
    
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
    
            currentAngle -= dd["brickAngle"] + dd["jointAngle"];
        }
    }

    // Conversion between angle and actual length of skew of radial arches using angular height of arch
    degToLength(deg, height) {
        return Math.sin(this.degToRad(deg)) * height;
    }

    radToLength(rad, height) {
        return Math.sin(rad) * height;
    }

    lengthToDeg(length, height) {
        return this.radToDeg(lengthToRad(length, height));
    }

    lengthToRad(length, height) {
        return Math.asin(length / height);
    }
}

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
