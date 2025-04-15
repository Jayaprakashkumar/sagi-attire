// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Slider,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   Button,
// } from "@mui/material";

// const ProductFilter = ({
//   onFilterChange,
// }: {
//   onFilterChange: (filter: any) => void;
// }) => {
//   // State for filters
//   const [priceRange, setPriceRange] = useState([100, 1000]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [inStock, setInStock] = useState(false);

//   const sizes = ["S", "M", "L", "XL"];

//   // Handle price range change
//   const handlePriceChange = (event, newValue) => {
//     setPriceRange(newValue);
//   };

//   // Handle size selection
//   const handleSizeChange = (event: any) => {
//     const value = event.target.name;
//     setSelectedSizes((prev) =>
//       prev.includes(value)
//         ? prev.filter((size) => size !== value)
//         : [...prev, value]
//     );
//   };

//   // Handle stock availability
//   const handleStockChange = (event) => {
//     setInStock(event.target.checked);
//   };

//   // Apply Filters
//   const applyFilters = () => {
//     onFilterChange({
//       priceRange,
//       selectedSizes,
//       inStock,
//     });
//   };

//   return (
//     <Box sx={{ width: 250, padding: 2, borderRight: "1px solid #ddd" }}>
//       <Typography variant="h6" gutterBottom>
//         Filters
//       </Typography>

//       {/* Price Range Slider */}
//       <Typography>
//         Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
//       </Typography>
//       <Slider
//         value={priceRange}
//         onChange={handlePriceChange}
//         valueLabelDisplay="auto"
//         min={100}
//         max={5000}
//         sx={{ marginBottom: 2 }}
//       />

//       {/* Size Selection */}
//       <Typography variant="subtitle1">Size</Typography>
//       <FormGroup>
//         {sizes.map((size) => (
//           <FormControlLabel
//             key={size}
//             control={
//               <Checkbox
//                 name={size}
//                 onChange={handleSizeChange}
//                 checked={selectedSizes.includes(size)}
//               />
//             }
//             label={size}
//           />
//         ))}
//       </FormGroup>

//       {/* Availability Checkbox */}
//       <Typography variant="subtitle1">Availability</Typography>
//       <FormControlLabel
//         control={<Checkbox checked={inStock} onChange={handleStockChange} />}
//         label="In Stock Only"
//       />

//       {/* Apply Filter Button */}
//       <Button
//         variant="contained"
//         color="primary"
//         fullWidth
//         sx={{ marginTop: 2 }}
//         onClick={applyFilters}
//       >
//         Apply Filters
//       </Button>
//     </Box>
//   );
// };

// export default ProductFilter;
