export type MissionStatus = 'incomplete' | 'completed' | 'failed' | 'skipped'

export interface UserProgress {
  user_id: string
  mission_id: string
  status: MissionStatus
  note: string | null
  updated_at: string
}

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}
