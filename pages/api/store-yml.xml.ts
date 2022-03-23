import { NextApiHandler } from "next";
import { parse, Node } from "node-html-parser";
import { fetchProducts, Product } from "../../server/store";
import prettier from "prettier";
import { render } from 'datocms-structured-text-to-plain-text';

const handler: NextApiHandler = async (req, res) => {
  const data = await fetchProducts("ru", "en", "ru", "RUB");

  const document = parse(
    `
    <?xml version="1.0" encoding="UTF-8"?>
    <yml_catalog date="${new Date().toISOString()}">
      <shop>
        <name>DiCraft Online Store</name>
        <company>Самозанятый Казаков Александр Олегович ИНН 710708547004</company>
        <url>https://dicraft.net</url>
        <email>support@dicraft.net</email>
        <currencies>
          <currency id="RUB" rate="1" />
        </currencies>
        <categories>
        </categories>
        <offers>
        </offers>
      </shop>
    </yml_catalog>
  `.trim()
  );

  const offersEl = document.querySelector("offers");
  const processProduct = (categoryId: number, product: Product) => {
    const xml = `<offer id="${product.id}">
      <name>${product.name}</name>
      <url>https://dicraft.net/ru/store/${product.id}</url>
      <price>${product.price.local.value}</price>
      ${product.image ? `<picture>${product.image}</picture>` : ""}
      <currencyId>${product.price.local.currency}</currencyId>
      <categoryId>${categoryId}</categoryId>
      ${product.description ? `<description>${render(product.description)}</description>` : ''}
      <country_of_origin>Россия</country_of_origin>
    </offer>`;

    offersEl.insertAdjacentHTML("beforeend", xml);
  };

  const categoriesEl = document.querySelector("categories");
  for (const category of data) {
    categoriesEl.insertAdjacentHTML(
      "beforeend",
      `<category id="${category.id}">${category.name}</category>`
    );

    category.products.forEach((product) =>
      processProduct(category.id, product)
    );

    for (const subcategory of category.subcategories) {
      categoriesEl.insertAdjacentHTML(
        "beforeend",
        `<category id="${subcategory.id}" parentId="${category.id}">${subcategory.name}</category>`
      );

      subcategory.products.forEach((product) =>
        processProduct(category.id, product)
      );
    }
  }

  res.writeHead(200, "OK", {
    "Content-Type": "application/xml"
  });
  res.end(
    prettier.format(document.toString(), {
      parser: "html",
      htmlWhitespaceSensitivity: "strict"
    })
  );
};

export default handler;
