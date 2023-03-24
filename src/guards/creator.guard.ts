import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class CreatorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    console.log(req, "Salom");
    

    if(!req.user.is_creator){
        throw new UnauthorizedException({
            message: "Bu amalni faqat creator bajara oladi!"
        })
    }

    return true;
  }
}



/* if(!req.user.is_creator){
    throw new UnauthorizedException({
        message: "Bu amalni faqat creator bajara oladi!"
    })
} */