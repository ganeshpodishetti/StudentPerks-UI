import { CreateCategoryRequest } from '@/features/categories/services/categoryService';
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CategoryFormModal from '../CategoryFormModal';

const mockOnSave = jest.fn() as (data: CreateCategoryRequest) => Promise<void>;
const mockOnClose = jest.fn();

describe('CategoryFormModal', () => {
  it('renders the modal for creating a new category', () => {
    render(
      <CategoryFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Create New Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Category Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Category Image')).toBeInTheDocument();
  });

  it('renders the modal for editing an existing category', () => {
    const mockCategory = {
      id: '1',
      name: 'Test Category',
      description: 'Test Description',
      imageUrl: 'http://example.com/image.png',
    };

    render(
      <CategoryFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        category={mockCategory}
      />
    );

    expect(screen.getByText('Edit Category')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('calls onSave with the correct data when the form is submitted', async () => {
    render(
      <CategoryFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Category Name *'), {
      target: { value: 'New Category' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Description' },
    });

    fireEvent.click(screen.getByText('Create Category'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Category',
          description: 'New Description',
        })
      );
    });
  });
});