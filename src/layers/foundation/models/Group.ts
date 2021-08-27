import Student from "./Student";
import DatabaseEntity from "./databaseentity";
import {IGroup} from "../interfaces/IGroup";
import {Database} from "../database/postgres/database";
import {IStudent} from "../interfaces/IStudent";
import DatabaseConnection from "../database/databaseconnection";

export default class Group extends DatabaseEntity implements IGroup {
    private _students: Student[] = [];

    public Name: string|null = null;
    protected tableName = "Group";

    constructor(data?: IGroup) {
        super(data);
        if(data?.Name != null) {
            this.Name = data.Name;
        }
    }

    isEmpty(): boolean {
        return this._students.length === 0;
    }

    getStudents(): Student[] {
        return this._students;
    }

    async load(): Promise<Group> {
        await super.load();
        await this._loadStudents();
        return this;
    }

    async save(): Promise<boolean> {
        if(this.ID === null || !(await this.exists())) {
            return this._saveNew();
        } else {
            return this._upadteExisting();
        }
    }

    private async _saveNew(): Promise<boolean> {
        this.ID = DatabaseConnection.generateUUID();
        const query = `INSERT INTO "Group" ("ID", "Name") VALUES ($1, $2)`;
        const data: Array<any> = [this.ID, this.Name];
        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return true;
    }

    private async _upadteExisting(): Promise<boolean> {
        const query = `UPDATE "Group" SET "Name" = $1 WHERE "ID" = $2`;
        const data: Array<any> = [this.Name,  this.ID];
        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        return true;
    }

    async addStudent(studentID: Student|string): Promise<boolean> {
        if(studentID instanceof Student) {
            if(studentID.ID === null) {
                throw `Can't add an usaved/unloaded student to this group`;
            }
            studentID = studentID.ID as string;
        }
        if(!this.hasID()) {
            throw "This Group does not have ID set";
        }
        if(studentID == null) {
            throw `Student ID mus be provided to add to a group. Received ${studentID}`;
        }

        const query = `INSERT INTO "StudentGroup" ("StudentID", "GroupID")
                        VALUES ($1, $2)`;
        const data: Array<any> = [studentID, this.ID];
        const connection = Database.Connection.getInstance();
        await connection.query(query, data);
        await this._loadStudents();
        return true;
    }

    private async _loadStudents(): Promise<IStudent[]> {
        const query = `SELECT * From "Student" 
                        JOIN "StudentGroup" 
                            ON "Student"."ID" = "StudentGroup"."StudentID" 
                        WHERE "StudentGroup"."GroupID"=$1;`;
        const data: Array<any> = [this.ID];
        const connection = Database.Connection.getInstance();
        const rows = await connection.query(query, data);
        this._students = rows.map((student: IStudent) => {
            return new Student(student);
        })
        return this._students;
    }
};
