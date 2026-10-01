import {
  randomUUID,
} from "crypto";

import {
  Timestamp,
} from "firebase-admin/firestore";

import {
  getAdminDb,
} from "@/lib/firebaseAdmin";

import {
  getAdminBucket,
  requireApprovedSeller,
  authErrorResponse,
} from "@/lib/serverAuth";

const CATEGORY_MAP = {
  "menswear:upperwear": {
    category: "menswear",
    subcategory: "upperwear",
  },

  "menswear:lowerwear": {
    category: "menswear",
    subcategory: "lowerwear",
  },

  "menswear:footwear": {
    category: "menswear",
    subcategory: "footwear",
  },

  "menswear:accessories": {
    category: "menswear",
    subcategory: "accessories",
  },

  "menswear:outerwear": {
    category: "menswear",
    subcategory: "outerwear",
  },

  "womenswear:upperwear": {
    category: "womenswear",
    subcategory: "upperwear",
  },

  "womenswear:lowerwear": {
    category: "womenswear",
    subcategory: "lowerwear",
  },

  "womenswear:footwear": {
    category: "womenswear",
    subcategory: "footwear",
  },

  "womenswear:accessories": {
    category: "womenswear",
    subcategory: "accessories",
  },

  "womenswear:outerwear": {
    category: "womenswear",
    subcategory: "outerwear",
  },
};

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/*
|--------------------------------------------------------------------------
| TURN FILE INTO FIREBASE STORAGE URL
|--------------------------------------------------------------------------
*/

async function uploadImage(
  file,
  bucket,
  uid
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "jpg";

  const safeName =
    file.name
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )
      .slice(0, 100);

  const token =
    randomUUID();

  const storagePath =
    `seller-listings/${uid}/${randomUUID()}-${safeName}.${extension}`;

  const storageFile =
    bucket.file(
      storagePath
    );

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );

  await storageFile.save(
    buffer,
    {
      resumable: false,

      metadata: {
        contentType:
          file.type ||
          "image/jpeg",

        metadata: {
          firebaseStorageDownloadTokens:
            token,
        },
      },
    }
  );

  /*
   * Firebase download-token URL.
   *
   * This means the buyer side can use
   * the URL directly in <img>.
   */
  return (
    `https://firebasestorage.googleapis.com/v0/b/` +
    `${bucket.name}/o/` +
    `${encodeURIComponent(storagePath)}` +
    `?alt=media&token=${token}`
  );
}

/*
|--------------------------------------------------------------------------
| POST /api/seller/listings
|--------------------------------------------------------------------------
*/

export async function POST(request) {
  try {
    const {
      user,
      application,
    } =
      await requireApprovedSeller(
        request
      );

    const formData =
      await request.formData();

    const title =
      String(
        formData.get("title") ||
          ""
      )
        .trim()
        .slice(0, 120);

    const description =
      String(
        formData.get("description") ||
          ""
      )
        .trim()
        .slice(0, 2000);

    const priceInput =
      String(
        formData.get("price") ||
          ""
      )
        .trim();

    const categoryKey =
      String(
        formData.get(
          "category"
        ) || ""
      ).trim();

    if (!title) {
      return Response.json(
        {
          error:
            "Listing title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!description) {
      return Response.json(
        {
          error:
            "Product description is required.",
        },
        {
          status: 400,
        }
      );
    }

    const price =
      Number(
        priceInput.replace(
          /,/g,
          ""
        )
      );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return Response.json(
        {
          error:
            "Enter a valid price.",
        },
        {
          status: 400,
        }
      );
    }

    const category =
      CATEGORY_MAP[
        categoryKey
      ];

    if (!category) {
      return Response.json(
        {
          error:
            "Choose a valid listing category.",
        },
        {
          status: 400,
        }
      );
    }

    const files =
      formData
        .getAll("photos")
        .filter(
          (value) =>
            value instanceof File &&
            value.size > 0
        );

    if (!files.length) {
      return Response.json(
        {
          error:
            "Add at least one photo.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      files.length >
      MAX_PHOTOS
    ) {
      return Response.json(
        {
          error:
            `You can upload up to ${MAX_PHOTOS} photos.`,
        },
        {
          status: 400,
        }
      );
    }

    for (const file of files) {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        return Response.json(
          {
            error:
              "Only image files are allowed.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        return Response.json(
          {
            error:
              "Each photo must be 5 MB or smaller.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const bucket =
      getAdminBucket();

    const imageUrls = [];

    for (const file of files) {
      const url =
        await uploadImage(
          file,
          bucket,
          user.uid
        );

      imageUrls.push(url);
    }

    const displayPrice =
      `₹${price.toLocaleString(
        "en-IN"
      )}`;

    const product = {
      name: title,

      price:
        displayPrice,

      category:
        category.category,

      subcategory:
        category.subcategory,

      image:
        imageUrls[0],

      images:
        imageUrls,

      description:
        description,

      sellerId:
        user.uid,

      sellerEmail:
        String(
          user.email || ""
        )
          .trim()
          .toLowerCase(),

      sellerName:
        application.fullName,

      storeName:
        application.storeName,

      source:
        "seller",

      status:
        "available",

      createdAt:
        Timestamp.now(),

      updatedAt:
        Timestamp.now(),
    };

    const document =
      await getAdminDb()
        .collection(
          "products"
        )
        .add(product);

    return Response.json(
      {
        success: true,

        listingId:
          document.id,

        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "SELLER LISTING ERROR:",
      error
    );

    return authErrorResponse(
      error
    );
  }
}