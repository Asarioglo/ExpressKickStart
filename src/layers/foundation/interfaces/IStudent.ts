import {IPerson} from "./iPerson";

export interface IStudent extends IPerson {
    ParentID: string|null
}
