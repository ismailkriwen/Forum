import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherClient = new PusherClient("aa0aed31f749382322fb", {
  cluster: "eu",
});

export const pusherServer = new PusherServer({
  appId: "1679794",
  key: "aa0aed31f749382322fb",
  secret: "056348aa6bc790fd4256",
  cluster: "eu",
  useTLS: true,
});
