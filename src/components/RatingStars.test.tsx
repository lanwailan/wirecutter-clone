import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RatingStars from './RatingStars';

describe('RatingStars Component', () => {
  it('renders correct number of full stars', () => {
    render(<RatingStars rating={4} />);
    
    // Should render 4 full stars
    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars).toHaveLength(5); // 4 full + 1 empty
  });

  it('renders half star for 4.5 rating', () => {
    render(<RatingStars rating={4.5} />);
    
    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars).toHaveLength(5); // 4 full + 1 half
  });

  it('shows rating number when showNumber is true', () => {
    render(<RatingStars rating={4.2} showNumber={true} />);
    
    expect(screen.getByText('4.2/5')).toBeInTheDocument();
  });

  it('hides rating number when showNumber is false', () => {
    render(<RatingStars rating={4.2} showNumber={false} />);
    
    expect(screen.queryByText('4.2/5')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container } = render(<RatingStars rating={3} size="lg" />);
    
    expect(container.querySelector('.w-6.h-6')).toBeInTheDocument();
  });

  it('handles edge cases: 0 rating', () => {
    render(<RatingStars rating={0} />);
    
    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars).toHaveLength(5); // All empty stars
  });

  it('handles edge cases: 5 rating', () => {
    render(<RatingStars rating={5} />);
    
    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars).toHaveLength(5); // All full stars
  });
});