import { describe, expect, it } from "vitest";
import { extractSourcePreviewFromHtml, enrichSourceLinksWithMedia } from "./source-media";

describe("extractSourcePreviewFromHtml", () => {
  it("extracts og image, site name and alt text from HTML", () => {
    const preview = extractSourcePreviewFromHtml(
      `
        <html>
          <head>
            <meta property="og:site_name" content="Example Tech" />
            <meta property="og:image" content="/images/hero.png" />
            <meta property="og:image:alt" content="Hero image alt" />
            <title>Fallback title</title>
          </head>
        </html>
      `,
      "https://example.com/articles/post",
      "Post fallback",
    );

    expect(preview).toEqual({
      imageAlt: "Hero image alt",
      imageUrl: "https://example.com/images/hero.png",
      siteName: "Example Tech",
    });
  });
});

describe("enrichSourceLinksWithMedia", () => {
  it("enriches source links with image metadata when HTML is available", async () => {
    const enriched = await enrichSourceLinksWithMedia(
      [
        {
          source: "Dev.to",
          title: "Interesting article",
          url: "https://example.com/post",
        },
      ],
      async () =>
        new Response(
          `
            <html>
              <head>
                <meta property="og:site_name" content="Example Tech" />
                <meta property="og:image" content="https://cdn.example.com/post.jpg" />
                <meta property="og:title" content="Interesting article" />
              </head>
            </html>
          `,
          {
            headers: {
              "content-type": "text/html; charset=utf-8",
            },
            status: 200,
          },
        ),
    );

    expect(enriched[0]).toMatchObject({
      imageAlt: "Interesting article",
      imageUrl: "https://cdn.example.com/post.jpg",
      siteName: "Example Tech",
    });
  });
});
