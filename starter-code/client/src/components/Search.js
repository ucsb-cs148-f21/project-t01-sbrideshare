import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

export default function SearchAppBar() {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
      } = usePlacesAutocomplete({
        requestOptions: {
          /* Define search scope here */
        },
        debounce: 300,
      });

    const [values, setValues] = useState({
        minDateTime: new Date(),
        MaxDateTime: new Date(),
        start_location: "",
        end_location: ""
    });

    const handleMinDateTimeInputChange = (event) => {
        setValues({ ...values, minDateTime: event.target.value });
    };

    const handleMaxDateTimeInputChange = (event) => {
        setValues({ ...values, maxDateTime: event.target.value });
    };

    const [location, setLocation] = useState("");

    const [search, setSearch] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if(search != ""){
            console.log(search); 
        } 
      }

    const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
    });

    return (
        <Grid component="form"
        item
        container 
        spacing={2}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        style = {{
            "border": "2px outset darkgrey",
            "background-color": "azure",
        }}
        onSubmit = {handleSubmit}
        >
            <Grid item>
            <FormLabel component="legend">Rides leaving between</FormLabel>
                <Stack direction="row" spacing={2} >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        value={values.minDateTime}
                        onChange={handleMinDateTimeInputChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <FormLabel xs = {1} component="legend" style={{width: "5px"}}>to</FormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        value={values.maxDateTime}
                        onChange={handleMaxDateTimeInputChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Stack>
            </Grid>
            <Grid item>
                <div ref={ref}>
                    <input
                    value={values.end_location}
                    name="end_location"
                    onChange={handleInputChange}
                    placeholder="End Location"
                    className="form-field"
                    autoComplete="off"
                    />
                    {/* We can use the "status" to decide whether we should display the dropdown or not */}
                    {status === "OK" && location === "end" && (
                    <ul>{renderEndSuggestions("end_location")}</ul>
                    )}
                </div>
            </Grid>
            
            <Grid item>
                <FormLabel component="legend">Filter by</FormLabel>
                <TextField
                    id="max_price" 
                    label="Max Price"
                    type="number"
                    variant="outlined"

                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <IconButton type = "submit" size="large" aria-label="search" color="inherit">
                    <SearchIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}