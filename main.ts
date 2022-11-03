import "https://deno.land/std@0.161.0/dotenv/load.ts";
import { Application, Router, Status, RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import adjectives from "./adjectives.ts";
import { SupabaseClient } from "./supabase.ts";

const app = new Application();
const router = new Router();
const supabase = new SupabaseClient(Deno.env.get("SUPABASE_API_URL")!, Deno.env.get("SUPABASE_API_KEY")!);

interface ShortenRequest {
  url: string;
  suffix?: string;
}

router.post("/shorten", async (context: RouterContext<"/shorten">) => {
  if (!context.request.hasBody) {
    context.throw(Status.BadRequest, "Bad Request");
  }
  const body = context.request.body();
  let shortenReq: Partial<ShortenRequest> | undefined;
  if (body.type === "json") {
    shortenReq = await body.value;
  }

  if (shortenReq) {
    context.assert(shortenReq.url && typeof shortenReq.url === "string", Status.BadRequest);

    const { currentAdjIndex }: {
      id: number;
      currentAdjIndex: number
    } = await supabase.table("adjectivesIndex").get("1");

    if (!shortenReq.suffix) {
      shortenReq.suffix = adjectives[currentAdjIndex];
    }

    shortenReq.suffix = shortenReq.suffix.toLowerCase();

    const alreadyExists = await supabase.table("urls").getBySuffix(shortenReq.suffix);
    if (alreadyExists) {
      console.log(alreadyExists);
      return context.throw(Status.Conflict, JSON.stringify({
        status: "error",
        message: `${Deno.env.get("BASE_URL")}/${shortenReq.suffix} already exists`
      }));
    }

    await supabase.table("urls").insert({ originalUrl: shortenReq.url, suffix: shortenReq.suffix });
    await supabase.table("adjectivesIndex").update("1", { currentAdjIndex: currentAdjIndex + 1 });

    context.response.status = Status.Created;
    context.response.body = {
      status: "ok",
      url: `${Deno.env.get("BASE_URL")}/${shortenReq.suffix}`,
    };
    context.response.type = "json";
    return;
  }

  context.throw(Status.BadRequest, "Bad Request");
});

router.get("/", (ctx: RouterContext<"/">) => {
  ctx.response.redirect("https://github.com/frectonz/taqsir")
})

router.get("/:suffix", async (context: RouterContext<"/:suffix">) => {
  const { suffix } = context.params;
  const url = await supabase.table("urls").getBySuffix(suffix);
  if (url) {
    context.response.redirect(url.originalUrl);
    return;
  }
  context.throw(Status.NotFound, "Not Found");
});

app.use(router.routes());

console.log(`Listening on port 8000`);
await app.listen({ port: 8000 });
