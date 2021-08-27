import {IDatabaseEntity} from "./IDatabaseEntity";

export interface IPerson extends IDatabaseEntity {
    FirstName: string|null;
    MiddleName: string|null;
    LastName: string|null;
}
