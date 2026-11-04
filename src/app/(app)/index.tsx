import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Avatar, Button, Card, Chip, ConfirmModal, Logo, Pillars } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { colors, radius } from '@/theme';

type UserRow = { id: string; email: string; name: string; role: string };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Dashboard() {
  const { user, role, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersError, setUsersError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isAdmin = role === 'admin';
  const firstName = (user?.displayName ?? '').split(' ')[0] || 'there';
  const domain = user?.email?.split('@')[1] ?? '';

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        setUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserRow, 'id'>) })));
      } catch {
        setUsersError('Could not load team members. Please try again.');
      }
    })();
  }, [isAdmin]);

  const doSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setConfirming(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top bar */}
      <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <View style={{ width: '100%', maxWidth: 1040, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Logo size={36} />
            {!compact && <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>HB+ Portal</Text>}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar uri={user?.photoURL} name={user?.displayName} email={user?.email} />
            <Button title="Sign out" variant="ghost" compact onPress={() => setConfirming(true)} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <View style={{ width: '100%', maxWidth: 1040, alignSelf: 'center', gap: 16 }}>
          {/* Welcome banner */}
          <View style={{ backgroundColor: colors.primaryDark, borderRadius: radius.xl, padding: compact ? 24 : 36, overflow: 'hidden', gap: 14 }}>
            <View style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: 130, borderWidth: 40, borderColor: 'rgba(255,255,255,0.05)' }} />
            <Chip label={isAdmin ? 'Admin' : 'Team member'} tone="gold" />
            <Text style={{ color: '#fff', fontSize: compact ? 28 : 36, fontWeight: '800', letterSpacing: -0.4 }}>
              {greeting()}, {firstName}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 24, maxWidth: 560 }}>
              You’re signed in to the HB+ portal as {user?.email}.
            </Text>
            <Pillars light />
          </View>

          {/* Info cards */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <Card style={{ flexGrow: 1, flexBasis: 300 }}>
              <SectionTitle>Account</SectionTitle>
              <Row label="Name" value={user?.displayName ?? '—'} />
              <Row label="Email" value={user?.email ?? '—'} />
              <Row label="Domain" value={domain} chip="Verified" />
              <Row label="Role" value={isAdmin ? 'Admin' : 'User'} last />
            </Card>

            <Card style={{ flexGrow: 1, flexBasis: 300 }}>
              <SectionTitle>Your access</SectionTitle>
              <Access ok text="Protected dashboard" />
              <Access ok text="Your profile and account details" />
              <Access ok={isAdmin} text="Team management (admins only)" />
            </Card>
          </View>

          {/* Admin: team */}
          {isAdmin && (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <SectionTitle noMargin>Team members</SectionTitle>
                <Chip label={`${users.length} total`} tone="brand" />
              </View>
              {usersError ? <Text style={{ color: colors.danger, marginVertical: 8 }}>{usersError}</Text> : null}
              {users.map((u, i) => (
                <View
                  key={u.id}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.line }}
                >
                  <Avatar name={u.name} email={u.email} size={36} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.ink, fontWeight: '700' }} numberOfLines={1}>{u.name || u.email}</Text>
                    <Text style={{ color: colors.muted, fontSize: 13 }} numberOfLines={1}>{u.email}</Text>
                  </View>
                  <Chip label={u.role === 'admin' ? 'Admin' : 'User'} tone={u.role === 'admin' ? 'gold' : 'neutral'} />
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>

      <ConfirmModal
        visible={confirming}
        title="Sign out of HB+?"
        message="You’ll need to sign in again with your @hbplus.fit account to get back in."
        confirmLabel="Sign out"
        loading={signingOut}
        onConfirm={doSignOut}
        onCancel={() => setConfirming(false)}
      />
    </View>
  );
}

function SectionTitle({ children, noMargin }: { children: string; noMargin?: boolean }) {
  return <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: noMargin ? 0 : 12 }}>{children}</Text>;
}

function Row({ label, value, chip, last }: { label: string; value: string; chip?: string; last?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <Text style={{ color: colors.muted }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
        <Text style={{ color: colors.ink, fontWeight: '600', flexShrink: 1 }} numberOfLines={1}>{value}</Text>
        {chip ? <Chip label={chip} tone="brand" /> : null}
      </View>
    </View>
  );
}

function Access({ ok, text }: { ok: boolean; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: ok ? colors.primarySoft : colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: ok ? colors.primary : colors.muted, fontWeight: '800', fontSize: 12 }}>{ok ? '✓' : '–'}</Text>
      </View>
      <Text style={{ color: ok ? colors.ink : colors.muted, flex: 1 }}>{text}</Text>
    </View>
  );
}