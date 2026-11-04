import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Button, Card, ErrorText, GoogleMark, Logo, Pillars } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { friendlyAuthError } from '@/lib/authErrors';
import { colors } from '@/theme';

export default function Login() {
  const { authError, clearError } = useAuth();
  const googleSignIn = useGoogleSignIn();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authError) setBusy(false);
  }, [authError]);

  const onGoogle = async () => {
    setBusy(true);
    setError('');
    clearError();
    try {
      await googleSignIn();
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        setBusy(false);
        return;
      }
      setError(e?.code ? friendlyAuthError(e) : (e?.message ?? 'Something went wrong.'));
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: wide ? 'row' : 'column', backgroundColor: colors.bg }}>
      {wide ? <BrandPanel /> : <MobileHeader />}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={{ width: '100%', maxWidth: 420, padding: 32 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.ink }}>Welcome back</Text>
            <Text style={{ color: colors.muted, marginTop: 6, marginBottom: 24, lineHeight: 21 }}>
              Sign in with your official <Text style={{ color: colors.primary, fontWeight: '700' }}>@hbplus.fit</Text> Google account to open the portal.
            </Text>

            <ErrorText message={authError || error} />

            <Button
              title={busy ? 'Signing you in…' : 'Continue with Google'}
              variant="google"
              icon={busy ? undefined : <GoogleMark />}
              onPress={onGoogle}
              loading={busy}
            />

            <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 22 }} />
            <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19 }}>
              Access is limited to hbplus.fit accounts. Personal Gmail accounts can’t sign in.
            </Text>
          </Card>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 20 }}>© {new Date().getFullYear()} HB+ · hbplus.fit</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function BrandPanel() {
  return (
    <View style={{ flex: 1.1, backgroundColor: colors.primaryDark, padding: 56, justifyContent: 'space-between', overflow: 'hidden' }}>
      {/* single decorative ring */}
      <View style={{ position: 'absolute', right: -140, bottom: -140, width: 420, height: 420, borderRadius: 210, borderWidth: 56, borderColor: 'rgba(255,255,255,0.05)' }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Logo light />
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>HB+ Portal</Text>
      </View>

      <View style={{ gap: 20, maxWidth: 520 }}>
        <Text style={{ color: '#fff', fontSize: 46, fontWeight: '800', lineHeight: 52, letterSpacing: -0.5 }}>
          Wellness that understands your lifestyle.
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, lineHeight: 26 }}>
          Expert-led, science-backed care across fitness, nutrition, mental health and recovery, all in one place.
        </Text>
        <Pillars light />
      </View>

      <View style={{ flexDirection: 'row', gap: 40 }}>
        <Stat value="1550+" label="Lives transformed" />
        <Stat value="59800+" label="Sessions completed" />
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function MobileHeader() {
  return (
    <View style={{ backgroundColor: colors.primaryDark, paddingTop: Platform.OS === 'web' ? 32 : 64, paddingBottom: 32, paddingHorizontal: 24, gap: 14, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Logo size={38} light />
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>HB+ Portal</Text>
      </View>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 32 }}>Wellness that understands your lifestyle.</Text>
      <Pillars light />
    </View>
  );
}