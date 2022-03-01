import Link from "./Link";
import {
  MailIcon,
  PhoneIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  DeviceMobileIcon,
  DesktopComputerIcon,
  GlobeAltIcon,
  VolumeUpIcon,
  ChatAlt2Icon,
  CursorClickIcon
} from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import classNames from "classnames";
import { If } from "./If";

function FooterBlock({ label, links = [], children, icon: Icon }: any) {
  const { locale } = useRouter();
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
                "text-gray-400 hover:text-primary-400 transition-colors duration-150",
                props?.className ?? ""
              )
            };

            return (
              <li key={label}>
                <Link {...props} href={link}>
                  {icon} {label}
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
  const { t } = useTranslation("footer");
  const { t: ts } = useTranslation("common");
  const router = useRouter();

  return (
    <footer
      itemProp="author"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="bg-gray-800">
        <section className="flex flex-row flex-wrap max-w-5xl mx-auto p-16 gap-8 justify-between">
          <FooterBlock
            label={t("links.title")}
            links={[
              [t("links.donate"), "/donate", ShoppingBagIcon],
              [
                t("links.discord"),
                "https://discord.gg/V6dCEUhsbt",
                VolumeUpIcon,
                { rel: "noopener noreferrer", target: "_blank" }
              ],
              [
                t("links.vk"),
                "https://vk.com/chrome_mc",
                ChatAlt2Icon,
                { rel: "noopener me", target: "_blank" }
              ]
            ]}
          />
          <FooterBlock
            label={t("join.title")}
            links={[
              [
                t("join.java"),
                "/articles/guides/how-to-join-from-java-edition",
                DesktopComputerIcon
              ],
              [
                t("join.bedrock"),
                "/articles/guides/how-to-join-from-bedrock",
                DeviceMobileIcon
              ],
              [
                t("join.consoles"),
                "/articles/guides/how-to-join-from-consoles",
                GlobeAltIcon
              ],
              [
                t("join.bedrock-add"),
                `minecraft://?addExternalServer=${ts("server.name")}|${ts(
                  "server.ip"
                )}:${ts("server.bedrockPort")}`,
                CursorClickIcon
              ]
            ]}
          />
          <FooterBlock
            label={t("contacts.title")}
            links={[
              [
                "+7 (995) 488-83-15",
                "tel:+79954888315",
                PhoneIcon,
                {
                  itemProp: "telephone",
                  "aria-label": t("contacts.phone"),
                  title: t("contacts.phone")
                }
              ],
              [
                "support@chrmc.fun",
                "mailto:support@chrmc.fun",
                MailIcon,
                {
                  itemProp: "email",
                  "aria-label": t("contacts.email"),
                  title: t("contacts.email")
                }
              ]
            ]}
          />
          <FooterBlock
            label={t("documents.title")}
            links={[
              [
                t("documents.rules"),
                "/articles/documents/rules",
                DocumentTextIcon
              ],
              [
                t("documents.agreement"),
                "/articles/documents/agreement",
                DocumentTextIcon
              ],
              [
                t("documents.privacy"),
                "/articles/documents/privacy",
                DocumentTextIcon
              ],
              [
                t("documents.parents"),
                "/articles/documents/parents",
                DocumentTextIcon
              ]
            ]}
          />
          <If condition={router.locales?.length > 0}>
            <FooterBlock label={t("lang.title")} icon={GlobeAltIcon}>
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
                    {locale} - {t(`lang.${locale}`, locale)}
                  </option>
                ))}
              </select>
            </FooterBlock>
          </If>
        </section>
      </div>
      <div className="bg-gray-900">
        <section className="flex flex-row flex-wrap max-w-3xl mx-auto px-16 py-8 gap-8 text-gray-400">
          <span itemProp="name">{ts("server.name")}</span> ©{" "}
          {new Date().getFullYear()}
          <div className="flex flex-row flex-wrap text-gray-500">
            <span>{t("disclaimer.trademarks")}</span>

            <br />
            <span>{t("disclaimer.mojang")}</span>
          </div>
        </section>
      </div>
    </footer>
  );
}
