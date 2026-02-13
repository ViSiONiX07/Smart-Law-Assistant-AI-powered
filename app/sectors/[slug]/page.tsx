import { notFound } from "next/navigation"

const data: any = {
  "criminal-law": {
    title: "Criminal Law",
    acts: ["Indian Penal Code (IPC)", "CrPC", "Evidence Act"]
  },
  "cyber-law": {
    title: "Cyber Law",
    acts: ["IT Act 2000", "IPC Cyber Sections"]
  }
}

export default function SectorPage({ params }: any) {
  const sector = data[params.slug]

  if (!sector) return notFound()

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-8">
        {sector.title}
      </h1>

      <h2 className="text-xl font-semibold mb-4">
        Key Acts
      </h2>

      <ul className="list-disc pl-6 text-gray-600 space-y-2">
        {sector.acts.map((act: string, i: number) => (
          <li key={i}>{act}</li>
        ))}
      </ul>
    </main>
  )
}