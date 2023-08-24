import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { resolve } from 'path';

@Controller()
export class AppController {
  @Get('/')
  root(@Req() req: Request, @Res() res: Response) {
    return res.render('index', { title: "True Foundry's GitHub Authorizerss" });
  }

  @Get('/administrator')
  administrator(@Res() res: Response) {
    return res.sendFile(resolve('./src/public/index.html'));
  }
}
