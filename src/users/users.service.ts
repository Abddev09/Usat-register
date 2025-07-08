import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Operator } from 'src/operators/entities/operator.entity';
import { GoogleService } from 'src/google/google.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,

    private readonly googleService: GoogleService,

  ) {}

  async create(userDto: CreateUserDto): Promise<{ success: boolean; message: string; data?: User }> {
  const user = this.userRepository.create(userDto);

  let operator: Operator | null = null;

  if (userDto.utmTag) {
    operator = await this.operatorRepository.findOne({
      where: { link: userDto.utmTag },
    });

    if (operator) {
      user.referrerOperator = operator;
      user.utmTag = operator.link;
      operator.referalCount++;
      await this.operatorRepository.save(operator);
    } else {
      return {
        success: false,
        message: 'Ushbu havola (utmTag) orqali operator topilmadi',
      };
    }
  }

  const savedUser = await this.userRepository.save(user);

  // 🔄 Google Sheets export
  const allUsers = await this.userRepository.find({
    take:1000,
    relations: ['referrerOperator'],
  });

  await this.googleService.writeUsersToSheet('All_Users', allUsers, true);

  if (operator) {
    const operatorUsers = await this.userRepository.find({
      where: { utmTag: operator.link },
      relations: ['referrerOperator'],
    });

    const sheetName = operator.name.replace(/\s+/g, '_');

    await this.googleService.writeUsersToSheet(sheetName, operatorUsers);
  }

  return {
    success: true,
    message: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
    data: savedUser,
  };
}

  async findAll(): Promise<{ success: boolean; message: string; data: User[] }> {
    const users = await this.userRepository.find({
      take:1000,
      relations: ['referrerOperator'], 
  });
    return {
      success: true,
      message: 'Foydalanuvchilar ro‘yxati olindi',
      data: users,
    };
  }

  async findOne(id: number): Promise<{ success: boolean; message: string; data: User }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`ID: ${id} bo‘lgan foydalanuvchi topilmadi`);
    }
    return {
      success: true,
      message: `ID: ${id} bo‘lgan foydalanuvchi topildi`,
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<{ success: boolean; message: string; data: User }> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`ID: ${id} bo‘lgan foydalanuvchi topilmadi`);
    }
    const updatedUser = await this.userRepository.save(user);
    return {
      success: true,
      message: `ID: ${id} bo‘lgan foydalanuvchi yangilandi`,
      data: updatedUser,
    };
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user.data);
    return {
      success: true,
      message: `ID: ${id} bo‘lgan foydalanuvchi o‘chirildi`,
    };
  }
}
