import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Layout() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}