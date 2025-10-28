import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we have real credentials
export const hasSupabaseConfig = !!(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
)

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
  video_time: number
  duration: number
  last_updated: string
}

export interface ActionRequest {
  id: string
  room_id: string
  user_name: string
  user_id: string
  action_type: 'play' | 'pause' | 'seek' | 'change_video'
  action_data?: any
  status: 'pending' | 'approved' | 'denied'
  created_at: string
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

export const actionRequestService = {
  async createRequest(request: Omit<ActionRequest, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('action_requests')
      .insert([{ ...request, status: 'pending' }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getRequests(roomId: string, status?: 'pending' | 'approved' | 'denied') {
    let query = supabase
      .from('action_requests')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async updateRequestStatus(requestId: string, status: 'approved' | 'denied') {
    const { error } = await supabase
      .from('action_requests')
      .update({ status })
      .eq('id', requestId)
    
    if (error) throw error
  },

  async subscribeToRequests(roomId: string, callback: (request: ActionRequest) => void) {
    return supabase
      .channel(`action_requests:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'action_requests',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        callback(payload.new as ActionRequest)
      })
      .subscribe()
  }
}

// Video Upload Service for Supabase Storage
export const videoUploadService = {
  /**
   * Upload a video file to Supabase Storage
   * Returns the public URL of the uploaded video
   */
  async uploadVideo(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; error: string | null }> {
    if (!hasSupabaseConfig) {
      return {
        url: '',
        error: 'Supabase is not configured. Please add environment variables to enable video uploads.',
      }
    }

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 9)
      const fileExt = file.name.split('.').pop()
      const fileName = `${timestamp}-${randomId}.${fileExt}`
      const filePath = `videos/${fileName}`

      // Simulate progress (Supabase doesn't provide upload progress yet)
      if (onProgress) onProgress(50)

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('ishrealm-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Upload error:', error)
        return {
          url: '',
          error: `Upload failed: ${error.message}`,
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ishrealm-videos')
        .getPublicUrl(filePath)

      if (onProgress) onProgress(100)

      return {
        url: publicUrl,
        error: null,
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      return {
        url: '',
        error: error.message || 'Unknown error occurred during upload',
      }
    }
  },

  /**
   * Delete a video from Supabase Storage
   */
  async deleteVideo(url: string): Promise<{ success: boolean; error: string | null }> {
    if (!hasSupabaseConfig) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      // Extract file path from URL
      const urlParts = url.split('/storage/v1/object/public/ishrealm-videos/')
      if (urlParts.length < 2) {
        return { success: false, error: 'Invalid URL format' }
      }
      
      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('ishrealm-videos')
        .remove([filePath])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}
