export type ProfileRaw = {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export type ProfileViewModel = {
  id: string
  email: string
  displayName: string
  memberSince: string
}

export function toProfileViewModel(profile: ProfileRaw): ProfileViewModel {
  const displayName = profile.name ?? profile.email
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return { id: profile.id, email: profile.email, displayName, memberSince }
}
