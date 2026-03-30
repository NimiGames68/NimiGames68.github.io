import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getUserPlayedGames,
  getRecentlyPlayedGames,
  getBasicPresence,
  getAccountDevices,
  getUserFriendsAccountIds,
  getUserBlockedAccountIds,
  getUserTitles,
  getProfileFromUserName,
  getProfileFromAccountId,
  getUserTrophyProfileSummary
} from "psn-api";

const NPSSO = process.env.NPSSO;
const PSN_USERNAME = process.env.PSN_USERNAME;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (!NPSSO || !PSN_USERNAME) {
    return res
      .status(500)
      .json({ error: "not defined username or NPSSO" });
  }

  try {
    console.log("authenticating...");
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);
    console.log("Auth with success");

    const [
      gamesRes,
      recentRes,
      presenceRes,
      devicesRes,
      friendsRes,
      blockedRes,
      profileRes
    ] = await Promise.allSettled([
      getUserPlayedGames(authTokens, "me", { limit: 100 }),
      getRecentlyPlayedGames(authTokens, { limit: 10 }),
      getBasicPresence(authTokens, "me"),
      getAccountDevices(authTokens),
      getUserFriendsAccountIds(authTokens, "me"),
      getUserBlockedAccountIds(authTokens),
      getProfileFromUserName(authTokens, PSN_USERNAME)
    ]);

    const games = gamesRes.status === "fulfilled" ? gamesRes.value : null;
    const latestGame = games?.titles?.[0];

    let nowPlaying = null;
    if (latestGame) {
      const diff =
        (Date.now() - new Date(latestGame.lastPlayedDateTime)) / 1000 / 60;
      nowPlaying = {
        name: latestGame.name,
        category: latestGame.category,
        service: latestGame.service,
        playCount: latestGame.playCount,
        lastPlayedDateTime: latestGame.lastPlayedDateTime,
        screenshot: latestGame.media?.screenshotUrl,
        status:
          diff < 10
            ? "Now Playing"
            : `Last played ${Math.floor(diff)} min`
      };
    }

    const psnData = {
      nowPlaying,
      presence:
        presenceRes.status === "fulfilled" ? presenceRes.value : null,
      recentGames: recentRes.status === "fulfilled" ? recentRes.value : null,
      games,
      devices:
        devicesRes.status === "fulfilled"
          ? devicesRes.value.accountDevices
          : [],
      friends:
        friendsRes.status === "fulfilled" ? friendsRes.value.friends : [],
      blocked:
        blockedRes.status === "fulfilled" ? blockedRes.value.blockList : [],
      profile: profileRes.status === "fulfilled" ? profileRes.value : null
    };

    return res.status(200).json(psnData);
  } catch (err) {
    console.error("error:", err);
    return res.status(500).json({ error: err.message });
  }
}
