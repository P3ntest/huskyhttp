Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const code = url.pathname.split("/")[1].split(".")[0];

    if (!code) {
      return new Response("Not found", { status: 404 });
    }

    const file = Bun.file(`output_img/${code}.png`);
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(await file.stream(), {
      headers: {
        "Content-Type": "image/png",
      },
    });
  },
});

console.log("Server started at http://localhost:3000");
