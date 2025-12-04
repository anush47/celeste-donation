export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const approved = searchParams.get("approved") === "true"

  const helpRequests = [
    {
      id: "req_1",
      name: "Perera Family",
      location: "Colombo",
      needTypes: ["Food & Water", "Shelter & Repairs"],
      description: "Family lost home in flooding, needs immediate shelter and food assistance",
      approved: true,
    },
    {
      id: "req_2",
      name: "Hospital Relief",
      location: "Galle",
      needTypes: ["Medical Supplies"],
      description: "Medical facility needs emergency medical supplies",
      approved: true,
    },
  ]

  if (approved) {
    return Response.json(helpRequests.filter((r) => r.approved))
  }
  return Response.json(helpRequests)
}
