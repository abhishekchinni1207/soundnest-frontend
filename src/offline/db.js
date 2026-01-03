import { openDB } from "idb";

let dbPromise;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB("soundnest-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("tracks")) {
          db.createObjectStore("tracks", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("recent")) {
          db.createObjectStore("recent", { keyPath: "id" });
        }
      },
    });
  }

  return dbPromise;
}
