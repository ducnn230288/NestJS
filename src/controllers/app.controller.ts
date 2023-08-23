import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  @Get('/')
  root(@Req() req: Request, @Res() res: Response, @I18n() i18n: I18nContext) {
    return res.render('index', { title: "True Foundry's GitHub Authorizerss" });
  }
}
