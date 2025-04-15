import {
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Checkbox,
  Divider,
  Card,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useForm } from "react-hook-form";
import { useCartStore } from "../../store/useCartStore";
import { getAmountWithCurrency } from "../common/util";
import { Link } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useState } from "react";

interface AddressForm {
  name: string;
  email: string;
  title: string;
  address: string;
  phone: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  isAddressSaved: boolean;
}
const CheckoutPage = () => {
  const { Razorpay } = useRazorpay();
  const [formData, setFormData] = useState<AddressForm>({} as AddressForm);

  const products = useCartStore((state) => state.items);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>();
  console.log(products);
  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
  const total = getAmountWithCurrency(
    products.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    console.log(data);
    setFormData(data);

    // const customerInfo = data;

    // const productHTML = products
    //   .map(
    //     (product, index) => `
    //     <tr>
    //      <td>${index}</td>
    //       <td><img src="${product.image}" width="100"/></td>
    //       <td>${product.size} / ${product.quantity}</td>
    //       <td>${getAmountWithCurrency(product.price)}</td>
    //     </tr>
    //      <tr>
    //      <td></td>
    //       <td></td>
    //       <td>Total</td>
    //       <td>${total}</td>
    //     </tr>
    //   `
    //   )
    //   .join("");

    // const templateParams = {
    //   email: customerInfo.email,
    //   to_name: customerInfo.name,
    //   address: customerInfo.address,
    //   phone: customerInfo.phone,
    //   order_id: uuidv4(),
    //   message: productHTML,
    // };

    // emailjs
    //   .send(
    //     "service_5wbm9s3",
    //     "template_xja3isp",
    //     templateParams,
    //     "lmGzuf9WF6JA7JOvF"
    //   )
    //   .then((response) => {
    //     console.log("Email sent successfully!", response);
    //   })
    //   .catch((error) => {
    //     console.error("Error sending email:", error);
    //   });
  };
  function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handlePayment = async () => {
    const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      console.log("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options: RazorpayOrderOptions = {
      key: razorpay_key,
      amount: +total,
      currency: "INR",
      name: "Sagi Atrire",
      image: "../../images/logo.png",
      description: "Payment",
      order_id: "receipt_" + Math.random().toString(36).substring(7),
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
        alert("Payment Successful!");
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.on("payment.failed", function (response) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
    });
    razorpayInstance.open();
  };

  return (
    <Grid container rowGap={5} spacing={3} marginTop={3} px={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Billing Address
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography sx={{ fontSize: 14, mb: 1 }}>
            * These fields are required.
          </Typography>
          <RadioGroup row>
            <FormControlLabel
              value="Mr"
              control={
                <Radio
                  {...register("title", { required: "Title is required" })}
                />
              }
              label="Mr"
            />
            <FormControlLabel
              value="Ms"
              control={
                <Radio
                  {...register("title", { required: "Title is required" })}
                />
              }
              label="Ms"
            />
          </RadioGroup>
          {errors.title && (
            <Typography color="error">
              {errors.title.message as string}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Enter Full Name *"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message as string}
            sx={{ my: 1 }}
          />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Contact Information
          </Typography>
          <TextField
            fullWidth
            label="Enter Email Address *"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message as string}
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth
            label="Address (House No., Building, Street, Area) *"
            {...register("address", { required: "Address is required" })}
            error={!!errors.address}
            helperText={errors.address?.message as string}
            sx={{ my: 1 }}
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Pincode *"
                {...register("pincode", { required: "Pincode is required" })}
                error={!!errors.pincode}
                helperText={errors.pincode?.message as string}
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="City *"
                {...register("city", { required: "City is required" })}
                error={!!errors.city}
                helperText={errors.city?.message as string}
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="State *"
                {...register("state", { required: "State is required" })}
                error={!!errors.state}
                helperText={errors.state?.message as string}
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Country *"
                defaultValue="IN"
                InputProps={{ readOnly: true }}
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Phone Number *"
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^\d{10}$/, message: "Invalid phone number" },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message as string}
            sx={{ my: 1 }}
          />
          {/* {errors.apiError && (
            <Typography color="error">
              {errors.apiError.message as string}
            </Typography>
          )} */}
          <FormControlLabel
            control={<Checkbox {...register("isAddressSaved")} />}
            label="Would you like to save the address for future use."
          />

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                color: "white",
                width: "100%",
                py: 1.5,
              }}
              type="submit"
            >
              Check Address
            </Button>
          </Box>
        </form>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 3,
            padding: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Order Summary
            </Typography>
            <Link to={"/cart"}>Edit your order here</Link>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h6" sx={{ fontWeight: "400" }}>
              {`Order Total (${totalQuantity} Items)`}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "400" }}>
              {total}
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h6" sx={{ fontWeight: "400" }}>
              Delivery Charge
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "400" }}>
              FREE
            </Typography>
          </Box>
          <Divider />
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h6" sx={{ fontWeight: "400" }}>
              Total
              <Typography variant="body2" fontSize={"12px"}>
                Inclusive of all taxes
              </Typography>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {total}
            </Typography>
          </Box>
        </Card>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6D1B31",
              color: "white",
              width: "100%",
              py: 1.5,
            }}
            onClick={handlePayment}
          >
            Proceed Payment
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CheckoutPage;
