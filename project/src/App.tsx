import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { useStore } from './hooks/useStore';
import { Loader2 } from 'lucide-react';

function App() {
  const store = useStore();

  if (store.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={store.cartCount}
        searchQuery={store.searchQuery}
        onSearchChange={store.setSearchQuery}
        onCartClick={() => store.setCartOpen(true)}
      />

      <Hero />

      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <CategoryFilter
            categories={store.categories}
            active={store.activeCategory}
            onChange={store.setActiveCategory}
          />
        </div>

        {store.products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {store.products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={store.addToCart} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-400">
          Mkt. &mdash; Curated essentials for modern living
        </div>
      </footer>

      <CartDrawer
        open={store.cartOpen}
        items={store.cartItems}
        total={store.cartTotal}
        onClose={() => store.setCartOpen(false)}
        onUpdateQuantity={store.updateQuantity}
        onRemove={store.removeFromCart}
        onCheckout={() => {
          store.setCartOpen(false);
          store.setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={store.checkoutOpen}
        total={store.cartTotal}
        sessionId={store.sessionId}
        onClose={() => store.setCheckoutOpen(false)}
        onComplete={() => store.setCheckoutOpen(false)}
      />
    </div>
  );
}

export default App;
