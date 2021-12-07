

import { createTheme } from '@mui/material/styles';
import { purple, lightBlue, grey, red, lightGreen } from '@mui/material/colors';
export default function getTheme() {
    return createTheme({
        palette: {
            join: {
                main: lightBlue[200]
            },
            driver: {
                main: lightGreen[400]
            },
            full: {
                main: grey[400]
            },
            leave: {
                main: purple[200]
            },
            error: {
                main: red[300]
            },
            black: {
                main: "#000000"
            }
        },
    });
}