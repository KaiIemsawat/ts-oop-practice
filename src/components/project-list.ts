/// <reference path="base-component.ts"  />
/// <reference path="../decorators/autobind.ts"  />
/// <reference path="../models/project.ts"  />
/// <reference path="../models/drag-drop.ts"  />
/// <reference path="../state/project-state.ts"  />

namespace App {
    /* ===== ProjectList class ===== */
    export class ProjectList
        extends Component<HTMLDivElement, HTMLElement>
        implements DragTarget
    {
        assignedProjects: Project[];

        constructor(private type: "active" | "finished") {
            super("project-list", "app", false, `${type}-projects`); // Use super() to call constructor of the base class

            this.assignedProjects = [];

            this.configure();
            this.renderContent(); // Call to render elements
        }

        @autobind
        dragOverHandler(event: DragEvent) {
            if (
                event.dataTransfer &&
                event.dataTransfer.types[0] === "text/plain"
            ) {
                event.preventDefault();
                const listElement = this.element.querySelector("ul")!;
                listElement.classList.add("droppable"); // Add class to HTML element. Create the color change effect in css once user start dragging
            }
        }

        @autobind
        dropHandler(event: DragEvent) {
            const projectId = event.dataTransfer!.getData("text/plain");
            projectState.moveProject(
                projectId,
                this.type === "active"
                    ? ProjectStatus.Active
                    : ProjectStatus.Finished
            );
        }

        @autobind
        dragLeaveHandler(_: DragEvent) {
            const listElement = this.element.querySelector("ul")!;
            listElement.classList.remove("droppable"); // Remove class to HTML element. Remove CSS color style once user move the element to somewhere else
        }

        // It is conventional to have 'public function' above 'private function'
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);

            projectState.addListener((projects: Project[]) => {
                // With this, project will assign values to only the relevant project status
                const relevantProjects = projects.filter((project) => {
                    if (this.type === "active") {
                        return project.status === ProjectStatus.Active;
                    }
                    return project.status === ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }

        // Render element according to the input value
        renderContent() {
            // Create dynamic id for HTML element
            const listId = `${this.type}-projects-list`;
            // Search for the element that we need to work with. Then, assign the id
            this.element.querySelector("ul")!.id = listId;
            this.element.querySelector(
                "h2"
            )!.textContent = `${this.type.toUpperCase()} PROJECT`;
        }

        private renderProjects() {
            const listElement = document.getElementById(
                `${this.type}-projects-list`
            )! as HTMLUListElement;
            listElement.innerHTML = ""; // clear list in innerHTML before render the new one
            for (const projectItem of this.assignedProjects) {
                new ProjectItem(
                    this.element.querySelector("ul")!.id,
                    projectItem
                );
            }
        }
    }
}
