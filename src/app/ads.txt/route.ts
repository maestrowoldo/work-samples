import { NextResponse } from "next/server";

export function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return new NextResponse("", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const publisherId = clientId.replace(/^ca-/, "");

  return new NextResponse(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
