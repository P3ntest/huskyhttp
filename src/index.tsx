import { Elysia, t, file } from "elysia";
import codesRaw from "../codes.json";
import z from "zod";
import html, { Html } from "@elysiajs/html";
import { AllCodes, CodePage } from "./CodePage";
import staticPlugin from "@elysiajs/static";

const codes = codesRaw.sort((a, b) => Number(a.code) - Number(b.code));

function parseCodeFromURL(code: string) {
  const part = code.split(".")[0].toLowerCase().trim();
  if (!z.number().int().nonnegative().safeParse(Number(part)).success) {
    return null;
  }

  return part;
}

const app = new Elysia()
  .use(staticPlugin())
  .use(html())
  .get("/", () => {
    return <AllCodes codes={codes} />;
  })
  .get(
    "/:code",
    async ({ params, status }) => {
      const codeParam = params.code.toLowerCase().trim();

      const codeNumber = parseCodeFromURL(codeParam);
      const codeData = codes.find((c) => c.code == codeNumber);
      const returnCode = codeData ? codeData.code : "404";
      const returnCodeData = codes.find((c) => c.code == returnCode);

      if (codeParam.endsWith(".webp")) {
        return file(`./output_img/${returnCode}.webp`);
      }

      return (
        <CodePage
          code={returnCodeData.code}
          phrase={returnCodeData.phrase}
          description={returnCodeData.description}
          refLink={returnCodeData.spec_href}
        />
      );
    },
    {
      params: t.Object({
        code: t.String(),
      }),
    }
  )
  .listen(3000);
