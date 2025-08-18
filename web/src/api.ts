const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function uploadImage(file: File) {
  const fd = new FormData()
  fd.append('image', file)
  const res = await fetch(`${base}/api/images`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function listImages() {
  const res = await fetch(`${base}/api/images`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function deleteImage(id: string) {
  const res = await fetch(`${base}/api/images/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
