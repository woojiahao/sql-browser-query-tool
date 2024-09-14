import { Client } from 'pg';
import { ForbiddenOperationError, TableNotFoundError } from './errors';

export class Database {
  private readonly client: Client;

  private constructor(base: string, databaseName: string) {
    const connStr = `${base}/${databaseName}`;
    console.log(connStr);
    this.client = new Client(connStr);
  }

  static async of(base: string, databaseName: string) {
    const database = new Database(base, databaseName);
    await database.client.connect();
    return database;
  }

  async query(query: string, ...params: any[]) {
    try {
      return await this.client.query(query, params);
    } catch (e) {
      if ('code' in e) {
        const code = e['code'];
        switch (code) {
          case '42P01': {
            // TODO: The database shouldn't be throwing HTTP errors
            throw new TableNotFoundError();
          }
          case '42501':
          case '42703': {
            throw new ForbiddenOperationError();
          }
          default: {
            console.error(e);
            throw new Error('Something happened internally.');
          }
        }
      } else {
        console.error(e);
        throw new Error('Something happened internally.');
      }
    }
  }
}
