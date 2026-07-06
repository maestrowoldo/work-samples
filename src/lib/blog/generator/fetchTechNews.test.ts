import { describe, expect, it } from "vitest";
import { BlogGeneratorError } from "./errors";
import { fetchTechNews } from "./fetchTechNews";

function createJsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

describe("fetchTechNews", () => {
  it("throws a friendly error when no relevant news are found", async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);

      if (url.includes("topstories") || url.includes("newstories")) {
        return createJsonResponse([]);
      }

      if (url.includes("search/repositories")) {
        return createJsonResponse({
          items: [],
        });
      }

      return createJsonResponse([]);
    };

    await expect(
      fetchTechNews({
        fetchImpl,
        now: new Date("2026-05-14T12:00:00.000Z"),
      }),
    ).rejects.toThrowError(BlogGeneratorError);
  });
});
