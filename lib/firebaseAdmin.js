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

  let serviceAccount;
  const serviceAccountJson =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    try {
      serviceAccount =
        JSON.parse(
          serviceAccountJson
        );
    } catch {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON."
      );
    }
  } else {
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
        "Firebase Admin credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_JSON."
      );
    }

    serviceAccount =
      JSON.parse(
        fs.readFileSync(
          serviceAccountPath,
          "utf8"
        )
      );
  }

  if (
    !serviceAccount.project_id ||
    !serviceAccount.client_email ||
    !serviceAccount.private_key
  ) {
    throw new Error(
      "The Firebase service-account JSON is missing required credentials."
    );
  }

  serviceAccount.private_key =
    serviceAccount.private_key.replace(
      /\\n/g,
      "\n"
    );

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