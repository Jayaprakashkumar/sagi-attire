import { Document } from "@contentful/rich-text-types";

type IsizeEnum = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "4XL" | "5XL";

export type ISizes = {
  id: string;
  quantity: number;
  name: IsizeEnum;
};

export type Product = {
  id: string;
  productId: string;
  name: string;
  price: number;
  offer: number;
  description: Document;
  images: string[];
  category: string;
  colors?: string[];
  sizes?: ISizes[];
};

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: Document;
  color: string;
  size: string;
  image: string;
  quantity: number;
  __id: string;
}
