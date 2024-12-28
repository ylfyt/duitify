import { supabase } from '@/supabase';

export const ACCOUNT_LOGOS: string[] = [
    '/accounts/shopee.webp',
    '/accounts/gopay.webp',
    '/accounts/bca.webp',
    '/accounts/wallet.webp',
    '/accounts/ovo.webp',
    '/accounts/dana.webp',
    '/accounts/bri.webp',
    '/accounts/invest.webp',
    '/accounts/loan.webp',
    '/accounts/bni.webp',
    '/accounts/livin-mandiri.webp',
] as const;

export const CATEGORY_LOGO_BASE = supabase.storage.from('images').getPublicUrl('categories').data.publicUrl;
