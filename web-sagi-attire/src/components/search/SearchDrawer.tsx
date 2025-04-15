import { useState, useEffect, useRef } from 'react';
import { 
  Drawer, 
  TextField, 
  Box, 
  Typography, 
  IconButton, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import client from '../../contentful/contentfulClient';
import { Product } from '../../types/Product';
import { ISizes } from '../../types/Product';

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SearchDrawer = ({ open, onClose }: SearchDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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
      navigate(`/all-products?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResultClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '80vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Search Products
          </Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

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
          sx={{ mb: 2 }}
        />

        {results.length > 0 && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Quick Results
          </Typography>
        )}

        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {results.map((product) => (
            <ListItem 
              key={product.id} 
              component="div"
              onClick={() => handleResultClick(product)}
              sx={{ 
                borderRadius: 1,
                mb: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <ListItemText
                primary={product.name}
                secondary={`${product.category} - ₹${product.price}`}
              />
            </ListItem>
          ))}
        </List>

        {searchTerm.trim() && results.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No results found for "{searchTerm}"
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={handleSearch}
          >
            View all results
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SearchDrawer; 