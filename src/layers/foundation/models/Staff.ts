import Person from "./Person";
import {IStaff} from "../interfaces/IStaff";
import DatabaseConnection from "../database/databaseconnection";
import {Database} from "../database/postgres/database";

export default class Staff extends Person implements IStaff {
    protected tableName = 'Staff';

    constructor(data?: any) {
        super(data);
    }

    async save(): Promise<Staff> {
        if(this.ID === null || !(await this.exists())) {
            return this._saveNew();
        } else {
            return this._updateExisting();
        }
    }

    private async _saveNew() {
        if(this.FirstName == null) {
            throw ('First name of the student must be provided');
        }
        if(this.LastName == null) {
            throw ('Last name of the student must be provided');
        }
        this.ID = DatabaseConnection.generateUUID()
        const query = `INSERT INTO "Staff" 
                         ("ID", "FirstName", "MiddleName", "LastName")
                         VALUES ($1, $2, $3, $4, $5)`;
        const data = [
            this.ID,
            this.FirstName,
            this.MiddleName,
            this.LastName
        ];

        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return this;

    }

    private async _updateExisting() {
        const query = `UPDATE "Staff" SET 
                        "FirstName" = $1,
                        "MiddleName" = $2,
                        "LastName" = $3`;
        const data = [
            this.FirstName,
            this.MiddleName,
            this.LastName
        ];
        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return this;
    }

}
