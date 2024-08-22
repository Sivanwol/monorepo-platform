"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ClickOutside } from "@app/ui";
import { useDescope } from "@descope/nextjs-sdk/client"

import type { DropdownUserProps } from "./type";
import React from "react";
import { useRouter } from 'next/navigation';
import { Avatar, Button } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

export const DropdownUser = ({
  userAvatar,
  profileLink,
  settingsLink,
  fullname,
  email,
  translations
}: DropdownUserProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter()
  const sdk = useDescope();
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <div className="rounded-full">
          <Avatar
            alt="Remy Sharp"
            src={userAvatar}
            sx={{ width: 48, height: 48 }}
          />
        </div>

        <span className="text-dark dark:text-dark-6 flex items-center gap-2 font-medium">
          <span className="hidden lg:block">{fullname}</span>

          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen && "rotate-180"}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
              fill=""
            />
          </svg>
        </span>
      </div>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`mt-7.5 border-stroke shadow-default dark:border-dark-3 dark:bg-gray-dark absolute right-0 flex w-[280px] flex-col rounded-lg border-[0.5px] bg-white`}
        >
          <div className="pb-5.5 flex items-center gap-2.5 px-5 pt-3.5">
            <span className="relative block h-12 w-12 rounded-full">
              <Image
                width={112}
                height={112}
                src={userAvatar}
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
                className="overflow-hidden rounded-full"
              />

              <span className="bg-green dark:border-gray-dark absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white"></span>
            </span>

            <span className="block">
              <span className="text-dark block font-medium dark:text-white">
                {fullname}
              </span>
              <span className="text-dark-5 dark:text-dark-6 block font-medium">
                {email}
              </span>
            </span>
          </div>
          <ul className="border-stroke dark:border-dark-3 flex flex-col gap-1 border-y-[0.5px] p-2.5">
            <li>
              <Link
                href={profileLink}
                className="text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium duration-300 ease-in-out dark:hover:text-white lg:text-base"
              >
                <FaUserCircle />
                {translations.userProfile}
              </Link>
            </li>

            <li>
              <Link
                href={settingsLink}
                className="text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium duration-300 ease-in-out dark:hover:text-white lg:text-base"
              >
                <IoSettingsSharp />
                {translations.userSettings}
              </Link>
            </li>
          </ul>
          <div className="p-2.5">
            <Button size="large" fullWidth
              onClick={() => {
                sdk.logout();
                setDropdownOpen(false);
                router.replace("/en/auth");
              }}
            >
              <MdLogout />
              {translations.userLogout}
            </Button>
          </div>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};
