import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Paper,
  Fade,
  IconButton,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import client from '../../contentful/contentfulClient';
import { Product } from '../../types/Product';
import { ISizes } from '../../types/Product';

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar = ({ onClose }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Animate in when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchTerm.trim()) {
      setLoading(true);
      searchTimeout.current = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 500);
    } else {
      setResults([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  // Fetch search results when debounced search term changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setLoading(false);
        return;
      }

      try {
        // Search by product name
        const nameResponse = await client.getEntries({
          content_type: 'product',
          'fields.name[match]': debouncedSearchTerm,
          limit: 5
        });

        // Search by product ID
        const idResponse = await client.getEntries({
          content_type: 'product',
          'fields.id[match]': debouncedSearchTerm,
          limit: 5
        });

        // Search by category
        const categoryResponse = await client.getEntries({
          content_type: 'category',
          'fields.id[match]': debouncedSearchTerm,
          limit: 1
        });

        let categoryId = '';
        if (categoryResponse.items.length > 0) {
          categoryId = categoryResponse.items[0].sys.id;
        }

        // If category found, get products in that category
        let categoryProducts: any[] = [];
        if (categoryId) {
          const categoryProductsResponse = await client.getEntries({
            content_type: 'product',
            'fields.category.sys.id': categoryId,
            limit: 5
          });
          categoryProducts = categoryProductsResponse.items;
        }

        // Combine and deduplicate results
        const allResults = [...nameResponse.items, ...idResponse.items, ...categoryProducts];
        const uniqueResults = Array.from(
          new Map(allResults.map(item => [item.sys.id, item])).values()
        );

        // Map to Product type
        const mappedResults = uniqueResults.map(item => ({
          id: item.sys.id as string,
          productId: item.fields.id,
          name: item.fields.name,
          description: item.fields.description,
          price: item.fields.price,
          offer: item.fields.offerInPercentage,
          category: item.fields.category?.fields?.id || '',
          images: (item.fields.images as [])?.map(
            (img: { fields: { file: { url: string } } }) => img.fields.file.url
          ) || [],
          sizes: (item.fields.sizes as [])?.map(
            (size: { fields: { id: string; quantity: number; name: string } }) => {
              return {
                id: size.fields.id,
                quantity: size.fields.quantity,
                name: size.fields.name,
              } as ISizes;
            }
          ),
        } as unknown as Product));

        setResults(mappedResults);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResultClick = (product: Product) => {
    navigate(`/product/${product.productId}`);
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    // Delay the actual closing to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <Collapse in={isVisible} timeout={300} easing="ease-in-out">
      <Box 
        ref={searchRef}
        sx={{ 
          width: '100%',
          position: 'relative',
          zIndex: 1000,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
        }}
      >
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, product ID, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: loading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Fade in={showSuggestions && results.length > 0} timeout={200}>
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0,
              maxHeight: '400px',
              overflow: 'auto',
              zIndex: 1000,
              transform: showSuggestions ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <List sx={{ p: 0 }}>
              <ListItem 
                component="div"
                onClick={() => {
                  navigate('/products');
                  onClose();
                }}
                sx={{ 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.selected'
                  }
                }}
              >
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SearchIcon fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={500}>
                        View All Products
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              
              {results.map((product) => (
                <ListItem
                  key={product.id}
                  component="div"
                  onClick={() => handleResultClick(product)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemText
                    primary={product.name}
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          {product.category} - {product.productId}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{product.price || 0}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      </Box>
    </Collapse>
  );
};

export default SearchBar; 