import DatabaseEntity from "./databaseentity";
import { Database } from "../database/postgres/database";
import {IStudent} from "../interfaces/IStudent";
import DatabaseConnection from "../database/databaseconnection";
import Person from "./Person";
import Parent from "./Parent";
import {IParent} from "../interfaces/IParent";

export default class Student extends Person implements IStudent {

    public ParentID: string|null;

    protected tableName = 'Student'

    constructor(data: IStudent) {
        super(data);
        this.ParentID = data.ParentID || null;
    }

    async save(): Promise<Student> {
        if(this.ID === null || !(await this.exists())) {
            return this._saveNew();
        } else {
            return this._updateExisting();
        }
    }

    async setData(data: IStudent) {
        super.setData(data);
        if(data.ParentID != null) {
            this.ParentID = data.ParentID;
        }
    }

    async addParent(parent: Parent|string): Promise<Student> {
        if(!parent) {
            throw "Parent instance or parent ID must be provided to add a parent";
        }
        if(typeof parent === "string") {
            parent = new Parent({ID: parent} as IParent);
        } else if(parent.ID == null) {
            throw "Parent you're trying to add does not have an ID";
        }
        const parentExists = await parent.exists();
        if(!parentExists) {
            throw `Parent you are trying to add does not exist. ID: ${parent.ID}`;
        }

        const query = `INSERT INTO "StudentParent" ("StudentID", "ParentID")
                        VALUES($1, $2)`;
        const data = [this.ID, parent.ID];
        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return this;
    }

    async getParents(): Promise<Array<string>> {
        if(this.ID == null) {
            throw 'This student has no ID';
        }
        const query = `SELECT "ParentID" FROM "StudentParent" WHERE "StudentID" = $1`;
        const data = [this.ID];
        const connection = Database.Connection.getInstance();
        const results = await connection.query(query, data);
        return results.map((record: {ParentID: string}) => {
            return record.ParentID;
        })
    }

    private async _saveNew(): Promise<Student> {
        if(this.FirstName == null) {
            throw ('First name of the student must be provided');
        }
        if(this.LastName == null) {
            throw ('Last name of the student must be provided');
        }

        this.ID = DatabaseConnection.generateUUID()
        const query = `INSERT INTO "Student" 
                         ("ID", "FirstName", "MiddleName", "LastName", "ParentID")
                         VALUES ($1, $2, $3, $4, $5)`;
        const data = [
            this.ID,
            this.FirstName,
            this.MiddleName,
            this.LastName,
            null
        ];

        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return this;
    }

    private async _updateExisting(): Promise<Student> {
        const query = `UPDATE "Student" SET 
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

    static async getCount(): Promise<number> {
        return DatabaseEntity.getCount('Student');
    }

    static async addStudent(studentData: IStudent): Promise<Student> {
        if(studentData.FirstName == null) {
            throw ('First name of the student must be provided');
        }
        if(studentData.LastName == null) {
            throw ('Last name of the student must be provided');
        }

        const uuid = DatabaseConnection.generateUUID()
        const query = `INSERT INTO "Student" 
                         ("ID", "FirstName", "MiddleName", "LastName", "ParentID")
                         VALUES ($1, $2, $3, $4, $5)`;
        const data = [
            uuid,
            studentData.FirstName,
            studentData.MiddleName,
            studentData.LastName,
            null
        ];

        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return new Student({...studentData, ID: uuid});
    }

    static async getStudentByID(ID: string): Promise<Student> {
        const student = new Student({ID: ID} as IStudent);
        return await student.load() as Student;
    }

}
