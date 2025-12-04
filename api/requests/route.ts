import { getHelpRequests } from "@/services/request-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const approved = searchParams.get("approved") === "true"

  const requests = await getHelpRequests(approved)
  return Response.json(requests)
}
