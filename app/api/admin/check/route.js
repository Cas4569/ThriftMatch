import {
  requireAdmin,
  authErrorResponse,
} from "@/lib/serverAuth";

export async function GET(request) {
  try {
    await requireAdmin(request);

    return Response.json({
      isAdmin: true,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
