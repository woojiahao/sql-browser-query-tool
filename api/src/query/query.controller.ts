import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { QueryService } from './query.service';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post('execute')
  @HttpCode(200)
  async executeQuery(@Body() body: ExecuteQueryDto) {
    return await this.queryService.executeQuery(body);
  }
}
