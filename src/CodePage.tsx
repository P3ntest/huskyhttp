import { Html } from "@elysiajs/html";
import { removeQuotes } from "./removeQuotes";

function PageLayout(props) {
  return (
    <html>
      <head>
        <title>HTTP Husky</title>
        <link rel="stylesheet" href="/public/style.css" />
      </head>
      <body>
        <header>
          <h1>HTTP Huskies</h1>
          <h2>A picture of a husky for every HTTP status code</h2>
        </header>
        <main>{props.children}</main>
        <footer>
          httphuskies.dev &mdash; Created by{" "}
          <a
            href="https://github.com/p3ntest"
            target="_blank"
            rel="noopener noreferrer"
          >
            Julius van Voorden
          </a>
        </footer>
      </body>
    </html>
  );
}

export function CodePage({
  code,
  phrase,
  description,
  refLink,
}: {
  code: string;
  phrase: string;
  description: string;
  refLink: string;
}) {
  return (
    <PageLayout>
      <div class="code-page">
        <a href={`${code}.webp`}>
          <img src={`${code}.webp`} width={400} alt="" />
        </a>
        <p class="code-title">{code}</p>
        <p class="code-phrase">{phrase}</p>
        <p class="code-description">{removeQuotes(description)}</p>

        <a
          class="spec-link"
          href={refLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the spec
        </a>
      </div>
    </PageLayout>
  );
}

export function AllCodes({
  codes,
}: {
  codes: {
    code: string;
    phrase: string;
    description: string;
    spec_href: string;
  }[];
}) {
  return (
    <PageLayout>
      <div class="all-codes-page">
        {codes.map((codeData) => (
          <a href={`/${codeData.code}`}>
            <img src={`/${codeData.code}.webp`} width={300} alt="" />
          </a>
        ))}
      </div>
    </PageLayout>
  );
}
