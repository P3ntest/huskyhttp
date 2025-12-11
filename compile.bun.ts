import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { Glob } from "bun";
import codes from "./codes.json";

GlobalFonts.registerFromPath("./fonts/Arial_Bold.ttf");

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

        const WIDTH = 512;
        const HEIGHT = 512;

        const canvas = createCanvas(WIDTH, HEIGHT);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Draw image
        const img = file ? await loadImage(file) : generic;

        const imgWidth = img.width;
        const imgHeight = img.height;

        const PADDING = 10;
        const BOTTOM_PADDING = 125;

        // The area you want to fill
        const targetWidth = WIDTH - PADDING * 2;
        const targetHeight = HEIGHT - PADDING * 2 - BOTTOM_PADDING;

        // 1. Calculate the scale factor to COVER the area
        // CHANGE: Use Math.max instead of Math.min
        const scale = Math.max(
          targetWidth / imgWidth,
          targetHeight / imgHeight
        );

        // 2. Calculate the new width and height
        const w = imgWidth * scale;
        const h = imgHeight * scale;

        // 3. Calculate the X and Y positions to center the image
        // This will result in negative offsets for the dimension that is larger than the target
        const x = PADDING + (targetWidth - w) / 2;
        const y = PADDING + (targetHeight - h) / 2;

        ctx.save();
        // Create a clipping region
        ctx.beginPath();
        ctx.rect(PADDING, PADDING, targetWidth, targetHeight);
        ctx.clip();

        ctx.drawImage(img, x, y, w, h);

        ctx.restore();

        // Draw text
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(codeInfo.code, WIDTH / 2, HEIGHT - 65);

        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(codeInfo.phrase, WIDTH / 2, HEIGHT - 20);

        // Save image
        const out = `output_img/${codeInfo.code}.png`;
        Bun.write(out, canvas.toBuffer("image/png"));
        console.log(`Generated ${out}`);
        return resolve();
      })
  )
);
