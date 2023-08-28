/* ===== Project Type class ===== */
enum ProjectStatus {
    Active,
    Finished,
}
class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

/* ===== Project State Management class ===== */
type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];

    private static instance: ProjectState;
    private constructor() {}

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
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
            isValid && validatableInput.value.toString().trim().length !== 0;
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

/* ===== ProjectList class ===== */
class ProjectList {
    // We need to tell TS the types we will be using
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement; // if there is no specific element type, we may use 'HTMLElement' which will work on any HTML element
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
        this.templateElement = document.getElementById(
            "project-list"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;
        this.assignedProjects = [];

        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );

        // Assign a velue to 'this.element' refer to the first element that happen to be <section>. Thus, there is no option as HTMLSectionElement so we use 'HTMLElement'
        this.element = importedNode.firstElementChild as HTMLElement;
        // Assign id to HTML element. In this case, it will appear in empty <div>
        this.element.id = `${this.type}-projects`;

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

        this.attach();
        this.renderContent(); // Call to render elements
    }

    private renderProjects() {
        const listElement = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement;
        listElement.innerHTML = ""; // clear list in innerHTML before render the new one
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listElement.appendChild(listItem);
        }
    }

    // Render element according to the input value
    private renderContent() {
        // Create dynamic id for HTML element
        const listId = `${this.type}-projects-list`;
        // Search for the element that we need to work with. Then, assign the id
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector(
            "h2"
        )!.textContent = `${this.type.toUpperCase()} PROJECT`;
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element); // beforeend <-- means before the closing tag
    }
}

/* ===== ProjectInput class ===== */
class ProjectInput {
    // We need to tell TS the types we will be using
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        // <HTMLTemplateElement> <-- type casting as the line below
        // this.templateElement = <HTMLTemplateElement>document.getElementById("project-input")!;
        // OR
        // Can also declare type casting using 'as as HTMLTemplateElement' as the line below. The results will be the same
        this.templateElement = document.getElementById(
            "project-input"
        )! as HTMLTemplateElement; // Using '!' declare that we sure this element is not null
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );

        // Assign a velue to 'this.element' refer to the first element that happen to be <form> so we use 'HTMLFormElement'
        this.element = importedNode.firstElementChild as HTMLFormElement;
        // Assign id to HTML element. In this case, it will appear in empty <div>
        this.element.id = "user-input";
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

        // call this.attach() to attach the element that we are working into the host element
        this.attach();
    }

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

    // Binding
    private configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }

    // Create a function that will work as a host to host the element
    // In HTML, this is an empty <div>
    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
