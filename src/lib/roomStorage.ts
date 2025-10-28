import { Room } from '../App';

const ROOMS_STORAGE_KEY = 'ishrealm_rooms';
const ROOM_EXPIRE_MINUTES = 240; // Rooms expire after 4 hours

interface StoredRoom extends Room {
  createdAt: number;
  participants: Array<{
    id: string;
    name: string;
    isHost: boolean;
    joinedAt: number;
  }>;
  videoState: {
    playing: boolean;
    currentTime: number;
    duration: number;
    playbackSpeed: number;
    lastUpdated: number;
  };
}

// Get all rooms from storage
const getRooms = (): Record<string, StoredRoom> => {
  try {
    const stored = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (!stored) return {};
    
    const rooms = JSON.parse(stored);
    const now = Date.now();
    
    // Filter out expired rooms
    const activeRooms: Record<string, StoredRoom> = {};
    Object.entries(rooms).forEach(([id, room]: [string, any]) => {
      const age = now - room.createdAt;
      if (age < ROOM_EXPIRE_MINUTES * 60 * 1000) {
        activeRooms[id] = room;
      }
    });
    
    // Save back only active rooms
    if (Object.keys(activeRooms).length !== Object.keys(rooms).length) {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(activeRooms));
    }
    
    return activeRooms;
  } catch (error) {
    console.error('Failed to get rooms:', error);
    return {};
  }
};

// Save rooms to storage
const saveRooms = (rooms: Record<string, StoredRoom>) => {
  try {
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  } catch (error) {
    console.error('Failed to save rooms:', error);
  }
};

// Create a new room
export const createRoom = (room: Room): StoredRoom => {
  const rooms = getRooms();
  
  const storedRoom: StoredRoom = {
    ...room,
    createdAt: Date.now(),
    participants: [
      {
        id: '1',
        name: room.hostName,
        isHost: true,
        joinedAt: Date.now(),
      },
    ],
    videoState: {
      playing: false,
      currentTime: 0,
      duration: 0,
      playbackSpeed: 1,
      lastUpdated: Date.now(),
    },
  };
  
  rooms[room.id] = storedRoom;
  saveRooms(rooms);
  
  return storedRoom;
};

// Get a room by ID
export const getRoom = (roomId: string): StoredRoom | null => {
  const rooms = getRooms();
  return rooms[roomId] || null;
};

// Join a room as a participant
export const joinRoom = (roomId: string, userName: string): StoredRoom | null => {
  const rooms = getRooms();
  const room = rooms[roomId];
  
  if (!room) return null;
  
  // Check if user already in room
  const existingParticipant = room.participants.find(p => p.name === userName);
  if (!existingParticipant) {
    room.participants.push({
      id: Date.now().toString(),
      name: userName,
      isHost: false,
      joinedAt: Date.now(),
    });
  }
  
  saveRooms(rooms);
  return room;
};

// Leave a room
export const leaveRoom = (roomId: string, userName: string): void => {
  const rooms = getRooms();
  const room = rooms[roomId];
  
  if (!room) return;
  
  room.participants = room.participants.filter(p => p.name !== userName);
  
  // Delete room if no participants left
  if (room.participants.length === 0) {
    delete rooms[roomId];
  }
  
  saveRooms(rooms);
};

// Update video state
export const updateVideoState = (
  roomId: string,
  videoState: {
    playing: boolean;
    currentTime: number;
    duration: number;
    playbackSpeed: number;
  }
): void => {
  const rooms = getRooms();
  const room = rooms[roomId];
  
  if (!room) return;
  
  room.videoState = {
    ...videoState,
    lastUpdated: Date.now(),
  };
  
  saveRooms(rooms);
};

// Get video state
export const getVideoState = (roomId: string) => {
  const room = getRoom(roomId);
  return room?.videoState || null;
};

// Kick a participant (host only)
export const kickParticipant = (roomId: string, participantName: string): void => {
  const rooms = getRooms();
  const room = rooms[roomId];
  
  if (!room) return;
  
  room.participants = room.participants.filter(p => p.name !== participantName && !p.isHost);
  saveRooms(rooms);
};

// Get participants
export const getParticipants = (roomId: string) => {
  const room = getRoom(roomId);
  return room?.participants || [];
};

// Subscribe to room changes (polling-based for now)
export const subscribeToRoom = (
  roomId: string,
  callback: (room: StoredRoom | null) => void
): () => void => {
  const interval = setInterval(() => {
    const room = getRoom(roomId);
    callback(room);
  }, 1000); // Poll every second
  
  return () => clearInterval(interval);
};

