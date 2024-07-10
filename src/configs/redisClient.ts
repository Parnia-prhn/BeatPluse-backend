import redis from "redis";
import { promisify } from "util";

const client = redis.createClient();

client.on("error", (err) => console.error("Redis error:", err));
client.on("connect", () => console.log("Connected to Redis"));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

export { getAsync, setAsync, delAsync, client };
