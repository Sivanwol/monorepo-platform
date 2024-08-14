import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { repositories } from "@app/db/client";

export const runtime = "edge";

export async function POST(_req: NextRequest) {
  const formData = await _req.json();
  const externalId = formData.get("externalId") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  if (!(await repositories.user.locateUserByExternalId(externalId))) {
    await repositories.user.register({
      externalId,
      firstName,
      lastName,
      email,
      phone,
    });
  }
  return NextResponse.json({ status: true, data: true });
};
