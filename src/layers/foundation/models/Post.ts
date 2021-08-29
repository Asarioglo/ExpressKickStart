import DatabaseEntity from "./DatabaseEntity";
import {IPost} from "../interfaces/IPost";
import DatabaseConnection from "../database/databaseconnection";
import {Database} from "../database/postgres/database";

export default class Post extends DatabaseEntity implements IPost{
    protected tableName = 'Post';
    CreatorID = null;
    TimeStamp = null;

    constructor(data?: any) {
        super(data);
        this.setData(data);
    }

    setData(data: any): Post {
        super.setData(data);
        if(data.hasOwnProperty('CreatorID')) {
            this.CreatorID = data.CreatorID;
        }
        if(data.hasOwnProperty('Timestamp')) {
            this.TimeStamp = data.TimeStamp;
        }
        return this;
    }

    save() {
        if(this.ID === null || !(await this.exists())) {
            return this._saveNew();
        } else {
            return this._upadteExisting();
        }
    }

    private async _saveNew(): Promise<boolean> {
        this.ID = DatabaseConnection.generateUUID();
        const query = `INSERT INTO "Post" ("ID", "CreatorID", "TimeStamp") VALUES ($1, $2, $3)`;
        const data: Array<any> = [this.ID, this.CreatorID, this.TimeStamp];
        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return true;
    }

    private async _upadteExisting(): Promise<boolean> {
        const query = `UPDATE "Post" SET 
                        "CreatorID" = $1,
                        "TimeStamp" = $2
                        WHERE "ID" = $3`;// probably will need timestamp and last updated
        const data: Array<any> = [this.CreatorID, this.TimeStamp, this.ID];
        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return true;
    }
}
