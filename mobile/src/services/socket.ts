import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import { Lead, ConnectionStatusType } from '../types/lead';

export const DEFAULT_BACKEND_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

let socket: Socket | null = null;
let currentUrl: string = DEFAULT_BACKEND_URL;

export interface SocketCallbacks {
  onStatusChange?: (status: ConnectionStatusType, error?: string) => void;
  onNewLead?: (lead: Lead) => void;
}

export function getCurrentServerUrl(): string {
  return currentUrl;
}

export function connectSocket(
  serverUrl: string = currentUrl,
  callbacks: SocketCallbacks = {}
): Socket {
  currentUrl = serverUrl.trim().replace(/\/$/, '');

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  callbacks.onStatusChange?.('connecting');

  socket = io(currentUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  socket.on('connect', () => {
    console.log('Connected to backend socket server successfully!');
    callbacks.onStatusChange?.('connected');
  });

  socket.on('new_lead', (lead: Lead) => {
    console.log('Received new lead in mobile app:', lead.fullName);
    callbacks.onNewLead?.(lead);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from server:', reason);
    callbacks.onStatusChange?.('disconnected', reason);
  });

  socket.on('connect_error', (error) => {
    console.log('Socket connection error:', error.message);
    callbacks.onStatusChange?.('error', error.message);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export async function fetchHistoricalLeads(serverUrl: string = currentUrl): Promise<Lead[]> {
  try {
    const url = `${serverUrl.trim().replace(/\/$/, '')}/api/leads`;
    const res = await fetch(url);
    const data = await res.json();
    return data.leads || [];
  } catch (err) {
    console.log('Could not fetch historical leads:', err);
    return [];
  }
}

export async function triggerMockLead(serverUrl: string = currentUrl, customData?: Partial<Lead>): Promise<any> {
  const url = `${serverUrl.trim().replace(/\/$/, '')}/api/test-lead`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customData || {}),
  });
  return await res.json();
}
