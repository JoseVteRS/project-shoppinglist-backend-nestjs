import { ProductDocument } from './schemas/product.schema';
import { Product } from './entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';
import { CategoryDocument } from 'src/categories/schemas/category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const createdProduct = await this.productModel.create(createProductDto);
    const productsForCategories = [];

    for (const category of createdProduct.categories) {
      const categoryFinded = await this.categoryModel.findById(category);

      productsForCategories.push(
        this.categoryModel.findByIdAndUpdate(category, {
          products: [...categoryFinded.products, createdProduct._id],
        }),
      );
    }
    await Promise.all(productsForCategories);

    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const findedProducts = await this.productModel
      .find()
      .populate('categories', '_id name');

    // if (!findedProducts) throw new NotFoundException();

    return findedProducts;
  }

  async findOne(id: string) {
    const findedProduct = await this.productModel.findById(id);
    if (!findedProduct) throw new NotFoundException();

    return findedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const findedProduct = await this.findOne(id);

    const productsForCategories = [];

    for (const category of findedProduct.categories) {
      const categoryFinded = await this.categoryModel.findById(category);

      productsForCategories.push(
        this.categoryModel.findByIdAndUpdate(category, {
          products: [...categoryFinded.products, findedProduct._id],
        }),
      );
    }
    await Promise.all(productsForCategories);

    return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const removedProduct = await this.productModel.findByIdAndDelete(id);
    return removedProduct;
  }
}
