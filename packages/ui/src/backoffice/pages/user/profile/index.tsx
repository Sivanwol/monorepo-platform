"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";

import type { UserProfilePageProps } from "@app/utils";

export const UserProfilePage = ({
  user,
  userId,
  lng,
  ns,
  translations,
}: UserProfilePageProps) => {
  const [editMode, setEditMode] = useState(false);
  const firstNameEditRender = (
    <FormControl sx={{ width: "25ch" }}>
      <InputLabel htmlFor="firstName" shrink>
        {translations.firstName}
      </InputLabel>
      <Input
        id="firstName"
        aria-describedby="my-helper-text"
        value={user.firstName}
      />
    </FormControl>
  );
  const firstNameViewRender = (
    <>
      <Typography variant="h4" component="div">
        {translations.firstName}
      </Typography>
      <div className="text-sm font-medium">
        <Typography gutterBottom variant="inherit" component="div">
          {user.firstName}
        </Typography>
      </div>
    </>
  );
  const lastNameEditRender = (
    <>
      <FormControl sx={{ width: "25ch" }}>
        <InputLabel htmlFor="lastName" shrink>
          {translations.lastName}
        </InputLabel>
        <Input
          id="lastName"
          aria-describedby="my-helper-text"
          value={user.lastName}
        />
      </FormControl>
    </>
  );
  const lastNameViewRender = (
    <>
      <Typography variant="h4" component="div">
        {translations.lastName}
      </Typography>
      <div className="text-sm font-medium">
        <Typography gutterBottom variant="inherit" component="div">
          {user.lastName}
        </Typography>
      </div>
    </>
  );
  const renderPage = (
    <Box sx={{ width: "100%" }}>
      <form>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              {!editMode ? firstNameViewRender : firstNameEditRender}
            </div>
            <div className="grid gap-2">
              {!editMode ? lastNameViewRender : lastNameEditRender}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant={editMode ? "contained" : "outlined"}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? translations.actionView : translations.actionEdit}
          </Button>
          {editMode && (
            <Button type="submit" className="ml-auto">
              {translations.actionSubmit}
            </Button>
          )}
        </div>
      </form>
    </Box>
  );
  return renderPage;
};
