import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from './entities/operator.entity';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operator)
    private operatorsRepository: Repository<Operator>,
  ) {}
 private generateSlug(name: string): string {
    return name
      .toLowerCase() // kichik harfga o'tkazish
      .replace(/[^a-z0-9\s]/g, '') // harf, raqam va probel qoldirib, qolgan belgilarni olib tashlash
      .trim() // boshlanish va tugashidagi probellarni olib tashlash
      .replace(/\s+/g, '_'); // probellarni `-` bilan almashtirish
  }
  generateLink(utmTag: string): string {
    return `https://t.me/usat_ariza_bot?start=${utmTag}`;
  }
  async create(createOperatorDto: CreateOperatorDto): Promise<{ success: boolean; message: string; data: Operator }> {
    const { name } = createOperatorDto;

    // name dan slug yasash
    const slug = this.generateSlug(name);

    const operator = this.operatorsRepository.create({
      name,
      slug,
      link:this.generateLink(slug)
    });

    const savedOperator = await this.operatorsRepository.save(operator);

    return {
      success: true,
      message: 'Operator successfully created',
      data: savedOperator,
    };
  }

  async findAll(): Promise<{ success: boolean; message: string; data: Operator[] }> {
    const operators = await this.operatorsRepository.find();
    return {
      success: true,
      message: `Found ${operators.length} operator(s)`,
      data: operators,
    };
  }

  async findOne(id: number): Promise<{ success: boolean; message: string; data?: Operator }> {
    const operator = await this.operatorsRepository.findOneBy({ id });
    if (!operator) {
      throw new NotFoundException(`Operator with id ${id} not found`);
    }
    return {
      success: true,
      message: `Operator with id ${id} found`,
      data: operator,
    };
  }

  async update(id: number, updateOperatorDto: UpdateOperatorDto): Promise<{ success: boolean; message: string; data: Operator }> {
  const operator = await this.operatorsRepository.findOneBy({ id });
  if (!operator) {
    throw new NotFoundException(`Operator with id ${id} not found`);
  }

  // agar name o'zgarsa => slug va link ham yangilansin
  if (updateOperatorDto.name) {
    const newSlug = this.generateSlug(updateOperatorDto.name);
    operator.slug = newSlug;
    operator.link = this.generateLink(newSlug);
  }

  // qolganlarini qo‘shamiz
  Object.assign(operator, updateOperatorDto);

  const updatedOperator = await this.operatorsRepository.save(operator);
  return {
    success: true,
    message: `Operator with id ${id} successfully updated`,
    data: updatedOperator,
  };
}

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const result = await this.operatorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Operator with id ${id} not found`);
    }
    return {
      success: true,
      message: `Operator with id ${id} successfully deleted`,
    };
  }
}
