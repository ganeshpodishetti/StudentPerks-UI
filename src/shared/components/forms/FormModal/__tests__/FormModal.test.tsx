import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormModal } from '../FormModal';

// Mock the toast hook
jest.mock('@/shared/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

interface TestFormData {
  name: string;
  description: string;
}

describe('FormModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const initialState: TestFormData = {
    name: '',
    description: ''
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    title: 'Test Modal',
    description: 'Test modal description',
    initialState,
    isLoading: false,
    children: (formData: TestFormData, handleInputChange: any) => (
      <div>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
      </div>
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open', () => {
    render(<FormModal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test modal description')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<FormModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<FormModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when form is submitted', async () => {
    mockOnSave.mockResolvedValue(undefined);
    
    render(<FormModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state during submission', () => {
    render(<FormModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<FormModal {...defaultProps} />);
    
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    
    expect(nameInput).toHaveValue('Test Name');
  });

  it('uses custom submit button text', () => {
    render(<FormModal {...defaultProps} submitText="Create" />);
    
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    render(<FormModal {...defaultProps} isLoading={true} />);
    
    const submitButton = screen.getByText('Saving...');
    expect(submitButton).toBeDisabled();
  });

  it('populates form with entity data when provided', () => {
    const entity: TestFormData = {
      name: 'Existing Name',
      description: 'Existing Description'
    };

    render(<FormModal {...defaultProps} entity={entity} />);
    
    expect(screen.getByDisplayValue('Existing Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
  });
});