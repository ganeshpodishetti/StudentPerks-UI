/**
 * Deal entity used throughout the UI.
 * Shape mirrors DealResponse from the backend.
 */
import type { RedeemType } from '@/shared/types/api/requests';

export type { RedeemType };

export interface Deal {
  id: string;
  title: string;
  discount: string;
  promo?: string | null;
  logoUrl?: string | null;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  url: string;
  redeemType: RedeemType;
  howToRedeem?: string | null;
  endDate?: string | null;
  isUniversitySpecific: boolean;
  categoryName: string;
  storeName: string;
  universityName?: string | null;
  universityImageUrl?: string;
  createdAt?: string;
}


