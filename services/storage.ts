import { Product, Order } from '../types';
import { initialProducts as defaultProducts } from '../data';

const PRODUCTS_KEY = 'fortex_products';
const ORDERS_KEY = 'fortex_orders';

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const deleteProduct = (id: string) => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  // Update pseudo-sales stats on product (in a real app this would be more complex)
  const products = getProducts();
  order.items.forEach(item => {
    const prod = products.find(p => p.id === item.product.id);
    if (prod) {
      prod.sales = (prod.sales || 0) + item.quantity;
    }
  });
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const updateOrderStatus = (id: string, status: Order['status']) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === id);
    if(order) {
        order.status = status;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
}