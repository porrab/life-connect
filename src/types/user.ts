export interface UserProfile {
  uid: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  isVerified?: boolean
  kycImageUrl?: string
  nationalId?: string
  address?: string
  phoneNumber?: string
  gender?: 'ชาย' | 'หญิง'
}
