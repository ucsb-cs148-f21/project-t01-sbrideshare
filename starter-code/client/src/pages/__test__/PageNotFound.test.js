import {render, screen} from '@testing-library/react';
import PageNotFound from '../PageNotFound';
import '@testing-library/jest-dom/extend-expect';

test('renders page not found', () => {
    render(<PageNotFound />);
    const element = screen.getByText(/This page was not found/i);
    expect(element).toBeInTheDocument();
}); 