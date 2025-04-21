import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorAlert from '../src/components/ErrorAlert';

describe('ErrorAlert Component', () => {
  it('renders the error message', () => {
    render(<ErrorAlert message="This is an error" onClose={() => {}} />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('calls onClose when clicked outside', () => {
    const handleClose = jest.fn();
    render(<ErrorAlert message="This is an error" onClose={handleClose} />);
    fireEvent.mouseDown(document);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});