import { useState, useEffect, useRef, useCallback } from "react";
import client from "../../contentful/contentfulClient";
import Grid from "@mui/material/Grid2";
import ProductCard from "../product/ProductCard";
import { ISizes, Product } from "../../types/Product";
import { Skeleton, Box, Typography, CircularProgress, Breadcrumbs, Link, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { StyledButton } from "../ui/Button";
import { useParams, Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FilterSidebar, { FilterOptions } from "../filter/FilterSidebar";

const ProductSkeleton = () => {
  const skeleton = new Array(8).fill(true);

  return skeleton.map((_, index) => (
    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={`skeleton-${index}`}>
      <Skeleton
        sx={{ height: 200 }}
        animation="wave"
        variant="rectangular"
        style={{ marginBottom: 6 }}
      />
      <Skeleton
        animation="wave"
        height={10}
        width="80%"
        style={{ marginBottom: 6 }}
      />
      <Skeleton
        animation="wave"
        height={10}
        width="50%"
        style={{ marginBottom: 6 }}
      />
    </Grid>
  ));
};

const CategoryPage = () => {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortOption, setSortOption] = useState<string>("");
  const limit = 8;
  const firstRender = useRef(true);
  const categoryIdRef = useRef<string>("");

  // Fetch category information
  const fetchCategoryInfo = useCallback(async () => {
    try {
      const categoryRes = await client.getEntries({
        content_type: "category",
        "fields.id": params.id,
      });

      if (categoryRes.items.length > 0) {
        categoryIdRef.current = categoryRes.items[0].sys.id;
        setCategoryName(categoryRes.items[0].fields.id as string);
        return true;
      } else {
        setError("Category not found");
        return false;
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Failed to fetch category information");
      return false;
    }
  }, [params.id]);

  // Fetch products from Contentful
  const fetchProducts = useCallback(async (currentPage: number) => {
    if (!categoryIdRef.current) {
      const categoryFound = await fetchCategoryInfo();
      if (!categoryFound) return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await client.getEntries({
        content_type: "product",
        "fields.category.sys.id": categoryIdRef.current,
        limit: limit,
        skip: (currentPage - 1) * limit,
      });

      const total = response.total;
      setTotalItems(total);

      const newProducts = response.items.map(
        (item) =>
          ({
            id: item.sys.id as string,
            productId: item.fields.id,
            name: item.fields.name,
            description: item.fields.description,
            price: item.fields.price,
            offer: item.fields.offerInPercentage,
            cateogry: categoryName,
            images:
              (item.fields.images as [])?.map(
                (img: { fields: { file: { url: string } } }) =>
                  img.fields.file.url
              ) || [],
            sizes: (item.fields.sizes as [])?.map(
              (size: {
                fields: { id: string; quantity: number; name: string };
              }) => {
                return {
                  id: size.fields.id,
                  quantity: size.fields.quantity,
                  name: size.fields.name,
                } as ISizes;
              }
            ),
          } as unknown as Product)
      );

      setProducts((prevProducts: Product[]) => {
        // If it's the first page, reset the products
        if (currentPage === 1) {
          return newProducts;
        }
        // Otherwise, append new products
        return [...prevProducts, ...newProducts];
      });

      // Check if we've loaded all products
      setHasMore(newProducts.length === limit && (currentPage * limit) < total);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [categoryName, fetchCategoryInfo]);

  // Reset state when category changes
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Reset state when category changes
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError("");
    categoryIdRef.current = "";
    
    // Fetch new category data
    fetchCategoryInfo();
    
    // Scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [params.id, fetchCategoryInfo]);

  // Fetch products when page changes
  useEffect(() => {
    if (categoryIdRef.current || params.id) {
      fetchProducts(page);
    }
  }, [page, fetchProducts, params.id]);

  // Sort products based on selected option
  const sortProducts = useCallback((productsToSort: Product[], option: string) => {
    if (!option) return productsToSort;
    
    const sortedProducts = [...productsToSort];
    
    switch (option) {
      case "price-low-high":
        return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high-low":
        return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "date-old-new":
        return sortedProducts.sort((a, b) => (a.id > b.id ? 1 : -1));
      case "date-new-old":
        return sortedProducts.sort((a, b) => (a.id < b.id ? 1 : -1));
      case "name-a-z":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedProducts;
    }
  }, []);

  // Handle sort option change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value);
  };

  // Apply sorting when products or sort option changes
  useEffect(() => {
    if (products.length > 0) {
      setProducts(sortProducts(products, sortOption));
    }
  }, [sortOption, sortProducts]);

  // Apply filters to products
  const applyFilters = useCallback((productsToFilter: Product[], filters: FilterOptions) => {
    return productsToFilter.filter(product => {
      // Filter by availability
      const hasInStock = product.sizes?.some(size => size.quantity > 0) || false;
      const hasOutOfStock = product.sizes?.every(size => size.quantity === 0) || false;
      
      if (filters.availability.inStock && !filters.availability.outOfStock && !hasInStock) {
        return false;
      }
      
      if (!filters.availability.inStock && filters.availability.outOfStock && !hasOutOfStock) {
        return false;
      }
      
      if (!filters.availability.inStock && !filters.availability.outOfStock) {
        return false;
      }
      
      // Filter by price range
      const price = product.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
      
      // Filter by size
      if (filters.sizes.length > 0) {
        const hasSelectedSize = product.sizes?.some(size => 
          filters.sizes.includes(size.name) && size.quantity > 0
        ) || false;
        
        if (!hasSelectedSize) {
          return false;
        }
      }
      
      return true;
    });
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    setFilteredProducts(applyFilters(products, filters));
  }, [products, applyFilters]);

  // Update filtered products when products or sort option changes
  useEffect(() => {
    if (products.length > 0) {
      const sortedProducts = sortProducts(products, sortOption);
      setFilteredProducts(sortedProducts);
    }
  }, [products, sortOption, sortProducts]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Grid display={"flex"} justifyContent={"center"} flexDirection={"column"}>
      {categoryName && (
        <>
          <Box sx={{ px: 2, py: 3, maxWidth: 'lg', width: '100%', mx: 'auto' }}>
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ mb: 2 }}
            >
              <Link 
                component={RouterLink} 
                to="/products" 
                color="inherit" 
                underline="hover"
              >
                Products
              </Link>
              <Typography color="text.primary" sx={{ textTransform: 'capitalize' }}>
                {categoryName.replace(/-/g, ' ')}
              </Typography>
            </Breadcrumbs>
          </Box>
        </>
      )}

      <Box sx={{ px: 2, maxWidth: 'lg', width: '100%', mx: 'auto', mb: 3, mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <FilterSidebar 
            products={products} 
            onFilterChange={handleFilterChange} 
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          justifyContent: 'flex-end',
          width: { xs: 'auto', md: 'auto' },
          ml: 'auto'
        }}>
          <FormControl 
            sx={{ 
              minWidth: { xs: 180, sm: 220 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'background.paper',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'secondary.main',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px',
                    borderColor: 'secondary.main',
                  },
                },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
                '&.Mui-focused': {
                  color: 'secondary.main',
                },
              },
            }}
          >
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortOption}
              label="Sort By"
              onChange={handleSortChange}
              size="small"
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'secondary.light',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'secondary.light',
                        color: 'secondary.main',
                        '&:hover': {
                          backgroundColor: 'secondary.light',
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="price-low-high">Price, low to high</MenuItem>
              <MenuItem value="price-high-low">Price, high to low</MenuItem>
              <MenuItem value="date-old-new">Date, old to new</MenuItem>
              <MenuItem value="date-new-old">Date, new to old</MenuItem>
              <MenuItem value="name-a-z">Product name A → Z</MenuItem>
              <MenuItem value="name-z-a">Product name Z → A</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', maxWidth: 'lg', width: '100%', mx: 'auto', px: 2 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterSidebar 
            products={products} 
            onFilterChange={handleFilterChange} 
          />
        </Box>
        
        <Box sx={{ flexGrow: 1, pl: { md: 2 } }}>
          <Grid container rowGap={5} spacing={3}>
            {filteredProducts.map((product, index) => (
              <Grid
                size={{ xs: 6, sm: 4, md: 3 }}
                key={`${product.id}-${index}`}
              >
                <ProductCard product={product} />
              </Grid>
            ))}

            {loading && <ProductSkeleton />}
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              my: 4,
              gap: 2
            }}
          >
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} />
                <Typography>Loading more products...</Typography>
              </Box>
            )}

            {!loading && hasMore && (
              <StyledButton
                onClick={handleLoadMore}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Load More
              </StyledButton>
            )}

            {!loading && !hasMore && filteredProducts.length > 0 && (
              <Typography color="text.secondary">
                No more products available.
              </Typography>
            )}

            {!loading && filteredProducts.length === 0 && !error && (
              <Typography color="text.secondary">
                No products available.
              </Typography>
            )}

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {filteredProducts.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Showing {filteredProducts.length} of {totalItems} products
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default CategoryPage;
