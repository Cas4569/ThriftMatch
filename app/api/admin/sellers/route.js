import { Timestamp } from "firebase-admin/firestore";

import {
  requireAdmin,
  authErrorResponse,
} from "@/lib/serverAuth";

import {
  getAdminDb,
} from "@/lib/firebaseAdmin";

import {
  sendSellerDecisionEmail,
} from "@/lib/sellerEmail";

/*
|--------------------------------------------------------------------------
| GET
| /api/admin/sellers
|--------------------------------------------------------------------------
|
| Returns pending seller applications only.
|
*/

export async function GET(request) {
  try {
    await requireAdmin(request);

    const snapshot =
      await getAdminDb()
        .collection(
          "sellerApplications"
        )
        .get();

    const applications =
      snapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data(),
        }))
        .filter(
          (application) =>
            application.status ===
            "pending"
        )
        .sort(
          (a, b) => {
            const aTime =
              a.createdAt?.toMillis?.() ||
              0;

            const bTime =
              b.createdAt?.toMillis?.() ||
              0;

            return bTime - aTime;
          }
        )
        .map((application) => ({
          ...application,

          createdAt:
            application.createdAt
              ?.toDate?.()
              ?.toISOString() || null,

          updatedAt:
            application.updatedAt
              ?.toDate?.()
              ?.toISOString() || null,
        }));

    return Response.json({
      applications,
    });
  } catch (error) {
    return authErrorResponse(
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH
| /api/admin/sellers
|--------------------------------------------------------------------------
|
| Body:
| {
|   id: "...",
|   status: "approved" | "rejected"
| }
|
*/

export async function PATCH(request) {
  try {
    await requireAdmin(request);

    const body =
      await request.json();

    const id =
      String(body?.id || "").trim();

    const status =
      String(
        body?.status || ""
      ).trim();

    if (!id) {
      return Response.json(
        {
          error:
            "Application ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      ![
        "approved",
        "rejected",
      ].includes(status)
    ) {
      return Response.json(
        {
          error:
            "Status must be approved or rejected.",
        },
        {
          status: 400,
        }
      );
    }

    const ref =
      getAdminDb()
        .collection(
          "sellerApplications"
        )
        .doc(id);

    const snapshot =
      await ref.get();

    if (!snapshot.exists) {
      return Response.json(
        {
          error:
            "Seller application not found.",
        },
        {
          status: 404,
        }
      );
    }

    const application =
      snapshot.data();

    /*
     * Only a pending application
     * can be reviewed.
     */
    if (
      application.status !==
      "pending"
    ) {
      return Response.json(
        {
          error:
            "This application has already been reviewed.",
        },
        {
          status: 409,
        }
      );
    }

    await ref.update({
      status,
      updatedAt:
        Timestamp.now(),
    });

    /*
     * Email is deliberately non-blocking.
     *
     * If Resend isn't configured,
     * approval/rejection still works.
     */
    try {
      await sendSellerDecisionEmail({
        to: application.email,
        name: application.fullName,
        storeName:
          application.storeName,
        status,
      });
    } catch (emailError) {
      console.error(
        "SELLER DECISION EMAIL ERROR:",
        emailError
      );
    }

    return Response.json({
      success: true,
      status,
    });
  } catch (error) {
    return authErrorResponse(
      error
    );
  }
}