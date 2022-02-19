import Link from "next/link";
import {
  MailIcon,
  PhoneIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  DeviceMobileIcon,
  DesktopComputerIcon,
  GlobeAltIcon
} from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

function FooterBlock({ label, links }: any) {
  const { locale } = useRouter();

  return (
    <article>
      <h3 className="text-white font-bold text-xl mb-4">{label}</h3>
      <ul className="flex flex-col gap-4">
        {links.map(([label, link, Icon]: any) => (
          <li key={label}>
            {link?.startsWith("/") ? (
              <Link href={link} locale={locale}>
                <a className="text-gray-400 hover:text-primary-400 transition-colors duration-150">
                  {Icon ? (
                    <Icon className="text-primary-400 w-5 h-5 inline" />
                  ) : (
                    <span className="text-primary-400">■</span>
                  )}{" "}
                  {label}
                </a>
              </Link>
            ) : (
              <a
                className="text-gray-400 hover:text-primary-400 transition-colors duration-150"
                href={link}
              >
                {Icon ? (
                  <Icon className="text-primary-400 w-5 h-5 inline" />
                ) : (
                  <span className="text-primary-400">■</span>
                )}{" "}
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Footer() {
  const { t } = useTranslation("footer");
  const { t: ts } = useTranslation("common");

  return (
    <footer>
      <div className="bg-gray-800">
        <section className="flex flex-row flex-wrap max-w-5xl mx-auto p-16 gap-8 justify-between">
          <FooterBlock
            label={t("links.title")}
            links={[
              [t("links.donate"), "/donate", ShoppingBagIcon],
              [t("links.discord"), "https://discord.gg/V6dCEUhsbt"],
              [t("links.vk"), "https://vk.com/chrome_mc"]
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
                `minecraft://?addExternalServer=${t("server.name")}|${t(
                  "server.ip"
                )}:${t("server.bedrockPort")}`,
                DeviceMobileIcon
              ]
            ]}
          />
          <FooterBlock
            label={t("contacts.title")}
            links={[
              ["+7 (995) 488-83-15", "tel:+79954888315", PhoneIcon],
              ["support@chrmc.fun", "mailto:support@chrmc.fun", MailIcon]
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
        </section>
      </div>
      <div className="bg-gray-900">
        <section className="flex flex-row flex-wrap max-w-3xl mx-auto px-16 py-8 gap-8 text-gray-400">
          {ts("server.name")} © {new Date().getFullYear()}
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
