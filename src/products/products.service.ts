// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CreateProductDto } from './dto/create-product.dto';
// import { Product, ProductDocument } from './schemas/product.schema';

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectModel(Product.name) private productModel: Model<ProductDocument>,
//   ) {}

//   private products = [];

//   getAll(): Promise<Array<Product>> {
//     return this.productModel.find().exec();
//   }

//   getById(id: string): Promise<Product> {
//     return this.productModel.findById(id).exec();
//   }

//   create(productDto: CreateProductDto) {
//     this.products.push({
//       ...productDto,
//       id: Date.now().toString(),
//     });
//     return this.products;
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  getAll(): Promise<Array<Product>> {
    return this.productModel.find().exec();
  }

  getById(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  create(productDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel({
      ...productDto,
    });
    return newProduct.save();
  }

  remove(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  update(id: string, productDto: UpdateProductDto): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(id, productDto, { new: true })
      .exec();
  }
}
