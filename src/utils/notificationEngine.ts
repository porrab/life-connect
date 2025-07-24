import { type UserProfile } from '@/types/user'

export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}

export const formatDateTime = (timestamp: any) => {
  if (!timestamp?.seconds) return 'N/A'
  return new Date(timestamp.seconds * 1000).toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getRelevantNotification(userProfile: UserProfile) {
  const age = calculateAge(userProfile.dateOfBirth)

  if (age === 59) {
    return {
      id: 'elderly_allowance',
      title: 'เบี้ยยังชีพผู้สูงอายุ',
      description: 'คุณจะมีอายุครบ 60 ปีในปีหน้า สามารถเตรียมยื่นขอเบี้ยยังชีพได้แล้ว',
      benefit: '600 - 1,000 บาท / เดือน',
      isNew: true,
    }
  }
  if (age > 59) {
    return {
      id: 'elderly_allowance',
      title: 'เบี้ยยังชีพผู้สูงอายุ',
      description: `คุณมีอายุ ${age} แล้ว สามารถเตรียมยื่นขอเบี้ยยังชีพได้แล้ว`,
      benefit: '600 - 1,000 บาท / เดือน',
      isNew: true,
    }
  }
  console.log(' Condition NOT MET.')
  return null
}
