import "server-only";

import { getFirestore } from "firebase-admin/firestore";

import { getFirebaseAdminApp } from "@/lib/auth/firebase-admin";

import type { SavedAnalysis, SavedAnalysisRepository } from "./analysis.types.ts";

const COLLECTION_NAME = "analyses";

function getCollection(userId: string) {
  return getFirestore(getFirebaseAdminApp())
    .collection("users")
    .doc(userId)
    .collection(COLLECTION_NAME);
}

export class FirestoreSavedAnalysisRepository implements SavedAnalysisRepository {
  async countByUserId(userId: string) {
    const snapshot = await getCollection(userId).count().get();

    return snapshot.data().count;
  }

  async create(input: SavedAnalysis) {
    await getCollection(input.userId).doc(input.id).set(input);

    return input;
  }

  async delete(id: string, userId: string) {
    const reference = getCollection(userId).doc(id);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      return false;
    }

    await reference.delete();

    return true;
  }

  async getById(id: string, userId: string) {
    const snapshot = await getCollection(userId).doc(id).get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data() as SavedAnalysis;
  }

  async listByUserId(userId: string) {
    const snapshot = await getCollection(userId).orderBy("updatedAt", "desc").get();

    return snapshot.docs.map((documentSnapshot) => documentSnapshot.data() as SavedAnalysis);
  }

  async update(
    id: string,
    userId: string,
    update: Partial<SavedAnalysis>,
  ) {
    const reference = getCollection(userId).doc(id);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      return null;
    }

    await reference.set(update, {
      merge: true,
    });

    const updatedSnapshot = await reference.get();

    return updatedSnapshot.data() as SavedAnalysis;
  }
}
