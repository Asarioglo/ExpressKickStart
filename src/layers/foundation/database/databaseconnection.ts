import { v4 as uuidv4 } from 'uuid';

export default abstract class DatabaseConnection {
    abstract query(query: string, data: Array<any>): any;

    static generateUUID(): string {
        return uuidv4();
    }
}
