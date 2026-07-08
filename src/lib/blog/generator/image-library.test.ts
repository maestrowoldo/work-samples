import { describe, expect, it } from "vitest";
import { getWikimediaImage } from "./image-library";

describe("getWikimediaImage", () => {
  it("returns a usable Wikimedia image with license metadata", async () => {
    const requestedUrls: string[] = [];
    const image = await getWikimediaImage(
      {
        keywords: ["software", "engineering"],
        title: "Software engineering technology",
      },
      async (input, init) => {
        requestedUrls.push(String(input));
        expect(init?.headers).toMatchObject({
          "Api-User-Agent": "WolkendoBlogBot/1.0 (portfolio blog generator)",
        });

        return (
        new Response(
          JSON.stringify({
            query: {
              pages: {
                "123": {
                  imageinfo: [
                    {
                      descriptionurl: "https://commons.wikimedia.org/wiki/File:Code.jpg",
                      extmetadata: {
                        Credit: {
                          value: "Jane Doe",
                        },
                        LicenseShortName: {
                          value: "CC BY 4.0",
                        },
                        LicenseUrl: {
                          value: "https://creativecommons.org/licenses/by/4.0/",
                        },
                      },
                      height: 900,
                      mime: "image/jpeg",
                      thumburl: "https://upload.wikimedia.org/code-1200.jpg",
                      url: "https://upload.wikimedia.org/code.jpg",
                      width: 1200,
                    },
                  ],
                  title: "File:Code.jpg",
                },
              },
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 200,
          },
        ));
      },
    );

    expect(image).toMatchObject({
      credit: "Jane Doe",
      descriptionUrl: "https://commons.wikimedia.org/wiki/File:Code.jpg",
      height: 900,
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      mime: "image/jpeg",
      originalUrl: "https://upload.wikimedia.org/code.jpg",
      url: "https://upload.wikimedia.org/code-1200.jpg",
      width: 1200,
    });
    expect(requestedUrls[0]).toContain("commons.wikimedia.org/w/api.php");
    expect(requestedUrls[0]).toContain("gsrnamespace=6");
    expect(requestedUrls[0]).toContain("gsrlimit=12");
    expect(requestedUrls[0]).toContain("iiprop=url%7Cmime%7Csize%7Cextmetadata");
  });
});
