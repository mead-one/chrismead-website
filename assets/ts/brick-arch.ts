import { Project/*, ToolbarItem */} from "./projects";
document.addEventListener("DOMContentLoaded", initialise);

const DEFAULT_CANVAS_MARGIN = 50;
const DEFAULT_ARCH_CONFIG: ArchConfig = {
    type: "flat",
    opening: 800,
    height: 210,
    jointSize: 10,
    brickDivisionMethod: "width",
    brickWidth: 65,
    skewUnit: "deg",
    skew: 20,
    baseRise: 0,
    topRise: 0
};

const TOOLBAR_FIELDS: Array<ToolbarField> = [
    {
        id: "arch-type-toolbar-select",
        name: "type",
        label: "Arch type: ",
        type: "select",
        defaultValue: DEFAULT_ARCH_CONFIG.type,
        options: [
            { value: "flat", label: "Flat" },
            { value: "radial", label: "Radial" },
            { value: "semicircle", label: "Semicircle" },
            { value: "bullseye", label: "Bullseye" }
        ],
        visibleFor: ["flat", "radial", "semicircle", "bullseye"]
    },
    {
        id: "brick-width-or-count-input",
        name: "brick-width-or-count",
        label: "Brick division: ",
        type: "number",
        defaultValue: DEFAULT_ARCH_CONFIG.brickWidth,
        visibleFor: ["flat", "radial", "semicircle", "bullseye"],
        additional: [
            {
                id: "brick-division-toolbar-select",
                name: "brick-division-select",
                label: "",
                type: "select",
                defaultValue: DEFAULT_ARCH_CONFIG.brickDivisionMethod,
                options: [
                    { value: "width", label: "mm wide" },
                    { value: "count", label: "bricks" }
                ]
            }
        ],
        min: 1
    },
    {
        id: "joint-size-toolbar-item",
        name: "joint-size",
        label: "Joint size: ",
        type: "number",
        defaultValue: DEFAULT_ARCH_CONFIG.jointSize,
        visibleFor: ["flat", "radial", "semicircle", "bullseye"],
        min: 1
    },
    {
        id: "opening-toolbar-item",
        name: "opening",
        label: "Opening: ",
        type: "number",
        defaultValue: DEFAULT_ARCH_CONFIG.opening,
        visibleFor: ["flat", "radial", "semicircle", "bullseye"],
        min: 100,
        step: 50
    },
    {
        id: "height-toolbar-item",
        name: "height",
        label: "Height: ",
        type: "number",
        defaultValue: DEFAULT_ARCH_CONFIG.height,
        visibleFor: ["flat", "radial", "semicircle", "bullseye"],
        min: 50,
        step: 5
    },
    {
        id: "skew-toolbar-item",
        name: "skew",
        label: "Skew: ",
        type: "number",
        defaultValue: DEFAULT_ARCH_CONFIG.skew,
        visibleFor: ["flat"],
        min: 1,
        additional: [
            {
                id: "skew-units-toolbar-select",
                name: "skew-units-select",
                label: "",
                type: "select",
                defaultValue: DEFAULT_ARCH_CONFIG.skewUnit,
                options: [
                    { value: "deg", label: "°" },
                    { value: "mm", label: "mm" }
                ]
            }
        ]
    },
    {
        id: "base-rise-toolbar-item",
        name: "base-rise",
        label: "Base rise: ",
        type: "number",
        defaultValue: DEFAULT_ARCH_CONFIG.baseRise,
        visibleFor: ["flat"],
        min: 0
    },
    {
        id: "top-rise-toolbar-item",
        name: "top-rise",
        label: "Top rise: ",
        type: "number",
        defaultValue: DEFAULT_ARCH_CONFIG.topRise,
        visibleFor: ["flat"],
        min: 0
    },
    {
        id: "rise-or-skew-toolbar-item",
        name: "rise-or-skew",
        label: "Rise: ",
        type: "number",
        defaultValue: 10,
        visibleFor: ["radial"],
        additional: [
            {
                id: "rise-or-skew-toolbar-select",
                name: "rise-or-skew-select",
                label: "",
                type: "select",
                defaultValue: "rise",
                options: [
                    { value: "rise", label: "Rise (mm)" },
                    { value: "deg", label: "Skew (°)" },
                    { value: "mm", label: "Skew (mm)" }
                ]
            }
        ],
        min: 1
    }
]

declare global {
    var Arch: Arch;
}

function initialise() {
    const container = document.getElementById("brick-arch-container");

    if (!container || !(container instanceof HTMLDivElement)) {
        console.error("No div with id 'brick-arch-container'!");
        throw new Error("No div with id 'brick-arch-container'!");
    }

    globalThis.Arch = new Arch(container);
    // globalThis.Arch.app.refresh();
}

type Point = [number, number];

interface BrickPiece {
    bl: Point;
    br: Point;
    tr: Point;
    tl: Point;
    label: string;
}

class GeometryUtils {
    degToRad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    radToDeg(rad: number): number {
        return rad * (180 / Math.PI);
    }

    // Cast a distance at an angle from a point
    calculateEndpoint(originX: number, originY: number, distance: number, angle: number): Point {
        let pointX = originX + distance * Math.cos(angle);
        let pointY = originY + distance * Math.sin(angle);

        return [pointX, pointY];
    }

    // Conversion between lengths of chord and arc, using radius
    arcLengthToChordLength(arcLength: number, radius: number): number {
        return 2 * radius * Math.sin(arcLength / (2 * radius));
    }

    chordLengthToArcLength(chord: number, radius: number): number {
        return 2 * radius * Math.asin(chord / (2 * radius));
    }

    // Conversion between arc angle and arc Length
    arcAngleToArcLength(angle: number, radius: number): number {
        return angle * radius;
    }

    arcLengthToArcAngle(arcLength: number, radius: number): number {
        return arcLength / radius;
    }

    // Conversion between lengths of arc and tangent, using radius
    arcLengthToTangentLength(arcLength: number, radius: number): number {
        return radius * Math.tan(arcLength / radius);
    }

    tangentLengthToArcLength(tangent: number, radius: number): number {
        return radius * Math.atan(tangent / radius);
    }
}

type ArchType = 'flat' | 'radial' | 'semicircle' | 'bullseye';
type BrickDivisionMethod = 'width' | 'count';
type SkewUnit = 'deg' | 'mm';
type RiseOrSkew = 'rise' | SkewUnit;

// Interface for input from the toolbar
interface ArchConfig {
    type: ArchType;
    opening: number;
    height: number;
    jointSize: number;
    brickDivisionMethod: BrickDivisionMethod;
    brickWidth?: number;
    brickCount?: number;

    // For flat arches
    baseRise?: number;
    topRise?: number;
    skewUnit?: SkewUnit;
    skew?: number;

    // For radial arches
    riseOrSkew?: RiseOrSkew;
    rise?: number;
    //skew?: number;
}

// Interface for full calculated arch parameters
interface ArchParameters {
    type: ArchType;
    drawingWidth: number;
    drawingHeight: number;

    opening: number;
    height: number;
    skewAngle?: number;
    skewLength?: number;
    brickCount: number;
    baseBrickWidth?: number;
    baseBrickAngle?: number;
    baseJointAngle?: number;
    topBrickWidth?: number;
    topBrickAngle?: number;
    topJointAngle?: number;
    pieces: Array<BrickPiece>;
}

interface FlatArchParameters extends ArchParameters {
    baseRise: number;
    baseOrigin: Point | null;
    baseRadius: number | null;
    baseFullAngle: number | null;
    topRise: number;
    topOrigin: Point | null;
    topRadius: number | null;
    topFullAngle: number | null;
}

interface RadialArchParameters extends ArchParameters {
    riseOrSkew?: RiseOrSkew;
    rise: number;
    origin: Point | null;
    baseRadius: number | null;
    topRadius: number | null;
    fullAngle: number | null;
}

interface BrickLayout {
    brickCount: number;
    pieces: Array<BrickPiece>;
}

// Individual arch calculators
abstract class ArchCalculator {
    abstract calculateParameters(config: ArchConfig): ArchParameters;
    // abstract calculateLayout(params: ArchParameters, brickConfig: BrickConfig): BrickLayout
    public geometry: GeometryUtils;

    constructor() {
        this.geometry = new GeometryUtils();
    }

    abstract degToLength(deg: number, height: number): number;
    abstract radToLength(rad: number, height: number): number;
    abstract lengthToDeg(length: number, height: number): number;
    abstract lengthToRad(length: number, height: number): number;

    // Count number of bricks from maximum length of piece, length of joint between, and whether to include last joint
    // (for bullseye arches)
    countBricks(fullLength: number, maxLength: number, jointWidth: number, includeLastJoint?: boolean | null): number {
        if (typeof includeLastJoint === "undefined" || !includeLastJoint) {
            fullLength += jointWidth;
        }

        return Math.ceil(fullLength / (maxLength + jointWidth));
    }
}

class FlatArchCalculator extends ArchCalculator {
    constructor() {
        super();
    }

    calculateParameters(config: ArchConfig): FlatArchParameters {
        /*
            * Required fields:
            * opening
            * height
            * jointSize
            * brickDivisionMethod
            * brickWidth || brickCount
            * skewUnit
            * skew
            * baseRise
            * topRise
        */

        if (!config.skew) {
            throw new Error("Missing skew value");
        }

        let skewLength: number, skewAngle: number, baseFullAngle: number | null;
        switch (config.skewUnit) {
            case "deg":
                skewAngle = this.geometry.degToRad(config.skew);
                skewLength = this.degToLength(config.skew, config.height);
                break;
            case "mm":
                skewLength = config.skew;
                skewAngle = this.lengthToRad(config.skew, config.height);
                break;
            default:
                throw new Error(`Unrecognised skew unit: ${config.skewUnit}`);
        }
        let fullLength = config.opening + 2 * skewLength;

        let baseRadius: number | null, baseOrigin: Point | null, baseHalfAngle: number | null;
        if (config.baseRise && config.baseRise > 0) {
            baseRadius = ((((config.opening / 2) ** 2) / config.baseRise) + config.baseRise) / 2;
            baseOrigin = [fullLength / 2, config.baseRise - baseRadius];
            baseHalfAngle = Math.atan((config.opening / 2) / (baseRadius - config.baseRise));
            baseFullAngle = this.geometry.arcLengthToArcAngle(config.opening, baseRadius);
        } else {
            baseRadius = baseOrigin = baseFullAngle = baseHalfAngle = null;
        }

        let topRadius: number | null, topOrigin: Point | null, topHalfAngle: number | null;
        if (config.topRise && config.topRise > 0) {
            topRadius = ((((fullLength / 2) ** 2) / config.topRise) + config.topRise) / 2;
            topOrigin = [fullLength / 2, config.height + config.topRise - topRadius];
            topHalfAngle = Math.atan((fullLength / 2) / (topRadius - config.topRise));
        } else {
            topRadius = topOrigin = topHalfAngle = null;
        }

        let brickCount: number, topFullAngle: number | null, topBrickAngle: number | null, topBrickWidth: number, topJointAngle: number | null,
            topFullArcLength: number | null, topJointArcLength: number | null;

        switch (config.brickDivisionMethod) {
            case "width":
                if (!config.brickWidth) throw new Error("Missing brick width");
                if (config.topRise && config.topRise <= 0 || !topRadius) {
                    brickCount = this.countBricks(fullLength, config.brickWidth, config.jointSize, false);
                    if (brickCount % 2 === 0) {
                        brickCount++;
                    }
                    let justBricks = fullLength - (config.jointSize * (brickCount - 1));
                    topBrickWidth = justBricks / brickCount;
                    topBrickAngle = topJointAngle = topFullArcLength = topJointArcLength = null;
                } else {
                    topFullArcLength = this.geometry.chordLengthToArcLength(fullLength, topRadius);
                    topJointArcLength = this.geometry.chordLengthToArcLength(config.jointSize, topRadius);
                    let maxBrickArcLength = this.geometry.tangentLengthToArcLength(config.brickWidth, topRadius);
                    brickCount = this.countBricks(topFullArcLength, maxBrickArcLength, topJointArcLength, false);
                    if (brickCount % 2 === 0) {
                        brickCount++;
                    }
                }
                break;
            case "count":
                if (!config.brickCount) {
                    throw new Error("Missing brick count");
                }
                brickCount = config.brickCount;
                if (topRadius) {
                    topFullArcLength = this.geometry.chordLengthToArcLength(fullLength, topRadius);
                    topJointArcLength = this.geometry.chordLengthToArcLength(config.jointSize, topRadius);
                } else {
                    topFullArcLength = topJointArcLength = null;
                }
                break;
            default:
                throw new Error(`Unrecognised brick division method: ${config.brickDivisionMethod}`);
        }

        // Calculate top brick size
        if ((config.topRise && config.topRise <= 0) || !topFullArcLength || !topJointArcLength || !topRadius) {
            let topJustBricks = fullLength - (brickCount - 1) * config.jointSize;
            topBrickWidth = topJustBricks / brickCount;
            topFullAngle = topBrickAngle = topJointAngle = null;
        } else {
            let justBricksArcLength = topFullArcLength - (topJointArcLength * (brickCount - 1));
            let topBrickArcLength = justBricksArcLength / brickCount;
            topBrickAngle = this.geometry.arcLengthToArcAngle(topBrickArcLength, topRadius);
            topBrickWidth = this.geometry.arcLengthToTangentLength(this.geometry.arcAngleToArcLength(topBrickAngle, topRadius), topRadius);
            topJointAngle = this.geometry.arcLengthToArcAngle(topJointArcLength, topRadius);
            topFullAngle = this.geometry.arcLengthToArcAngle(config.opening + 2 * skewLength, topRadius);
        }

        // Calculate base brick size
        let baseFullArcLength: number, baseJointArcLength: number, baseBrickAngle: number | null,
            baseBrickWidth: number, baseJointAngle: number | null;
        if (config.baseRise && config.baseRise <= 0 || baseRadius == null) {
            let baseJustBricks = config.opening - (brickCount - 1) * config.jointSize;
            baseBrickWidth = baseJustBricks / brickCount;
            baseBrickAngle = null;
            baseJointAngle = null;
        } else {
            baseFullArcLength = this.geometry.chordLengthToArcLength(config.opening, baseRadius);
            baseJointArcLength = this.geometry.chordLengthToArcLength(config.jointSize, baseRadius);
            let justBricksArcLength = baseFullArcLength - (baseJointArcLength * (brickCount - 1));
            let baseBrickArcLength = justBricksArcLength / brickCount;
            baseBrickAngle = this.geometry.arcLengthToArcAngle(baseBrickArcLength, baseRadius);
            baseBrickWidth = this.geometry.arcLengthToTangentLength(this.geometry.arcAngleToArcLength(baseBrickAngle, baseRadius), baseRadius);
            baseJointAngle = this.geometry.arcLengthToArcAngle(baseJointArcLength, baseRadius);
        }

        let drawingWidth = config.opening + 2 * skewLength;
        let drawingHeight = config.topRise ?
            config.height + config.topRise :
            config.height;

        const params: FlatArchParameters = {
            type: config.type,
            drawingWidth: drawingWidth,
            drawingHeight: drawingHeight,

            opening: config.opening,
            height: config.height,
            skewAngle: skewAngle,
            skewLength: skewLength,
            brickCount: brickCount,
            baseBrickWidth: baseBrickWidth,
            baseFullAngle: baseFullAngle,
            baseBrickAngle: baseBrickAngle ? baseBrickAngle : undefined,
            baseJointAngle: baseJointAngle ? baseJointAngle : undefined,
            topBrickWidth: topBrickWidth,
            topFullAngle: topFullAngle,
            topBrickAngle: topBrickAngle ? topBrickAngle : undefined,
            topJointAngle: topJointAngle ? topJointAngle : undefined,

            baseRise: config.baseRise ? config.baseRise : 0,
            baseOrigin: baseOrigin ? baseOrigin : null,
            baseRadius: baseRadius ? baseRadius : null,
            // fullAngle: skewAngle * 2,
            topRise: config.topRise ? config.topRise : 0,
            topOrigin: topOrigin ? topOrigin : null,
            topRadius: topRadius ? topRadius : null,

            // Clear pieces
            pieces: []
        }

        return params;
    }

    // Conversion between angle and actual length of skew of flat arches using actual height of arch
    degToLength(deg: number, height: number): number {
        return Math.tan(GeometryUtils.prototype.degToRad(deg)) * height;
    }

    radToLength(rad: number, height: number): number {
        return Math.tan(rad) * height;
    }

    lengthToDeg(length:number, height: number): number {
        return GeometryUtils.prototype.radToDeg(this.lengthToRad(length, height));
    }

    lengthToRad(length: number, height: number): number {
        return Math.atan(length / height);
    }
}

class RadialArchCalculator extends ArchCalculator {
    constructor() {
        super();
    }

    calculateParameters(config: ArchConfig): RadialArchParameters {
        let rise: number, baseRadius: number | null, topRadius: number | null, skewAngle: number, skewLength: number,
            origin: Point | null, fullAngle: number | null, drawingWidth: number, drawingHeight: number;
        switch (config.type) {
            case "radial":
                /*
                    * Required fields:
                    * opening
                    * height
                    * jointSize
                    * brickDivisionMethod
                    * brickWidth || brickCount
                    * riseOrSkew
                    * rise || skew
                */
                // let measurement = parseInt(riseOrSkewInput.value);
                switch (config.riseOrSkew) {
                    case "rise":
                        if (!config.rise) {
                            throw new Error("Missing rise value");
                        }

                        rise = config.rise;
                        if (rise > 0) {
                            baseRadius = ((((config.opening / 2) ** 2) / rise) + rise) / 2;
                            topRadius = (baseRadius != null) ? baseRadius + config.height : null;
                            skewAngle = Math.atan((config.opening / 2) / (baseRadius - rise));
                            skewLength = this.radToLength(skewAngle, config.height);
                            origin = [(config.opening / 2) + skewLength, rise - baseRadius];
                            fullAngle = skewAngle * 2;
                        } else {
                            skewLength = skewAngle = fullAngle = 0;
                            baseRadius = topRadius = origin = null;
                        }
                        break;
                    case "deg":
                        if (!config.skew) {
                            throw new Error("Missing rise value");
                        }

                        skewAngle = this.geometry.degToRad(config.skew);
                        if (skewAngle > 0) {
                            fullAngle = skewAngle * 2;
                            skewLength = this.radToLength(skewAngle, config.height);
                            baseRadius = (config.opening / 2) / Math.sin(skewAngle);
                            topRadius = (baseRadius != null) ? baseRadius + config.height : null;
                            rise = baseRadius - (config.opening / 2 / Math.tan(skewAngle));
                            origin = [(config.opening / 2) + skewLength, rise - baseRadius];
                        } else {
                            skewLength = skewAngle = fullAngle = rise = 0;
                            baseRadius = topRadius = origin = null;
                        }
                        break;
                    case "mm":
                        if (!config.skew) {
                            throw new Error("Missing rise value");
                        }

                        skewLength = config.skew;
                        if (skewLength > 0) {
                            skewAngle = this.lengthToRad(skewLength, config.height);
                            baseRadius = (config.opening / 2) / Math.sin(skewAngle);
                            topRadius = (baseRadius != null) ? baseRadius + config.height : null;
                            rise = baseRadius - (config.opening / 2 / Math.tan(skewAngle));
                            fullAngle = skewAngle * 2;
                            origin = [(config.opening / 2) + skewLength, rise - baseRadius];
                        } else {
                            skewLength = skewAngle = fullAngle = rise = 0;
                            baseRadius = topRadius = origin = null;
                        }
                        break;
                    default:
                        console.error(`Unrecognised rise/skew choice on radial arch: ${config.riseOrSkew}`);
                        baseRadius = topRadius = origin = null;
                        rise = skewAngle = skewLength = fullAngle = 0
                }

                if (baseRadius && topRadius && origin) {
                    drawingWidth = this.geometry.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2 - skewAngle)[0];
                    drawingHeight = this.geometry.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2)[1];
                } else {
                    drawingWidth = config.opening;
                    drawingHeight = config.height;
                }

                break;
            case "semicircle":
                baseRadius = config.opening / 2;
                topRadius = baseRadius + config.height;
                skewAngle = this.geometry.degToRad(90);
                skewLength = config.height;
                rise = config.opening / 2;
                origin = [topRadius, 0];
                fullAngle = Math.PI;
                drawingWidth = 2 * topRadius;
                drawingHeight = topRadius;
                break;
            case "bullseye":
                baseRadius = config.opening / 2;
                topRadius = baseRadius + config.height;
                skewAngle = this.geometry.degToRad(180);
                skewLength = 0;
                rise = config.opening + config.height;
                origin = [topRadius, topRadius];
                fullAngle = 2 * Math.PI;
                drawingWidth = 2 * topRadius;
                drawingHeight = drawingWidth;
                break;
            default:
                throw new Error(`Unrecognised arch type: ${config.type}`);
        }

        if (fullAngle === null || baseRadius === null || topRadius === null || origin === null) {
            throw TypeError("Unexpected null value.");
        }

        // let brickDivisionValue = parseInt(brickDivisionInput.value);
        let brickWidth: number | undefined;
        let brickCount;

        let topArcLength = this.geometry.arcAngleToArcLength(fullAngle, topRadius);
        let topJointArcLength = this.geometry.tangentLengthToArcLength(config.jointSize, topRadius);

        switch (config.brickDivisionMethod) {
            case "width":
                if (!config.brickWidth) throw new Error("Missing brick width");
                brickWidth = config.brickWidth;
                let topBrickMaxArcLength = this.geometry.tangentLengthToArcLength(config.brickWidth, topRadius);
                brickCount = this.countBricks(topArcLength, topBrickMaxArcLength, topJointArcLength, config.type === "bullseye" ? true : false);
                if (config.type !== "bullseye" && brickCount % 2 === 0) {
                    brickCount++;
                }
                break;
            case "count":
                if (!config.brickCount) throw new Error("Missing brick count");
                brickCount = config.brickCount;
                break;
            default:
                throw new Error(`Unrecognised brick division method: ${config.brickDivisionMethod}`);
        }

        let topJustBricksArc = topArcLength - ((config.type === "bullseye" ? brickCount : brickCount - 1) * topJointArcLength);
        let topBrickArcLength = topJustBricksArc / brickCount;
        let topBrickWidth = this.geometry.arcLengthToTangentLength(topBrickArcLength, topRadius);
        let topBrickAngle = this.geometry.arcLengthToArcAngle(topBrickArcLength, topRadius);
        let topJointAngle = this.geometry.arcLengthToArcAngle(topJointArcLength, topRadius);
        
        let baseArcLength = this.geometry.arcAngleToArcLength(fullAngle, baseRadius);
        let baseJointArcLength = this.geometry.tangentLengthToArcLength(config.jointSize, baseRadius);
        let baseJointAngle = this.geometry.arcLengthToArcAngle(baseJointArcLength, baseRadius);
        let baseJustBricksArc = baseArcLength - ((config.type === "bullseye" ? brickCount : brickCount - 1) * baseJointArcLength);
        let baseBrickArcLength = baseJustBricksArc / brickCount;
        let baseBrickAngle = this.geometry.arcLengthToArcAngle(baseBrickArcLength, baseRadius);
        let baseBrickWidth = this.geometry.arcLengthToTangentLength(baseBrickArcLength, baseRadius);

        const params: RadialArchParameters = {
            type: config.type,
            drawingWidth: drawingWidth,
            drawingHeight: drawingHeight,

            // Store measurements in object
            opening: config.opening,
            height: config.height,
            skewAngle: skewAngle,
            skewLength: skewLength,
            brickCount: brickCount,
            baseBrickWidth: baseBrickWidth,
            baseBrickAngle: baseBrickAngle ? baseBrickAngle : undefined,
            baseJointAngle: baseJointAngle ? baseJointAngle : undefined,
            topBrickWidth: topBrickWidth,
            topBrickAngle: topBrickAngle ? topBrickAngle : undefined,
            topJointAngle: topJointAngle ? topJointAngle : undefined,

            riseOrSkew: config.riseOrSkew,
            rise: rise,
            origin: origin ? origin : null,
            baseRadius: baseRadius ? baseRadius : null,
            topRadius: topRadius ? topRadius : null,
            fullAngle: skewAngle * 2,

            // Clear pieces
            pieces: []
        }

        return params;
    }

    // Conversion between angle and actual length of skew of radial arches using angular height of arch
    degToLength(deg: number, height: number): number {
        return Math.sin(GeometryUtils.prototype.degToRad(deg)) * height;
    }

    radToLength(rad: number, height: number): number {
        return Math.sin(rad) * height;
    }

    lengthToDeg(length: number, height: number): number {
        return GeometryUtils.prototype.radToDeg(this.lengthToRad(length, height));
    }

    lengthToRad(length: number, height: number): number {
        return Math.asin(length / height);
    }
}

interface ToolbarField {
    id: string;
    name: string;
    label: string;
    type: 'number' | 'select' | 'checkbox';
    defaultValue?: string | number
    options?: Array<{ value: string; label: string }>;
    visibleFor?: Array<ArchType>;
    additional?: Array<ToolbarField>; // For additional element on same line
    min?: number;
    max?: number;
    step?: number;
}

class ToolbarManager {
    fields: ToolbarField[];
    toolbarElement: HTMLFormElement;

    constructor(toolbarElement: HTMLFormElement, fields: Array<ToolbarField>) {
        this.toolbarElement = toolbarElement;
        this.fields = fields;
    }

    populateToolbar(): void {
        for (let field of this.fields) {
            const fieldElement = document.createElement("span");
            const labelElement = document.createElement("label");
            let inputElement: HTMLInputElement | HTMLSelectElement

            fieldElement.setAttribute("id", `${field.name}-toolbar-item`);
            fieldElement.classList.add("arch-toolbar-item");

            for (let type in field.visibleFor) {
                fieldElement.classList.add(`${type}-toolbar-item`);
            }

            labelElement.setAttribute("for", field.name);
            labelElement.innerText = field.label;

            switch (field.type) {
                case "number":
                    inputElement = document.createElement("input");
                    inputElement.setAttribute("type", "number");
                    inputElement.setAttribute("id", field.id);
                    inputElement.setAttribute("name", field.name);
                    inputElement.setAttribute("value", field.defaultValue ? field.defaultValue.toString() : "0");
                    if (field.hasOwnProperty("min") && field.min != undefined)
                        inputElement.setAttribute("min", field.min.toString());
                    if (field.hasOwnProperty("max") && field.max != undefined)
                        inputElement.setAttribute("max", field.max.toString());
                    if (field.hasOwnProperty("step") && field.step != undefined)
                        inputElement.setAttribute("step", field.step.toString());

                    fieldElement.appendChild(labelElement);
                    fieldElement.appendChild(inputElement);
                    break;
                case "select":
                    inputElement = document.createElement("select");
                    inputElement.setAttribute("id", field.id);
                    inputElement.setAttribute("name", field.name);
                    if (field.hasOwnProperty("defaultValue") && field.defaultValue)
                        inputElement.setAttribute("value", field.defaultValue.toString());

                    if (field.hasOwnProperty("options") && field.options) {
                        for (let option of field.options) {
                            const optionElement = document.createElement("option");
                            optionElement.setAttribute("value", option.value);
                            optionElement.innerText = option.label;
                            inputElement.appendChild(optionElement);
                        }
                    }
                    fieldElement.appendChild(labelElement);
                    fieldElement.appendChild(inputElement);
                    break;
                case "checkbox":
                    inputElement = document.createElement("input");
                    inputElement.setAttribute("type", "checkbox");
                    inputElement.setAttribute("id", field.id);
                    inputElement.setAttribute("name", field.name);
                    if (field.hasOwnProperty("defaultValue") && field.defaultValue)
                        inputElement.setAttribute("checked", "true");

                    fieldElement.appendChild(inputElement);
                    fieldElement.appendChild(labelElement);
                    break;
                default:
                    throw new Error(`Unrecognised field type: ${field.type}`);
            }

            if (field.hasOwnProperty("additional") && field.additional) {
                for (let additionalField of field.additional) {
                    const additionalLabelElement = document.createElement("label");
                    let additionalElement: HTMLInputElement | HTMLSelectElement

                    additionalLabelElement.setAttribute("for", additionalField.id);
                    additionalLabelElement.innerText = additionalField.label;

                    switch (additionalField.type) {
                        case "number":
                            additionalElement = document.createElement("input");
                            additionalElement.setAttribute("type", "number");
                            additionalElement.setAttribute("id", additionalField.id);
                            additionalElement.setAttribute("name", additionalField.name);
                            additionalElement.setAttribute("value", additionalField.defaultValue ? additionalField.defaultValue.toString() : "0");
                            if (additionalField.hasOwnProperty("min") && additionalField.min != undefined)
                                additionalElement.setAttribute("min", additionalField.min.toString());
                            if (additionalField.hasOwnProperty("max") && additionalField.max != undefined)
                                additionalElement.setAttribute("max", additionalField.max.toString());
                            if (additionalField.hasOwnProperty("step") && additionalField.step != undefined)
                                additionalElement.setAttribute("step", additionalField.step.toString());
                            fieldElement.appendChild(additionalLabelElement);
                            fieldElement.appendChild(additionalElement);
                            break;
                        case "select":
                            additionalElement = document.createElement("select");
                            additionalElement.setAttribute("id", additionalField.id);
                            additionalElement.setAttribute("name", additionalField.name);
                            if (additionalField.hasOwnProperty("defaultValue") && additionalField.defaultValue)
                                additionalElement.setAttribute("value", additionalField.defaultValue.toString());

                            if (additionalField.hasOwnProperty("options") && additionalField.options) {
                                for (let option of additionalField.options) {
                                    const optionElement = document.createElement("option");
                                    optionElement.setAttribute("value", option.value);
                                    optionElement.innerText = option.label;
                                    additionalElement.appendChild(optionElement);
                                }
                            }
                            fieldElement.appendChild(additionalLabelElement);
                            fieldElement.appendChild(additionalElement);
                            break;
                        case "checkbox":
                            additionalElement = document.createElement("input");
                            additionalElement.setAttribute("type", "checkbox");
                            additionalElement.setAttribute("id", additionalField.id);
                            additionalElement.setAttribute("name", additionalField.name);
                            if (additionalField.hasOwnProperty("defaultValue") && additionalField.defaultValue)
                                additionalElement.setAttribute("checked", "true");
                            fieldElement.appendChild(additionalElement);
                            fieldElement.appendChild(additionalLabelElement);
                            break;
                    }
                }
            }

            this.toolbarElement.appendChild(fieldElement);
        }
    }

    showFieldsForArchType(archType: ArchType): void {
        for (let field of this.fields) {
            const fieldElement: HTMLSpanElement | null = this.toolbarElement.querySelector(`#${field.name}-toolbar-item`);

            if (!fieldElement || !(fieldElement instanceof HTMLSpanElement)) {
                // throw new Error(`Field ${field.id} is not an input element.`);
                console.error(`Field #${field.name}-toolbar-item is not an input element.`);
                continue;
            }

            if (field.visibleFor && field.visibleFor.includes(archType)) {
                fieldElement.style.display = 'inline-block';
            } else {
                fieldElement.style.display = 'none';
            }
        }
    }

    // ########################## PLACEHOLDER ##########################
    getFormData(): Record<string, any> {
        const elements: HTMLFormControlsCollection = this.toolbarElement.elements;
        const formData: Record<string, any> = {};

        for (let field of this.fields) {
            if (!(elements.hasOwnProperty(field.name))) {
                continue;
            }

            const fieldElement: Element | RadioNodeList | null = elements.namedItem(field.name);
            if (!fieldElement) {
                continue;
            } else if (fieldElement instanceof HTMLInputElement) {
                if (fieldElement.type === "radio") {
                    formData[field.name] = fieldElement.checked;
                    continue;
                }
            }

            switch (field.type) {
                case "number":
                    if (!(fieldElement instanceof HTMLInputElement)) {
                        throw new Error(`Field ${field.name} is not an input element.`);
                    }
                    formData[field.name] = fieldElement.value;
                    break;
                case "select":
                    if (!(fieldElement instanceof HTMLSelectElement)) {
                        throw new Error(`Field ${field.name} is not a select element.`);
                    }
                    formData[field.name] = fieldElement.value;
                    break;
                case "checkbox":
                    if (!(fieldElement instanceof HTMLInputElement) || fieldElement.type !== "checkbox") {
                        throw new Error(`Field ${field.name} is not a checkbox element.`);
                    }
                    formData[field.name] = fieldElement.checked;
                    break;
                default:
                    throw new Error(`Unrecognised field type: ${field.type}`);
            }

            if (field.hasOwnProperty("additional") && field.additional) {
                for (let additionalField of field.additional) {
                    const additionalFieldElement: Element | RadioNodeList | null = elements.namedItem(additionalField.name);
                    if (!additionalFieldElement) {
                        continue;
                    } else if (additionalFieldElement instanceof HTMLInputElement) {
                        if (additionalFieldElement.type === "radio") {
                            formData[additionalField.name] = additionalFieldElement.checked;
                            continue;
                        }
                    }

                    switch (additionalField.type) {
                        case "number":
                            if (!(additionalFieldElement instanceof HTMLInputElement)) {
                                throw new Error(`Field ${additionalField.name} is not an input element.`);
                            }
                            formData[additionalField.name] = additionalFieldElement.value;
                            break;
                        case "select":
                            if (!(additionalFieldElement instanceof HTMLSelectElement)) {
                                throw new Error(`Field ${additionalField.name} is not a select element.`);
                            }
                            formData[additionalField.name] = additionalFieldElement.value;
                            break;
                        case "checkbox":
                            if (!(additionalFieldElement instanceof HTMLInputElement) || additionalFieldElement.type !== "checkbox") {
                                throw new Error(`Field ${additionalField.name} is not a checkbox element.`);
                            }
                            formData[additionalField.name] = additionalFieldElement.checked;
                            break;
                        default:
                            throw new Error(`Unrecognised field type: ${additionalField.type}`);
                    }
                }
            }
        }

        return formData;
    }

    readConfig(formData: Record<string, any>): ArchConfig {
        let brickWidth: number | undefined, brickCount: number | undefined;

        switch (formData["type"]) {
            case "flat":
                brickWidth = brickCount = undefined;
                switch (formData["brick-division-select"]) {
                    case "width":
                        brickWidth = formData["brick-width-or-count"];
                        break;
                    case "count":
                        brickCount = formData["brick-width-or-count"];
                        break;
                    default:
                        throw new Error(`Unrecognised brick division method: ${formData.brickDivisionMethod}`);
                }

                const config: ArchConfig = {
                    type: "flat",
                    opening: parseInt(formData["opening"]),
                    height: parseInt(formData["height"]),
                    jointSize: parseInt(formData["joint-size"]),
                    brickDivisionMethod: formData["brick-division-select"],
                    brickWidth: brickWidth,
                    brickCount: brickCount,
                    baseRise: parseInt(formData["base-rise"]),
                    topRise: parseInt(formData["top-rise"]),
                    skewUnit: formData["skew-units-select"],
                    skew: parseInt(formData["skew"]),
                }
                return config;
            case "radial":
            case "semicircle":
            case "bullseye":
                let rise: number | undefined, skew: number | undefined;
                brickWidth = brickCount = undefined;
                switch (formData["rise-or-skew-select"]) {
                    case "rise":
                        rise = parseInt(formData["rise-or-skew"]);
                        break;
                    case "deg":
                    case "mm":
                        skew = parseInt(formData["rise-or-skew"]);
                        break;
                    default:
                        throw new Error(`Unrecognised rise/skew choice on radial arch: ${formData["rise-or-skew"]}`);
                }

                switch (formData["brick-division-select"]) {
                    case "width":
                        brickWidth = parseInt(formData["brick-width-or-count"]);
                        break;
                    case "count":
                        brickCount = parseInt(formData["brick-width-or-count"]);
                        break;
                    default:
                        throw new Error(`Unrecognised brick division method: ${formData["brick-division-select"]}`);
                }

                return {
                    type: formData.type,
                    opening: parseInt(formData["opening"]),
                    height: parseInt(formData["height"]),
                    jointSize: parseInt(formData["joint-size"]),
                    brickDivisionMethod: formData["brick-division-select"],
                    brickWidth: brickWidth,
                    brickCount: brickCount,
                    riseOrSkew: formData["rise-or-skew-select"],
                    rise: rise,
                    skew: skew
                }
            default:
                throw new Error(`Unrecognised arch type: ${formData.type}`);
        }
    }

    // ########################## PLACEHOLDER ##########################
    updateFieldVisibility(archType: string): void {
        const archTypeField = this.fields.find(field => field.name === 'arch-type-toolbar-select');
        if (archTypeField) {
            archTypeField.visibleFor = archType === 'flat' ? ['flat', 'radial', 'semicircle', 'bullseye'] : ['flat', 'radial'];
        }
    }
}

abstract class ArchRenderer {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected geometry = new GeometryUtils();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.geometry = new GeometryUtils();

    }

    render(layout: BrickLayout/*, parameters: ArchParameters*/): void {
        this.drawPieces(layout.pieces);
    }

    drawPieces(pieces: BrickPiece[]): void {
        this.ctx.translate(globalThis.Arch.app.margin, globalThis.Arch.app.margin);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let piece of pieces) {
            this.ctx.beginPath();
            this.ctx.lineTo(piece.bl[0], piece.bl[1]);
            this.ctx.lineTo(piece.br[0], piece.br[1]);
            this.ctx.lineTo(piece.tr[0], piece.tr[1]);
            this.ctx.lineTo(piece.tl[0], piece.tl[1]);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    abstract drawOutline(parameters: FlatArchParameters | RadialArchParameters): void;

    adjustCanvas(width: number, height: number, clear?: boolean): void {
        globalThis.Arch.app.margin = Math.max(Math.round(height / 300), Math.round(width / 500)) * 50;
        this.canvas.width = width + 2 * globalThis.Arch.app.margin;
        this.canvas.height = height + 2 * globalThis.Arch.app.margin;
        this.ctx.resetTransform();

        if (clear) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.ctx.translate(globalThis.Arch.app.margin, globalThis.Arch.app.margin);
    }
}

class FlatArchRenderer extends ArchRenderer {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    drawOutline(parameters: FlatArchParameters, clear?: boolean): void {
        if (parameters.baseRise == null || parameters.topRise == null ||
            parameters.skewAngle == null || parameters.skewLength == null ||
            parameters.height == null) {
            throw new Error("Missing required parameters.");
        }

        this.adjustCanvas(parameters.drawingWidth, parameters.drawingHeight, clear);

        let bl: Point, br: Point, tr: Point, tl: Point;
        bl = [parameters.skewLength, 0];
        br = [parameters.skewLength + Number(parameters.opening), 0];
        tr = [parameters.skewLength * 2 + Number(parameters.opening), parameters.height];
        tl = [0, parameters.height];

        this.ctx.beginPath();
        this.ctx.lineTo(bl[0], bl[1]);
        if (parameters.baseRise < 1) {
            this.ctx.lineTo(br[0], br[1]);
        } else {
            if (parameters.baseOrigin == null || parameters.baseRadius == null ||
               parameters.baseFullAngle == null) {
                throw new Error("Missing required parameters.");
            }
            this.ctx.arc(parameters.baseOrigin[0], parameters.baseOrigin[1], parameters.baseRadius, (Math.PI / 2) + (parameters.baseFullAngle / 2), (Math.PI / 2) - (parameters.baseFullAngle / 2), true);
        }
        this.ctx.lineTo(tr[0], tr[1]);
        if (parameters.topRise < 1) {
            this.ctx.lineTo(tl[0], tl[1]);
        } else {
            if (parameters.topOrigin == null || parameters.topRadius == null ||
                parameters.topFullAngle == null) {
                throw new Error("Missing required parameters.");
            }
            this.ctx.arc(parameters.topOrigin[0], parameters.topOrigin[1], parameters.topRadius, Math.PI / 2 - (parameters.topFullAngle / 2), Math.PI / 2 + (parameters.topFullAngle / 2));
        }

        this.ctx.closePath();
        this.ctx.stroke();
    }
}

class RadialArchRenderer extends ArchRenderer {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    drawOutline(parameters: RadialArchParameters, clear?: boolean): void {
        console.log("drawOutline");
        if (parameters.baseBrickAngle == null || parameters.topBrickAngle == null ||
            parameters.baseJointAngle == null || parameters.topJointAngle == null ||
            parameters.origin == null || parameters.baseRadius == null ||
            parameters.topRadius == null || parameters.skewAngle == null ||
            parameters.skewLength == null || parameters.height == null ||
            parameters.brickCount == null || parameters.baseBrickWidth == null ||
            parameters.topBrickWidth == null || parameters.fullAngle == null) {
            throw new Error("Missing required parameters.");
        }

        this.adjustCanvas(parameters.drawingWidth, parameters.drawingHeight, clear);

        let bl: Point, br: Point, tr: Point, tl: Point;
        bl = this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.baseRadius, Math.PI / 2 - parameters.skewAngle);
        br = this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.baseRadius, Math.PI / 2 + parameters.skewAngle);
        tr = this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.topRadius, Math.PI / 2 + parameters.skewAngle);
        tl = this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.topRadius, Math.PI / 2 - parameters.skewAngle);

        let startAngle: number = Math.PI / 2 - parameters.skewAngle,
            endAngle: number = Math.PI / 2 + parameters.skewAngle;

        this.ctx.beginPath();
        this.ctx.lineTo(bl[0], bl[1]);
        this.ctx.arc(parameters.origin[0], parameters.origin[1], parameters.baseRadius, startAngle, endAngle, false);
        this.ctx.lineTo(tr[0], tr[1]);
        this.ctx.arc(parameters.origin[0], parameters.origin[1], parameters.topRadius, endAngle, startAngle, true);
        this.ctx.lineTo(bl[0], bl[1]);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

class AxisRenderer {
    private canvasContainer: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private axes: HTMLDivElement;
    private grid: HTMLDivElement;
    private toggleBox: HTMLFormElement;

    constructor (canvasContainer: HTMLDivElement) {
        this.canvasContainer = canvasContainer;
        this.canvas = this.canvasContainer.querySelector("canvas#arch-drawing-area") as HTMLCanvasElement;

        if (!(this.canvas instanceof HTMLCanvasElement)) {
            this.canvas = document.createElement("canvas");
            this.canvas.setAttribute("id", "arch-drawing-area");
            this.canvasContainer.appendChild(this.canvas);
        }

        this.axes = this.canvasContainer.querySelector("div#arch-axes") as HTMLDivElement;

        if (!(this.axes instanceof HTMLDivElement)) {
            this.axes = document.createElement("div");
            this.axes.setAttribute("id", "arch-axes");
            this.canvasContainer.appendChild(this.axes);
        }

        this.grid = this.canvasContainer.querySelector("div#arch-grid") as HTMLDivElement;

        if (!(this.grid instanceof HTMLDivElement)) {
            this.grid = document.createElement("div");
            this.grid.setAttribute("id", "arch-grid");
            this.canvasContainer.appendChild(this.grid);
        }

        this.toggleBox = this.canvasContainer.querySelector("form#axes-toggle-box") as HTMLFormElement;

        if (!(this.toggleBox instanceof HTMLDivElement)) {
            this.toggleBox = document.createElement("form");
            this.toggleBox.setAttribute("id", "axes-toggle-box");

            const axesVisibilityLabel: HTMLLabelElement = document.createElement("label");
            axesVisibilityLabel.setAttribute("for", "axes-visibility-chk");
            axesVisibilityLabel.innerText = "Axes";
            this.toggleBox.appendChild(axesVisibilityLabel);

            const axesVisibilityInput: HTMLInputElement = document.createElement("input");
            axesVisibilityInput.setAttribute("type", "checkbox");
            axesVisibilityInput.setAttribute("id", "axes-visibility-chk");
            axesVisibilityInput.setAttribute("name", "axes");
            axesVisibilityInput.setAttribute("checked", "true");
            axesVisibilityInput.addEventListener("change", () => {
                this.showAxes(axesVisibilityInput.checked);
            });
            this.toggleBox.appendChild(axesVisibilityInput);

            const gridVisibilityLabel: HTMLLabelElement = document.createElement("label");
            gridVisibilityLabel.setAttribute("for", "grid-visibility-chk");
            gridVisibilityLabel.innerText = "Grid";
            this.toggleBox.appendChild(gridVisibilityLabel);

            const gridVisibilityInput: HTMLInputElement = document.createElement("input");
            gridVisibilityInput.setAttribute("type", "checkbox");
            gridVisibilityInput.setAttribute("id", "grid-visibility-chk");
            gridVisibilityInput.setAttribute("name", "grid");
            gridVisibilityInput.setAttribute("checked", "true");
            gridVisibilityInput.addEventListener("change", () => {
                this.showGrid(gridVisibilityInput.checked);
            });
            this.toggleBox.appendChild(gridVisibilityInput);

            this.canvasContainer.appendChild(this.toggleBox);
        }
    }

    updateAxes(canvasWidth: number, canvasHeight: number, margin: number): void {
        // Scaling
        console.log(`A Margin: ${margin} from ${this.constructor.name}`);
        let precision = Math.max(
            this.nearestPrecision(canvasWidth, 10),
            this.nearestPrecision(canvasHeight, 8)
        );
        var axesLabelSize = Math.max(Math.round(canvasHeight / 40), Math.round(canvasWidth / 50));

        this.axes.innerHTML = "";
        this.grid.innerHTML = "";

        const xAxis = document.createElement("div");
        xAxis.className = "axis x";
        xAxis.style.top = `${this.canvas.height - margin + 1}px`;
        xAxis.style.width = `${this.canvas.width}px`;
        this.axes.appendChild(xAxis);

        const yAxis = document.createElement("div");
        yAxis.className = "axis y";
        yAxis.style.left = `${margin -2}px`;
        yAxis.style.height = `${this.canvas.height}px`;
        this.axes.appendChild(yAxis);

        // Label the axes
        for (let i = 0; i <= this.canvas.width; i += precision) {
            const label = document.createElement("div");
            label.className = "axis-label x";
            label.style.left = `${margin + i - 1}px`;
            label.style.top = `${this.canvas.height - margin + axesLabelSize}px`;
            label.style.fontSize = `${axesLabelSize}px`;
            label.innerHTML = i.toString();
            this.axes.appendChild(label);

            const grid = document.createElement("div");
            grid.className = "grid y";
            grid.style.left = `${i + margin - 1}px`;
            grid.style.height = `${this.canvas.height}px`;
            this.grid.appendChild(grid);
        }
        
        for (let i = 0; i <= this.canvas.height; i += precision) {
            const label = document.createElement("div");
            label.className = "axis-label y";
            label.style.top = `${this.canvas.height - margin - i}px`;
            label.style.right = `${this.canvas.width - margin + axesLabelSize}px `;
            label.style.fontSize = `${axesLabelSize}px`;
            label.innerHTML = i.toString();
            this.axes.appendChild(label);

            const grid = document.createElement("div");
            grid.className = "grid x";
            grid.style.top = `${this.canvas.height - i - margin}px`;
            grid.style.width = `${this.canvas.width}px`;
            this.grid.appendChild(grid);
        }
    }

    generatePrecision(n: number): number {
        const nums = [10, 12.5, 25, 50];
        return nums[n % 4] * Math.pow(10, Math.floor(n / 4));
    }

    nearestPrecision(distance: number, freq: number): number {
        let estimatedPrecision = Math.round(distance / freq);

        let n = 0;
        let currentPrecision = this.generatePrecision(n);
        let closestPrecision = currentPrecision;

        while (currentPrecision <= estimatedPrecision) {
            closestPrecision = currentPrecision;
            n++;
            currentPrecision = this.generatePrecision(n);
        }

        let nextPrecision = this.generatePrecision(n);
        if (Math.abs(nextPrecision - estimatedPrecision) < Math.abs(closestPrecision - estimatedPrecision)) {
            closestPrecision = nextPrecision;
        } else {
            n--;
        }

        return closestPrecision; //n; 
    }

    showAxes(show: boolean): void {
        this.axes.style.visibility = show ? "visible" : "hidden";
    }

    showGrid(show: boolean): void {
        this.grid.style.visibility = show ? "visible" : "hidden";
    }
}

class ArchCalculatorFactory {
    static create(type: string): ArchCalculator {
        switch (type) {
            case "flat":
                return new FlatArchCalculator();
            case "radial":
            case "semicircle":
            case "bullseye":
                return new RadialArchCalculator();
            default:
                throw new Error(`Unrecognised arch type: ${type}`);
        }
    }
}

class ArchApplication {
    private container: HTMLDivElement;
    private canvasContainer: HTMLDivElement;
    canvas: HTMLCanvasElement;
    config: ArchConfig;
    private calculator: ArchCalculator;
    renderer: FlatArchRenderer | RadialArchRenderer;
    private axisRenderer: AxisRenderer;
    private toolbar: ToolbarManager;
    margin: number;
    resizeObserver: ResizeObserver;

    constructor(container: HTMLDivElement) {
        this.container = container;
        let contentElement: HTMLDivElement | null = container.querySelector("div.project-content");
        let toolbarElement: HTMLFormElement | null = container.querySelector("form#arch-parameters-form");
        let canvasContainer: HTMLDivElement | null = container.querySelector("div.canvas-container");
        let canvas: HTMLCanvasElement | null = container.querySelector("canvas#arch-drawing-area");

        if (!contentElement || !(contentElement instanceof HTMLDivElement)) {
            contentElement = document.createElement("div");
            contentElement.setAttribute("class", "project-content");
            this.container.appendChild(contentElement);
        }

        if (!toolbarElement || !(toolbarElement instanceof HTMLFormElement)) {
            toolbarElement = document.createElement("form");
            toolbarElement.setAttribute("id", "arch-parameters-form");
            contentElement.appendChild(toolbarElement);
        }

        if (!canvasContainer || !(canvasContainer instanceof HTMLDivElement)) {
            canvasContainer = document.createElement("div");
            canvasContainer.setAttribute("class", "canvas-container");
            contentElement.appendChild(canvasContainer);
        }

        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "arch-drawing-area");
            canvasContainer.appendChild(canvas);
        }
        this.canvas = canvas;
        
        if (container.querySelector("div.canvas-container") && container.querySelector("div.canvas-container") instanceof HTMLDivElement) {
            this.canvasContainer = container.querySelector("div.canvas-container") as HTMLDivElement;
        } else {
            this.canvasContainer = document.createElement("div");
            this.canvasContainer.setAttribute("class", "canvas-container");
            contentElement.appendChild(this.canvasContainer);
        }


        this.config = DEFAULT_ARCH_CONFIG;
        this.calculator = ArchCalculatorFactory.create(this.config.type);
        switch (this.config.type) {
            case "flat":
                this.renderer = new FlatArchRenderer(this.canvas);
                break;
            case "radial":
                this.renderer = new RadialArchRenderer(this.canvas);
                break;
            default:
                throw new Error(`Unrecognised arch type: ${this.config.type}`);
        }
        this.axisRenderer = new AxisRenderer(this.canvasContainer);
        this.toolbar = new ToolbarManager(toolbarElement, TOOLBAR_FIELDS);
        this.toolbar.populateToolbar();

        this.setArchType(this.config.type);

        this.setupEventListeners();

        this.resizeObserver = new ResizeObserver(() => {
            this.refresh();
        });
        this.resizeObserver.observe(this.container);

        this.margin = DEFAULT_CANVAS_MARGIN;
    }

    setArchType(type: ArchType): void {
        this.toolbar.showFieldsForArchType(type);
    }

    updateConfiguration(config: Partial<ArchConfig>): void {
        this.config = Object.assign(this.config, config);
    }

    refresh(): void {
        console.log("Refreshing...");
        this.config = this.toolbar.readConfig(this.toolbar.getFormData());

        switch (this.config.type) {
            case "flat":
                this.renderer = new FlatArchRenderer(this.canvas);
                this.calculator = new FlatArchCalculator();
                break;
            case "radial":
            case "semicircle":
            case "bullseye":
                this.renderer = new RadialArchRenderer(this.canvas);
                this.calculator = new RadialArchCalculator();
                break;
            default:
                throw new Error(`Unrecognised arch type: ${this.config.type}`);
        }

        console.log(`B Margin: ${globalThis.Arch.app.margin} from ${this.constructor.name}`);
        this.calculateAndRender();
    }

    private calculateAndRender(): void {
        if (this.config.type === "flat" && this.calculator instanceof FlatArchCalculator &&
            this.renderer instanceof FlatArchRenderer) {
            const parameters: FlatArchParameters = this.calculator.calculateParameters(this.config as ArchConfig);
            this.renderer.drawOutline(parameters, true);
        } else if ((this.config.type === "radial" || this.config.type === "semicircle" ||
            this.config.type === "bullseye") && this.calculator instanceof RadialArchCalculator &&
            this.renderer instanceof RadialArchRenderer) {
            const parameters: RadialArchParameters = this.calculator.calculateParameters(this.config as ArchConfig);
            this.renderer.drawOutline(parameters);
        } else {
            throw new Error(`Unrecognised arch type: ${this.config.type}`);
        }

        console.log(`C Margin: ${globalThis.Arch.app.margin} from ${this.constructor.name}`);
        this.axisRenderer.updateAxes(this.canvas.width, this.canvas.height, this.margin);
        console.log(`D Margin: ${globalThis.Arch.app.margin} from ${this.constructor.name}`);
        this.adjustViewport();
    }

    private setupEventListeners(): void {
        // Add event listener to minimise/restore buttons
        // Project.prototype.setupEventListeners.call(this);

        // Add event listener to type select on change to run setArchType
        const typeSelectElement: HTMLSelectElement | null = this.toolbar.toolbarElement.querySelector("select#arch-type-toolbar-select");
        if (typeSelectElement instanceof HTMLSelectElement) {
            typeSelectElement.addEventListener("change", () => {
                this.setArchType(typeSelectElement.value as ArchType);
            });
        }

        for (let field of this.toolbar.fields) {
            const fieldElement: HTMLSpanElement | null = this.toolbar.toolbarElement.querySelector(`[name=${field.name}]`);

            if (!fieldElement || (!(fieldElement instanceof HTMLInputElement) && !(fieldElement instanceof HTMLSelectElement))) {
                // throw new Error(`Field ${field.id} is not an input element.`);
                console.error(`Field #${field.name}-toolbar-item is not an input element.`);
                continue;
            }

            fieldElement.addEventListener("change", () => {
                this.refresh();
            });

            if (field.hasOwnProperty("additional") && field.additional) {
                for (let additionalField of field.additional) {
                    const additionalFieldElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement | null = this.toolbar.toolbarElement.querySelector(`[name=${additionalField.name}]`);

                    if (!additionalFieldElement || (!(additionalFieldElement instanceof HTMLInputElement) && !(additionalFieldElement instanceof HTMLSelectElement) && !(additionalFieldElement instanceof HTMLTextAreaElement) && !(additionalFieldElement instanceof HTMLButtonElement))) {
                        continue;
                    }
                    additionalFieldElement.addEventListener("change", () => {
                        this.refresh();
                    });
                }
            }
        }
    }

    adjustViewport() {
        console.log("adjustViewport");
        const windowHeight: number = document.body.getBoundingClientRect().height;
        const titleBarHeight: number = globalThis.Arch.titlebar.getBoundingClientRect().height;
        const toolbarHeight: number = globalThis.Arch.app.toolbar.toolbarElement.getBoundingClientRect().height;
        const axesToggleBox: HTMLFormElement | null = this.container.querySelector("#axes-toggle-box");
        // const realCanvasHeight = this.canvasContainer.getBoundingClientRect().height;

        let maxHeight;
        if (this.container.classList.contains("maximised")) {
            maxHeight = windowHeight - titleBarHeight - toolbarHeight;
        } else {
            maxHeight = windowHeight * 0.6 - titleBarHeight - toolbarHeight;
        }

        var scale = Math.min(
            globalThis.Arch.content.getBoundingClientRect().width / this.canvas.width,
            maxHeight / this.canvas.height
        );

        this.canvasContainer.style.width = `${this.canvas.width}px`;
        this.canvasContainer.style.height = `${this.canvas.height}px`;
        this.canvasContainer.style.transform = `scale(${scale})`;
        this.canvasContainer.style.transformOrigin = "top left";

        if (!axesToggleBox) {
            return;
        }
        axesToggleBox.style.transform = `scale(${1 / scale})`;
    }
}

class Arch extends Project {
    app: ArchApplication;

    constructor(container: HTMLDivElement) {
        super("brick-arch", "Brick Arch", container);

        this.app = new ArchApplication(container);
    }
}

