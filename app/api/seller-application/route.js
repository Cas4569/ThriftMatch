import { getAdminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

/*
|--------------------------------------------------------------------------
| RATE LIMITING
|--------------------------------------------------------------------------
|
| 3 seller applications per IP every 10 minutes.
|
| This is appropriate for the hackathon/local setup.
|
*/

const RATE_LIMIT = 3;

const RATE_WINDOW_MS =
  10 * 60 * 1000;

const rateLimitStore = new Map();

/*
|--------------------------------------------------------------------------
| Get client IP
|--------------------------------------------------------------------------
*/

function getClientIp(request) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

/*
|--------------------------------------------------------------------------
| Check rate limit
|--------------------------------------------------------------------------
*/

function checkRateLimit(ip) {
  const now = Date.now();

  const current =
    rateLimitStore.get(ip);

  /*
   * New request window.
   */
  if (
    !current ||
    now -
      current.windowStart >=
      RATE_WINDOW_MS
  ) {
    rateLimitStore.set(ip, {
      count: 1,
      windowStart: now,
    });

    return {
      allowed: true,
      remaining:
        RATE_LIMIT - 1,
      retryAfter: 0,
    };
  }

  /*
   * Too many requests.
   */
  if (
    current.count >=
    RATE_LIMIT
  ) {
    const retryAfter = Math.ceil(
      (
        RATE_WINDOW_MS -
        (
          now -
          current.windowStart
        )
      ) / 1000
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  /*
   * Count the request.
   */
  current.count += 1;

  rateLimitStore.set(
    ip,
    current
  );

  return {
    allowed: true,
    remaining:
      RATE_LIMIT -
      current.count,
    retryAfter: 0,
  };
}

/*
|--------------------------------------------------------------------------
| URL validation
|--------------------------------------------------------------------------
*/

function isValidUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    );
  } catch {
    return false;
  }
}

/*
|--------------------------------------------------------------------------
| POST /api/seller-application
|--------------------------------------------------------------------------
*/

export async function POST(request) {
  /*
   * -------------------------------------------------------
   * RATE LIMIT
   * -------------------------------------------------------
   */

  const ip =
    getClientIp(request);

  const limit =
    checkRateLimit(ip);

  if (!limit.allowed) {
    return Response.json(
      {
        error:
          "Too many seller applications. Please wait a few minutes and try again.",
      },
      {
        status: 429,

        headers: {
          "Retry-After":
            String(
              limit.retryAfter
            ),

          "X-RateLimit-Limit":
            String(
              RATE_LIMIT
            ),

          "X-RateLimit-Remaining":
            "0",
        },
      }
    );
  }

  try {
    /*
     * -------------------------------------------------------
     * READ BODY
     * -------------------------------------------------------
     */

    const body =
      await request.json();

    /*
     * -------------------------------------------------------
     * CLEAN INPUT
     * -------------------------------------------------------
     */

    const fullName =
      String(
        body?.fullName || ""
      )
        .trim()
        .slice(0, 100);

    const mobile =
      String(
        body?.mobile || ""
      )
        .trim()
        .slice(0, 30);

    const email =
      String(
        body?.email || ""
      )
        .trim()
        .toLowerCase()
        .slice(0, 150);

    const storeName =
      String(
        body?.storeName || ""
      )
        .trim()
        .slice(0, 100);

    const sellerType =
      String(
        body?.sellerType || ""
      )
        .trim()
        .slice(0, 50);

    const storeLink =
      String(
        body?.storeLink || ""
      )
        .trim()
        .slice(0, 500);

    /*
     * -------------------------------------------------------
     * REQUIRED FIELDS
     * -------------------------------------------------------
     */

    if (
      !fullName ||
      !mobile ||
      !email ||
      !storeName ||
      !sellerType
    ) {
      return Response.json(
        {
          error:
            "Please complete all required seller information.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * EMAIL VALIDATION
     * -------------------------------------------------------
     */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email
      )
    ) {
      return Response.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * SELLER TYPE VALIDATION
     * -------------------------------------------------------
     */

    const allowedSellerTypes = [
      "individual",
      "thrift-store",
    ];

    if (
      !allowedSellerTypes.includes(
        sellerType
      )
    ) {
      return Response.json(
        {
          error:
            "Please select a valid seller type.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * STORE / SOCIAL LINK VALIDATION
     * -------------------------------------------------------
     */

    if (
      !isValidUrl(storeLink)
    ) {
      return Response.json(
        {
          error:
            "Please enter a valid store or social media URL.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * FIREBASE ADMIN
     * -------------------------------------------------------
     */

    const adminDb =
      getAdminDb();

    /*
     * -------------------------------------------------------
     * SAVE TO FIRESTORE
     * -------------------------------------------------------
     */

    const application =
      await adminDb
        .collection(
          "sellerApplications"
        )
        .add({
          fullName,

          mobile,

          email,

          storeName,

          sellerType,

          storeLink:
            storeLink || null,

          status:
            "pending",

          reviewNotes:
            "",

          createdAt:
            Timestamp.now(),

          updatedAt:
            Timestamp.now(),
        });

    /*
     * -------------------------------------------------------
     * SUCCESS
     * -------------------------------------------------------
     */

    return Response.json(
      {
        success: true,

        applicationId:
          application.id,

        message:
          "Your seller verification request has been received.",
      },
      {
        status: 201,

        headers: {
          "X-RateLimit-Limit":
            String(
              RATE_LIMIT
            ),

          "X-RateLimit-Remaining":
            String(
              limit.remaining
            ),
        },
      }
    );
  } catch (error) {
    /*
     * -------------------------------------------------------
     * SERVER ERROR
     * -------------------------------------------------------
     */

    console.error(
      "SELLER APPLICATION ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error?.message ||
          "Something went wrong while saving your seller application.",
      },
      {
        status: 500,

        headers: {
          "X-RateLimit-Limit":
            String(
              RATE_LIMIT
            ),

          "X-RateLimit-Remaining":
            String(
              limit.remaining
            ),
        },
      }
    );
  }
}