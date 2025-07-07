import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class LoginService implements OnModuleInit {
  constructor(
    @InjectRepository(Login)
    private readonly userRepository: Repository<Login>,
  ) {}

async register(createLoginDto: CreateLoginDto): Promise<{ success: boolean; message: string }> {
  const existingUser = await this.userRepository.findOneBy({ username: createLoginDto.username });

  if (existingUser) {
    return {
      success: false,
      message: 'Bu username bilan foydalanuvchi allaqachon mavjud',
    };
  }

  const hashedPassword = await bcrypt.hash(createLoginDto.password, 10);

  const newUser = this.userRepository.create({
    username: createLoginDto.username,
    password: hashedPassword,
  });

  await this.userRepository.save(newUser);

  return {
    success: true,
    message: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
  };
}

  async onModuleInit() {
    const existing = await this.userRepository.findOneBy({ username: '1' });

    if (!existing) {
      const hashedPassword = await bcrypt.hash('1', 10); // 10 - salt rounds
      const user = this.userRepository.create({
        username: '1',
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      console.log('✅ Default user created: username=1, password=1 (hashed)');
    } else {
      console.log('ℹ️ Default user already exists');
    }
  }

  async login(loginDto: CreateLoginDto): Promise<{ success: boolean; message: string; data?: any }> {
    const user = await this.userRepository.findOneBy({ username: loginDto.username });

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    console.log('➡️ loginDto:', loginDto);
    console.log('➡️ user:', user);
    console.log('➡️ user.password:', user?.password);
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Parol noto‘g‘ri');
    }

    return {
      success: true,
      message: 'Login muvaffaqiyatli',
      data: { id: user.id, username: user.username },
    };
  }
}
