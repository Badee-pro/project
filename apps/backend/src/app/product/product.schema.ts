import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


// Define products schema
@Schema()
export class Product {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
