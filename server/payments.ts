import { normalize } from "./strings";
import type { Cart } from "./cart";
import { createHmac } from "crypto";

let Authorization = "";
export const setAuth = (auth: string) => {
  Authorization = auth;
};

export async function encrypt(buffer: Buffer) {
  const response = await fetch(
    `https://kms.yandex/kms/v1/keys/${process.env.KMS_KEY_ID}:encrypt`,
    {
      method: "POST",
      headers: { Authorization, "Content-Type": "application/json" },
      body: JSON.stringify({
        plaintext: buffer.toString("base64")
      })
    }
  );

  const { ciphertext: base64 } = await response.json();
  const ciphertext = Buffer.from(base64, "base64");

  return ciphertext;
}

export async function decrypt(buffer: Buffer) {
  const response = await fetch(
    `https://kms.yandex/kms/v1/keys/${process.env.KMS_KEY_ID}:decrypt`,
    {
      method: "POST",
      headers: { Authorization, "Content-Type": "application/json" },
      body: JSON.stringify({
        ciphertext: buffer.toString("base64")
      })
    }
  );

  const { plaintext: base64 } = await response.json();
  const plaintext = Buffer.from(base64, "base64");

  return plaintext;
}

export async function createPaymentLink(
  nickname: number,
  cart: Cart
): Promise<[url: string, qr: string]> {
  const orderId = `${
    process.env.XHT_PAY_MERCHANT_ID
  }:${nickname}:${Date.now()}`;
  const hmac = createHmac("SHA256", process.env.XHT_PAY_MERCHANT_TOKEN)
    .update(orderId)
    .digest();

  const signature = await encrypt(hmac);

  const receipt: {
    name: string;
    price: number;
    quantity: number;
    sku: string;
  }[] = Array.from(cart.entries()).map(([product, quantity]) => {
    let name = normalize(product.name);
    if (name && name[0]) name = name[0].toUpperCase() + name.slice(1);
    return {
      quantity,
      name,
      price: Math.round(product.price * 100),
      sku: product.id.toString()
    };
  });

  const details = {
    id: orderId,
    lifetimeDays: 3,
    receipt,
    comment: `Оплата на сервер Minecraft: Chrome MC`,
    meta: {
      nickname: nickname.toString()
    },
    webhookUrl: "https://chrmc.fun/api/pay/callback"
  };

  const response = await fetch(
    `https://api.xxhax.com/pay?merchantId=${process.env.XHT_PAY_MERCHANT_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": encodeURIComponent(signature.toString("base64"))
      },
      body: JSON.stringify(details)
    }
  );

  const {
    payload: { id }
  } = await response.json();
  return [
    `https://pay.xxhax.com/bill/?id=${id}`,
    `https://api.xxhax.com/pay?id=${id}&act=qr`
  ];
}
