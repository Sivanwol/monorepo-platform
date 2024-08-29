import type { BasePageCommonProps } from "@app/utils";
import { ReactSwagger } from "@app/ui";

import { getApiDocs } from "~/swagger";

// export const runtime = "edge";

export default async function IndexPage(props: BasePageCommonProps) {
  const spec = await getApiDocs();
  return (
    <div>
      <ReactSwagger spec={spec} />
    </div>
  );
}
