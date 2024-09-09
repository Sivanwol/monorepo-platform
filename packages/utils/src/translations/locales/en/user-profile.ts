import type { DynamicStructure } from "../../type";

const translate: DynamicStructure = {
  title: "User Profile",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  gender: "Gender",
  aboutMe: "User About",
  actions: {
    edit: "Edit",
    view: "View",
    submit: "Submit",
    cancel: "Cancel",
  },
  errors: {
    firstName: "First Name is required",
    lastName: "Last Name is required",
    email: "Email is required",
  },
};

export default translate;
