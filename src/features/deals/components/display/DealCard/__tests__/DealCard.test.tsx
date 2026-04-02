import type { Deal } from '@/shared/types';
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';
import DealCard from '../DealCard';

jest.mock('../../DealDetail/DealDetail', () => ({
  __esModule: true,
  default: ({ trigger }: { trigger: React.ReactElement }) => <>{trigger}</>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}));

const baseDeal: Deal = {
  id: 'deal-1',
  title: 'Student Discount',
  discount: '20% OFF',
  isFeatured: false,
  isActive: true,
  url: 'https://example.com/deal',
  redeemType: 'Online',
  isUniversitySpecific: false,
  categoryName: 'Food',
  storeName: 'Store A',
};

describe('DealCard', () => {
  it('uses logoUrl first when both logoUrl and imageUrl are present', () => {
    const expectedLogoUrl = 'https://cdn.example.com/logo.png';

    render(
      <DealCard
        deal={{
          ...baseDeal,
          logoUrl: expectedLogoUrl,
          imageUrl: 'https://cdn.example.com/image.png',
        }}
      />,
    );

    const image = screen.getByTestId('deal-card-logo-image');
    expect(image).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(expectedLogoUrl)));
  });

  it('falls back to imageUrl when logoUrl is missing', () => {
    const expectedImageUrl = 'https://cdn.example.com/image.png';

    render(
      <DealCard
        deal={{
          ...baseDeal,
          imageUrl: expectedImageUrl,
        }}
      />,
    );

    const image = screen.getByTestId('deal-card-logo-image');
    expect(image).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(expectedImageUrl)));
  });

  it('shows first-letter fallback when image fails to load', () => {
    render(
      <DealCard
        deal={{
          ...baseDeal,
          logoUrl: 'https://cdn.example.com/broken.png',
        }}
      />,
    );

    fireEvent.error(screen.getByTestId('deal-card-logo-image'));

    expect(screen.queryByTestId('deal-card-logo-image')).not.toBeInTheDocument();
    expect(screen.getByTestId('deal-card-logo-fallback')).toHaveTextContent('S');
  });

  it('shows first-letter fallback for placeholder logo URLs', () => {
    render(
      <DealCard
        deal={{
          ...baseDeal,
          logoUrl: 'https://cdn.example.com/placeholder-logo.png',
        }}
      />,
    );

    expect(screen.queryByTestId('deal-card-logo-image')).not.toBeInTheDocument();
    expect(screen.getByTestId('deal-card-logo-fallback')).toHaveTextContent('S');
  });
});


