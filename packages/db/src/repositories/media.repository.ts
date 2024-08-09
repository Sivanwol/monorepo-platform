import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { and, eq } from "drizzle-orm";
import { kv } from "@vercel/kv";
import * as schema from "../schema";
import superjson from 'superjson';
import { convertToMediaModel, MediaModel } from "../Models";
import { CacheConfig } from "@app/utils";


export class MediaRepository {
  constructor(public db: VercelPgDatabase<typeof schema>) { }

  public async GetMediaById(media_id: number): Promise<MediaModel | null> {
    if (await kv.exists(`media:${media_id}`)) {
      return await kv.get<MediaModel>(CacheConfig.keys.mediaId(media_id));
    }
    const media = await this.db.query.Media.findFirst({
      where: eq(schema.Media.id, media_id),
    });
    if (!media) throw new Error(`Media with id ${media_id} not found.`);
    const model = convertToMediaModel(media)
    await kv.set(CacheConfig.keys.mediaId(media_id), superjson.stringify(model), { ex: 100, nx: true });
    return model
  }
}
