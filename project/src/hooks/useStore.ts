import { useState, useEffect, useCallback } from 'react';
import { supabase, Product, CartItem } from '../lib/supabase';

const SESSION_KEY = 'store_session_id';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const sessionId = getSessionId();

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }, []);

  const fetchCart = useCallback(async () => {
    const { data } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('session_id', sessionId);
    if (data) setCartItems(data as CartItem[]);
  }, [sessionId]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCart()]).then(() => setLoading(false));
  }, [fetchProducts, fetchCart]);

  const addToCart = async (productId: string) => {
    const existing = cartItems.find((item) => item.product_id === productId);
    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({
        session_id: sessionId,
        product_id: productId,
        quantity: 1,
      });
    }
    await fetchCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await supabase.from('cart_items').delete().eq('id', itemId);
    } else {
      await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
    }
    await fetchCart();
  };

  const removeFromCart = async (itemId: string) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await supabase.from('cart_items').delete().eq('session_id', sessionId);
    await fetchCart();
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.products?.price ?? 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  return {
    products: filteredProducts,
    allProducts: products,
    cartItems,
    loading,
    cartOpen,
    setCartOpen,
    checkoutOpen,
    setCheckoutOpen,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    categories,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    sessionId,
  };
}
