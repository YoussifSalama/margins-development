import "server-only";
import type { Collection } from "mongodb";

/** Persists a new order: position = index in `ids`. One round trip. */
export async function reorder<T extends { _id: string; position: number }>(collection: Collection<T>, ids: string[]) {
  if (ids.length === 0) return;
  await collection.bulkWrite(
    ids.map((id, position) => ({ updateOne: { filter: { _id: id }, update: { $set: { position } } } })) as never,
  );
}

/** New rows go to the end of the list. */
export async function nextPosition<T extends { _id: string; position: number }>(collection: Collection<T>) {
  const [last] = await collection.find({}, { projection: { position: 1 } }).sort({ position: -1 }).limit(1).toArray();
  return last ? (last.position as number) + 1 : 0;
}
