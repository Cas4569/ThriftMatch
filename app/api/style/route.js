import { GoogleGenAI } from "@google/genai";

/*
|--------------------------------------------------------------------------
| Gemini
|--------------------------------------------------------------------------
*/

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/*
|--------------------------------------------------------------------------
| Product categories
|--------------------------------------------------------------------------
*/

const CATEGORIES = [
  "outerwear",
  "upperwear",
  "lowerwear",
  "footwear",
  "accessories",
];

/*
|--------------------------------------------------------------------------
| Gemini models
|--------------------------------------------------------------------------
|
| We try the primary model first.
| If Google temporarily returns 429/503/5xx,
| we retry and then fall back to another model.
|
*/

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

/*
|--------------------------------------------------------------------------
| RATE LIMITING
|--------------------------------------------------------------------------
|
| 5 AI generations
| per IP
| per 60 seconds
|
| This is good for your hackathon/local deployment.
|
| IMPORTANT:
| This in-memory limiter is not a permanent distributed
| production solution on serverless hosting because different
| server instances may have different memory.
|
*/

const RATE_LIMIT = 5;

const RATE_WINDOW_MS =
  60 * 1000;

/*
|--------------------------------------------------------------------------
| In-memory request store
|--------------------------------------------------------------------------
*/

const rateLimitStore =
  new Map();

/*
|--------------------------------------------------------------------------
| Get IP address
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
  const now =
    Date.now();

  const current =
    rateLimitStore.get(ip);

  /*
   * First request or expired window.
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
   * Limit reached.
   */
  if (
    current.count >=
    RATE_LIMIT
  ) {
    const retryAfter =
      Math.ceil(
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
   * Increment request count.
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
| Gemini retry detection
|--------------------------------------------------------------------------
*/

function isRetryableGeminiError(
  error
) {
  const message =
    String(
      error?.message || ""
    ).toLowerCase();

  const status =
    error?.status ??
    error?.code ??
    "";

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes(
      "429"
    ) ||
    message.includes(
      "500"
    ) ||
    message.includes(
      "502"
    ) ||
    message.includes(
      "503"
    ) ||
    message.includes(
      "504"
    ) ||
    message.includes(
      "resource_exhausted"
    ) ||
    message.includes(
      "unavailable"
    ) ||
    message.includes(
      "high demand"
    ) ||
    message.includes(
      "overloaded"
    )
  );
}

/*
|--------------------------------------------------------------------------
| Wait helper
|--------------------------------------------------------------------------
*/

function wait(ms) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms
      )
  );
}

/*
|--------------------------------------------------------------------------
| Gemini generation with retry + fallback
|--------------------------------------------------------------------------
*/

async function generateWithFallback(
  systemPrompt
) {
  let lastError =
    null;

  for (
    const model of MODELS
  ) {
    /*
     * Try each model twice.
     */
    for (
      let attempt = 0;
      attempt < 2;
      attempt++
    ) {
      try {
        console.log(
          `Gemini request → ${model} → attempt ${
            attempt + 1
          }`
        );

        const response =
          await ai.models.generateContent(
            {
              model,

              contents:
                systemPrompt,

              config: {
                responseMimeType:
                  "application/json",

                responseSchema:
                  STYLE_SCHEMA,
              },
            }
          );

        return {
          response,
          model,
        };
      } catch (
        error
      ) {
        lastError =
          error;

        console.error(
          `Gemini failed: ${model}, attempt ${
            attempt + 1
          }`,
          error
        );

        /*
         * If this isn't a temporary Gemini
         * error, don't keep retrying.
         */
        if (
          !isRetryableGeminiError(
            error
          )
        ) {
          throw error;
        }

        /*
         * Exponential backoff:
         *
         * attempt 1 → 2 sec
         * attempt 2 → 4 sec
         */
        const delay =
          2000 *
          Math.pow(
            2,
            attempt
          );

        await wait(
          delay
        );
      }
    }
  }

  throw (
    lastError ||
    new Error(
      "All Gemini models are temporarily unavailable."
    )
  );
}

/*
|--------------------------------------------------------------------------
| Gemini structured output schema
|--------------------------------------------------------------------------
*/

const STYLE_SCHEMA = {
  type: "object",

  properties: {
    intent: {
      type: "object",

      properties: {
        occasion: {
          type: "string",
        },

        vibe: {
          type: "string",
        },

        formality: {
          type: "string",
        },

        colorDirection: {
          type: "string",
        },

        summary: {
          type: "string",
        },
      },

      required: [
        "occasion",
        "vibe",
        "formality",
        "colorDirection",
        "summary",
      ],
    },

    selections: {
      type: "array",

      items: {
        type: "object",

        properties: {
          category: {
            type: "string",
            enum: CATEGORIES,
          },

          productId: {
            type: "string",
          },

          reason: {
            type: "string",
          },
        },

        required: [
          "category",
          "productId",
          "reason",
        ],
      },
    },

    overallReason: {
      type: "string",
    },
  },

  required: [
    "intent",
    "selections",
    "overallReason",
  ],
};

/*
|--------------------------------------------------------------------------
| POST /api/style
|--------------------------------------------------------------------------
*/

export async function POST(
  request
) {
  /*
   * -------------------------------------------------------
   * RATE LIMIT CHECK
   * -------------------------------------------------------
   */

  const ip =
    getClientIp(
      request
    );

  const limit =
    checkRateLimit(
      ip
    );

  /*
   * If the user exceeded the limit,
   * immediately stop.
   *
   * IMPORTANT:
   * Gemini is NOT called.
   */

  if (!limit.allowed) {
    return Response.json(
      {
        error:
          "You've generated too many looks. Please wait a moment and try again.",
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

  /*
   * -------------------------------------------------------
   * MAIN REQUEST
   * -------------------------------------------------------
   */

  try {
    const body =
      await request.json();

    /*
     * Prompt
     *
     * Maximum 500 characters.
     */
    const prompt =
      String(
        body?.prompt || ""
      )
        .trim()
        .slice(0, 500);

    /*
     * Catalog
     *
     * Maximum 200 products sent to Gemini.
     */
    const catalog =
      Array.isArray(
        body?.catalog
      )
        ? body.catalog.slice(
            0,
            200
          )
        : [];

    /*
     * Locked items
     */
    const lockedItems =
      Array.isArray(
        body?.lockedItems
      )
        ? body.lockedItems.slice(
            0,
            CATEGORIES.length
          )
        : [];

    /*
     * Previously used items
     */
    const avoidItems =
      Array.isArray(
        body?.avoidItems
      )
        ? body.avoidItems.slice(
            0,
            CATEGORIES.length
          )
        : [];

    if (!catalog.length) {
      return Response.json(
        {
          error:
            "No marketplace products were provided.",
        },
        {
          status: 400,
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

    /*
     * -------------------------------------------------------
     * GROUP CATALOG
     * -------------------------------------------------------
     */

    const catalogByCategory =
      Object.fromEntries(
        CATEGORIES.map(
          (category) => [
            category,

            catalog.filter(
              (item) =>
                item.category ===
                category
            ),
          ]
        )
      );

    /*
     * -------------------------------------------------------
     * AI SYSTEM PROMPT
     * -------------------------------------------------------
     */

    const systemPrompt = `
You are the AI fashion stylist for ThriftMatch.

ThriftMatch is a second-hand fashion marketplace.

Your job is to understand the user's natural-language
fashion request and build a complete outfit using ONLY
real products from the supplied ThriftMatch catalog.

Do NOT rely on literal keyword matching.

Understand what the user actually means.

Reason about:

- occasion
- vibe
- aesthetic
- formality
- silhouette
- color compatibility
- layering
- weather
- practicality
- age/context
- budget
- compatibility between pieces

IMPORTANT RULES:

1. Never invent a product.
2. Never invent a product ID.
3. Never invent a price.
4. Never invent an image.
5. Only select products from the supplied catalog.
6. Select at most one product from each category.
7. Make the outfit coherent as one complete look.
8. Keep locked products unchanged.
9. Prefer different products from the previous outfit
   for unlocked categories.

AVAILABLE CATEGORIES:

outerwear
upperwear
lowerwear
footwear
accessories

NATURAL LANGUAGE EXAMPLE:

"I have my cousin's reception tonight. I want to look
young and stylish but I don't want to look like I'm
going to a corporate office."

Understand this as:

occasion:
wedding reception

vibe:
young / modern / stylish

formality:
smart casual

goal:
polished but not corporate

ANOTHER EXAMPLE:

"I want something that feels like I stole it from my
older brother's 1998 wardrobe but still works for college."

Understand this as:

vibe:
1990s / vintage / relaxed

occasion:
college

aesthetic:
nostalgic streetwear

ANOTHER EXAMPLE:

"Rainy day in the city. Comfortable, slightly edgy,
but not trying too hard."

Understand this as:

occasion:
everyday city

weather:
rain

style:
casual / practical / understated / slightly edgy

LOCKED ITEMS:

The user may manually hold products.

You MUST keep those products.

PREVIOUSLY USED ITEMS:

Avoid these products for unlocked categories when
reasonable so that regeneration produces variety.

BUDGET:

If the user mentions a maximum budget, respect it
whenever the available inventory makes it possible.

REAL THRIFTMATCH CATALOG:

${JSON.stringify(
  catalogByCategory,
  null,
  2
)}

LOCKED ITEMS:

${JSON.stringify(
  lockedItems,
  null,
  2
)}

PREVIOUSLY USED ITEMS:

${JSON.stringify(
  avoidItems,
  null,
  2
)}

USER REQUEST:

${
  prompt ||
  "Create a stylish everyday outfit from the available ThriftMatch inventory."
}

Return only JSON matching the supplied schema.
`;

    /*
     * -------------------------------------------------------
     * GEMINI
     * -------------------------------------------------------
     */

    const {
      response,
      model,
    } =
      await generateWithFallback(
        systemPrompt
      );

    const rawText =
      response.text;

    if (!rawText) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    const result =
      JSON.parse(
        rawText
      );

    /*
     * -------------------------------------------------------
     * VALIDATE GEMINI PRODUCT IDS
     * -------------------------------------------------------
     *
     * Never trust the model to invent valid
     * product IDs.
     */

    const catalogIds =
      new Set(
        catalog.map(
          (item) =>
            item.id
        )
      );

    const seenCategories =
      new Set();

    const seenProducts =
      new Set();

    const validSelections =
      Array.isArray(
        result.selections
      )
        ? result.selections.filter(
            (
              selection
            ) => {
              if (
                !selection ||
                !selection.productId
              ) {
                return false;
              }

              /*
               * Product must actually
               * exist in the catalog.
               */
              if (
                !catalogIds.has(
                  selection.productId
                )
              ) {
                return false;
              }

              /*
               * Category must be valid.
               */
              if (
                !CATEGORIES.includes(
                  selection.category
                )
              ) {
                return false;
              }

              /*
               * One item per category.
               */
              if (
                seenCategories.has(
                  selection.category
                )
              ) {
                return false;
              }

              /*
               * Don't return the same
               * product twice.
               */
              if (
                seenProducts.has(
                  selection.productId
                )
              ) {
                return false;
              }

              seenCategories.add(
                selection.category
              );

              seenProducts.add(
                selection.productId
              );

              return true;
            }
          )
        : [];

    /*
     * -------------------------------------------------------
     * SUCCESS
     * -------------------------------------------------------
     */

    return Response.json(
      {
        model,

        intent:
          result.intent ||
          null,

        selections:
          validSelections,

        overallReason:
          result.overallReason ||
          "",
      },
      {
        status: 200,

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
    console.error(
      "THRIFTMATCH GEMINI ERROR:",
      error
    );

    const retryable =
      isRetryableGeminiError(
        error
      );

    return Response.json(
      {
        error: retryable
          ? "The AI stylist is temporarily busy. Please try again in a few seconds."
          : error?.message ||
            "The AI stylist could not generate a look.",
      },
      {
        status:
          retryable
            ? 503
            : 500,

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