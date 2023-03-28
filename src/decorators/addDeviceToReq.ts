import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as UAParser from 'ua-parser-js'

export const AddDeviceInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const uaParser = new UAParser();
    const userAgent = request.headers['user-agent'];
    const parsedUserAgent = uaParser.setUA(userAgent).getResult();
    request.device = parsedUserAgent
    
    return request;
  },
);