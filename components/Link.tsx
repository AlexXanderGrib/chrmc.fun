import classNames from "classnames";
import { default as NextLink, LinkProps } from "next/link";
import { useRouter } from "next/router";

function isInternalHref(href: string) {
  if (!href) return false;

  return href.startsWith("/");
}

export default function Link({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["a"] & Omit<LinkProps, "href" | "passHref">) {
  const router = useRouter();
  locale ??= router.locale;

  const isInternal = isInternalHref(href);
  const classes = classNames("clickable", className);

  if (!isInternal) {
    return (
      <a {...rest} href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <NextLink
      {...{
        as,
        replace,
        scroll,
        shallow,
        prefetch,
        locale
      }}
      href={href}
      passHref
      legacyBehavior
    >
      <a hrefLang={locale} draggable="false" {...rest} className={classes}>
        {children}
      </a>
    </NextLink>
  );
}
