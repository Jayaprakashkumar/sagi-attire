import emailjs from "@emailjs/browser";
import { useCartStore } from "../../store/useCartStore";
import { v4 as uuidv4 } from "uuid";
import { getAmountWithCurrency } from "../common/util";

export const SendOrderConfirmation = ({
  customerInfo,
}: {
  customerInfo: any;
}) => {
  const products = useCartStore((state) => state.items);
  console.log(customerInfo);

  const total = getAmountWithCurrency(
    products.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const productHTML = products
    .map(
      (product, index) => `
      <tr>
       <td>${index}</td>
        <td><img src="${product.image}" width="100"/></td>
        <td>${product.size} / ${product.quantity}</td>
        <td>${getAmountWithCurrency(product.price)}</td>
      </tr>
       <tr>
       <td></td>
        <td></td>
        <td>Total</td>
        <td>${total}</td>
      </tr>
    `
    )
    .join("");

  const templateParams = {
    email: customerInfo.email,
    to_name: customerInfo.name,
    address: customerInfo.address,
    phone: customerInfo.phone,
    order_id: uuidv4(),
    message: productHTML,
  };

  emailjs
    .send(
      "service_5wbm9s3",
      "template_xja3isp",
      templateParams,
      "lmGzuf9WF6JA7JOvF"
    )
    .then((response) => {
      console.log("Email sent successfully!", response);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};
