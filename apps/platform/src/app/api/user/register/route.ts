import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { repositories } from "@app/db/client";

export const runtime = "edge";

export const POST = async (_req: NextRequest) => {
  const formData = await _req.json();
  const externalId = formData.get("externalId");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phone = formData.get("phone");
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
