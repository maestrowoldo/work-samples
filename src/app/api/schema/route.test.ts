import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/schema", () => {
  it("returns JSON-LD person schema", async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/ld+json");
    expect(body).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Wolkendo Arias",
    });
    expect(body.sameAs).toContain("https://github.com/maestrowoldo");
  });
});
