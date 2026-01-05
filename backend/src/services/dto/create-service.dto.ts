export class CreateServiceDto {
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  available?: boolean;
  features: string[];
}
