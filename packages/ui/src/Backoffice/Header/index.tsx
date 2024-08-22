import Image from "next/image";
import Link from "next/link";

import type { HeaderProps } from "./type";
import { DropdownNotification } from "./dropdownNotification";
import { DropdownUser } from "./dropdownUser";
import { SearchForm } from "./searchForm";
import React from "react";

export * from "./type";
export const Header = ({
  sidebarOpen,
  setSidebarOpen,
  notifications,
  blockActions,
  translations,
  lng,
  user,
}: HeaderProps) => {
  return (
    <header className="z-999 border-stroke dark:border-stroke-dark dark:bg-gray-dark sticky top-0 flex w-full border-b bg-white">
      <div className="shadow-2 flex flex-grow items-center justify-between px-4 py-5 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            type="button"
            aria-controls="sidebar"
            aria-expanded={sidebarOpen && !blockActions ? "true" : "false"}
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen && !blockActions);
            }}
            title={translations["toggle-sidebar"]}
            className="z-99999 border-stroke dark:border-dark-3 dark:bg-dark-2 block rounded-sm border bg-white p-1.5 shadow-sm lg:hidden"
          >
            <span className="h-5.5 w-5.5 relative block cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`bg-dark delay-[0] relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                  className={`bg-dark relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm delay-150 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                  className={`bg-dark relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm delay-200 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`bg-dark absolute left-2.5 top-0 block h-full w-0.5 rounded-sm delay-300 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!delay-[0] !h-0"
                    }`}
                ></span>
                <span
                  className={`delay-400 bg-dark absolute left-0 top-2.5 block h-0.5 w-full rounded-sm duration-200 ease-in-out dark:bg-white ${!sidebarOpen && "!h-0 !delay-200"
                    }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden xl:block">
          <div>
            <h1 className="text-heading-5 text-dark mb-0.5 font-bold dark:text-white">
              {translations.dashboard}
            </h1>
            <p className="font-medium">{translations.title}</p>
          </div>
        </div>

        <div className="2xsm:gap-4 flex items-center justify-normal gap-2 lg:w-full lg:justify-between xl:w-auto xl:justify-normal">
          {!blockActions && (
            <><ul className="2xsm:gap-4 flex items-center gap-2">
              <DropdownNotification {...user} notifications={notifications} {...translations} lng={lng} />
            </ul><DropdownUser {...user} {...translations} lng={lng} /></>
          )}
        </div>
      </div>
    </header>
  );
};
