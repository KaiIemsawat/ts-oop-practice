/* ===== Component Base class ===== */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
