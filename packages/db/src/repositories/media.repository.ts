import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { kv } from "@vercel/kv";
import { and, eq } from "drizzle-orm";
import superjson from "superjson";

import { CacheConfig, logger } from "@app/utils";

import type { MediaModel } from "../Models";
import { convertToMediaModel } from "../Models";
import * as schema from "../schema";

export class MediaRepository {
  constructor(public db: VercelPgDatabase<typeof schema>) {}

  public async GetMediaById(media_id: number): Promise<MediaModel | null> {
    await logger.info(`fetch media by id ${media_id}`);
    if (await kv.exists(`media:${media_id}`)) {
      await logger.info(`media ${media_id} located on cache`);
      return await kv.get<MediaModel>(CacheConfig.keys.mediaId(media_id));
    }
    const media = await this.db.query.Media.findFirst({
      where: eq(schema.Media.id, media_id),
    });
    if (!media) {
      await logger.error(`media ${media_id} not found`);
      throw new Error(`Media with id ${media_id} not found.`);
    }
    const model = convertToMediaModel(media);

    await logger.info(`media ${media_id} register on cache`);
    await kv.set(
      CacheConfig.keys.mediaId(media_id),
      superjson.stringify(model),
      { ex: 100, nx: true },
    );
    return model;
  }
}
