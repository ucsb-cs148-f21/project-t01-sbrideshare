import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Home from '../Home';
import '@testing-library/jest-dom/extend-expect';
import getUser from "../../utils/get-user";
import ucsbAccount from "../../utils/ucsb-account";
jest.mock('../../utils/get-user');
jest.mock('../../utils/ucsb-account');

test('renders Home page', () => {
    getUser.mockResolvedValue({
        fullName: "Joe Goldberg",
        given_name: "Joe", 
        family_name: "Goldberg", 
        email: "joegoldberg@ucsb.edu",
        id: "21358971895"
    });

    ucsbAccount.mockResolvedValue(true);

    render(<Home />);
    const title = screen.getByText(/Welcome to SB RideShare!/i);
    expect(title).toBeInTheDocument();

    const findARide = screen.getAllByText(/Find A Ride/i)[1];
    expect(findARide).toBeInTheDocument();

    const createARide = screen.getAllByText(/Create A Ride/i)[0];
    expect(createARide).toBeInTheDocument();

    const myRides = screen.getByText(/My Rides/i);
    expect(myRides).toBeInTheDocument();

    const text = screen.getByText(/A web application designed for UCSB students on the go./i);
    expect(text).toBeInTheDocument();
}); 