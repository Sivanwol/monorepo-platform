"use client";

import * as React from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { BiHelpCircle } from "react-icons/bi";
import * as Icons from "react-icons/hi2";

import type { MenuGroup, SidebarProps } from "./type";

export * from "./type";

export const SideItemNoCollapsed = ({
  group,
  rootIndex,
}: {
  group: MenuGroup;
  rootIndex: number;
}) => {
  const Icon = Icons[group.icon as keyof typeof Icons];
  return (
    <ListItemButton href={group.route ?? ""}>
      <ListItemText primary={group.label} />
    </ListItemButton>
  );
};

export const SideItemWithChildren = ({
  group,
  rootIndex,
}: {
  group: MenuGroup;
  rootIndex: number;
}) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={group.label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding key={"submenu_" + rootIndex}>
          {group.items.map((t, index) => (
            <ListItemButton sx={{ pl: 4 }} href={t.route || ""}>
              <ListItemText secondary={t.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export const SidebarArea = ({
  sidebarOpen,
  setSidebarOpen,
  items,
  lng,
  translations,
}: SidebarProps) => {
  return (
    <aside
      className={` w-72.5 border-stroke dark:border-stroke-dark dark:bg-gray-dark absolute left-0 top-0 flex h-screen flex-col overflow-y-auto border-r bg-white lg:static lg:translate-x-0 ${sidebarOpen
        ? "translate-x-0 duration-300 ease-linear"
        : "-translate-x-full"
        }`}
      style={{ zIndex: 10 }}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="py-5.5 lg:py-6.5 flex items-center justify-between gap-2 px-6 xl:py-10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden"
          title={translations.toggleSidebar}
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <List
        key="sidemenu"
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="sidemenu-subheader">
            {translations.shortTitle}
          </ListSubheader>
        }
      >
        {items.map((group, groupIndex) => (
          <>
            {group.items.length === 0 && (
              <SideItemNoCollapsed
                key={"itemsGroup_" + groupIndex}
                group={group}
                rootIndex={groupIndex}
              />
            )}
            {group.items.length > 0 && (
              <SideItemWithChildren
                key={"itemsGroup_" + groupIndex}
                group={group}
                rootIndex={groupIndex}
              />
            )}
          </>
        ))}
        <Divider />

        <ListItemButton href={`/${lng}/platform/support`}>
          <ListItemIcon>
            <BiHelpCircle />
          </ListItemIcon>
          <ListItemText primary={translations.support} />
        </ListItemButton>
      </List>
    </aside>
  );
};
