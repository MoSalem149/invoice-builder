// src/types/index.ts

// Notification Types
export interface NotificationInput {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export interface NotificationProps extends NotificationInput {
  id: string;
  onClose: () => void;
}

// User and Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

export interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// App Types
export interface Company {
  logo: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  currency: "USD" | "EGP" | "CHF";
  language: "en" | "ar" | "it";
  watermark?: string;
  showNotes?: boolean;
  showTerms?: boolean;
  taxRate?: number;
}

export interface Client {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  discount: number;
  price: number;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  amount: number;
  discount: number;
}

export interface Invoice {
  id: string;
  _id?: string; // For MongoDB
  number: string;
  date: string;
  dueDate: string;
  client: Client;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string;
  status?: "draft" | "sent" | "paid" | "overdue";
  createdAt?: string;
  updatedAt?: string;
}

export interface AppState {
  company: Company;
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
}

export type AppAction =
  | { type: "UPDATE_COMPANY"; payload: Company }
  | { type: "ADD_CLIENT"; payload: Client }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "UPDATE_CLIENT"; payload: Client }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "UPDATE_INVOICE"; payload: Invoice }
  | { type: "ARCHIVE_CLIENT"; payload: string }
  | { type: "UNARCHIVE_CLIENT"; payload: string }
  | { type: "ARCHIVE_PRODUCT"; payload: string }
  | { type: "UNARCHIVE_PRODUCT"; payload: string }
  | { type: "LOAD_DATA"; payload: AppState }
  | { type: "SET_CLIENTS"; payload: Client[] }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_INVOICES"; payload: Invoice[] };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadUserData: () => Promise<void>;
  saveInvoice: (invoice: Partial<Invoice>) => Promise<boolean>;
  updateInvoice: (invoice: Partial<Invoice>) => Promise<boolean>;
}

// Language Types
export interface LanguageContextType {
  t: (key: string) => string;
  isRTL: boolean;
  language: "en" | "ar" | "it";
  setLanguage: (lang: "en" | "ar" | "it") => void;
}

// Notification Context Type
export interface NotificationContextType {
  notifications: NotificationProps[];
  addNotification: (notification: NotificationInput) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
}
