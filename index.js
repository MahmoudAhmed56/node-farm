const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./final/modules/replaceTemplate");
const slugify = require("slugify");
const data = fs.readFileSync(
  `${__dirname}/final/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const slug = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);
console.log(slug);
const tempOverview = fs.readFileSync(
  `${__dirname}/final/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/final/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/final/templates/template-product.html`,
  "utf-8"
);
console.log(
  slugify("Fresh Avocados", {
    lower: true,
  })
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    console.log(query);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>this page Not founded</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request 8000");
});


