import {render, screen} from '@testing-library/react';
import RidesList from '../RidesList';
import '@testing-library/jest-dom/extend-expect';

test('renders ride listings', () => {
    render(<RidesList />);

    const text = screen.getByText(/To join a ride, select the sign-up button, or filter by ride details to find the ride you want./i);
    expect(text).toBeInTheDocument();

    const filter = screen.getByText(/Filter Rides/);
    expect(filter).toBeInTheDocument();
}); 