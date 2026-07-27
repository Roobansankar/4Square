export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  description?: string;
  email: string;
  phone1: string;
  phone2: string;
  engineer?: string;
  supervisor?: string;
  estimatedBudget: number;
  budget?: number;
  spent?: number;
  status: 'Plan' | 'In Progress' | 'Hold';
  startDate: string;
  endDate: string;
  progress: number;
  completion?: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  projectCount: number;
  status: 'Active' | 'Inactive';
}

export interface Engineer {
  id: string;
  name: string;
  designation: string;
  projects: number;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar: string;
}

export interface Supervisor {
  id: string;
  name: string;
  site: string;
  workers: number;
  progress: number;
}

export interface Contractor {
  id: string;
  name: string;
  specialization: string;
  contact: string;
  runningProjects: number;
}

export interface Vendor {
  id: string;
  vendor: string;
  material: string;
  gst: string;
  phone: string;
  outstanding: number;
}

export interface Payment {
  id: string;
  vendor: string;
  amount: number;
  paidDate: string;
  mode: string;
  status: 'Paid' | 'Pending' | 'Processing';
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  site: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  material: string;
  stock: number;
  unit: string;
  lastPurchase: string;
  supplier: string;
}

export interface PurchaseOrder {
  id: string;
  vendor: string;
  amount: number;
  status: 'Delivered' | 'Partial' | 'Pending' | 'Processing';
  date: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}
