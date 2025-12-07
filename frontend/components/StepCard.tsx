"use client"

export function StepCard({
  title,
  desc,
}: {
  title: string
  desc: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  )
}
