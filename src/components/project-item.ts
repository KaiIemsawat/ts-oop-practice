/// <reference path="base-component.ts"  />
/// <reference path="../decorators/autobind.ts"  />
/// <reference path="../models/project.ts"  />
/// <reference path="../models/drag-drop.ts"  />

namespace App {
    /* ===== ProjectItem class ===== */
    export class ProjectItem
        extends Component<HTMLUListElement, HTMLLIElement>
        implements Draggable
    {
        // implementing Draggable needs it functions
        private project: Project;

        // Create condition where the assigned people may be singular or pural
        get persons() {
            if (this.project.people === 1) {
                return "1 Person";
            } else {
                return `${this.project.people} Persons`;
            }
        }

        constructor(hostId: string, project: Project) {
            super("single-project", hostId, false, project.id);
            this.project = project;

            this.configure();
            this.renderContent();
        }

        @autobind
        // Came from Draggable interface
        dragStartHandler(event: DragEvent) {
            // The DataTransfer object is used to hold the data that is being dragged during a drag and drop operation. It may hold one or more data items, each of one or more data types
            event.dataTransfer!.setData("text/plain", this.project.id); // '?' may or may not have this value, '!' we sure that we have it
            event.dataTransfer!.effectAllowed = "move";
        }

        // Came from Draggable interface
        dragEndHandler(_: DragEvent) {
            // '_' means that we are not using it
            console.log("Drag End");
        }

        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler); // Can also use the next line and remove @autobind
            // this.element.addEventListener("dragstart", this.dragStartHandler.bind(this));
            this.element.addEventListener("dragend", this.dragEndHandler);
        }

        // Assign value to HTML elements
        renderContent() {
            this.element.querySelector("h2")!.textContent = this.project.title;
            this.element.querySelector("h3")!.textContent =
                this.persons + " assigned.";
            this.element.querySelector("p")!.textContent =
                this.project.description;
        }
    }
}
