import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";

import { env } from "@/env.ts";
import { normalizePrivateKey } from "@/lib/auth/auth-utils.ts";

function getServiceAccount() {
  const serviceAccountJson = env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson) as {
      client_email: string;
      private_key: string;
      project_id: string;
    };

    return {
      clientEmail: parsed.client_email,
      privateKey: normalizePrivateKey(parsed.private_key),
      projectId: parsed.project_id,
    };
  }

  return {
    clientEmail: env.FIREBASE_CLIENT_EMAIL!,
    privateKey: normalizePrivateKey(env.FIREBASE_PRIVATE_KEY!),
    projectId: env.FIREBASE_PROJECT_ID!,
  };
}

export function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccount = getServiceAccount();

  return initializeApp({
    credential: cert({
      clientEmail: serviceAccount.clientEmail,
      privateKey: serviceAccount.privateKey,
      projectId: serviceAccount.projectId,
    }),
    projectId: serviceAccount.projectId,
    ...(env.FIREBASE_STORAGE_BUCKET
      ? { storageBucket: env.FIREBASE_STORAGE_BUCKET }
      : {}),
  });
}
