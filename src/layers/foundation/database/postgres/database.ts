import {Pool, QueryResult} from 'pg';
import DatabaseConnection from "../databaseconnection";

export namespace Database {
    let _databaseConnection: Connection|null = null;

    export class Connection extends DatabaseConnection {
        private _pool = new Pool({
            user: 'appUser',
            host: 'localhost',
            database: 'appdata',
            password: 'root',
        });

        async query(query: string, data?: Array<any>): Promise<Array<any>> {
            if(data) {
                return (await this._pool.query(query, data)).rows;
            }
            return (await this._pool.query(query)).rows;
        }

        static getInstance() {
            if(_databaseConnection === null) {
                _databaseConnection = new Connection();
            }
            return _databaseConnection;
        }
    }
}

