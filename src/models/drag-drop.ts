/* ===== Drag & Drop interface ===== */

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
