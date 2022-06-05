/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { User } from 'src/users/entities/user.model';
import { UsersService } from 'src/users/users.service';

export interface RequestModel extends Request {
    user: User
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService, private userService: UsersService) { }

    async use(req: RequestModel, res: Response, next: NextFunction) {
        try {
            const token = await this.authService.verifytoken(req.headers['authorization'].split(' ')[1]);
            console.log(token);

            const user: User = await this.userService.findOne(token.data.id);
            console.log(user);
            if (user) {
                req.user = user;
                next();
            }
            else{
                throw new HttpException("Unauthorized", 401);
            }
        } catch (error) {
            throw new HttpException("Unauthorized", 401);
        }
    }
}
