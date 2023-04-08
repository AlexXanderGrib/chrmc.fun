import { Translation } from "../types";

export const ru = {
  article: {
    updatedAt: "От"
  },

  common: {
    seo: {
      description:
        "Приватный лицензионный майнкрафт сервер на 1.19 java и bedrock (пе) с режимами: Выживание (СМП) и Ролеплей в городе (РП)",
      keywords:
        "DiCraft, майнкрафт сервер, майнкрафт выживание, майнкрафт пе сервер, майнкрафт ролеплей, майнкрафт рп",
      title: "DiCraft • 1.19 • Приватный СМП | РП"
    },
    server: {
      ip: "play.dicraft.net",
      name: "DiCraft",
      javaPort: "25565",
      javaVersion: "1.19.3",
      bedrockPort: "19132"
    },
    join: {
      address: "Адрес (IP)",
      port: "Порт",
      version: "Версия",
      actions: {
        "bedrock-join": "Добавить этот сервер",
        "how-to-join": "Как присоеденится?",
        copy: "Копировать"
      }
    },
    actions: {
      read: "Читать"
    },
    guides: {
      java: {
        title: "С JavaEdition"
      },
      bedrock: {
        title: "С BedrockEdition"
      },
      consoles: {
        title: "С Игровых Консолей",
        article: {
          title: "Гайд",
          thumbnail:
            "https://sun9-41.userapi.com/impg/zpjzKOgS5dtE6nagTLYAPdCamyqbnkhUQNQdLQ/-izrrRGdCRE.jpg?size=604x402&quality=96&sign=24116670c5667031028be993118c21a0&type=album",
          link: "https://vk.com/@chrome_mc-join-from-xbox"
        }
      }
    }
  },
  error: {
    "404": "Страница не найдена",
    "500": "Ошибка сервера"
  },
  footer: {
    contacts: {
      title: "Поддержка",
      email: "Электронная почта",
      phone: "Номер телефона"
    },
    documents: {
      title: "Документы",
      agreement: "Пользовательское Соглашение",
      privacy: "Политика конфиденциальности",
      parents: "Для Родителей",
      rules: "Правила Сервера"
    },
    join: {
      title: "Играть",
      java: "С Java",
      bedrock: "С Bedrock",
      consoles: "С Консолей",
      "bedrock-add": "Открыть в Bedrock"
    },
    socials: {
      title: "Соц. сети",
      instagram: "Инстаграм",
      tiktok: "ТикТок",
      vk: "ВКонтакте",
      discord: "Дискорд"
    },
    links: {
      title: "Ресурсы",
      store: "Донат",
      "city-map": "Карта Города",
      "survival-map": "Карта Выживания"
    },
    lang: {
      title: "Язык",
      ru: "Русский",
      en: "English"
    },
    disclaimer: {
      trademarks:
        "Все права сохранены, все торговые марки являются собственностью их владельцев.",
      mojang:
        "DiCraft (бывш. Chrome MC) не аффилирован и не может быть ассоциирован с Mojang и Microsoft"
    }
  },
  index: {
    advantages: "Наши преимущества",
    buy: {
      title: "Купить Проходку",
      expires: "Истекает"
    }
  },

  nav: {
    menu: {
      open: "Открыть меню",
      close: "Закрыть меню"
    }
  },

  shop: {
    shop: "Донат",
    forever: "Навсегда",
    expires: "Истекает",
    "select-currency": "Выберите валюту",
    buy: "Купить"
  }
} satisfies Translation;
