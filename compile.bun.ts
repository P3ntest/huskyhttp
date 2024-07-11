import { createCanvas, loadImage } from "@napi-rs/canvas";
import { Glob } from "bun";
import codes from "./codes.json";

const generic = await loadImage("source_img/generic.png");

await Promise.all(
  codes.map(
    (codeInfo) =>
      new Promise<void>(async (resolve, reject) => {
        if (codeInfo.code.includes("x")) {
          return resolve();
        }

        const glob = new Glob(`source_img/${codeInfo.code}.*`);
        const file = (await glob.scan().next()).value ?? null;

        const WIDTH = 800;
        const HEIGHT = 800;

        const canvas = createCanvas(WIDTH, HEIGHT);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Draw image
        const img = file ? await loadImage(file) : generic;

        const PADDING = 10;
        const BOTTOM_PADDING = 160;
        ctx.drawImage(
          img,
          PADDING,
          PADDING,
          WIDTH - PADDING * 2,
          HEIGHT - PADDING * 2 - BOTTOM_PADDING
        );

        // Draw text
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(codeInfo.code, WIDTH / 2, HEIGHT - 90);

        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(codeInfo.phrase, WIDTH / 2, HEIGHT - 30);

        // Save image
        const out = `output_img/${codeInfo.code}.png`;
        Bun.write(out, canvas.toBuffer("image/png"));
        console.log(`Generated ${out}`);
        return resolve();
      })
  )
);
