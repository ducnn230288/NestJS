import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as isBot from 'isbot';
import { resolve } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  root(@Req() req: Request, @Res() res: Response) {
    if (isBot(req.get('user-agent'))) return res.render('index', { title: "True Foundry's GitHub Authorizerss" });
    return res.sendFile(resolve('./src/public/react.html'));
  }
}
