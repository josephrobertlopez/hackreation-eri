import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Set these in .env (see .env.example). Without them the app uses bundled sample data.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Supabase's newer "publishable" key; the legacy anon key still works as a fallback.
// EXPO_PUBLIC_ values are bundled into the app in plain text, so NEVER put the secret/service_role key here.
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anonKey
  ? createClient(url, anonKey, { auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true } })
  : null;
