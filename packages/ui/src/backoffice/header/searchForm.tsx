"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, TextField } from "@mui/material";

export const SearchForm = () => {
  return (
    <>
      <li className="hidden lg:block">
        <Box
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <TextField
            sx={{ ml: 1, flex: 1 }}
            size="medium"
            variant="filled"
            placeholder="Search"
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
      </li>
    </>
  );
};
