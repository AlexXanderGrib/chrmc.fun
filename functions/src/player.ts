import axios from "axios";

export type Player =
  | { exists: false }
  | {
      exists: true;
      uuid: string;
      username: string;
      inGameName: string;
      isPlayer: boolean;
    };

/**
 *
 * @param {string} hex
 * @return {string}
 */
function formatUuid(hex: string) {
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

/**
 *
 * @param {string} username
 */
async function checkJava(username: string): Promise<Player> {
  try {
    const {data} = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${username}`
    );
    const {id} = data;
    if (!id) {
      throw new Error();
    }

    const uuid = formatUuid(id);

    return {
      username,
      uuid,
      exists: true,
      inGameName: username,
      isPlayer: false,
    };
  } catch (error) {
    return {exists: false};
  }
}

/**
 *
 * @param {string} gamerTag
 *
 */
async function checkBedrock(gamerTag: string): Promise<Player> {
  try {
    const {data} = await axios.get("https://xbl.io/api/v2/friends/search/", {
      params: {gt: gamerTag},
      headers: {
        "X-Authorization": process.env.XB_IO_KEY ?? "",
      },
    });

    const id = data.profileUsers?.[0]?.id;
    if (!id) {
      throw new Error();
    }

    const bytes = parseInt(id).toString(16).padStart(32, "0");
    const uuid = formatUuid(bytes);

    return {
      username: gamerTag,
      uuid,
      exists: true,
      inGameName: `.${gamerTag.replace(/ /g, "_").slice(0, 15)}`,
      isPlayer: false,
    };
  } catch (error) {
    return {exists: false};
  }
}

/**
 *
 *
 * @export
 * @param {("java" | "bedrock")} platform
 * @param {string} username
 * @return {Promise<Player>}
 */
export async function checkPlayer(
    platform: "java" | "bedrock",
    username: string
): Promise<Player> {
  switch (platform) {
    case "java":
      return await checkJava(username);
    case "bedrock":
      return await checkBedrock(username);
    default:
      throw new Error("Invalid platform");
  }
}
