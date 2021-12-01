import React, { useState } from 'react';
import axios from "axios";
import getBackendURL from "../utils/get-backend-url";
import List from "../pages/ride-files/List";

import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Container from '@mui/material/Container';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import FormLabel from '@mui/material/FormLabel';
import HelpIcon from '@mui/icons-material/Help';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';

import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";


export default function SearchAppBar(props) {
    const sliderRangeDefaultValue = 1500;

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
      } = usePlacesAutocomplete({
        requestOptions: {
        },
        debounce: 300,
      });

    var dt = new Date();
    dt.setHours(dt.getHours() - 24);

    const [values, setValues] = useState({
        max_price: "",
        min_leave_datetime: dt,
        max_leave_datetime: null,
        start_location: "",
        start_location_radius: sliderRangeDefaultValue,
        end_location: "",
        end_location_radius: sliderRangeDefaultValue
    });

    const handleMinDateTimeInputChange = (value) => {
        setValues({ ...values, min_leave_datetime: value });
    };

    const handleMaxDateTimeInputChange = (value) => {
        setValues({ ...values, max_leave_datetime: value });
    };

    const handleStartLocationRangeInputChange = (event) => {
        setValues({ ...values, start_location_radius: event.target.value });
    };

    const handleEndLocationRangeInputChange = (event) => {
        setValues({ ...values, end_location_radius: event.target.value });
    };

    const handleMaxPriceInputChange = (event) => {
        setValues({ ...values, max_price: event.target.value });
    };

    const [location, setLocation] = useState("");
    const [startPlaceId, setStartPlaceId] = useState("");
    const [endPlaceId, setEndPlaceId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const params = {
            params: {
                min_leave_datetime: values.min_leave_datetime == null ? undefined: values.min_leave_datetime,
                max_leave_datetime: values.max_leave_datetime == null ? undefined : values.max_leave_datetime,
                max_price: values.max_price == "" ? undefined :  values.max_price,
                start_location: startPlaceId == "" ? undefined : startPlaceId,
                start_location_radius: values.start_location_radius,
                end_location: endPlaceId == "" ? undefined : endPlaceId,
                end_location_radius: values.end_location_radius
            }
        }

        axios.get(getBackendURL() + "/rides", params).then(response => {
            props.callback(<List rideInfo={response.data}/>)
        })
      }

    const handleClearSearch = () => {
      var tempDate = new Date();
      tempDate.setHours(tempDate.getHours() - 24);

      setValues({ 
        max_price: "",
        min_leave_datetime: tempDate,
        max_leave_datetime: null,
        start_location: "",
        start_location_radius: sliderRangeDefaultValue,
        end_location: "",
        end_location_radius: sliderRangeDefaultValue
      });

      const params = {
        params: {
          min_leave_datetime: new Date()
        }
      }

      axios.get(getBackendURL() + "/rides", params).then(response => {
        props.callback(<List rideInfo={response.data}/>)
      })
      
    };

    const ref = useOnclickOutside(() => {
      // When user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });

    const handleStartSelect = ({ description, place_id }) => () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
    
        clearSuggestions();
    
        setValues({
          ...values,
          start_location: description,
        });
        setStartPlaceId(place_id);
      };
    
      const handleEndSelect = ({ description, place_id }) => () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
    
        clearSuggestions();
        setValues({
          ...values,
          end_location: description,
        });
        setEndPlaceId(place_id);
      };

    const renderStartSuggestions = (location) =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={
            location === "start_location"
              ? handleStartSelect(suggestion, place_id)
              : handleEndSelect(suggestion, place_id)
          }
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const renderEndSuggestions = (location) =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={
            location === "start_location"
              ? handleStartSelect(suggestion)
              : handleEndSelect(suggestion)
          }
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
          case "start_location":
            setValue(value);
            setLocation("start");
            setValues((prev) => {
              return {
                ...prev,
                [name]: value,
              };
            });
            break;
          case "end_location":
            setValue(value);
            setLocation("end");
            setValues((prev) => {
              return {
                ...prev,
                [name]: value,
              };
            });
            break;
          default:
            break;
        }
      };

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card>
            <ListItemButton onClick={handleExpandClick}>
                <ListItemText primary="Filter Rides" />
                {expanded ? <ExpandLess /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                
                <Grid component="form"
                item
                container 
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                style = {{
                    "border": "2px outset darkgrey",
                    "backgroundColor": "azure",
                }}
                onSubmit = {handleSubmit}
                >
                    
                    <Grid xs={12} item>
                    <Container fixed>
                        <FormLabel component="legend">Rides leaving between</FormLabel>
                        <Stack direction="row" spacing={2} >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                value={values.min_leave_datetime}
                                onChange={handleMinDateTimeInputChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            </LocalizationProvider>
                            <FormLabel xs = {1} component="legend" style={{width: "5px"}}>to</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                value={values.max_leave_datetime}
                                onChange={handleMaxDateTimeInputChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            </LocalizationProvider>
                        </Stack>
                    </Container>
                    </Grid>
                    <Grid xs={6} item>
                        <Container fixed>
                        <div ref={ref}>
                            <input
                            value={values.start_location}
                            name="start_location"
                            onChange={handleInputChange}
                            placeholder="Start Location"
                            className="form-field"
                            autoComplete="off"
                            />
                            {/* We can use the "status" to decide whether we should display the dropdown or not */}
                            {status === "OK" && location === "start" && (
                            <ul>{renderStartSuggestions("start_location")}</ul>
                            )}
                        </div>
                        <Stack direction="row" >
                            <FormLabel component="legend">Start Location Search Radius</FormLabel> 
                            <Tooltip title="Distance in meters to search around your start location.">
                            <HelpIcon/>
                            </Tooltip>
                        </Stack>
                        <Slider onChange={handleStartLocationRangeInputChange} value={values.start_location_radius} defaultValue={sliderRangeDefaultValue} step={250} max={3000} aria-label="Default" valueLabelDisplay="auto" />
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
                        <Stack direction="row" >
                            <FormLabel component="legend">End Location Search Radius</FormLabel> 
                            <Tooltip title="Distance in meters to search around your end location.">
                            <HelpIcon/>
                            </Tooltip>
                        </Stack>
                        <Slider onChange={handleEndLocationRangeInputChange} value={values.end_location_radius} defaultValue={sliderRangeDefaultValue} step={250} max={3000} aria-label="Default" valueLabelDisplay="auto" />
                        </Container>
                    </Grid>
                    
                    <Grid xs={12} item>
                    <Container fixed>
                        <TextField
                        id="max_price" 
                        label="Max Price"
                        type="number"
                        variant="outlined"
                        onChange={handleMaxPriceInputChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        />
                    </Container>
                    </Grid>
                    <Grid item>
                        <Container fixed>
                          <Stack direction="row" spacing={2}>
                            <Button type = "submit" variant="contained">
                                Search
                            </Button>
                            <Button onClick={handleClearSearch} variant="contained">
                                Clear Search
                            </Button>
                          </Stack>
                        </Container>

                    </Grid>
                </Grid>
            </Collapse>
        </Card>
    );
}
