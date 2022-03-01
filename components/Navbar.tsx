import { Disclosure, Popover, Transition } from "@headlessui/react";
import { MenuIcon, ChevronDownIcon, XIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function NavBar({ transparent = false, dark = false }) {
  const { t } = useTranslation("nav");
  const { t: fs } = useTranslation("footer");
  const { t: ts } = useTranslation("common");
  const { locale } = useRouter();

  const navigation = {
    [fs("links.title")]: [{ name: fs("links.donate"), href: "/donate" }],
    [fs("documents.title")]: [
      { name: fs("documents.rules"), href: "/articles/documents/rules" },
      { name: fs("documents.parents"), href: "/articles/documents/parents" }
    ]
  };

  return (
    <Popover
      className={classNames("relative", {
        "bg-white": !transparent,
        dark
      })}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" passHref locale={locale}>
              <a className="clickable" draggable="false" hrefLang={locale}>
                <span className="sr-only">{ts("server.name")}</span>
                <img
                  className="h-8 w-auto sm:h-10 rounded"
                  src="/logo-40.jpg"
                  srcSet="/logo-80.jpg 2x"
                  alt=""
                  width="40"
                  height="40"
                />
              </a>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="clickable bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">{t("menu.open")}</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden md:flex space-x-10">
            {Object.keys(navigation).map((key) => (
              <Popover className="relative" key={key}>
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? "text-gray-900" : "text-gray-500",
                        "clickable group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      )}
                    >
                      <span>{key}</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? "text-gray-600" : "text-gray-400",
                          "ml-2 h-5 w-5 group-hover:text-gray-500"
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                            {navigation[key as keyof typeof navigation].map(
                              (item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  locale={locale}
                                  passHref
                                >
                                  <a
                                    className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 clickable"
                                    draggable="false"
                                    hrefLang={locale}
                                  >
                                    <div className="ml-4">
                                      <p className="text-base font-medium text-gray-900">
                                        {item.name}
                                      </p>
                                    </div>
                                  </a>
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            ))}
          </Popover.Group>

          <div className="hidden md:block w-24"></div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-10"
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto rounded"
                    src="/logo-40.jpg"
                    srcSet="/logo-80.jpg 2x"
                    width="40"
                    height="40"
                    alt={ts("server.name")}
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="clickable bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                    <span className="sr-only">{t("menu.close")}</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {Object.keys(navigation).map((key) => (
                    <Disclosure key={key}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="clickable -m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                            {key}{" "}
                            <ChevronDownIcon
                              className={classNames(
                                "text-gray-400 transition-transform duration-150 w-5 h-5",
                                { "rotate-180": open }
                              )}
                            />
                          </Disclosure.Button>
                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Disclosure.Panel>
                              {navigation[key as keyof typeof navigation].map(
                                (item) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    passHref
                                    locale={locale}
                                  >
                                    <a
                                      className="clickable -m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                                      hrefLang={locale}
                                      draggable="false"
                                    >
                                      <span className="ml-3 text-base font-medium text-gray-900">
                                        {item.name}
                                      </span>
                                    </a>
                                  </Link>
                                )
                              )}
                            </Disclosure.Panel>
                          </Transition>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
