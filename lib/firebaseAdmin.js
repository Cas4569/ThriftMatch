import fs from "fs";
import path from "path";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getFirestore,
} from "firebase-admin/firestore";

import {
  getAuth,
} from "firebase-admin/auth";

let adminDb = null;
let adminAuth = null;

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountPath =
    path.join(
      process.cwd(),
      "thriftmatch-127c8-firebase-adminsdk-fbsvc-f6d8375553.json"
    );

  if (
    !fs.existsSync(
      serviceAccountPath
    )
  ) {
    throw new Error(
      `Firebase Admin service-account file not found: ${serviceAccountPath}`
    );
  }

  const serviceAccount =
    JSON.parse(
      fs.readFileSync(
        serviceAccountPath,
        "utf8"
      )
    );

  if (
    !serviceAccount.project_id ||
    !serviceAccount.client_email ||
    !serviceAccount.private_key
  ) {
    throw new Error(
      "The Firebase service-account JSON is missing required credentials."
    );
  }

  return initializeApp({
    credential:
      cert(
        serviceAccount
      ),
  });
}

export function getAdminDb() {
  if (!adminDb) {
    adminDb =
      getFirestore(
        getAdminApp()
      );
  }

  return adminDb;
}

export function getAdminAuth() {
  if (!adminAuth) {
    adminAuth =
      getAuth(
        getAdminApp()
      );
  }

  return adminAuth;
}