import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "./theme/theme";
import { CssBaseline, Stack } from "@mui/material";
import Header from "./components/header/Header";
import { Home } from "./components/home/Home";
import CategoryPage from "./components/pages/CategoryPage";
import ProductPage from "./components/pages/ProductPage";
import { CartPage } from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import Footer from "./components/footer/Footer";
import PrivayPolicy from "./components/pages/PrivayPolicy";
import AllProductsPage from "./components/pages/AllProductsPage";


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack minHeight="100vh" justifyContent={"space-between"}>
       
          <Header />
       
          <main style={{ flexGrow: 1, minHeight: "300px"}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/privacy-policy" element={<PrivayPolicy />} />
              <Route path="/search" element={<AllProductsPage />} />
              <Route path="/products" element={<AllProductsPage />} />

              {/* <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-success"
                element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                }
              /> */}
              {/* <Route path="/auth" element={<AuthForm />} /> */}
            </Routes>
          </main>
          <Footer />
        </Stack>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
