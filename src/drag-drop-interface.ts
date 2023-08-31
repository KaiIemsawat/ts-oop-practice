/* ===== Drag & Drop interface ===== */

// namespace is a keyword. (Typescript feature, not in vanilla js)
// Name could be anything that make sense. In this case App in assosiate with app.ts
namespace App {
    // * Need to ad attribute in HTML tag as 'draggable="true"'
    // using export to be able to access from other files
    export interface Draggable {
        // DragEvent is one of DOM events. More info -> https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
        dragStartHandler(event: DragEvent): void;
        dragEndHandler(event: DragEvent): void;
    }

    export interface DragTarget {
        dragOverHandler(event: DragEvent): void;
        dropHandler(event: DragEvent): void;
        dragLeaveHandler(event: DragEvent): void;
    }
}
