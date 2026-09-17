"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/*
|--------------------------------------------------------------------------
| Cart structure
|--------------------------------------------------------------------------
|
| carts/{userId}/items/{productId}
|
| The cart stores ONLY the product ID.
| Product name, image, price, category, etc.
| always come from products/{productId}.
|
|--------------------------------------------------------------------------
*/

export function getCartItemsRef(userId) {
  return collection(
    db,
    "carts",
    userId,
    "items"
  );
}

/*
|--------------------------------------------------------------------------
| Add item
|--------------------------------------------------------------------------
*/

export async function addCartItem(
  userId,
  productId
) {
  if (!userId) {
    throw new Error(
      "You must be signed in to add items to your cart."
    );
  }

  if (!productId) {
    throw new Error(
      "Missing product ID."
    );
  }

  /*
   * Verify the product exists.
   */
  const productRef = doc(
    db,
    "products",
    productId
  );

  const productSnap =
    await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error(
      "This product is no longer available."
    );
  }

  /*
   * Use productId as the cart document ID.
   *
   * This prevents duplicate entries.
   */
  const cartItemRef = doc(
    db,
    "carts",
    userId,
    "items",
    productId
  );

  await setDoc(
    cartItemRef,
    {
      productId,
      addedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Remove item
|--------------------------------------------------------------------------
*/

export async function removeCartItem(
  userId,
  productId
) {
  if (!userId || !productId) {
    return;
  }

  await deleteDoc(
    doc(
      db,
      "carts",
      userId,
      "items",
      productId
    )
  );
}

/*
|--------------------------------------------------------------------------
| Clear cart
|--------------------------------------------------------------------------
*/

export async function clearCart(
  userId
) {
  if (!userId) {
    return;
  }

  const snapshot =
    await getDocs(
      getCartItemsRef(
        userId
      )
    );

  if (snapshot.empty) {
    return;
  }

  const batch =
    writeBatch(db);

  snapshot.docs.forEach(
    (cartDoc) => {
      batch.delete(
        cartDoc.ref
      );
    }
  );

  await batch.commit();
}

/*
|--------------------------------------------------------------------------
| Subscribe to cart
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This version prevents stale asynchronous snapshots
| from overwriting newer cart state.
|--------------------------------------------------------------------------
*/

export function subscribeToCart(
  userId,
  onChange,
  onError
) {
  if (!userId) {
    return () => {};
  }

  const cartRef =
    getCartItemsRef(
      userId
    );

  /*
   * Every Firestore snapshot gets a version number.
   *
   * If snapshot #1 starts loading products,
   * then snapshot #2 arrives because the user
   * added an item, snapshot #1 is no longer allowed
   * to overwrite snapshot #2 when its async work finishes.
   */
  let snapshotVersion = 0;

  const unsubscribe =
    onSnapshot(
      cartRef,
      async (snapshot) => {
        const thisVersion =
          ++snapshotVersion;

        try {
          /*
           * Get product IDs from Firestore cart.
           */
          const productIds =
            snapshot.docs.map(
              (cartDoc) =>
                cartDoc.id
            );

          /*
           * Empty cart.
           */
          if (
            productIds.length === 0
          ) {
            /*
             * Only apply if this is still
             * the newest snapshot.
             */
            if (
              thisVersion ===
              snapshotVersion
            ) {
              onChange([]);
            }

            return;
          }

          /*
           * Load the actual products.
           */
          const products =
            await Promise.all(
              productIds.map(
                async (
                  productId
                ) => {
                  const productRef =
                    doc(
                      db,
                      "products",
                      productId
                    );

                  const productSnap =
                    await getDoc(
                      productRef
                    );

                  if (
                    !productSnap.exists()
                  ) {
                    return null;
                  }

                  const product =
                    productSnap.data();

                  return {
                    id:
                      productSnap.id,

                    ...product,

                    cartAddedAt:
                      snapshot.docs.find(
                        (
                          cartDoc
                        ) =>
                          cartDoc.id ===
                          productId
                      )?.data()
                        ?.addedAt ||
                      null,
                  };
                }
              )
            );

          /*
           * If a newer snapshot arrived while
           * these product requests were running,
           * DO NOT overwrite the newer result.
           */
          if (
            thisVersion !==
            snapshotVersion
          ) {
            return;
          }

          const validProducts =
            products.filter(
              Boolean
            );

          onChange(
            validProducts
          );
        } catch (error) {
          console.error(
            "CART PRODUCT LOAD ERROR:",
            error
          );

          /*
           * Only report the error if this is
           * still the latest snapshot.
           */
          if (
            thisVersion ===
            snapshotVersion
          ) {
            if (onError) {
              onError(error);
            }
          }
        }
      },
      (error) => {
        console.error(
          "CART LISTENER ERROR:",
          error
        );

        if (onError) {
          onError(error);
        }
      }
    );

  return unsubscribe;
}