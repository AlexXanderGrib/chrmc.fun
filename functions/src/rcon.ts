import {Rcon} from "rcon-client";

let client: Rcon;

/**
 *
 *
 */
async function init() {
  const url = new URL(process.env.RCON_URL || "");


  client = await Rcon.connect({
    host: url.hostname,
    password: url.password,
    port: parseInt(url.port) || 25_575,
  });
}
/**
 *
 *
 * @export
 * @param {string} command
 */
export async function rcon(command: string): Promise<string> {
  client ?? (await init());

  const response = await client.send(command);

  console.log({command, response});

  return response;
}
