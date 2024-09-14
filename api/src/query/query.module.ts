import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';

@Module({
  imports: [],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
