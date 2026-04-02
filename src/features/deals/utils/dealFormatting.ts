import { Deal } from "@/shared/types/entities/deal";

/**
 * Formats a date string for display.
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'No date specified';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Calculates days remaining until the deal's end date.
 */
export const getDaysRemaining = (endDateStr?: string | null): number | null => {
  if (!endDateStr || endDateStr === 'No date specified' || endDateStr.trim() === '') return null;
  try {
    const endDate = new Date(endDateStr);
    if (isNaN(endDate.getTime())) return null;
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    return null;
  }
};

/**
 * Formats the redeem type for display.
 */
export const formatRedeemType = (redeemType: string): string => {
  switch (redeemType) {
    case 'Online':
      return 'Online only';
    case 'InStore':
      return 'In-store only';
    case 'Both':
      return 'Online & In-store';
    case 'Unknown':
      return 'Contact store';
    default:
      return redeemType;
  }
};

/**
 * Generates an empty state message based on current filters and search status.
 */
export const generateEmptyDealsMessage = (
  hasSearched: boolean,
  searchResultsLength: number,
  searchTerm?: string,
  selectedCategory?: string,
  selectedStore?: string
): string => {
  if (hasSearched) {
    return searchResultsLength === 0
      ? "No deals found matching your search criteria."
      : "";
  }

  if (
    searchTerm ||
    (selectedCategory && selectedCategory !== "All") ||
    (selectedStore && selectedStore !== "All")
  ) {
    return `No deals found${
      selectedCategory && selectedCategory !== "All"
        ? ` in ${selectedCategory}`
        : ""
    }${
      selectedStore && selectedStore !== "All" ? ` from ${selectedStore}` : ""
    }${searchTerm ? ` matching "${searchTerm}"` : ""}`;
  }
  return "No deals available";
};
