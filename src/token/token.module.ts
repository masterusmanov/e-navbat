import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schema/token.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}])],
  controllers: [TokenController],
  providers: [TokenService]
})
export class TokenModule {}
