import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = await this.categoryModel.create(createCategoryDto);
    return createdCategory;
  }

  async findAll() {
    const findedCategories = await this.categoryModel
      .find()
      .populate('products', '_id name');
    return findedCategories;
  }

  async findOne(id: string) {
    const findedCategory = await this.categoryModel
      .findById(id)
      .populate('products', '_id name');

    if (!findedCategory) throw new NotFoundException();

    return findedCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );

    return updatedCategory;
  }

  async remove(id: string) {
    await this.findOne(id);
    const removedCategory = await this.categoryModel.findByIdAndDelete(id);
    return removedCategory;
  }
}
