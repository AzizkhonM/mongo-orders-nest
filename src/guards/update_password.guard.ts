import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UpdatePassword implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()

    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException({
        message: "Foydalanuvchi avtorizatsiyadan o'tmagan",
      });
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: "Foydalanuvchi avtorizatsiyadan o'tmagan salom",
      });
    }
    let user: any;
    try {
      user = this.jwtService.verify(token, { secret: process.env.PRIVATE_KEY });
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException({
        message: "Foydalanuvchi avtorizatsiyadan o'tmagan User",
      });
    }

    /* let id = req.user._id.split('"')[1]
    console.log(id); */
    req.user = user;

    console.log(req.user, 'USER');

    // if(req.user.id != req.param.id){
    //     throw new UnauthorizedException("Ruxsat yo'q")
    // }
    return true
  }
}




/* const req = context.switchToHttp().getRequest()

        if(String(req.user._id) != req.param.id){
            throw new UnauthorizedException("Ruxsat yo'q")
        }
        return true */