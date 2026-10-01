import { getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

import { getAdminDb } from "@/lib/firebaseAdmin";

/*
|--------------------------------------------------------------------------
| API AUTH ERROR
|--------------------------------------------------------------------------
*/

export class ApiAuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/*
|--------------------------------------------------------------------------
| GET INITIALIZED ADMIN APP
|--------------------------------------------------------------------------
|
| Your existing firebaseAdmin.js already initializes the Admin SDK
| because /api/seller-application is using getAdminDb().
|
*/

function getAdminApp() {
  let apps = getApps();

  if (!apps.length) {
    getAdminDb();
    apps = getApps();
  }

  if (!apps.length) {
    throw new Error(
      "Firebase Admin SDK is not initialized."
    );
  }

  return apps[0];
}

/*
|--------------------------------------------------------------------------
| ADMIN AUTH
|--------------------------------------------------------------------------
*/

function getAdminAuth() {
  return getAuth(getAdminApp());
}

/*
|--------------------------------------------------------------------------
| ADMIN STORAGE
|--------------------------------------------------------------------------
*/

export function getAdminBucket() {
  const storage = getStorage(getAdminApp());

  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET;

  return bucketName
    ? storage.bucket(bucketName)
    : storage.bucket();
}

/*
|--------------------------------------------------------------------------
| READ BEARER TOKEN
|--------------------------------------------------------------------------
*/

function getBearerToken(request) {
  const header =
    request.headers.get("authorization");

  if (!header) {
    return null;
  }

  const match =
    header.match(/^Bearer\s+(.+)$/i);

  return match?.[1] || null;
}

/*
|--------------------------------------------------------------------------
| VERIFY NORMAL USER
|--------------------------------------------------------------------------
*/

export async function requireAuth(request) {
  const token =
    getBearerToken(request);

  if (!token) {
    throw new ApiAuthError(
      401,
      "Authentication required."
    );
  }

  try {
    return await getAdminAuth().verifyIdToken(
      token
    );
  } catch (error) {
    console.error(
      "ID TOKEN VERIFICATION ERROR:",
      error
    );

    throw new ApiAuthError(
      401,
      "Authentication required."
    );
  }
}

/*
|--------------------------------------------------------------------------
| VERIFY ADMIN
|--------------------------------------------------------------------------
|
| For the hackathon, ADMIN_EMAILS is the simplest
| server-side allowlist.
|
| IMPORTANT:
| Do NOT prefix this with NEXT_PUBLIC_.
|
*/

export async function requireAdmin(request) {
  const decodedUser =
    await requireAuth(request);

  const adminEmails =
    String(
      process.env.ADMIN_EMAILS || ""
    )
      .split(",")
      .map((email) =>
        email.trim().toLowerCase()
      )
      .filter(Boolean);

  const email =
    String(
      decodedUser.email || ""
    ).toLowerCase();

  if (
    !email ||
    !adminEmails.includes(email)
  ) {
    throw new ApiAuthError(
      403,
      "Admin access required."
    );
  }

  return decodedUser;
}

/*
|--------------------------------------------------------------------------
| VERIFY APPROVED SELLER
|--------------------------------------------------------------------------
*/

export async function requireApprovedSeller(
  request
) {
  const decodedUser =
    await requireAuth(request);

  const email =
    String(
      decodedUser.email || ""
    )
      .trim()
      .toLowerCase();

  if (!email) {
    throw new ApiAuthError(
      403,
      "A verified seller email is required."
    );
  }

  const snapshot =
    await getAdminDb()
      .collection(
        "sellerApplications"
      )
      .where(
        "email",
        "==",
        email
      )
      .get();

  let approvedApplication = null;

  for (
    const document of snapshot.docs
  ) {
    const data =
      document.data();

    if (
      data.status ===
      "approved"
    ) {
      approvedApplication = {
        id: document.id,
        ...data,
      };

      break;
    }
  }

  if (!approvedApplication) {
    throw new ApiAuthError(
      403,
      "Your seller application has not been approved."
    );
  }

  return {
    user: decodedUser,
    application:
      approvedApplication,
  };
}

/*
|--------------------------------------------------------------------------
| AUTH ERROR RESPONSE
|--------------------------------------------------------------------------
*/

export function authErrorResponse(
  error
) {
  if (
    error instanceof ApiAuthError
  ) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: error.status,
      }
    );
  }

  console.error(
    "AUTH ERROR:",
    error
  );

  return Response.json(
    {
      error:
        "Something went wrong while authenticating this request.",
    },
    {
      status: 500,
    }
  );
}