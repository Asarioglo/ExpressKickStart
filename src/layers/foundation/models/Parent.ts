import {IParent} from "../interfaces/IParent";
import {Database} from "../database/postgres/database";
import Person from "./Person";
import DatabaseConnection from "../database/databaseconnection";

export default class Parent extends Person implements IParent {

    protected tableName = 'Parent';

    constructor(data?: IParent) {
        super(data);
    }

    async getChildren(): Promise<string[]> {
        if(this.ID == null) {
            throw "This parent has no ID";
        }
        const query = `SELECT "StudentID" FROM "StudentParent" WHERE "ParentID" = $1`;
        const data = [this.ID];
        const connection = Database.Connection.getInstance();
        const results = await connection.query(query, data);
        return results.map((record: {StudentID: string}) => {
            return record.StudentID;
        })
    }

    static async getParentCount(): Promise<number> {
        const connection = Database.Connection.getInstance();
        const query = 'SELECT COUNT("ID") as "Count" FROM "Parent"';
        const count = await connection.query(query);
        return parseInt(count[0].Count);
    }

    static async addParent(parentData: IParent): Promise<Parent> {
        if(parentData.FirstName == null) {
            throw ('First name of the parent must be provided');
        }
        if(parentData.LastName == null) {
            throw ('Last name of the parent must be provided');
        }

        const uuid = DatabaseConnection.generateUUID()
        const query = `INSERT INTO "Parent" 
                         ("ID", "FirstName", "MiddleName", "LastName")
                         VALUES ($1, $2, $3, $4)`;
        const data = [
            uuid,
            parentData.FirstName,
            parentData.MiddleName,
            parentData.LastName
        ];

        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return new Parent({...parentData, ID: uuid});
    }

    static async getParentByID(ID: string): Promise<Parent> {
        const parent = new Parent({ID: ID} as IParent);
        return await parent.load() as Parent;
    }

}
