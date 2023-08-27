// Code goes here!
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;

    constructor() {
        // Useing '!' declare that we sure this element is not null
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

        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = "user-input";
        this.attach();
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

const projectInput = new ProjectInput();
