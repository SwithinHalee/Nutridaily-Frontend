/**
 * NutriDaily Frontend - Standalone Mock API Client
 *
 * Seluruh data menggunakan hardcoded dummy data berkualitas tinggi tanpa
 * memerlukan server backend eksternal. State interaktif (seperti swap menu,
 * ubah profil, pause/resume langganan, dan login/logout) didukung secara
 * langsung di sisi klien dengan sinkronisasi localStorage.
 */

import {
  MOCK_CATALOG_MEALS,
  MOCK_VERIFIED_MEALS,
  INITIAL_USER,
  INITIAL_SESSIONS,
  INITIAL_LOGIN_HISTORY,
  buildWeeklyDays,
  WeeklyDay,
} from '@/data/mock-data';
import { VerifiedMealItem } from '@/data/clean-label-data';

export const API_BASE_URL = '';

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors: FieldError[] = [],
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
  }

  fieldMessage(field: string): string | undefined {
    return this.fieldErrors.find((e) => e.field === field)?.message;
  }
}

// ---------------------------------------------------------------- Data Types

export interface AccountUser {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  passwordChangedAt: string | null;
  dataConsentAt: string | null;
  dataConsentVersion: string | null;
}

export interface SessionInfo {
  id: string;
  current: boolean;
  device: string;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string;
}

export interface LoginHistoryItem {
  id: string;
  status: 'SUCCESS' | 'FAILED';
  reason: string | null;
  device: string;
  ipAddress: string | null;
  createdAt: string;
}

export interface UpcomingOrder {
  id: string;
  orderDate: string;
  mealType: 'LUNCH' | 'DINNER';
  recipeId: string;
  recipeTitle: string;
  status: string;
}

export interface SubscriptionData {
  id: string;
  userId: string;
  packageType: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  deliveryAddress: {
    id: string;
    label: string;
    fullAddress: string;
  };
  upcomingOrders: UpcomingOrder[];
  allSubscriptions?: SubscriptionData[];
}

export interface CheckoutInput {
  orderId?: string;
  packageType: string;
  durationDays: number;
  scheduleMode?: 'ROLLOVER' | 'PARALLEL';
  targetCalories?: number;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress?: {
    label?: string;
    fullAddress?: string;
  };
}

interface MessageResponse {
  message: string;
}

// ---------------------------------------------------------------- Storage Helpers

const STORAGE_KEYS = {
  USER: 'nutridaily_mock_user',
  IS_LOGGED_OUT: 'nutridaily_mock_logged_out',
  SESSIONS: 'nutridaily_mock_sessions',
  LOGIN_HISTORY: 'nutridaily_mock_login_history',
  SUBSCRIPTION: 'nutridaily_mock_subscription',
  TRANSACTIONS: 'nutridaily_mock_transactions',
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // fallback ignore
  }
}

// ---------------------------------------------------------------- Initial Mock Subscription Builder

function createInitialSubscription(): SubscriptionData {
  const weeklyDays = buildWeeklyDays(new Date(), 0);
  const meals = MOCK_CATALOG_MEALS;

  const upcomingOrders: UpcomingOrder[] = weeklyDays.map((d, index) => {
    const meal = meals[index % meals.length];
    return {
      id: `ord-mock-${index + 1}`,
      orderDate: d.fullDate,
      mealType: 'LUNCH',
      recipeId: meal.id,
      recipeTitle: meal.title,
      status: 'CONFIRMED',
    };
  });

  const mainSub: SubscriptionData = {
    id: 'SUB-2026-ND-8821',
    userId: INITIAL_USER.id,
    packageType: 'WEIGHT_LOSS_LEAN_SCULPT',
    durationDays: 20,
    startDate: weeklyDays[0]?.fullDate || '2026-10-05',
    endDate: '2026-10-30',
    status: 'ACTIVE',
    deliveryAddress: {
      id: 'addr-1',
      label: 'Kantor SCBD Pacific Century Tower Lt. 18',
      fullAddress: 'Pacific Century Tower Lt. 18, Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan',
    },
    upcomingOrders,
  };

  const historySub: SubscriptionData = {
    id: 'SUB-2026-ND-7210',
    userId: INITIAL_USER.id,
    packageType: 'MAINTENANCE_VITALITY_DAILY',
    durationDays: 20,
    startDate: '2026-09-01',
    endDate: '2026-09-28',
    status: 'CANCELLED',
    deliveryAddress: {
      id: 'addr-2',
      label: 'Apartemen Senopati',
      fullAddress: 'Senopati Suites Tower 1 Unit 12B, Kebayoran Baru, Jakarta Selatan',
    },
    upcomingOrders: [],
  };

  mainSub.allSubscriptions = [mainSub, historySub];
  return mainSub;
}

// ---------------------------------------------------------------- Initial Mock Transactions

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-001',
    invoiceNumber: 'INV/ND/20261003/001',
    userId: INITIAL_USER.id,
    customerName: INITIAL_USER.fullName,
    customerEmail: INITIAL_USER.email,
    packageType: 'WEIGHT_LOSS_LEAN_SCULPT',
    durationDays: 20,
    amount: 1530000,
    formattedAmount: 'Rp 1.530.000',
    paymentType: 'BCA Virtual Account (Midtrans Snap)',
    transactionStatus: 'SETTLEMENT',
    paidAt: '2026-10-03T10:15:00.000Z',
    createdAt: '2026-10-03T10:12:00.000Z',
  },
  {
    id: 'tx-002',
    invoiceNumber: 'INV/ND/20260903/089',
    userId: INITIAL_USER.id,
    customerName: INITIAL_USER.fullName,
    customerEmail: INITIAL_USER.email,
    packageType: 'WEIGHT_LOSS_LEAN_SCULPT',
    durationDays: 20,
    amount: 1530000,
    formattedAmount: 'Rp 1.530.000',
    paymentType: 'Mandiri Bill Payment',
    transactionStatus: 'SETTLEMENT',
    paidAt: '2026-09-03T09:40:00.000Z',
    createdAt: '2026-09-03T09:35:00.000Z',
  },
  {
    id: 'tx-003',
    invoiceNumber: 'INV/ND/20260803/042',
    userId: INITIAL_USER.id,
    customerName: INITIAL_USER.fullName,
    customerEmail: INITIAL_USER.email,
    packageType: 'MAINTENANCE_VITALITY_DAILY',
    durationDays: 20,
    amount: 1700000,
    formattedAmount: 'Rp 1.700.000',
    paymentType: 'GoPay QRIS',
    transactionStatus: 'SETTLEMENT',
    paidAt: '2026-08-03T14:22:00.000Z',
    createdAt: '2026-08-03T14:20:00.000Z',
  },
];

// Helper delay simulator untuk UX yang natural
const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------- Auth API

export const authApi = {
  register: async (input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    dataConsent: boolean;
  }) => {
    await delay(120);
    const newUser: AccountUser = {
      id: `usr-${Date.now()}`,
      email: input.email.trim(),
      phone: input.phone.trim(),
      fullName: input.fullName.trim(),
      role: 'CUSTOMER',
      isVerified: true,
      createdAt: new Date().toISOString(),
      passwordChangedAt: null,
      dataConsentAt: input.dataConsent ? new Date().toISOString() : null,
      dataConsentVersion: input.dataConsent ? 'v1.0-UU-PDP-27-2022' : null,
    };
    setStorageItem(STORAGE_KEYS.USER, newUser);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_OUT);
    }
    return {
      message: 'Pendaftaran berhasil. Selamat datang di NutriDaily!',
      user: newUser,
    };
  },

  verifyEmail: async (_token: string) => {
    await delay(100);
    return { message: 'Alamat email berhasil diverifikasi.' };
  },

  resendVerification: async (_email: string) => {
    await delay(100);
    return { message: 'Tautan verifikasi telah dikirim ulang ke email Anda.' };
  },

  login: async (email: string, _password: string) => {
    await delay(150);
    const stored = getStorageItem<AccountUser>(STORAGE_KEYS.USER, INITIAL_USER);
    const user: AccountUser = {
      ...stored,
      email: email.trim() || stored.email,
    };
    setStorageItem(STORAGE_KEYS.USER, user);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_OUT);
    }
    return {
      message: 'Login berhasil. Selamat datang kembali!',
      user,
    };
  },

  logout: async () => {
    await delay(80);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.IS_LOGGED_OUT, 'true');
    }
    return { message: 'Anda telah berhasil logout.' };
  },

  logoutAll: async () => {
    await delay(80);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.IS_LOGGED_OUT, 'true');
    }
    return { message: 'Seluruh sesi login perangkat telah dinonaktifkan.' };
  },

  forgotPassword: async (_email: string) => {
    await delay(120);
    return { message: 'Instruksi pemulihan kata sandi telah dikirim ke email Anda.' };
  },

  resetPassword: async (_token: string, _password: string, _confirmPassword: string) => {
    await delay(120);
    return { message: 'Kata sandi berhasil diperbarui. Silakan login kembali.' };
  },
};

// ---------------------------------------------------------------- Account API

export const accountApi = {
  me: async (): Promise<{ user: AccountUser }> => {
    await delay(50);
    const isLoggedOut = getStorageItem<string | null>(STORAGE_KEYS.IS_LOGGED_OUT, null);
    if (isLoggedOut === 'true') {
      throw new ApiError(401, 'UNAUTHENTICATED', 'Sesi tidak aktif atau belum login.');
    }
    const user = getStorageItem<AccountUser>(STORAGE_KEYS.USER, INITIAL_USER);
    return { user };
  },

  updateProfile: async (input: { fullName?: string; phone?: string }) => {
    await delay(100);
    const current = getStorageItem<AccountUser>(STORAGE_KEYS.USER, INITIAL_USER);
    const updated: AccountUser = {
      ...current,
      ...(input.fullName ? { fullName: input.fullName.trim() } : {}),
      ...(input.phone ? { phone: input.phone.trim() } : {}),
    };
    setStorageItem(STORAGE_KEYS.USER, updated);
    return {
      message: 'Profil berhasil diperbarui.',
      user: updated,
    };
  },

  changePassword: async (_current: string, _newPass: string, _confirm: string) => {
    await delay(150);
    const current = getStorageItem<AccountUser>(STORAGE_KEYS.USER, INITIAL_USER);
    current.passwordChangedAt = new Date().toISOString();
    setStorageItem(STORAGE_KEYS.USER, current);
    return { message: 'Kata sandi berhasil diubah.' };
  },

  sessions: async () => {
    await delay(80);
    const sessions = getStorageItem<SessionInfo[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    return { sessions };
  },

  loginHistory: async () => {
    await delay(80);
    const history = getStorageItem<LoginHistoryItem[]>(STORAGE_KEYS.LOGIN_HISTORY, INITIAL_LOGIN_HISTORY);
    return { history };
  },

  deleteAccount: async (_password: string, _confirmation: string) => {
    await delay(150);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.USER);
      window.localStorage.setItem(STORAGE_KEYS.IS_LOGGED_OUT, 'true');
    }
    return { message: 'Akun Anda berhasil dinonaktifkan.' };
  },
};

// ---------------------------------------------------------------- Subscription API

export const subscriptionApi = {
  getMySubscription: async () => {
    await delay(90);
    let sub = getStorageItem<SubscriptionData | null>(STORAGE_KEYS.SUBSCRIPTION, null);
    if (!sub) {
      sub = createInitialSubscription();
      setStorageItem(STORAGE_KEYS.SUBSCRIPTION, sub);
    }
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utc + 3600000 * 7);

    return {
      data: sub,
      currentWibTime: {
        nowIso: wib.toISOString(),
        hour: wib.getHours(),
        minute: wib.getMinutes(),
      },
      cutoffNotice: 'Modifikasi menu dan pengiriman H+1 ditutup setiap hari kerja pukul 20.00 WIB. Dapur libur Sabtu dan Minggu.',
    };
  },

  pause: async (id: string, effectiveDate: string) => {
    await delay(120);
    const sub = getStorageItem<SubscriptionData>(STORAGE_KEYS.SUBSCRIPTION, createInitialSubscription());
    sub.status = 'PAUSED';
    if (sub.allSubscriptions) {
      const match = sub.allSubscriptions.find((s) => s.id === id);
      if (match) match.status = 'PAUSED';
    }
    setStorageItem(STORAGE_KEYS.SUBSCRIPTION, sub);
    return {
      message: `Langganan berhasil di-pause efektif mulai tanggal ${effectiveDate}.`,
      data: sub,
    };
  },

  resume: async (id: string, effectiveDate: string) => {
    await delay(120);
    const sub = getStorageItem<SubscriptionData>(STORAGE_KEYS.SUBSCRIPTION, createInitialSubscription());
    sub.status = 'ACTIVE';
    if (sub.allSubscriptions) {
      const match = sub.allSubscriptions.find((s) => s.id === id);
      if (match) match.status = 'ACTIVE';
    }
    setStorageItem(STORAGE_KEYS.SUBSCRIPTION, sub);
    return {
      message: `Langganan berhasil diaktifkan kembali mulai tanggal ${effectiveDate}.`,
      data: sub,
    };
  },

  swapMenu: async (_id: string, orderDate: string, recipeId: string, recipeTitle: string) => {
    await delay(100);
    const sub = getStorageItem<SubscriptionData>(STORAGE_KEYS.SUBSCRIPTION, createInitialSubscription());
    if (Array.isArray(sub.upcomingOrders)) {
      const order = sub.upcomingOrders.find((o) => o.orderDate === orderDate);
      if (order) {
        order.recipeId = recipeId;
        order.recipeTitle = recipeTitle;
      } else {
        sub.upcomingOrders.push({
          id: `ord-swap-${Date.now()}`,
          orderDate,
          mealType: 'LUNCH',
          recipeId,
          recipeTitle,
          status: 'CONFIRMED',
        });
      }
    }
    setStorageItem(STORAGE_KEYS.SUBSCRIPTION, sub);
    return {
      message: `Menu untuk tanggal ${orderDate} berhasil ditukar dengan "${recipeTitle}".`,
      data: sub,
    };
  },

  updateAddress: async (
    _id: string,
    effectiveDate: string,
    addressId: string,
    label: string,
    fullAddress: string,
  ) => {
    await delay(100);
    const sub = getStorageItem<SubscriptionData>(STORAGE_KEYS.SUBSCRIPTION, createInitialSubscription());
    sub.deliveryAddress = {
      id: addressId,
      label,
      fullAddress,
    };
    setStorageItem(STORAGE_KEYS.SUBSCRIPTION, sub);
    return {
      message: `Alamat pengiriman mulai tanggal ${effectiveDate} berhasil diperbarui ke ${label}.`,
      data: sub,
    };
  },
};

// ---------------------------------------------------------------- Recipes API

export const recipesApi = {
  getCatalog: async (week?: 'current' | 'next') => {
    await delay(80);
    const days: WeeklyDay[] = buildWeeklyDays(new Date(), week === 'next' ? 1 : 0);
    return {
      data: {
        days,
        meals: MOCK_CATALOG_MEALS,
      },
    };
  },

  getCleanLabel: async () => {
    await delay(80);
    return {
      data: MOCK_VERIFIED_MEALS,
    };
  },

  verifyCleanLabel: async (qrCode: string) => {
    await delay(80);
    const lowered = (qrCode || '').toLowerCase().trim();
    const found = MOCK_VERIFIED_MEALS.find(
      (m) =>
        m.qrCode.toLowerCase() === lowered ||
        m.skuCode.toLowerCase() === lowered ||
        m.id.toLowerCase() === lowered,
    );
    if (!found) {
      // Fallback gracefully to the first verified meal
      return { data: MOCK_VERIFIED_MEALS[0] };
    }
    return { data: found };
  },
};

// ---------------------------------------------------------------- Payments API

export const paymentsApi = {
  createSnap: async (_data: unknown) => {
    await delay(100);
    return {
      statusCode: 200,
      data: {
        token: `SNAP-DUMMY-${Date.now()}`,
        redirect_url: '#',
      },
    };
  },

  checkout: async (data: CheckoutInput) => {
    await delay(200);
    const invoiceNumber = `ND-INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

    // Buat langganan baru yang aktif
    const weeklyDays = buildWeeklyDays(new Date(), 0);
    const newSub: SubscriptionData = {
      id: `SUB-${Date.now()}`,
      userId: INITIAL_USER.id,
      packageType: data.packageType,
      durationDays: data.durationDays,
      startDate: weeklyDays[0]?.fullDate || '2026-10-12',
      endDate: '2026-11-06',
      status: 'ACTIVE',
      deliveryAddress: {
        id: 'addr-checkout',
        label: data.deliveryAddress?.label || 'Alamat Pengiriman Utama',
        fullAddress:
          data.deliveryAddress?.fullAddress ||
          'Jl. Jend. Sudirman Kav. 52-53, Pacific Century Tower Lt. 18, Jakarta Selatan',
      },
      upcomingOrders: weeklyDays.map((d, i) => ({
        id: `ord-new-${i}`,
        orderDate: d.fullDate,
        mealType: 'LUNCH',
        recipeId: MOCK_CATALOG_MEALS[i % MOCK_CATALOG_MEALS.length].id,
        recipeTitle: MOCK_CATALOG_MEALS[i % MOCK_CATALOG_MEALS.length].title,
        status: 'CONFIRMED',
      })),
    };
    setStorageItem(STORAGE_KEYS.SUBSCRIPTION, newSub);

    return {
      statusCode: 201,
      message: 'Pesanan langganan berhasil diproses dan dikonfirmasi.',
      data: {
        invoiceNumber,
        packageType: data.packageType,
        durationDays: data.durationDays,
        amount: data.totalAmount,
        status: 'PAID',
        createdAt: new Date().toISOString(),
      },
    };
  },

  getTransactions: async () => {
    await delay(80);
    const transactions = getStorageItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    return {
      statusCode: 200,
      data: {
        transactions,
        auditLogs: [
          {
            tone: 'amber',
            time: '10 Okt 2026 20:00:00 WIB',
            text: '[SISTEM KUNCI] CUTOFF H+1 LOCKED untuk 1.842 pesanan aktif besok.',
          },
          {
            tone: 'teal',
            time: '10 Okt 2026 05:00:00 WIB',
            text: 'Tiket produksi harian KDS berhasil diterbitkan (420 tiket batch 1).',
          },
          {
            tone: 'green',
            time: '10 Okt 2026 10:30:00 WIB',
            text: 'Fleet Dispatch: 4 armada berpendingin diberangkatkan dari Sudirman.',
          },
        ],
        summary: {
          totalSettled: transactions.length,
          totalVolumeRp: transactions.reduce((acc, t) => acc + t.amount, 0),
          idempotencyRate: '100% Terverifikasi',
        },
      },
    };
  },
};

// ---------------------------------------------------------------- Generic api adapter & rules

export const api = {
  get: async <T>(_path: string): Promise<T> => ({} as T),
  post: async <T>(_path: string, _body?: unknown): Promise<T> => ({} as T),
  patch: async <T>(_path: string, _body?: unknown): Promise<T> => ({} as T),
  delete: async <T>(_path: string, _body?: unknown): Promise<T> => ({} as T),
};

export async function refreshSession(): Promise<boolean> {
  return true;
}

export async function apiRequest<T>(_method: string, _path: string): Promise<T> {
  return {} as T;
}

export const PASSWORD_RULES: Array<{ id: string; label: string; test: (v: string) => boolean }> = [
  { id: 'length', label: 'Minimal 8 karakter', test: (v) => v.length >= 8 },
  { id: 'lower', label: 'Huruf kecil (a-z)', test: (v) => /[a-z]/.test(v) },
  { id: 'upper', label: 'Huruf besar (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'digit', label: 'Angka (0-9)', test: (v) => /[0-9]/.test(v) },
  { id: 'symbol', label: 'Simbol, misalnya ! @ # $', test: (v) => /[^A-Za-z0-9\s]/.test(v) },
];

export function safeNextPath(raw: string | null | undefined, fallback = '/account'): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
  return raw;
}
