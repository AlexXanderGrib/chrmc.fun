import * as functions from "firebase-functions";
import {checkPlayer as check} from "./player";
import {rcon as rc} from "./rcon";

export const player = functions.https.onRequest(async (req, res) => {
  res.json(await check(req.query.type as any, req.query.username as string));
});

export const rcon = functions.https.onRequest(async (req, res) => {
  const response = await rc(req.query.command as string);

  res.send(response).end();
});
