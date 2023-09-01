import Cmp from "./base-component"; // incase that the original file use 'export default', we may name anything
// import { Validatable, validate } from "../utils/validation";
import * as Validation from "../utils/validation"; // another way of import multiple values
// import { autobind } from "../decorators/autobind";
import { autobind as Autobind } from "../decorators/autobind"; // Also work on single value the need to change name (changed name onle effects this file)
import { projectState } from "../state/project-state";

/* ===== ProjectInput class ===== */
export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement> {
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

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true,
            // minLength: 3,
        };
        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const peopleValidatable: Validation.Validatable = {
            // adding '+' will convert the value to number
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };

        // Validating
        if (
            // If any of these show false, it's invalid and alert will show
            !Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable)
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

    @Autobind
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
