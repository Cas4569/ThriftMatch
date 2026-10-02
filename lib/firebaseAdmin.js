import fs from "fs";
import path from "path";
import process from "node:process";

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

function configurationError(message) {
  const error = new Error(message);
  error.code = "FIREBASE_ADMIN_CONFIG";
  return error;
}

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
      throw configurationError(
        "FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON."
      );
    }
  } else {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail =
      process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey =
      process.env.FIREBASE_PRIVATE_KEY;

    if (
      projectId &&
      clientEmail &&
      privateKey
    ) {
      serviceAccount = {
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
      };
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
        throw configurationError(
          "Firebase Admin credentials are missing. Configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
        );
      }

      try {
        serviceAccount =
          JSON.parse(
            fs.readFileSync(
              serviceAccountPath,
              "utf8"
            )
          );
      } catch {
        throw configurationError(
          "The local Firebase Admin service-account file must contain valid JSON."
        );
      }
    }
  }

  if (
    !serviceAccount ||
    typeof serviceAccount !== "object" ||
    typeof serviceAccount.project_id !== "string" ||
    typeof serviceAccount.client_email !== "string" ||
    typeof serviceAccount.private_key !== "string"
  ) {
    throw configurationError(
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