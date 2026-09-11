import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off, Database } from 'firebase/database';
import { TournamentState } from '../types/tournament';

export interface FirebaseConfigType {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const FIREBASE_CONFIG_KEY = 'mlbb_firebase_config_v1';
const TOURNAMENT_ID_KEY = 'mlbb_tournament_room_id_v1';

export const OFFICIAL_DEFAULT_FIREBASE_CONFIG: FirebaseConfigType = {
  apiKey: "AIzaSyC_4Unn7KDvTekePh9VURFVIK0NHq7qNM4",
  authDomain: "mlbb-championship.firebaseapp.com",
  databaseURL: "https://mlbb-championship-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mlbb-championship",
  storageBucket: "mlbb-championship.firebasestorage.app",
  messagingSenderId: "169469309413",
  appId: "1:169469309413:web:bbef8430a36920887fbf0c"
};

export class FirebaseSyncService {
  private db: Database | null = null;
  public isConnected: boolean = false;
  public currentRoomId: string = 'mlbb-championship-2026';

  constructor() {
    this.initFromStorage();
  }

  public initFromStorage(): boolean {
    if (typeof window === 'undefined') return false;
    
    // 1. Check environment variables first (for Vercel / Netlify / .env deployments)
    const env = (import.meta as any)?.env || {};
    const envDatabaseUrl = env.VITE_FIREBASE_DATABASE_URL;
    const envProjectId = env.VITE_FIREBASE_PROJECT_ID;
    if (envDatabaseUrl || envProjectId) {
      const envConfig: FirebaseConfigType = {
        apiKey: env.VITE_FIREBASE_API_KEY,
        databaseURL: envDatabaseUrl,
        projectId: envProjectId,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      };
      if (this.initFirebase(envConfig)) return true;
    }

    // 2. Check localStorage saved config
    const savedConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
    const savedRoom = localStorage.getItem(TOURNAMENT_ID_KEY);
    if (savedRoom) this.currentRoomId = savedRoom;

    if (savedConfig) {
      try {
        const config: FirebaseConfigType = JSON.parse(savedConfig);
        if (this.initFirebase(config)) return true;
      } catch (e) {
        console.error('Failed to parse Firebase config:', e);
      }
    }

    // 3. Official Tournament Default Fallback
    return this.initFirebase(OFFICIAL_DEFAULT_FIREBASE_CONFIG);
  }

  public initFirebase(config: FirebaseConfigType): boolean {
    try {
      if (!config.databaseURL && !config.projectId) return false;

      const app = getApps().length > 0 ? getApp() : initializeApp(config);
      this.db = getDatabase(app);
      this.isConnected = true;
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch (e) {
      console.error('Firebase initialization error:', e);
      this.isConnected = false;
      return false;
    }
  }

  public setRoomId(roomId: string) {
    this.currentRoomId = roomId.trim() || 'mlbb-championship-2026';
    localStorage.setItem(TOURNAMENT_ID_KEY, this.currentRoomId);
  }

  public getSavedConfig(): FirebaseConfigType | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  public removeConfig() {
    this.db = null;
    this.isConnected = false;
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  }

  // Subscribe to real-time updates from cloud
  public subscribeToUpdates(callback: (state: TournamentState) => void): () => void {
    if (!this.db || !this.isConnected) {
      return () => {};
    }

    const tournamentRef = ref(this.db, `tournaments/${this.currentRoomId}`);
    
    const listener = onValue(tournamentRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.matches && data.teams) {
        callback(data as TournamentState);
      }
    }, (error) => {
      console.error('Firebase read error:', error);
    });

    return () => {
      off(tournamentRef, 'value', listener);
    };
  }

  // Push state to cloud database (Admin only)
  public async pushState(state: TournamentState): Promise<boolean> {
    if (!this.db || !this.isConnected) return false;
    try {
      const tournamentRef = ref(this.db, `tournaments/${this.currentRoomId}`);
      await set(tournamentRef, state);
      return true;
    } catch (e) {
      console.error('Firebase write error:', e);
      return false;
    }
  }
}

export const firebaseSync = new FirebaseSyncService();
