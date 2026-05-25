import {
  Controller,
  Get,
  UseGuards,
  Put, // <-- Import Put
  Param, // <-- Import Param
  ParseIntPipe, // <-- Import ParseIntPipe
  Body, // <-- Import Body
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto'; // <-- Import the new DTO

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect the entire controller
@Roles('admin') // All routes in this controller are for admins only
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admins') // GET /users/admins
  findAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  // --- NEW ROUTE ---
  @Get() // GET /users
  findAll() {
    return this.usersService.findAll();
  }

  // --- NEW ROUTE ---
  @Put(':id') // PUT /users/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}