import DatabaseEntity from "./databaseentity";
import {IPerson} from "../interfaces/iPerson";
import {Database} from "../database/postgres/database";
import {IStudent} from "../interfaces/IStudent";

export default abstract class Person extends DatabaseEntity implements IPerson {
    public FirstName: string | null = null;
    public MiddleName: string | null = null;
    public LastName: string | null = null;

    protected constructor (data?: IPerson) {
        super(data);
        this.FirstName = data?.FirstName || null;
        this.LastName = data?.LastName || null;
        this.MiddleName = data?.MiddleName || null;
    }

    setData(data: IStudent) {
        super.setData(data);
        this.FirstName = data.FirstName ? data.FirstName : null;
        this.MiddleName = data.MiddleName ? data.MiddleName : null;
        this.LastName = data.LastName ? data.LastName : null;
    }
}
