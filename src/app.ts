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

// ProjectInput class
class ProjectInput {
    // We need to tell TS the types we will be using
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        // Using '!' declare that we sure this element is not null
        // <HTMLTemplateElement> <-- type casting as the line below
        // this.templateElement = <HTMLTemplateElement>document.getElementById("project-input")!;
        // OR
        // Can also declare type casting using 'as as HTMLTemplateElement' as the line below. The results will be the same
        this.templateElement = document.getElementById(
            "project-input"
        )! as HTMLTemplateElement;
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
            console.log(title, desc, people);
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
