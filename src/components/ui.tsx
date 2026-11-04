import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, shadow } from '@/theme';

/* ---------- Brand ---------- */
export function Logo({ size = 44, light = false }: { size?: number; light?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: light ? '#fff' : colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
    >
      <Text style={{ color: light ? colors.primary : '#fff', fontWeight: '800', fontSize: size * 0.36 }}>HB</Text>
      <Text style={{ color: colors.accent, fontWeight: '800', fontSize: size * 0.36 }}>+</Text>
    </View>
  );
}

export function Pillars({ light = false }: { light?: boolean }) {
  const items = [
    { label: 'Body', color: colors.body },
    { label: 'Mind', color: colors.mind },
    { label: 'Gut', color: colors.gut },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      {items.map((i) => (
        <View
          key={i.label}
          style={[
            s.pillar,
            { backgroundColor: light ? 'rgba(255,255,255,0.1)' : colors.bg, borderColor: light ? 'rgba(255,255,255,0.18)' : colors.line },
          ]}
        >
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i.color }} />
          <Text style={{ color: light ? '#fff' : colors.ink, fontWeight: '600', fontSize: 13 }}>{i.label}</Text>
        </View>
      ))}
    </View>
  );
}

/* ---------- Primitives ---------- */
export function Card({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Chip({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'brand' | 'gold' }) {
  const bg = tone === 'brand' ? colors.primarySoft : tone === 'gold' ? '#FBF0D2' : colors.bg;
  const fg = tone === 'brand' ? colors.primary : tone === 'gold' ? '#7A5A0A' : colors.muted;
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' }}>
      <Text style={{ color: fg, fontWeight: '700', fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function initials(name?: string | null, email?: string | null) {
  const src = (name || email || '?').trim();
  const parts = src.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
}

export function Avatar({ uri, name, email, size = 40 }: { uri?: string | null; name?: string | null; email?: string | null; size?: number }) {
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.primary, fontWeight: '800', fontSize: size * 0.36 }}>{initials(name, email)}</Text>
    </View>
  );
}

/* ---------- Button ---------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'google' | 'danger';

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  icon,
  compact,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  icon?: ReactNode;
  compact?: boolean;
}) {
  const v = variants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      accessibilityRole="button"
      style={({ pressed, hovered }: any) => [
        s.button,
        compact && { paddingVertical: 9, paddingHorizontal: 14, marginTop: 0 },
        { backgroundColor: hovered || pressed ? v.bgHover : v.bg, borderColor: v.border },
        (loading || disabled) && { opacity: 0.6 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {icon}
          <Text style={[s.buttonText, { color: v.fg }, compact && { fontSize: 14 }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const variants: Record<Variant, { bg: string; bgHover: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, bgHover: colors.primaryDark, fg: '#fff', border: colors.primary },
  secondary: { bg: colors.primarySoft, bgHover: '#CBE8E0', fg: colors.primary, border: 'transparent' },
  ghost: { bg: 'transparent', bgHover: colors.bg, fg: colors.ink, border: colors.line },
  google: { bg: '#fff', bgHover: '#F8FAF9', fg: colors.ink, border: colors.line },
  danger: { bg: colors.danger, bgHover: '#912018', fg: '#fff', border: colors.danger },
};

export function GoogleMark() {
  return (
    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#4285F4', fontWeight: '800', fontSize: 13 }}>G</Text>
    </View>
  );
}

/* ---------- Feedback ---------- */
export function ErrorText({ message }: { message?: string }) {
  return message ? (
    <View style={s.errorBox} accessibilityRole="alert">
      <View style={s.errorDot}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>!</Text></View>
      <Text style={s.error}>{message}</Text>
    </View>
  ) : null;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  loading,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={s.overlay}>
        <View style={[s.modal, shadow]}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink }}>{title}</Text>
          <Text style={{ color: colors.muted, marginTop: 6, marginBottom: 20, lineHeight: 21 }}>{message}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><Button title="Cancel" variant="ghost" onPress={onCancel} disabled={loading} /></View>
            <View style={{ flex: 1 }}><Button title={confirmLabel} variant="danger" onPress={onConfirm} loading={loading} /></View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 24,
    ...(shadow as object),
  },
  pillar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1 },
  button: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: { fontWeight: '700', fontSize: 16 },
  errorBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerLine,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 14,
  },
  errorDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  error: { color: colors.danger, fontSize: 14, flex: 1, lineHeight: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(11,43,42,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: radius.lg, padding: 24 },
});