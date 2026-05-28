const API_ORIGIN = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") || "https://cafe-api-server.vercel.app";
const API_BASE = `${API_ORIGIN}/api`;

function getToken(): string | null {
  return sessionStorage.getItem("authToken");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error ?? "Request failed");
  }
  return res.json();
}

export async function uploadPaymentProof(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload/payment-proof`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Upload gagal" }));
    throw new Error(body.error ?? "Upload gagal");
  }
  const data = await res.json();
  return data.url as string;
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; user: { id: string; username: string; email: string; role: string } }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ username, password }) }
      ),
    register: (username: string, email: string, password: string) =>
      request<{ message: string; userId: string }>(
        "/auth/register",
        { method: "POST", body: JSON.stringify({ username, email, password }) }
      ),
    logout: () => request("/auth/logout", { method: "POST" }),
    me: () => request<{ id: string; username: string; email: string; role: string }>("/auth/me"),
  },

  menu: {
    getAll: () => request<MenuItem[]>("/menu"),
    create: (data: Partial<MenuItem>) =>
      request<MenuItem>("/menu", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<MenuItem>) =>
      request<MenuItem>(`/menu/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/menu/${id}`, { method: "DELETE" }),
  },

  orders: {
    getMyOrders: () => request<Order[]>("/orders"),
    getAdminOrders: () => request<AdminOrder[]>("/admin/orders"),
    getOrderItems: (id: string) => request<OrderItemDetail[]>(`/orders/${id}/items`),
    create: (data: CreateOrderPayload) =>
      request<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),
    adminUpdate: (id: string, data: { paymentStatus?: string; orderStatus?: string }) =>
      request<Order>(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },

  users: {
    getAll: () => request<UserRecord[]>("/admin/users"),
    updateRole: (id: string, role: string) =>
      request<UserRecord>(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
    delete: (id: string) => request(`/admin/users/${id}`, { method: "DELETE" }),
  },

  paymentChannels: {
    getActive: () => request<PaymentChannel[]>("/payment-channels"),
    getAll: () => request<PaymentChannel[]>("/admin/payment-channels"),
    create: (data: Partial<PaymentChannel>) =>
      request<PaymentChannel>("/admin/payment-channels", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<PaymentChannel>) =>
      request<PaymentChannel>(`/admin/payment-channels/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/admin/payment-channels/${id}`, { method: "DELETE" }),
  },

  categories: {
    getAll: () => request<CategoryRecord[]>("/categories"),
    create: (data: Partial<CategoryRecord>) =>
      request<CategoryRecord>("/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CategoryRecord>) =>
      request<CategoryRecord>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/categories/${id}`, { method: "DELETE" }),
  },

  rekap: {
    get: (from: string, to: string) =>
      request<RekapData>(`/admin/rekap?from=${from}&to=${to}`),
  },
};

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number | string;
  imageUrl?: string;
  image_url?: string;
  available: boolean;
  createdAt?: string;
}

export interface Order {
  id: string;
  userId?: string;
  user_id?: string;
  totalAmount?: number | string;
  total_amount?: number | string;
  paymentMethod?: string;
  payment_method?: string;
  paymentStatus?: string;
  payment_status?: string;
  orderStatus?: string;
  order_status?: string;
  paymentProofUrl?: string;
  payment_proof_url?: string;
  notes?: string;
  createdAt?: string;
  created_at?: string;
}

export interface AdminOrder extends Order {
  username?: string;
  email?: string;
  users?: { username: string; email: string };
}

export interface OrderItemDetail {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
  menuItemName?: string;
}

export interface CreateOrderPayload {
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
  paymentProofUrl?: string;
  items: {
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  created_at?: string;
}

export interface PaymentChannel {
  id: string;
  name: string;
  accountNumber?: string;
  account_number?: string;
  accountName?: string;
  account_name?: string;
  instructions?: string;
  active: boolean;
  createdAt?: string;
  created_at?: string;
}

export function getUser(): { id: string; username: string; email: string; role: string } | null {
  const data = sessionStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function setUser(user: { id: string; username: string; email: string; role: string }, token: string) {
  sessionStorage.setItem("user", JSON.stringify(user));
  sessionStorage.setItem("authToken", token);
}

export function clearUser() {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("authToken");
}

export interface CategoryRecord {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  created_at?: string;
}

export interface RekapData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    confirmedOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    avgOrderValue: number;
  };
  dailyRevenue: { date: string; revenue: number; orders: number; confirmedOrders: number }[];
  byPaymentMethod: { method: string; count: number; total: number }[];
  byStatus: { status: string; count: number }[];
  orders: {
    id: string;
    tanggal: string;
    pelanggan: string;
    email: string;
    totalAmount: number;
    metodePembayaran: string;
    statusPembayaran: string;
    statusPesanan: string;
    catatan: string;
  }[];
}

