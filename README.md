# Taqsir

Taqsir is "shorten" translated to Arabic. According to Google Translate. It's a simple URL shortener API.

## Usage

POST to `https://taqsir.deno.dev/shorten` with a JSON body of:

```json
{
  "url": "https://example.com"
}
```

the response will be a a shortened URL with a suffix from the [adjectives.ts](./adjectives.ts) file and the response code will be `201 Created`.

```json
{
  "status":"ok",
  "url":"https://taqsir.deno.dev/<random_adjective>"
}
```

if you want to use a custom suffix, you can do so by adding a `suffix` key to the JSON body:

```json
{
  "url": "https://example.com",
  "suffix": "dance"
}
```

If the suffix you requested is already taken, you will get a `409 Conflict` response with the following body:

```json
{
  "status":"error",
  "message":"suffix already taken"
}
```

## Technologies used

- [Deno](https://deno.land/)
- [Oak](https://github.com/oakserver/oak)
- [Supabase](https://supabase.io/)
- [Deno Deploy](https://deno.com/deploy)
- [adjectives.ts](./adjectives.ts) is a list of adjectives from [this repo](https://github.com/dariusk/corpora/blob/master/data/words/adjs.json)
