export type User = {
  id: number
  googleId: string
  email: string | null
  picture: string | null
  name: string | null
  familyid: number | null
  isOnboarding: boolean
  createdAt: Date
  updatedAt: Date
}
