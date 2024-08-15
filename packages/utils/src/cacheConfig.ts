export const CacheConfig = {
  expireValue: 1000 * 60 * 60 * 5, // 5 hour

  keys: {
    mediaId: (media_id: number) => `media:${media_id}`,
  },
};
