export async function GET() {
  return Response.json([
    {
      id: "pkg_1",
      name: "Family Food Kit",
      description: "Essential food items sufficient for a family",
      items: [
        { name: "Rice (5kg)", unitPrice: 1500, quantity: 1 },
        { name: "Canned Food Pack", unitPrice: 600, quantity: 2 },
      ],
      total: 2700,
    },
    {
      id: "pkg_2",
      name: "Water & Hygiene Kit",
      description: "Clean water and essential hygiene products",
      items: [
        { name: "Drinking Water (20L)", unitPrice: 2000, quantity: 2 },
        { name: "Soap & Sanitizer Set", unitPrice: 800, quantity: 3 },
      ],
      total: 6400,
    },
  ])
}
