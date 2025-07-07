window.addEventListener("DOMContentLoaded", initialise);

function initialise() {
    const projectImageViewers: NodeListOf<HTMLDivElement> = document.querySelectorAll("div.project-image-viewer");

    for (let projectImageViewer of projectImageViewers) {
        projectImageViewer.addEventListener("wheel", (e: WheelEvent) => {
            e.preventDefault();
            projectImageViewer.scrollLeft += e.deltaY;
        });
    }
}
