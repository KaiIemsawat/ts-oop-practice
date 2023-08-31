// 3 Forward slashes is a typescript special syntax. Not in js
// add path to the file needed to import
// ! Becareful using these. Need to check tsconfig.json for "module": "commonjs" to "module": "amd"
// * Also check <script src="dist/bundle.js" defer></script> in html
///<reference path="drag-drop-interface.ts"/>
///<reference path="project-model.ts"/>

namespace App {
    /* ===== State class ===== */
    type Listener<T> = (items: T[]) => void;
    class State<T> {
        protected listeners: Listener<T>[] = [];
        addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn);
        }
    }

    /* ===== Project State Management class ===== */
    class ProjectState extends State<Project> {
        private projects: Project[] = [];

        private static instance: ProjectState;
        private constructor() {
            super();
        }

        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }

        addProject(title: string, description: string, numOfPeople: number) {
            const newProject = new Project(
                Math.random().toString(),
                title,
                description,
                numOfPeople,
                ProjectStatus.Active
            );
            this.projects.push(newProject);
            this.updateListeners();
        }

        // The concept of this function is to switch status of the project
        moveProject(projectId: string, newStatus: ProjectStatus) {
            const project = this.projects.find(
                (project) => project.id === projectId
            );
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }

        // Later, we can call this function in addProject() or moveProject() if we did change something
        private updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }

    const projectState = ProjectState.getInstance();

    // Validation
    // We may use '?' as 'minLength?: number;' or 'minLength: number | undefinded;' and the result will be same
    interface Validatable {
        value: string | number;
        required: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
    }

    function validate(validatableInput: Validatable) {
        let isValid = true;

        // Check required
        if (validatableInput.required) {
            isValid =
                isValid &&
                validatableInput.value.toString().trim().length !== 0;
        }

        // Check minLength
        if (
            validatableInput.minLength != null &&
            typeof validatableInput.value === "string"
        ) {
            isValid =
                isValid &&
                validatableInput.value.length >= validatableInput.minLength;
        }

        // Check maxLength
        if (
            validatableInput.maxLength != null &&
            typeof validatableInput.value === "string"
        ) {
            isValid =
                isValid &&
                validatableInput.value.length <= validatableInput.maxLength;
        }

        // Check min
        if (
            validatableInput.min != null &&
            typeof validatableInput.value === "number"
        ) {
            isValid = isValid && validatableInput.value >= validatableInput.min;
        }

        // Check max
        if (
            validatableInput.max != null &&
            typeof validatableInput.value === "number"
        ) {
            isValid = isValid && validatableInput.value <= validatableInput.max;
        }
        return isValid;
    }

    // Autobind decorator
    function autobind(
        // add underscore '_' that the front of the name tells TS that we know this specific argument is not being used
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        const adjDescriptor: PropertyDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            },
        };
        return adjDescriptor;
    }

    /* ===== Component Base class ===== */
    abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        // Create generic types
        // We need to tell TS the types we will be using
        templateElement: HTMLTemplateElement;
        hostElement: T;
        element: U; // if there is no specific element type, we may use 'HTMLElement' which will work on any HTML element

        constructor(
            templateId: string,
            hostElementId: string,
            insertAtStart: boolean,
            newElementId?: string // Optional parameter should be at the last. Not mandatory but a good practice
        ) {
            this.templateElement = document.getElementById(
                templateId
            )! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostElementId)! as T;

            const importedNode = document.importNode(
                this.templateElement.content,
                true
            );

            // Assign a velue to 'this.element' refer to the first element that happen to be <section>. Thus, there is no option as HTMLSectionElement so we use 'HTMLElement'
            this.element = importedNode.firstElementChild as U;
            // Check is 'newElementId' is available
            if (newElementId) {
                // If so, assign id to HTML element. In this case, it will appear in empty <div>
                this.element.id = newElementId;
            }

            this.attach(insertAtStart);
        }
        // call this.attach() to attach the element that we are working into the host element
        private attach(insertAtBeginning: boolean) {
            this.hostElement.insertAdjacentElement(
                insertAtBeginning
                    ? "afterbegin" // afterbegin <-- means right after openning tag
                    : "beforeend", // beforeend <-- means before the closing tag
                this.element
            );
        }

        // Any class that inherit this class needs this two methods.
        abstract configure(): void;
        abstract renderContent(): void;
    }

    /* ===== ProjectItem class ===== */
    class ProjectItem
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

    /* ===== ProjectList class ===== */
    class ProjectList
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

    /* ===== ProjectInput class ===== */
    class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        // We need to tell TS the types we will be using
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;

        constructor() {
            super("project-input", "app", true, "user-input");
            // Assign a value to 'this.elementInputElement' using this.element.querySelector("#elementId") as HTMLInputElement;
            this.titleInputElement = this.element.querySelector(
                "#title"
            ) as HTMLInputElement;
            this.descriptionInputElement = this.element.querySelector(
                "#description"
            ) as HTMLInputElement;
            this.peopleInputElement = this.element.querySelector(
                "#people"
            ) as HTMLInputElement;

            this.configure();
        }
        // It is conventional to have 'public function' above 'private function'
        // Binding
        configure() {
            this.element.addEventListener("submit", this.submitHandler);
        }

        renderContent(): void {}

        // Canceptually, this function is used to reach out all user inputs
        // : [string, string, number] <-- this type called tuple. Tuple requires exact type
        private getherUserInput(): [string, string, number] | void {
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;

            const titleValidatable: Validatable = {
                value: enteredTitle,
                required: true,
                // minLength: 3,
            };
            const descriptionValidatable: Validatable = {
                value: enteredDescription,
                required: true,
                minLength: 5,
            };
            const peopleValidatable: Validatable = {
                // adding '+' will convert the value to number
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 5,
            };

            // Validating
            if (
                // If any of these show false, it's invalid and alert will show
                !validate(titleValidatable) ||
                !validate(descriptionValidatable) ||
                !validate(peopleValidatable)
            ) {
                alert("Invalid input, please give it another try");
                return;
            } else {
                // adding '+' will convert the value to number
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }

        private clearInput() {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.peopleInputElement.value = "";
        }

        @autobind
        private submitHandler(event: Event) {
            event.preventDefault();
            const userInput = this.getherUserInput();
            // Check if userInput is an array
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                projectState.addProject(title, desc, people);
                // clear input fields
                this.clearInput();
            }
        }
    }

    new ProjectInput();
    new ProjectList("active");
    new ProjectList("finished");
}
