import {render, screen, fireEvent} from '@testing-library/react';
import Login from '../Login';
import '@testing-library/jest-dom/extend-expect';

test('renders front login page', () => {
    render(<Login />);
    const title = screen.getByText(/SBRideShare/i);
    expect(title).toBeInTheDocument();
    const buttonText = screen.getByText(/GET STARTED/i);
    expect(buttonText).toBeInTheDocument();
}); 

test('next page renders', () => {
    render(<Login />);
    fireEvent.click(screen.getByText(/GET STARTED/i));
    const nextPage = screen.getByText(/To continue, please sign in with a valid "ucsb.edu" email./i);
    expect(nextPage).toBeInTheDocument();
})