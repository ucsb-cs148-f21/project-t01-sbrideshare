import {render, screen} from '@testing-library/react';
import Ride from '../Ride';
import '@testing-library/jest-dom/extend-expect';
import getUser from "../../utils/get-user";
import ucsbAccount from "../../utils/ucsb-account";
jest.mock('../../utils/get-user');
jest.mock('../../utils/ucsb-account');

test('renders rides', () => {
    getUser.mockResolvedValue({
        fullName: "Joe Goldberg",
        given_name: "Joe", 
        family_name: "Goldberg", 
        email: "joegoldberg@ucsb.edu",
        id: "21358971895"
    });

    ucsbAccount.mockResolvedValue(true);

    render(<Ride />);
    const element = screen.getByText(/To make a personal drive available for passengers, please fill out the form below. This will allow users to sign up for your ride!/i);
    expect(element).toBeInTheDocument();
}); 