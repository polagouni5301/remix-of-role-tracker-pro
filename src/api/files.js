import { store } from "@/mock/store.js";
import { delay } from "./client.js";

// Mock: file content is not actually stored. We track metadata only.
export async function uploadFile({ userId, file, entryId, role, activityKey, period, periodKey }) {
  await delay(150);
  const meta = store.addFile({
    userId, role, entryId, activityKey, period, periodKey,
    fileName: file.name, mimeType: file.type || "application/octet-stream", size: file.size,
  });
  // attach to entry
  const entries = store.entries();
  const e = entries.find((x) => x.id === entryId);
  if (e) {
    e.attachmentIds = [...(e.attachmentIds || []), meta.id];
    e.updatedAt = Date.now();
    store.setEntries(entries);
    // recompute points if completed
    if (e.completed) store.patchEntry(e.id, {});
  }
  return meta;
}

export async function removeFile(fileId) {
  await delay(80);
  // detach from entries
  const entries = store.entries();
  entries.forEach((e) => {
    if ((e.attachmentIds || []).includes(fileId)) {
      e.attachmentIds = e.attachmentIds.filter((x) => x !== fileId);
      if (e.completed) {
        // recompute
        store.setEntries(entries);
        store.patchEntry(e.id, {});
      }
    }
  });
  store.setEntries(entries);
  store.removeFile(fileId);
  return { ok: true };
}

export async function listFilesByIds(ids) {
  await delay(40);
  return store.filesByIds(ids);
}

export async function downloadUrl(fileId) {
  await delay(40);
  return { url: `mock://files/${fileId}` };
}
