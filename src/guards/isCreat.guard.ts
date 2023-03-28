import {Injectable,ExecutionContext, CanActivate, UnauthorizedException} from '@nestjs/common'
import { Observable } from 'rxjs';

@Injectable()
export class IsCreat implements CanActivate{

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        
        if(!req.user.is_creator)
            {
            
                throw new UnauthorizedException({
                    message: "Ruxsat etilmagan foydalanuvchi"
                }); 

            }    
        return true
        
    }
}