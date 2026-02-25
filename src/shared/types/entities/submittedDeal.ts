export interface SubmittedDeal {
  id: string;
  name: string;
  url: string;
  promoCode?: string;
  markedAsRead: boolean;
  sentAt: string;
}

export interface SubmitDealRequest {
  title: string;
  url: string;
  promoCode?: string;
}

export interface MarkAsReadDealRequest {
  markedAsRead: boolean;
}

export interface SubmittedDealResponse {
  id: string;
  name: string;
  url: string;
  promoCode?: string;
  markedAsRead: boolean;
  sentAt: string;
}
