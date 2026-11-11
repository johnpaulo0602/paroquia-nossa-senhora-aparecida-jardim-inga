import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { CelebrationExceptions } from './collections/CelebrationExceptions'
import { Celebrations } from './collections/Celebrations'
import { Communities } from './collections/Communities'
import { ContactMessages } from './collections/ContactMessages'
import { Events } from './collections/Events'
import { Highlights } from './collections/Highlights'
import { Media } from './collections/Media'
import { Milestones } from './collections/Milestones'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Notices } from './collections/Notices'
import { Pastorals } from './collections/Pastorals'
import { People } from './collections/People'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { SacramentGuides } from './collections/SacramentGuides'
import { SacramentRequests } from './collections/SacramentRequests'
import { Sponsors } from './collections/Sponsors'
import { TeamAssignments } from './collections/TeamAssignments'
import { TitheInterests } from './collections/TitheInterests'
import { Users } from './collections/Users'
import { ContactPage } from './globals/ContactPage'
import { ContributionPage } from './globals/ContributionPage'
import { HistoryPage } from './globals/HistoryPage'
import { HomePage } from './globals/HomePage'
import { Navigation } from './globals/Navigation'
import { PastorumPage } from './globals/PastorumPage'
import { PatronPage } from './globals/PatronPage'
import { SecretariatPage } from './globals/SecretariatPage'
import { SiteSettings } from './globals/SiteSettings'
import { SpiritualityPage } from './globals/SpiritualityPage'
import { TitheWallPage } from './globals/TitheWallPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Neon Object Storage (S3-compatible). Only active when MEDIA_BUCKET is set;
// without it, uploads stay on the local `media/` folder.
const mediaBucket = process.env.MEDIA_BUCKET

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dateFormat: 'dd/MM/yyyy HH:mm',
    timezones: {
      defaultTimezone: 'America/Sao_Paulo',
    },
    meta: {
      titleSuffix: ' — Paróquia Nossa Senhora Aparecida',
    },
  },
  defaultDepth: 2,
  maxDepth: 3,
  collections: [
    Users,
    Media,
    Posts,
    Highlights,
    Notices,
    Communities,
    Celebrations,
    CelebrationExceptions,
    Events,
    Milestones,
    People,
    TeamAssignments,
    Pastorals,
    SacramentGuides,
    Projects,
    Sponsors,
    ContactMessages,
    SacramentRequests,
    TitheInterests,
    NewsletterSubscribers,
  ],
  globals: [
    SiteSettings,
    Navigation,
    HomePage,
    HistoryPage,
    PatronPage,
    SecretariatPage,
    ContactPage,
    ContributionPage,
    SpiritualityPage,
    PastorumPage,
    TitheWallPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Push syncs the schema straight into the database and leaves a `dev` row in
    // payload_migrations, which blocks `payload migrate` in CI. Set
    // PAYLOAD_DB_PUSH=false when DATABASE_URL points at a deployed database.
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH !== 'false',
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: Boolean(mediaBucket),
      bucket: mediaBucket || '',
      collections: { media: true },
      config: {
        // Endpoint, region and credentials come from the AWS_* env vars.
        endpoint: process.env.AWS_ENDPOINT_URL_S3,
        region: process.env.AWS_REGION || 'us-east-2',
        forcePathStyle: true, // required by Neon
      },
    }),
  ],
})
