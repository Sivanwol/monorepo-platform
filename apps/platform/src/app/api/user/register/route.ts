import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { repositories } from "@app/db/client";

export const runtime = "edge";

export async function POST(_req: NextRequest) {
  const formData = await _req.json();
  const externalId = formData.externalId as string;
  const firstName = formData.firstName as string;
  const lastName = formData.lastName as string;
  const email = formData.email as string;
  const phone = (formData.phone || "") as string;
  console.log(`register feedback from descope ${externalId}`);
  if (!(await repositories.user.locateUserByExternalId(externalId))) {
    console.log(`payload user info`, {
      externalId,
      firstName,
      lastName,
      email,
      phone,
    });
    await repositories.user.register({
      externalId,
      firstName,
      lastName,
      email,
      phone,
    });
    return NextResponse.json({ status: true, data: true });
  }
  console.log(`feedback found no action been taken - ${externalId}`);
  return NextResponse.json({ status: true, data: true });
}
