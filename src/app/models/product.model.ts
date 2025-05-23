export class Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl?: string;
  category?: string;

  constructor(
    name: string = '',
    price: number = 0,
    quantity: number = 0,
    description: string = '',
    imageUrl: string = '',
    category: string = '',
    id?: number
  ) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.description = description;
    this.imageUrl = imageUrl;
    this.category = category;
    this.id = id;
  }
}
