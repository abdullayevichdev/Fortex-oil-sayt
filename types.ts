export interface Product {
  id: string;
  name: string;
  category: 'Motor Oil' | 'Transmission Oil' | 'ATF' | 'Hydraulic Oil' | 'Antifreeze';
  liters: string[];
  price_uzs: number[]; // Corresponds to liters index
  image_url: string;
  description: string;
  tags: string[];
  seo: {
    title: string;
    meta_description: string;
  };
  telegram_bot: {
    buy_button: boolean;
    status_sequence: string[];
    admin_notification: boolean;
    pdf_receipt: boolean;
    payment_card: string;
    user_data_required: string[];
  };
  sales?: number; // For admin stats
}

export interface CartItem {
  product: Product;
  selectedLiter: string;
  selectedPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  paymentMethod: 'cash' | 'card';
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Accepted' | 'Ready' | 'Cancelled';
  date: string;
}

export interface Booking {
  name: string;
  phone: string;
  carModel: string;
  serviceType: string;
  date: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  topProducts: { name: string; sold: number }[];
}

export const CATEGORIES = {
  MOTOR_OIL: 'Motor Oil',
  TRANSMISSION: 'Transmission Oil',
  ATF: 'ATF',
  HYDRAULIC: 'Hydraulic Oil',
  ANTIFREEZE: 'Antifreeze'
};

export const COMPANY_INFO = {
  address: "Namangan, O'zbekiston",
  location: { lat: 40.969778, lng: 71.732222 }, // 40°58'11.2"N 71°43'56.0"E
  phone: "+998 93 490 35 80",
  telegram: "https://t.me/Abdullayevich_design",
  instagram: "https://instagram.com/avazxanov_701",
  card: "9860 1701 1369 9921",
  email: "info@fortex.uz"
};