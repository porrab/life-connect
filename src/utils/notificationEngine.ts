import { type UserProfile } from '@/types/user'

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
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
