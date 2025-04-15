import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Checkbox, 
  FormGroup, 
  FormControlLabel, 
  Slider, 
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  Button
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { Product } from '../../types/Product';

interface FilterSidebarProps {
  products: Product[];
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  availability: {
    inStock: boolean;
    outOfStock: boolean;
  };
  priceRange: [number, number];
  sizes: string[];
}

const FilterSidebar = ({ products, onFilterChange }: FilterSidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    availability: {
      inStock: true,
      outOfStock: false,
    },
    priceRange: [0, 10000],
    sizes: [],
  });

  // Calculate counts for availability and sizes
  const inStockCount = products.filter(product => 
    product.sizes?.some(size => size.quantity > 0)
  ).length;
  
  const outOfStockCount = products.filter(product => 
    product.sizes?.every(size => size.quantity === 0)
  ).length;

  // Calculate size counts
  const sizeCounts: Record<string, number> = {};
  products.forEach(product => {
    product.sizes?.forEach(size => {
      if (size.quantity > 0) {
        sizeCounts[size.name] = (sizeCounts[size.name] || 0) + 1;
      }
    });
  });

  // Get min and max prices
  const prices = products.map(product => product.price || 0).filter(price => price > 0);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 10000);

  // Update price range when products change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [minPrice, maxPrice] as [number, number],
    }));
  }, [minPrice, maxPrice]);

  // Handle filter changes
  const handleAvailabilityChange = (type: 'inStock' | 'outOfStock') => {
    const newFilters = {
      ...filters,
      availability: {
        ...filters.availability,
        [type]: !filters.availability[type],
      },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (_event: Event, newValue: number | number[]) => {
    const newFilters = {
      ...filters,
      priceRange: newValue as [number, number],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    
    const newFilters = {
      ...filters,
      sizes: newSizes,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      availability: {
        inStock: true,
        outOfStock: false,
      },
      priceRange: [minPrice, maxPrice] as [number, number],
      sizes: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const filterContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="secondary">Filters</Typography>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} color="secondary">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mb: 2, borderColor: 'secondary.light' }} />
      
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }} color="secondary">Availability</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox 
              checked={filters.availability.inStock}
              onChange={() => handleAvailabilityChange('inStock')}
              sx={{
                color: 'secondary.main',
                '&.Mui-checked': {
                  color: 'secondary.main',
                },
              }}
            />
          }
          label={`In Stock (${inStockCount})`}
        />
        <FormControlLabel
          control={
            <Checkbox 
              checked={filters.availability.outOfStock}
              onChange={() => handleAvailabilityChange('outOfStock')}
              sx={{
                color: 'secondary.main',
                '&.Mui-checked': {
                  color: 'secondary.main',
                },
              }}
            />
          }
          label={`Out of Stock (${outOfStockCount})`}
        />
      </FormGroup>
      
      <Divider sx={{ my: 2, borderColor: 'secondary.light' }} />
      
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }} color="secondary">Price Range</Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={minPrice}
          max={maxPrice}
          step={100}
          sx={{ 
            mt: 2,
            color: 'secondary.main',
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0px 0px 0px 8px rgba(var(--secondary-rgb), 0.16)',
              },
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'secondary.main',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="secondary">₹{filters.priceRange[0]}</Typography>
          <Typography variant="body2" color="secondary">₹{filters.priceRange[1]}</Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2, borderColor: 'secondary.light' }} />
      
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }} color="secondary">Product Size</Typography>
      <FormGroup>
        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL'].map((size) => (
          <FormControlLabel
            key={size}
            control={
              <Checkbox 
                checked={filters.sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
                sx={{
                  color: 'secondary.main',
                  '&.Mui-checked': {
                    color: 'secondary.main',
                  },
                }}
              />
            }
            label={`${size} (${sizeCounts[size] || 0})`}
          />
        ))}
      </FormGroup>
      
      <Button 
        variant="outlined" 
        fullWidth 
        sx={{ 
          mt: 3,
          color: 'secondary.main',
          borderColor: 'secondary.main',
          '&:hover': {
            borderColor: 'secondary.dark',
            backgroundColor: 'secondary.light',
          }
        }}
        onClick={handleClearFilters}
      >
        Clear Filters
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setMobileOpen(true)}
          size="small"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            borderColor: 'divider',
            color: 'inherit',
            '&:hover': {
              borderColor: 'divider',
              backgroundColor: 'action.hover',
            }
          }}
        >
          Filter
        </Button>
        
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          {filterContent}
        </Drawer>
      </>
    );
  }

  return (
    <Box 
      sx={{ 
        width: 280, 
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        height: '100%',
        pr: 2
      }}
    >
      {filterContent}
    </Box>
  );
};

export default FilterSidebar; 