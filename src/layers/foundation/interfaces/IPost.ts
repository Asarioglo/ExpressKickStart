import {IDatabaseEntity} from "./IDatabaseEntity";

export interface IPost extends IDatabaseEntity {
    CreatorID: string|null;
    TimeStamp: number|null;
}
