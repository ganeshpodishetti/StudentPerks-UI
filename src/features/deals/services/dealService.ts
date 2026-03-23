/**
 * dealService – delegates to dealsApi.
 *
 * FIX: old code used `import apiClient, { publicApiClient }` which is wrong
 * (there is no default export).  Now imports through typed dealsApi module.
 *
 * Update/Delete return void (204 No Content from backend).
 * Search with empty query short-circuits to [] client-side.
 */
import { dealsApi } from '@/shared/services/api/dealsApi';
import type {
    CreateDealRequest,
    CursorPaginationRequest,
    FeedInteractionEventType,
    UpdateDealRequest
} from '@/shared/types/api/requests';
import type { CursorPaginatedDealsResponse, DealResponse, FeedType } from '@/shared/types/api/responses';

// Keep the Deal type alias so existing consumers don't break
export type { DealResponse as Deal };
export type { CreateDealRequest, UpdateDealRequest };

export interface GetDealsParams extends CursorPaginationRequest {}

export const dealService = {
  async getDeals(params?: GetDealsParams): Promise<CursorPaginatedDealsResponse> {
    return dealsApi.getAll(params);
  },

  async getDeal(id: string): Promise<DealResponse> {
    return dealsApi.getById(id);
  },

  async getDealsByCategory(name: string): Promise<DealResponse[]> {
    try {
      return await dealsApi.getByCategory(name);
    } catch (err: any) {
      if (err?.response?.status === 404) return [];
      return Promise.reject(err);
    }
  },

  async getDealsByStore(name: string): Promise<DealResponse[]> {
    try {
      return await dealsApi.getByStore(name);
    } catch (err: any) {
      if (err?.response?.status === 404) return [];
      return Promise.reject(err);
    }
  },

  async getDealsByUniversity(name: string): Promise<DealResponse[]> {
    try {
      return await dealsApi.getByUniversity(name);
    } catch (err: any) {
      if (err?.response?.status === 404) return [];
      return Promise.reject(err);
    }
  },

  async getUserDeals(): Promise<DealResponse[]> {
    return dealsApi.getForUser();
  },

  async createDeal(data: CreateDealRequest): Promise<DealResponse> {
    return dealsApi.create(data);
  },

  /** PUT returns 204 → void */
  async updateDeal(id: string, data: UpdateDealRequest): Promise<void> {
    return dealsApi.update(id, data);
  },

  async deleteDeal(id: string): Promise<void> {
    return dealsApi.remove(id);
  },

  /**
   * GET /api/deals/search?query=
   * Returns [] for empty query (204 is not an error).
   */
  async searchDeals({ query = '' }: { query?: string }): Promise<DealResponse[]> {
    return dealsApi.search(query);
  },

  async getLatestFeed(): Promise<DealResponse[]> {
    try {
      return await dealsApi.getLatestFeed();
    } catch {
      return [];
    }
  },

  async getFeaturedFeed(): Promise<DealResponse[]> {
    try {
      return await dealsApi.getFeaturedFeed();
    } catch {
      return [];
    }
  },

  async getPopularFeed(): Promise<DealResponse[]> {
    try {
      return await dealsApi.getPopularFeed();
    } catch {
      return [];
    }
  },

  async getTrendingFeed(): Promise<DealResponse[]> {
    try {
      return await dealsApi.getTrendingFeed();
    } catch {
      return [];
    }
  },

  async getSingleFeedWithFallback(feedType: FeedType): Promise<DealResponse[]> {
    try {
      switch (feedType) {
        case 'latest':
          return await dealService.getLatestFeed();
        case 'featured':
          return await dealService.getFeaturedFeed();
        case 'popular':
          return await dealService.getPopularFeed();
        case 'trending':
          return await dealService.getTrendingFeed();
      }
    } catch {
      const legacy = await dealService.getDeals();

      if (feedType === 'featured') {
        return legacy.items.filter((deal) => deal.isFeatured);
      }

      return legacy.items;
    }
  },

  async getHomeFeed(): Promise<DealResponse[]> {
    const feedResults = await Promise.allSettled([
      dealService.getLatestFeed(),
      dealService.getFeaturedFeed(),
      dealService.getPopularFeed(),
      dealService.getTrendingFeed(),
    ]);

    const successfulFeeds = feedResults
      .filter((result): result is PromiseFulfilledResult<DealResponse[]> => result.status === 'fulfilled')
      .flatMap((result) => result.value);

    // If all feed calls fail, gracefully fall back to legacy deals endpoint.
    if (successfulFeeds.length === 0) {
      const legacy = await dealService.getDeals();
      return legacy.items;
    }

    const uniqueById = new Map<string, DealResponse>();
    for (const deal of successfulFeeds) {
      if (!uniqueById.has(deal.id)) {
        uniqueById.set(deal.id, deal);
      }
    }

    return Array.from(uniqueById.values());
  },

  async trackFeedInteraction({
    dealId,
    eventType,
    userId,
  }: {
    dealId: string;
    eventType: FeedInteractionEventType;
    userId?: string;
  }): Promise<void> {
    return dealsApi.trackInteraction({ dealId, eventType, userId });
  },
};

