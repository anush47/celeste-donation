import { getPackages } from "@/services/package-service"

export async function GET() {
  const packages = await getPackages()
  return Response.json(packages)
}
