import { NextApiRequest, NextApiResponse } from "next";

import { openApiDocument } from "~/trpc/openapi";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(openApiDocument);
}
