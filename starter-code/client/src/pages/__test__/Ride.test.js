import {render, screen} from '@testing-library/react';
import RidesList from '../RidesList';
import '@testing-library/jest-dom/extend-expect';

test('renders ride listings', () => {
    render(<RidesList />);
    const element = screen.getByText(/To join a ride, select the green sign-up button./i);
    expect(element).toBeInTheDocument();
}); 