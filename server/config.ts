import { GraphQLClient } from "graphql-request";
import { Tebex } from "tebex";

export const datocms = new GraphQLClient('https://graphql.datocms.com/', {
  headers: {
    authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`
  }
})
export const tebex = new Tebex(process.env.TEBEX_STORE_SECRET);