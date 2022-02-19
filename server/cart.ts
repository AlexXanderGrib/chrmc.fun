import { sum, calculate } from "@xxhax/safe-math";

export class Product {
  static fromJson(json: Product) {
    return new this(json.id, json.name, json.price);
  }

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number
  ) {}
}

export class Cart {
  static fromJSON(json: ReturnType<Cart["toJSON"]>): Cart {
    const cart = new this();

    cart.quantities = json.qty;
    cart.references = json.ref;
    cart.meta = json.meta ?? {};

    return cart;
  }

  quantities: Record<Product["id"], number> = {};
  references: Product[] = [];
  meta: Record<string, string> = {};

  add(product: Product) {
    if (!this.references.find((p) => p.id === product.id)) {
      this.references.push(product);
    }

    this.quantities[product.id] ??= 0;
    this.quantities[product.id]++;

    return this;
  }

  remove(product: Product) {
    this.quantities[product.id] ??= 0;
    this.quantities[product.id]--;

    if ((this.quantities[product.id] ?? 0) < 1) {
      this.references = this.references.filter((p) => p.id !== product.id);
    }

    return this;
  }

  entries(): IterableIterator<[product: Product, quantity: number]> {
    const map = new Map<Product, number>();

    Object.keys(this.quantities).forEach((key) => {
      const id = parseInt(key);
      const ref = this.references.find((p) => p.id === id);
      const quantity = this.quantities[id];

      if (ref && quantity) map.set(ref, quantity);
    });

    return map.entries();
  }

  clear() {
    this.quantities = {};
    this.references = [];

    return this;
  }

  clone(): Cart {
    return Cart.fromJSON(JSON.parse(JSON.stringify(this)));
  }

  toJSON() {
    return {
      type: "cart",
      ref: this.references,
      qty: this.quantities,
      meta: this.meta
    };
  }

  get size() {
    return Object.values(this.quantities).reduce((a, b) => a + b);
  }

  get uniques() {
    return this.references.length;
  }

  get total() {
    const products = Array.from(this.entries());
    if (products.length === 0) return 0;

    return products.reduce(
      (acc, [product, quantity]) =>
        sum(
          acc,
          calculate(product.price, quantity, (a, b) => a * b)
        ),
      0
    );
  }
}
