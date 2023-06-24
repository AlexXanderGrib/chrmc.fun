import Link from "./Link";
import {
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  CursorArrowRaysIcon,
  ClipboardIcon,
  MapIcon,
  ShoppingCartIcon
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import classNames from "classnames";
import { If } from "./If";
import {
  ComponentProps,
  JSXElementConstructor,
  PropsWithChildren
} from "react";
import { useTranslation } from "../i18n";

type IconComponent = JSXElementConstructor<ComponentProps<"svg">>;

type FooterBlockProps = PropsWithChildren<{
  label: string;
  icon?: IconComponent;
  links?: [
    label: string,
    link: string,
    Icon?: IconComponent,
    props?: ComponentProps<"a">
  ][];
}>;

function FooterBlock({
  label,
  links = [],
  children,
  icon: Icon
}: FooterBlockProps) {
  const iconFrag = Icon ? <Icon className="w-5 h-5 inline" /> : null;

  return (
    <article>
      <h3 className="text-white font-bold text-xl mb-4 flex gap-2 justify-start items-center">
        {iconFrag} {label}
      </h3>
      <If condition={links?.length > 0}>
        <ul className="flex flex-col gap-4">
          {links.map(([label, link, Icon, props]: any) => {
            const icon = Icon ? (
              <Icon className="text-primary-400 w-5 h-5 inline" />
            ) : (
              <span className="text-primary-400 select-none" aria-hidden="true">
                ■
              </span>
            );

            props = {
              ...props,
              className: classNames(
                "text-gray-400 hover:text-primary-400 transition-colors duration-150 !select-auto",
                props?.className ?? ""
              )
            };

            return (
              <li key={label}>
                <Link {...props} href={link} draggable="true">
                  <span className="select-none">{icon} </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </If>
      {children}
    </article>
  );
}

export default function Footer() {
  const { footer: t, common: ts } = useTranslation();
  const router = useRouter();

  return (
    <footer
      itemProp="author"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="bg-indigo-700">
        <div className="flex flex-col md:flex-row items-center md:justify-between max-w-5xl mx-auto px-16 py-8 gap-8">
          <button
            className="flex overflow-hidden rounded-lg text-white items-stretch clickable filter active:brightness-110"
            title={ts.join.actions.copy}
            onClick={() => navigator.clipboard.writeText(ts.server.ip)}
          >
            <span className="px-4 py-2 bg-indigo-800 font-bold uppercase">
              {ts.server.ip}
            </span>
            <span className="px-4 py-2 bg-indigo-900 flex justify-center items-center">
              <ClipboardIcon
                className="w-5 h-5"
                aria-label={ts.join.actions.copy}
              />
            </span>
          </button>
          <ul
            className="flex gap-8 flex-wrap justify-center"
            aria-label={t.socials.title}
            title={t.socials.title}
          >
            <li>
              <a
                href="https://discord.gg/V6dCEUhsbt"
                rel="noreferrer noopener me"
                target="_blank"
                className="clickable group"
                title={t.socials.discord}
              >
                <img
                  src="/images/icons/Discord.svg"
                  alt={t.socials.discord}
                  draggable="false"
                  loading="eager"
                  width="32"
                  height="32"
                  className="opacity-50 group-hover:opacity-80 group-focus:opacity-80 transition-opacity"
                />
              </a>
            </li>
            <li>
              <a
                href="https://t.me/dme_sup"
                rel="noreferrer noopener me"
                target="_blank"
                className="clickable group"
                title={t.socials.telegram}
              >
                <img
                  src="/images/icons/Telegram.svg"
                  alt={t.socials.telegram}
                  draggable="false"
                  loading="eager"
                  width="32"
                  height="32"
                  className="opacity-50 group-hover:opacity-80 group-focus:opacity-80 transition-opacity"
                />
              </a>
            </li>
            <li>
              <a
                href="https://vk.com/dicraft.server"
                rel="noreferrer noopener me"
                target="_blank"
                className="clickable group"
                title={t.socials.vk}
              >
                <img
                  src="/images/icons/VK.svg"
                  alt={t.socials.vk}
                  draggable="false"
                  loading="eager"
                  width="32"
                  height="32"
                  className="opacity-50 group-hover:opacity-80 group-focus:opacity-80 transition-opacity"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-800">
        <div className="flex flex-row flex-wrap max-w-5xl mx-auto p-16 gap-8 justify-between">
          <FooterBlock
            label={t.contacts.title}
            links={[
              [
                "+7 (995) 488-83-15",
                "tel:+79954888315",
                PhoneIcon,
                {
                  itemProp: "telephone",
                  "aria-label": t.contacts.phone,
                  title: t.contacts.phone
                }
              ],
              [
                "support@dicraft.net",
                "mailto:support@dicraft.net",
                EnvelopeIcon,
                {
                  itemProp: "email",
                  "aria-label": t.contacts.email,
                  title: t.contacts.email
                }
              ]
            ]}
          />

          <If condition={router.locales?.length > 0}>
            <FooterBlock label={t.lang.title} icon={GlobeAltIcon}>
              <select
                defaultValue={router.locale ?? router.defaultLocale}
                onChange={(e) => {
                  router.push(router.asPath, router.asPath, {
                    locale: e.target.value
                  });
                }}
                className="max-w-full w-full select-none rounded"
              >
                {router.locales.map((locale) => (
                  <option value={locale} key={locale}>
                    {locale} - {t.lang[locale] ?? locale}
                  </option>
                ))}
              </select>
            </FooterBlock>
          </If>
        </div>
      </div>

      <div className="bg-gray-900">
        <div className="flex flex-row flex-wrap max-w-3xl mx-auto px-16 py-8 gap-8 text-gray-300">
          <span itemProp="name">{ts.server.name}</span> © 2021-
          {new Date().getFullYear()}
          <div className="flex flex-row flex-wrap text-gray-400">
            <span>{t.disclaimer.trademarks}</span>

            <br />
            <span>{t.disclaimer.mojang}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
