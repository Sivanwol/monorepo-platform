"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MdGMobiledata,
  MdNotifications,
  MdNotificationsNone,
} from "react-icons/md";

import { ClickOutside } from "@app/ui";

import type { DropdownNotificationProps } from "./type";

export const parseTypeToIcon = (type: string) => {
  switch (type) {
    case "info":
      return <MdNotifications />;
    case "warning":
      return <MdNotificationsNone />;
    default:
      return <MdGMobiledata />;
  }
};

export const DropdownNotification = ({
  lng,
  notifications,
  translations,
}: DropdownNotificationProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const hasNewNotifications = notifications.filter((n) => !n.read).length > 0;
  return (
    <ClickOutside
      onClick={() => setDropdownOpen(false)}
      className="relative hidden sm:block"
    >
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          href="javascript:void(0)"
          className="border-stroke bg-gray-2 text-dark dark:border-dark-4 dark:bg-dark-3 relative flex h-12 w-12 items-center justify-center rounded-full border hover:text-primary dark:text-white dark:hover:text-white"
        >
          <span className="relative">
            {hasNewNotifications ? (
              <MdNotifications />
            ) : (
              <MdNotificationsNone className="h-6 w-6 text-lg" />
            )}
            <span
              className={`z-1 border-gray-2 bg-red-light dark:border-dark-3 absolute -top-0.5 right-0 h-2.5 w-2.5 rounded-full border-2 ${!notifying ? "hidden" : "inline"}`}
            >
              <span className="-z-1 bg-red-light absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
            </span>
          </span>
        </Link>

        {dropdownOpen && (
          <div
            className={`-right-27 mt-7.5 w-75 border-stroke px-5.5 pb-5.5 shadow-default dark:border-dark-3 dark:bg-gray-dark absolute flex h-[550px] flex-col rounded-xl border-[0.5px] bg-white pt-5 sm:right-0 sm:w-[364px]`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-dark text-lg font-medium dark:text-white">
                {translations.notificationsTitle}
              </h5>
              <span className="text-body-xs rounded-md bg-primary px-2 py-0.5 font-medium text-white">
                {translations.notificationsNew}
              </span>
            </div>

            <ul
              className="no-scrollbar mb-5 flex h-auto flex-col gap-1 overflow-y-auto"
              style={{ zIndex: 10 }}
            >
              {notifications.length === 0 && (
                <>
                  <li key={0}>
                    <span className="block">
                      <span className="text-dark block font-medium dark:text-white">
                        {translations.notificationsEmpty}
                      </span>
                    </span>
                  </li>
                </>
              )}
              {notifications.length !== 0 &&
                notifications.map((item, index) => (
                  <li key={index}>
                    <Link
                      className="hover:bg-gray-2 dark:hover:bg-dark-3 flex items-center gap-4 rounded-[10px] p-2.5"
                      href="#"
                    >
                      <span className="block h-14 w-14 rounded-full">
                        {parseTypeToIcon(item.type)}
                      </span>

                      <span className="block">
                        <span className="text-dark block font-medium dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-body-sm text-dark-5 dark:text-dark-6 block font-medium">
                          {item.body}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>

            <Link
              className="hover:bg-blue-light-5 dark:border-dark-4 dark:text-dark-6 dark:hover:bg-blue-light-3 flex items-center justify-center rounded-[7px] border border-primary p-2.5 font-medium text-primary dark:hover:border-primary dark:hover:text-primary"
              href={`/${lng}/platform/notifications/list`}
            >
              {translations.notificationsViewAll}
            </Link>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};
