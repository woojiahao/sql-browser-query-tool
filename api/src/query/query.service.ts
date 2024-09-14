import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Database } from '../database/database';

@Injectable()
export class QueryService {
  // TODO: Allow users to select from all existing tables
  private readonly baseReadDatabaseUrl: string;
  private readonly baseAdminDatabaseUrl: string;

  constructor(configService: ConfigService) {
    this.baseReadDatabaseUrl = configService.getOrThrow('READ_DATABASE_URL');
    this.baseAdminDatabaseUrl = configService.getOrThrow('ADMIN_DATABASE_URL');
  }

  async executeQuery({ databaseName, query }: ExecuteQueryDto) {
    const database = await Database.of(this.baseReadDatabaseUrl, databaseName);
    const result = await database.query(query);
    const columns = result.fields.map((field) => field.name);
    const values = result.rows.slice(0, 20).map((row) => row);
    console.log(result);
    return {
      columns,
      values,
    };
  }
}
