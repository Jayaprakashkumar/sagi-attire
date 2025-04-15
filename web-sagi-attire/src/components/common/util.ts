/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartItem, ISizes, Product } from "../../types/Product";
import { IProductAttribute } from "../pages/ProductPage";
import { v4 as uuidv4 } from "uuid";

export const getAmountWithCurrency = (amount: number) => `Rs. ${amount}`;

export const getOfferPrice = (
  offerPercent: number,
  actualPrice: number
): number =>
  offerPercent
    ? Math.round(actualPrice - (actualPrice * offerPercent) / 100)
    : actualPrice;

export const mapCartItems = (
  product: Product,
  actionAttribute: IProductAttribute | null,
  quantity: number
): CartItem => {
  return {
    id: product.id,
    name: product.name,
    price: getOfferPrice(product.offer, product.price),
    description: product.description,
    color: actionAttribute?.color || "",
    size: actionAttribute?.size || "",
    image: product.images[0],
    quantity: quantity,
    __id: uuidv4(),
  };
};

export const getCategoryLink = (category: string) => {
  const link = category?.toLowerCase().split(" ").join("-");
  return `/category/${link}`;
};

export const mapProduct = (item: any) => {
  return {
    id: item.sys.id as string,
    productId: item.fields.id,
    name: item.fields.name,
    description: item.fields.description,
    price: item.fields.price,
    offer: item.fields.offerInPercentage,
    cateogry: item.fields.cateogry,
    images:
      item.fields.images?.map(
        (img: { fields: { file: { url: string } } }) => img.fields.file.url
      ) || [],
    sizes: item.fields.sizes?.map(
      (size: { fields: { id: string; quantity: number; name: string } }) => {
        return {
          id: size.fields.id,
          quantity: size.fields.quantity,
          name: size.fields.name,
        } as ISizes;
      }
    ),
  } as unknown as Product;
};
