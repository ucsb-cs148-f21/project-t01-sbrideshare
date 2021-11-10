import {render, screen} from '@testing-library/react';
import MyRides from '../MyRides';
import '@testing-library/jest-dom/extend-expect';

test('renders your rides', () => {
    render(<MyRides />);
    const element = screen.getByText(/A list of rides that you are currently signed up for./i);
    expect(element).toBeInTheDocument();
}); 