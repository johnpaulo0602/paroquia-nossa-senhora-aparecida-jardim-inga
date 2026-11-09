const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

type Relation = number | string | { id: number | string; name?: string | null }
type Origin = 'official' | 'research' | 'archive' | 'demonstration' | null

type CelebrationRule = {
  id: number | string
  title: string
  celebrationType: 'mass' | 'confession' | 'adoration' | 'other'
  community: Relation
  weekday: string
  time: string
  validFrom?: string | null
  validTo?: string | null
  active?: boolean | null
  origin?: Origin
}

type CelebrationException = {
  id: number | string
  title: string
  celebration?: Relation | null
  community: Relation
  date: string
  exceptionType: 'cancellation' | 'change' | 'extra'
  newTime?: string | null
  reason?: string | null
  origin?: Origin
}

const relationID = (relation: Relation | null | undefined) =>
  relation && typeof relation === 'object' ? relation.id : relation

const dateOnly = (value: string) => value.slice(0, 10)

const withinValidity = (rule: CelebrationRule, date: string) =>
  (!rule.validFrom || dateOnly(rule.validFrom) <= date) &&
  (!rule.validTo || dateOnly(rule.validTo) >= date)

export const resolveCelebrationsForDate = (
  rules: CelebrationRule[],
  exceptions: CelebrationException[],
  date: string,
) => {
  const dailyExceptions = exceptions.filter((exception) => dateOnly(exception.date) === date)
  const weekday = weekdays[new Date(`${date}T12:00:00.000Z`).getUTCDay()]

  const regular = rules
    .filter(
      (rule) =>
        rule.active !== false && rule.weekday === weekday && withinValidity(rule, date),
    )
    .map((rule) => {
      const exception = dailyExceptions.find(
        (item) => relationID(item.celebration) === rule.id && item.exceptionType !== 'extra',
      )

      if (exception?.exceptionType === 'cancellation') return null

      return {
        id: String(rule.id),
        title: rule.title,
        celebrationType: rule.celebrationType,
        community: rule.community,
        time: exception?.newTime || rule.time,
        exception: exception || null,
        origin: rule.origin ?? null,
      }
    })
    .filter((item) => item !== null)

  const extras = dailyExceptions
    .filter((exception) => exception.exceptionType === 'extra')
    .map((exception) => ({
      id: `exception-${exception.id}`,
      title: exception.title,
      celebrationType: 'other' as const,
      community: exception.community,
      time: exception.newTime || '00:00',
      exception,
      origin: exception.origin ?? null,
    }))

  return [...regular, ...extras].sort((a, b) => a.time.localeCompare(b.time))
}
