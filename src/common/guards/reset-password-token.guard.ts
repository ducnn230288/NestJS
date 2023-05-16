import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ResetPasswordTokenGuard extends AuthGuard('jwt-reset-password') {}
