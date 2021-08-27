import {IDatabaseEntity} from "../interfaces/IDatabaseEntity";
import {Database} from "../database/postgres/database";

export default class DatabaseEntity implements IDatabaseEntity {
    public ID: string|null = null;
    protected tableName: string|null = null;

    protected constructor(data?: any) {
        if(data?.hasOwnProperty('ID')) {
            this.ID = data['ID'];
        }
    }

    hasID (): boolean {
        return this.ID !== null;
    }

    setData(data: any) {
        if(data.hasOwnProperty('ID')) {
            this.ID = data['ID'];
        }
    }

    public async exists(): Promise<boolean> {
        if(this.ID == null) {
            return false;
        }
        const query = `SELECT EXISTS(SELECT 1 FROM "${this.tableName}" WHERE "ID"=$1)`;
        const data = [this.ID];
        const connection = Database.Connection.getInstance();
        const exists = await connection.query(query, data);
        return exists[0].exists;
    };

    public async delete(): Promise<boolean> {
        if(this.tableName == null) {
            throw "This entity has not defined its table name";
        }
        if(!this.hasID()) {
            throw `Can't be deleted. This object has not been instantiated with an ID`;
        }
        const query = `DELETE FROM "${this.tableName}" WHERE "ID" = $1`;
        const data = [this.ID];
        const connection = Database.Connection.getInstance();
        // if not successful this will throw
        await connection.query(query, data);
        return true;
    }

    public async load(): Promise<DatabaseEntity> {
        if(this.hasID()) {
            const connection = Database.Connection.getInstance();
            const query = `SELECT * FROM "${this.tableName}" WHERE "ID" = $1`;
            const data = [this.ID];
            const rows = await connection.query(query, data);
            if(rows.length === 1) {
                this.setData(rows[0]);
                return this;
            } else {
                if(rows.length === 0) {
                    throw(`Entity with id ${this.ID} has not been found`);
                } else {
                    throw(`More than one Entity with id: ${this.ID} has been found`);
                }
            }
        } else {
            throw `Can't be loaded. This object has not been instantiated with an ID`;
        }
    }

    static async getCount(tableName: string): Promise<number> {
        const connection = Database.Connection.getInstance();
        const query = `SELECT COUNT(*) as "Count" FROM "${tableName}"`;
        const count = await connection.query(query);
        return parseInt(count[0].Count);
    }
}
