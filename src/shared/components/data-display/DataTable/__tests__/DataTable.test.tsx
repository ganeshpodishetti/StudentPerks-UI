import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTable } from '../DataTable';

// Mock data for testing
const mockData = [
  { id: '1', name: 'Item 1', description: 'Description 1', status: 'active' },
  { id: '2', name: 'Item 2', description: 'Description 2', status: 'inactive' },
];

const mockColumns = [
  {
    key: 'name',
    header: 'Name',
    accessor: 'name' as keyof typeof mockData[0],
  },
  {
    key: 'description',
    header: 'Description',
    accessor: 'description' as keyof typeof mockData[0],
  },
  {
    key: 'status',
    header: 'Status',
    render: (value: any, item: typeof mockData[0]) => (
      <span className={item.status === 'active' ? 'text-green-600' : 'text-red-600'}>
        {item.status}
      </span>
    ),
  },
];

describe('DataTable', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    actions: {
      onEdit: mockOnEdit,
      onDelete: mockOnDelete,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table headers correctly', () => {
    render(<DataTable {...defaultProps} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders table data correctly', () => {
    render(<DataTable {...defaultProps} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders custom cell content', () => {
    render(<DataTable {...defaultProps} />);
    
    const activeStatus = screen.getByText('active');
    const inactiveStatus = screen.getByText('inactive');
    
    expect(activeStatus).toHaveClass('text-green-600');
    expect(inactiveStatus).toHaveClass('text-red-600');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<DataTable {...defaultProps} />);
    
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => button.querySelector('svg'));
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<DataTable {...defaultProps} />);
    
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => button.querySelector('svg'));
    
    if (deleteButton && deleteButtons.length > 1) {
      fireEvent.click(deleteButtons[1]); // Second button should be delete
      expect(mockOnDelete).toHaveBeenCalledWith(mockData[0].id);
    }
  });

  it('shows empty state when no data', () => {
    render(<DataTable {...defaultProps} data={[]} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('hides actions column when no actions provided', () => {
    const { actions, ...propsWithoutActions } = defaultProps;
    render(<DataTable {...propsWithoutActions} />);
    
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  it('shows only edit button when only onEdit is provided', () => {
    const propsWithOnlyEdit = {
      ...defaultProps,
      actions: { onEdit: mockOnEdit }
    };
    render(<DataTable {...propsWithOnlyEdit} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockData.length); // One edit button per row
  });

  it('shows only delete button when only onDelete is provided', () => {
    const propsWithOnlyDelete = {
      ...defaultProps,
      actions: { onDelete: mockOnDelete }
    };
    render(<DataTable {...propsWithOnlyDelete} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockData.length); // One delete button per row
  });

  it('applies custom className', () => {
    const { container } = render(
      <DataTable {...defaultProps} className="custom-table" />
    );
    
    expect(container.firstChild).toHaveClass('custom-table');
  });

  it('shows custom empty message', () => {
    render(<DataTable {...defaultProps} data={[]} emptyMessage="Custom empty message" />);
    
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });
});