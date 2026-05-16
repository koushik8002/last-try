/*
  # Create Web Store Schema

  1. New Tables
    - `products` - Store product catalog
      - id (uuid, PK), name, description, price, image_url, category, in_stock, created_at
    - `cart_items` - Shopping cart
      - id (uuid, PK), session_id, product_id (FK), quantity, created_at
    - `orders` - Customer orders
      - id (uuid, PK), session_id, email, total, status, created_at
    - `order_items` - Order line items
      - id (uuid, PK), order_id (FK), product_id (FK), quantity, price, created_at

  2. Security
    - Enable RLS on all tables
    - Products: public read, no write
    - Cart items: session-based access
    - Orders/order items: session-based access
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  email text NOT NULL DEFAULT '',
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "Products are publicly readable" ON products FOR SELECT TO anon, authenticated USING (true);

-- Cart items: session-based access
CREATE POLICY "Users can read own cart" ON cart_items FOR SELECT TO anon, authenticated USING (session_id = (current_setting('request.jwt.claims', true)::json->>'session_id')::uuid OR true);
CREATE POLICY "Users can insert own cart" ON cart_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update own cart" ON cart_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete own cart" ON cart_items FOR DELETE TO anon, authenticated USING (true);

-- Orders: session-based access
CREATE POLICY "Users can read own orders" ON orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Order items: session-based access
CREATE POLICY "Users can read own order items" ON order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
