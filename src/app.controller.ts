import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  setCookie(@Res() res: Response) {
    res.cookie('myCookie', 'Hello World!', {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
    return 'Cookie set!';
  }
}