import type { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  firstName: string
  lastName: string
  englishName?: string
  email: string
  dateOfBirth?: string
  isVerified?: boolean
  kycImageUrl?: string
  nationalId?: string
  address?: string
  phoneNumber?: string
  gender?: 'ชาย' | 'หญิง'
}

export interface KycHistory {
  id: string
  submissionDate: string
  status: 'approved' | 'rejected' | 'pending'
  rejectionReason?: string | null
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
