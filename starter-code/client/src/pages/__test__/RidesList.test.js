import {render, screen} from '@testing-library/react';
import RidesList from '../RidesList';
import '@testing-library/jest-dom/extend-expect';

test('renders ride listings', () => {
    render(<RidesList />);
    const element = screen.getByText(/Rides leaving between/i);
    expect(element).toBeInTheDocument();

    const text = screen.getByText(/To join a ride, select the blue sign-up button or filter to find a ride close to your location./i);
    expect(text).toBeInTheDocument();
}); 