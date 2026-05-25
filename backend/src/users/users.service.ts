import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user_role } from '../../generated/prisma'; // Import the enum
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllAdmins() {
    return this.prisma.users.findMany({
      where: {
        role: 'admin', // Filter by the 'admin' role using the enum
      },
      select: {
        // Only select the fields needed for the dropdown
        id: true,
        full_name: true,
        email: true, // Keep email if helpful for identification
        role: true,
      },
      orderBy: {
        full_name: 'asc', // Order alphabetically
      },
    });
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      orderBy: { created_at: 'desc' },
    });
    // Map over users to exclude password_hash from the response
    return users.map(({ password_hash, ...user }) => user);
  }

  // --- NEW HELPER METHOD ---
  /**
   * Finds a single user by ID or throws an error.
   */
  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // --- NEW METHOD ---
  /**
   * Updates a user's details by their ID.
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    // 1. Ensure user exists
    await this.findOne(id);

    const { password, email, ...dataToUpdate } = updateUserDto;
    
    // Create an object for the data that will be updated
    const updateData: any = { ...dataToUpdate };

    // 2. If email is being changed, check if it's already in use
    if (email) {
      const existingUser = await this.prisma.users.findUnique({
        where: { email },
      });
      // Throw an error if the email exists AND belongs to a *different* user
      if (existingUser && Number(existingUser.id) !== id) {
        throw new ConflictException('Email address is already in use.');
      }
      updateData.email = email;
    }

    // 3. If a new password is provided, hash it and add to update data
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    // 4. Perform the update
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: updateData,
    });

    // 5. Return the updated user, stripping the password hash
    const { password_hash, ...result } = updatedUser;
    return result;
  }

}