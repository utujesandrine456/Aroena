import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/create-login-user.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('login-or-signup')
    loginOrSignup(@Body() data: LoginUserDto){
        return this.usersService.loginOrSignup(data);
    }

    @Get()
    findAll(){
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string){
        return this.usersService.findOne(Number(id));
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() data: UpdateUserDto){
        return this.usersService.update(Number(id), data);
    }

    @Delete(':id')
    delete(@Param('id') id:string){
        return this.usersService.delete(Number(id));
    }
}
