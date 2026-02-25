import { RedeemType } from '@/shared/types/entities/deal';

export interface FormData {
  title: string;
  description: string;
  discount: string;
  promo?: string;
  isActive: boolean;
  url: string;
  redeemType: RedeemType;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  categoryName: string;
  storeName: string;
  universityName?: string;
  isUniversitySpecific?: boolean;
}