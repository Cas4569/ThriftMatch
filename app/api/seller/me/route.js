import {
  requireApprovedSeller,
  authErrorResponse,
} from "@/lib/serverAuth";

export async function GET(request) {
  try {
    const {
      user,
      application,
    } =
      await requireApprovedSeller(
        request
      );

    return Response.json({
      approved: true,

      seller: {
        uid: user.uid,
        email: user.email,

        applicationId:
          application.id,

        fullName:
          application.fullName,

        storeName:
          application.storeName,

        sellerType:
          application.sellerType,
      },
    });
  } catch (error) {
    return authErrorResponse(
      error
    );
  }
}