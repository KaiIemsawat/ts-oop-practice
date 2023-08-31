/* ===== Project Model class ===== */

// Name need to be App (in this case)

export enum ProjectStatus {
    Active,
    Finished,
}
export class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}
