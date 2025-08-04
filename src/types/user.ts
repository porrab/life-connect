import type { Timestamp } from 'firebase/firestore'

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

export interface HistoryItem {
  id: string
  type: 'kyc' | 'booking'
  timestamp: Timestamp
  title: string
  description: string
  status?: string
  serviceName?: string
}
