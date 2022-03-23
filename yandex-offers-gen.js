const { Tebex } = require("tebex");
const dotenv = require("dotenv");
const prettier = require("prettier");

dotenv.config();

async function main() {
  const tebex = new Tebex(process.env.TEBEX_STORE_SECRET);

  const [information, listing, packages] = await Promise.all([
    tebex.information.get(),
    tebex.listing.get(),
    tebex.packages.get()
  ]);

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${new Date().toISOString()}">
  <shop>
    <name>${information.account.name}</name>
    <company>Самозанятый Казаков Александр Олегович ИНН 710708547004</company>
    <url>https://dicraft.net</url>
    <email>support@dicraft.net</email>
    <currencies>
      <currency id="${information.account.currency.iso_4217}" rate="1"/>
    </currencies>
    <categories>
      ${listing
        .map((category) => {
          const subs = category.subcategories
            .map(
              (sub) =>
                `<category id="${sub.id}"${
                  category.only_subcategories
                    ? ""
                    : ` parentId="${category.id}"`
                }>${sub.name}</category>`
            )
            .join("\n");

          if (category.only_subcategories) {
            return subs;
          }

          return `<category id="${category.id}">${category.name}</category>\n${subs}`;
        })
        .join("\n")}
    </categories>
    <offers>
      ${packages
        .map((pkg) => {
          return `<offer id="${pkg.id}">
          <name>${pkg.name}</name>
          <url>https://dicraft.net/ru/purchase/${pkg.id}</url>
          <price>${pkg.price}</price>
          ${pkg.image ? `<picture>${pkg.image}</picture>` : ""}
          <currencyId>${information.account.currency.iso_4217}</currencyId>
          <categoryId>${pkg.category.id}</categoryId>
          <country_of_origin>Россия</country_of_origin>
        </offer>`;
        })
        .join("\n")}
    </offers>
  </shop>
</yml_catalog>`;

  console.log(
    prettier.format(content, {
      parser: "html",
      htmlWhitespaceSensitivity: "strict"
    })
  );
}

main();
