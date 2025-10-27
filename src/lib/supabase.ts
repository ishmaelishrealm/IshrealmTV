import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Room {
  id: string
  platform: 'youtube' | 'twitch' | 'hosted' | 'local'
  url: string
  host_name: string
  host_id: string
  created_at: string
  updated_at: string
  is_active: boolean
  participant_count: number
}

export interface Participant {
  id: string
  room_id: string
  user_name: string
  user_id: string
  joined_at: string
  is_host: boolean
  is_online: boolean
}

export interface Message {
  id: string
  room_id: string
  user_name: string
  user_id: string
  message: string
  created_at: string
  is_system: boolean
}

export interface VideoState {
  room_id: string
  playing: boolean
  current_time: number
  duration: number
  last_updated: string
}

// Database functions
export const roomService = {
  async createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at' | 'participant_count'>) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([room])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getRoom(roomId: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  async updateRoom(roomId: string, updates: Partial<Room>) {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', roomId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteRoom(roomId: string) {
    const { error } = await supabase
      .from('rooms')
      .update({ is_active: false })
      .eq('id', roomId)
    
    if (error) throw error
  }
}

export const participantService = {
  async joinRoom(roomId: string, participant: Omit<Participant, 'id' | 'joined_at'>) {
    const { data, error } = await supabase
      .from('participants')
      .insert([{ ...participant, room_id: roomId }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async leaveRoom(roomId: string, userId: string) {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId)
    
    if (error) throw error
  },

  async getParticipants(roomId: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_online', true)
      .order('joined_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async updateParticipantStatus(roomId: string, userId: string, isOnline: boolean) {
    const { error } = await supabase
      .from('participants')
      .update({ is_online: isOnline })
      .eq('room_id', roomId)
      .eq('user_id', userId)
    
    if (error) throw error
  }
}

export const messageService = {
  async sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getMessages(roomId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data.reverse()
  },

  async subscribeToMessages(roomId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        callback(payload.new as Message)
      })
      .subscribe()
  }
}

export const videoStateService = {
  async updateVideoState(roomId: string, state: Omit<VideoState, 'room_id' | 'last_updated'>) {
    const { data, error } = await supabase
      .from('video_states')
      .upsert([{ ...state, room_id: roomId }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getVideoState(roomId: string) {
    const { data, error } = await supabase
      .from('video_states')
      .select('*')
      .eq('room_id', roomId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async subscribeToVideoState(roomId: string, callback: (state: VideoState) => void) {
    return supabase
      .channel(`video_state:${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_states',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        callback(payload.new as VideoState)
      })
      .subscribe()
  }
}
