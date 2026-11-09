import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  Church,
  Clock,
  Cross,
  Crown,
  Droplet,
  ExternalLink,
  Flame,
  HandHeart,
  Heart,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Users,
  Waves,
  X,
  type LucideIcon,
} from 'lucide-react'

/**
 * The site's icon set (Lucide, 1.75 stroke, currentColor). Names are Lucide's own
 * kebab-case names — the same ones editors type in the CMS — plus a few legacy keys.
 */
const icons = {
  arrow: ArrowRight,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  arrowLeft: ArrowLeft,
  book: BookOpen,
  'book-open': BookOpen,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  check: Check,
  'chevron-down': ChevronDown,
  chevronDown: ChevronDown,
  church: Church,
  clock: Clock,
  close: X,
  cross: Cross,
  crown: Crown,
  droplet: Droplet,
  external: ExternalLink,
  'external-link': ExternalLink,
  flame: Flame,
  'hand-heart': HandHeart,
  heart: Heart,
  'heart-handshake': HeartHandshake,
  location: MapPin,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  'message-circle': MessageCircle,
  phone: Phone,
  users: Users,
  waves: Waves,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons

/** Portuguese keywords editors may type in the CMS instead of an icon name. */
const aliases: Record<string, IconName> = {
  batismo: 'droplet',
  catequese: 'book-open',
  crisma: 'flame',
  eucaristia: 'flame',
  mapa: 'map-pin',
  matrimonio: 'heart-handshake',
  matrimônio: 'heart-handshake',
  missas: 'clock',
  pastorais: 'users',
  secretaria: 'phone',
  whatsapp: 'message-circle',
}

/** Resolves a free-text icon name from the CMS, falling back when it isn't known. */
export function resolveIcon(name: string | null | undefined, fallback: IconName): IconName {
  const key = name?.trim().toLowerCase()
  if (!key) return fallback
  if (key in icons) return key as IconName
  return aliases[key] ?? fallback
}

type IconProps = {
  name: IconName
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const Component = icons[name]

  return (
    <Component
      aria-hidden="true"
      className={className ? `icon ${className}` : 'icon'}
      focusable="false"
      strokeWidth={1.75}
    />
  )
}
