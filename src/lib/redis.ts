type RedisCommand = "zrange" | "sismember" | "get" | "smembers";

export async function fetchHelperForRedis(
  commnad: RedisCommand,
  // key: string,
  ...args: (string | number)[]
) {
  try {
    const res = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/${commnad}/${args.join("/")}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-cache",
      }
    );
    // if (!res.ok) {
    //   throw new Error("Error: " + res.statusText);
    // }

    // console.log(
    //   "env",
    //   res,
    //   process.env,
    //   process.env.UPSTASH_REDIS_REST_URL,
    //   `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    // );
    const data = await res.json();
    return data.result;
  } catch (error) {
    console.log(error);
    return null;
    // throw new Error("Error excuting redis  command");
  }
}
