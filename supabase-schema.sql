-- Supabase Database Schema for ISHREALM TV
-- Run this SQL in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY DEFAULT 'ISH-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'twitch', 'hosted', 'local')),
  url TEXT NOT NULL,
  host_name TEXT NOT NULL,
  host_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  participant_count INTEGER DEFAULT 0
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_host BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT TRUE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_system BOOLEAN DEFAULT FALSE
);

-- Create video_states table
CREATE TABLE IF NOT EXISTS video_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  playing BOOLEAN DEFAULT FALSE,
  current_time DECIMAL DEFAULT 0,
  duration DECIMAL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_participants_room ON participants(room_id);
CREATE INDEX IF NOT EXISTS idx_participants_online ON participants(is_online);
CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_video_states_room ON video_states(room_id);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_states ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to active rooms" ON rooms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public insert access to rooms" ON rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to rooms" ON rooms
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to participants" ON participants
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to participants" ON participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to participants" ON participants
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to participants" ON participants
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access to messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to video states" ON video_states
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to video states" ON video_states
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to video states" ON video_states
  FOR UPDATE USING (true);

-- Create functions for real-time updates
CREATE OR REPLACE FUNCTION update_room_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_room_updated_at();

-- Function to update participant count
CREATE OR REPLACE FUNCTION update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rooms SET participant_count = participant_count + 1 WHERE id = NEW.room_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE rooms SET participant_count = participant_count - 1 WHERE id = OLD.room_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_participant_count_trigger
  AFTER INSERT OR DELETE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_participant_count();

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE video_states;
