/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {}

    async generateToken(data: any): Promise<string> {
        return this.jwtService.signAsync({data});
    }

    verifytoken(token: string): Promise<any>{
        return this.jwtService.verifyAsync(token);
    }
    
}
