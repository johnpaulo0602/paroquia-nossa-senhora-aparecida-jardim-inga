// Must stay first: it adjusts DATABASE_URL and storage for the homologation deployment.
import { getServerURL } from './lib/deploy-env'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { pt } from '@payloadcms/translations/languages/pt'
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
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Notices } from './collections/Notices'
import { Pastorals } from './collections/Pastorals'
import { People } from './collections/People'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { SacramentGuides } from './collections/SacramentGuides'
import { SacramentRequests } from './collections/SacramentRequests'
import { Sponsors } from './collections/Sponsors'
import { TitheInterests } from './collections/TitheInterests'
import { Users } from './collections/Users'
import { ContactPage } from './globals/ContactPage'
import { HomePage } from './globals/HomePage'
import { SecretariatPage } from './globals/SecretariatPage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Neon Object Storage (S3-compatible). Only active when MEDIA_BUCKET is set;
// without it, uploads stay on the local `media/` folder.
const mediaBucket = process.env.MEDIA_BUCKET

export default buildConfig({
  serverURL: getServerURL(),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
    },
    dateFormat: 'dd/MM/yyyy HH:mm',
    // Each collection or global that has a public page sets its own preview address.
    livePreview: {
      breakpoints: [
        { name: 'mobile', label: 'Celular', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 820, height: 1180 },
        { name: 'desktop', label: 'Computador', width: 1440, height: 900 },
      ],
    },
    timezones: {
      defaultTimezone: 'America/Sao_Paulo',
    },
    meta: {
      titleSuffix: ' — Paróquia Nossa Senhora Aparecida',
    },
  },
  defaultDepth: 2,
  maxDepth: 3,
  // The order below is the order of the panel menu.
  collections: [
    // Notícias e avisos
    Posts,
    Highlights,
    Notices,
    // Missas e agenda
    Celebrations,
    CelebrationExceptions,
    Events,
    // A paróquia
    Communities,
    People,
    Pastorals,
    SacramentGuides,
    Projects,
    Sponsors,
    // Mensagens recebidas
    ContactMessages,
    SacramentRequests,
    TitheInterests,
    NewsletterSubscribers,
    // Imagens
    Media,
    // Configurações
    Users,
  ],
  globals: [HomePage, SecretariatPage, ContactPage, SiteSettings],
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },
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
