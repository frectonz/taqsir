POST http://localhost:8000/shorten
{
  "url": "https://www.google.com"
}

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"

POST http://localhost:8000/shorten
{
  "url": "https://www.youtube.com",
  "suffix": "Aristotelian"
}

HTTP/1.1 409
[Asserts]
jsonpath "$.status" == "error"
