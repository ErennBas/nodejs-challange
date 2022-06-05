/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository  } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUser, User } from './entities/user.model';
import { AuthService } from 'src/auth/service/auth.service';
import { HttpException } from '@nestjs/common';
import { randomUUID, createHash } from 'crypto';

@Injectable()
export class UsersService {
  
  constructor(@InjectRepository(UserEntity) private readonly userRepos: MongoRepository <UserEntity>, private authService: AuthService) { }

  private async checkMailIsExist(email: string): Promise<boolean>{
    console.log("before process");
    const user = await this.userRepos.findOne({ where: {email} });
    console.log(email);
    if (user) {
      return true;
    }
    return false;
  }



  async create(user: User): Promise<User> {
    try {
      const isExist: boolean = await this.checkMailIsExist(user.email);
      if (!isExist) {
        user.id = randomUUID();
        user.password = this.md5(user.password);
        const newUser = await this.userRepos.save(this.userRepos.create(user));
        return newUser;
      }
      else{
        throw new HttpException("Email is already in use", 409);
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
  
  async login (user: LoginUser): Promise<string> {
    try {
      const getUser: User = await this.userRepos.findOne({ where: {email: user.email} });
      if (getUser) {
        if (this.md5(user.password) == getUser.password) {
          return this.authService.generateToken(getUser);
        }
        else{
          throw new HttpException("No user detected 1", 401);
        }
      }
      else{
        throw new HttpException("No user detected 1", 401);
      }
    } catch (error) {
      throw new HttpException("No user detected 2", 401);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepos.find({});
  }

  public async findOne(id: any): Promise<User> {
    return await this.userRepos.findOne({ where: { id }});
  }

  private md5(data): string{
    return createHash('md5').update(data).digest("hex");
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
