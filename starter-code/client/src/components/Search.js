import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';



export default function SearchAppBar() {
    const [search,setSearch] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if(search != ""){
            console.log(search); 
        } 
      }
    return (
        <Box display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <form 
                autoComplete="off" onSubmit = {handleSubmit}
            >
                <TextField 
                    onChange={(e) => setSearch(e.target.value)}
                    id="Search-bar" 
                    label="Search" 
                    variant="outlined"
                />

                <IconButton type = "submit" size="large" aria-label="search" color="inherit">
                    <SearchIcon />
                </IconButton>
            </ form>
        </Box>
    );
}