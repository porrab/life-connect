import type { UserProfile } from 'firebase/auth'

export interface BenefitEvent {
  id: string
  title: string
  description: string

  eligibility: (user: UserProfile) => boolean
}

const allEvents: BenefitEvent[] = [
  {
    id: 'elderly_allowance',
    title: 'เบี้ยยังชีพผู้สูงอายุ',
    description: 'สิทธิประโยชน์สำหรับผู้สูงอายุสัญชาติไทย',

    eligibility: (user) => {
      if (typeof user.dateOfBirth !== 'string' || !user.dateOfBirth) {
        return false
      }
      const birthDate = new Date(user.dateOfBirth)
      const today = new Date()
      if (isNaN(birthDate.getTime())) {
        return false
      }
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 59
    },
  },
  {
    id: 'child_subsidy',
    title: 'เงินอุดหนุนบุตร',
    description: 'สำหรับครอบครัวที่มีรายได้น้อยและมีบุตรแรกเกิด',

    eligibility: (user) => {
      return false
    },
  },
]

export function getRelevantEvents(userProfile: UserProfile | null): BenefitEvent[] {
  if (!userProfile || typeof userProfile.dateOfBirth !== 'string' || !userProfile.dateOfBirth) {
    return []
  }

  return allEvents.filter((event) => event.eligibility(userProfile))
}
export function getEventById(id: string): BenefitEvent | undefined {
  return allEvents.find((event) => event.id === id)
}
