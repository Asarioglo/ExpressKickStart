import {Database} from "../database";
import {QueryResult} from 'pg';

test("Application connects to database", async () => {
    const queryString = 'SELECT $1::text as message';
    const queryData = ['Hello World'];

    const connection = Database.Connection.getInstance();

    const result = await connection.query(queryString, queryData);

    expect(result[0].message).toEqual('Hello World');
})
