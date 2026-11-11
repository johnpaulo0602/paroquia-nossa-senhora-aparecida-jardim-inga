import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // "Atribuições de equipe" is merged into "Clero e equipe" (people). Keep each person's
  // role before the old table is dropped: the current assignment wins, then the first one.
  await db.execute(sql`
   CREATE TABLE "_migration_team_roles" AS
   SELECT DISTINCT ON ("person_id")
     "person_id", "role_title", "role_type"::text AS "role_type", "area", "order", "current"
   FROM "team_assignments"
   WHERE "person_id" IS NOT NULL
   ORDER BY "person_id", "current" DESC NULLS LAST, "order" ASC NULLS LAST, "id" ASC;`)

  await db.execute(sql`
   CREATE TYPE "public"."enum_highlights_internal_path" AS ENUM('/', '/comunicacao', '/agenda', '/horarios', '/secretaria', '/contato', '/paroquia', '/padroeira', '/equipe', '/comunidades', '/vida', '/vida/batismo', '/vida/catequese', '/vida/matrimonio', '/vida/pastorais', '/vida/in-cordibus-pastorum', '/vida/espiritualidade', '/vida/mural-do-dizimo', '/projetos', '/contribuir');
  CREATE TYPE "public"."enum__highlights_v_version_internal_path" AS ENUM('/', '/comunicacao', '/agenda', '/horarios', '/secretaria', '/contato', '/paroquia', '/padroeira', '/equipe', '/comunidades', '/vida', '/vida/batismo', '/vida/catequese', '/vida/matrimonio', '/vida/pastorais', '/vida/in-cordibus-pastorum', '/vida/espiritualidade', '/vida/mural-do-dizimo', '/projetos', '/contribuir');
  CREATE TYPE "public"."enum_notices_internal_path" AS ENUM('/', '/comunicacao', '/agenda', '/horarios', '/secretaria', '/contato', '/paroquia', '/padroeira', '/equipe', '/comunidades', '/vida', '/vida/batismo', '/vida/catequese', '/vida/matrimonio', '/vida/pastorais', '/vida/in-cordibus-pastorum', '/vida/espiritualidade', '/vida/mural-do-dizimo', '/projetos', '/contribuir');
  CREATE TYPE "public"."enum__notices_v_version_internal_path" AS ENUM('/', '/comunicacao', '/agenda', '/horarios', '/secretaria', '/contato', '/paroquia', '/padroeira', '/equipe', '/comunidades', '/vida', '/vida/batismo', '/vida/catequese', '/vida/matrimonio', '/vida/pastorais', '/vida/in-cordibus-pastorum', '/vida/espiritualidade', '/vida/mural-do-dizimo', '/projetos', '/contribuir');
  CREATE TYPE "public"."enum_celebrations_time" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum__celebrations_v_version_time" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum_celebration_exceptions_new_time" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum__celebration_exceptions_v_version_new_time" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum_people_role_type" AS ENUM('clergy', 'administration', 'pastoral', 'service');
  CREATE TYPE "public"."enum__people_v_version_role_type" AS ENUM('clergy', 'administration', 'pastoral', 'service');
  CREATE TYPE "public"."enum_pastorals_meeting_info_time" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum__pastorals_v_version_meeting_info_time" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum_home_page_service_links_icon" AS ENUM('cross', 'clock', 'church', 'book-open', 'droplet', 'flame', 'heart', 'heart-handshake', 'users', 'phone', 'mail', 'message-circle', 'map-pin', 'calendar-days');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_service_links_icon" AS ENUM('cross', 'clock', 'church', 'book-open', 'droplet', 'flame', 'heart', 'heart-handshake', 'users', 'phone', 'mail', 'message-circle', 'map-pin', 'calendar-days');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_secretariat_hours_opens_at" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum_site_settings_secretariat_hours_closes_at" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum_site_settings_secretariat_hours_second_opens_at" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TYPE "public"."enum_site_settings_secretariat_hours_second_closes_at" AS ENUM('05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45');
  CREATE TABLE "_home_page_v_version_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"url" varchar,
  	"icon" "enum__home_page_v_version_service_links_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_faith_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_show_communication" boolean DEFAULT true,
  	"version_communication_title" varchar,
  	"version_communication_intro" varchar,
  	"version_participation_title" varchar,
  	"version_participation_body" varchar,
  	"version_participation_image_id" integer,
  	"version_show_agenda" boolean DEFAULT true,
  	"version_show_sacraments" boolean DEFAULT true,
  	"version_sacraments_title" varchar,
  	"version_sacraments_intro" varchar,
  	"version_show_communities" boolean DEFAULT true,
  	"version_communities_title" varchar,
  	"version_communities_intro" varchar,
  	"version_show_projects" boolean DEFAULT true,
  	"version_projects_title" varchar,
  	"version_projects_intro" varchar,
  	"version_show_sponsors" boolean DEFAULT true,
  	"version_sponsors_title" varchar,
  	"version_sponsors_intro" varchar,
  	"version_show_faith" boolean DEFAULT true,
  	"version_faith_title" varchar,
  	"version_faith_intro" varchar,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "milestones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_milestones_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_assignments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_assignments_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header_groups_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_groups_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "history_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "patron_page_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "patron_page_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "patron_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contribution_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spirituality_page_practices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spirituality_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pastorum_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tithe_wall_page_reasons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tithe_wall_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "milestones" CASCADE;
  DROP TABLE "_milestones_v" CASCADE;
  DROP TABLE "team_assignments" CASCADE;
  DROP TABLE "_team_assignments_v" CASCADE;
  DROP TABLE "navigation_header_groups_links" CASCADE;
  DROP TABLE "navigation_header_groups" CASCADE;
  DROP TABLE "navigation_footer_groups_links" CASCADE;
  DROP TABLE "navigation_footer_groups" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "history_page" CASCADE;
  DROP TABLE "patron_page_facts" CASCADE;
  DROP TABLE "patron_page_sources" CASCADE;
  DROP TABLE "patron_page" CASCADE;
  DROP TABLE "contribution_page" CASCADE;
  DROP TABLE "spirituality_page_practices" CASCADE;
  DROP TABLE "spirituality_page" CASCADE;
  DROP TABLE "pastorum_page" CASCADE;
  DROP TABLE "tithe_wall_page_reasons" CASCADE;
  DROP TABLE "tithe_wall_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_milestones_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_team_assignments_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_milestones_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_team_assignments_id_idx";
  ALTER TABLE "posts" ALTER COLUMN "format" SET DEFAULT 'news';
  ALTER TABLE "posts" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_posts_v" ALTER COLUMN "version_format" SET DEFAULT 'news';
  ALTER TABLE "_posts_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "highlights" ALTER COLUMN "internal_path" SET DATA TYPE "public"."enum_highlights_internal_path" USING "internal_path"::"public"."enum_highlights_internal_path";
  ALTER TABLE "highlights" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_highlights_v" ALTER COLUMN "version_internal_path" SET DATA TYPE "public"."enum__highlights_v_version_internal_path" USING "version_internal_path"::"public"."enum__highlights_v_version_internal_path";
  ALTER TABLE "_highlights_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "notices" ALTER COLUMN "internal_path" SET DATA TYPE "public"."enum_notices_internal_path" USING "internal_path"::"public"."enum_notices_internal_path";
  ALTER TABLE "notices" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_notices_v" ALTER COLUMN "version_internal_path" SET DATA TYPE "public"."enum__notices_v_version_internal_path" USING "version_internal_path"::"public"."enum__notices_v_version_internal_path";
  ALTER TABLE "_notices_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "communities" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_communities_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "celebrations" ALTER COLUMN "celebration_type" SET DEFAULT 'mass';
  ALTER TABLE "celebrations" ALTER COLUMN "time" SET DATA TYPE "public"."enum_celebrations_time" USING "time"::"public"."enum_celebrations_time";
  ALTER TABLE "celebrations" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_celebrations_v" ALTER COLUMN "version_celebration_type" SET DEFAULT 'mass';
  ALTER TABLE "_celebrations_v" ALTER COLUMN "version_time" SET DATA TYPE "public"."enum__celebrations_v_version_time" USING "version_time"::"public"."enum__celebrations_v_version_time";
  ALTER TABLE "_celebrations_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "celebration_exceptions" ALTER COLUMN "exception_type" SET DEFAULT 'cancellation';
  ALTER TABLE "celebration_exceptions" ALTER COLUMN "new_time" SET DATA TYPE "public"."enum_celebration_exceptions_new_time" USING "new_time"::"public"."enum_celebration_exceptions_new_time";
  ALTER TABLE "celebration_exceptions" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_celebration_exceptions_v" ALTER COLUMN "version_exception_type" SET DEFAULT 'cancellation';
  ALTER TABLE "_celebration_exceptions_v" ALTER COLUMN "version_new_time" SET DATA TYPE "public"."enum__celebration_exceptions_v_version_new_time" USING "version_new_time"::"public"."enum__celebration_exceptions_v_version_new_time";
  ALTER TABLE "_celebration_exceptions_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "events" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_events_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "people" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_people_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "pastorals_meeting_info" ALTER COLUMN "time" SET DATA TYPE "public"."enum_pastorals_meeting_info_time" USING "time"::"public"."enum_pastorals_meeting_info_time";
  ALTER TABLE "pastorals" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_pastorals_v_version_meeting_info" ALTER COLUMN "time" SET DATA TYPE "public"."enum__pastorals_v_version_meeting_info_time" USING "time"::"public"."enum__pastorals_v_version_meeting_info_time";
  ALTER TABLE "_pastorals_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "sacrament_guides" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_sacrament_guides_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "projects" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_projects_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "sponsors" ALTER COLUMN "origin" SET DEFAULT 'official';
  ALTER TABLE "_sponsors_v" ALTER COLUMN "version_origin" SET DEFAULT 'official';
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "opens_at" SET DATA TYPE "public"."enum_site_settings_secretariat_hours_opens_at" USING "opens_at"::"public"."enum_site_settings_secretariat_hours_opens_at";
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "closes_at" SET DATA TYPE "public"."enum_site_settings_secretariat_hours_closes_at" USING "closes_at"::"public"."enum_site_settings_secretariat_hours_closes_at";
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "second_opens_at" SET DATA TYPE "public"."enum_site_settings_secretariat_hours_second_opens_at" USING "second_opens_at"::"public"."enum_site_settings_secretariat_hours_second_opens_at";
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "second_closes_at" SET DATA TYPE "public"."enum_site_settings_secretariat_hours_second_closes_at" USING "second_closes_at"::"public"."enum_site_settings_secretariat_hours_second_closes_at";
  ALTER TABLE "home_page_service_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_home_page_service_links_icon" USING "icon"::"public"."enum_home_page_service_links_icon";
  ALTER TABLE "_posts_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_communities_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_events_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "people" ADD COLUMN "role_title" varchar;
  ALTER TABLE "people" ADD COLUMN "role_type" "enum_people_role_type" DEFAULT 'service';
  ALTER TABLE "people" ADD COLUMN "area" varchar;
  ALTER TABLE "people" ADD COLUMN "current" boolean DEFAULT true;
  ALTER TABLE "people" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "_people_v" ADD COLUMN "version_role_title" varchar;
  ALTER TABLE "_people_v" ADD COLUMN "version_role_type" "enum__people_v_version_role_type" DEFAULT 'service';
  ALTER TABLE "_people_v" ADD COLUMN "version_area" varchar;
  ALTER TABLE "_people_v" ADD COLUMN "version_current" boolean DEFAULT true;
  ALTER TABLE "_people_v" ADD COLUMN "version_order" numeric DEFAULT 0;
  ALTER TABLE "_pastorals_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "home_page" ADD COLUMN "_status" "enum_home_page_status" DEFAULT 'draft';
  ALTER TABLE "_home_page_v_version_service_links" ADD CONSTRAINT "_home_page_v_version_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_faith_links" ADD CONSTRAINT "_home_page_v_version_faith_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_participation_image_id_media_id_fk" FOREIGN KEY ("version_participation_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_home_page_v_version_service_links_order_idx" ON "_home_page_v_version_service_links" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_service_links_parent_id_idx" ON "_home_page_v_version_service_links" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_faith_links_order_idx" ON "_home_page_v_version_faith_links" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_faith_links_parent_id_idx" ON "_home_page_v_version_faith_links" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_version_participation_image_idx" ON "_home_page_v" USING btree ("version_participation_image_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_autosave_idx" ON "_home_page_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_communities_v_autosave_idx" ON "_communities_v" USING btree ("autosave");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "_pastorals_v_autosave_idx" ON "_pastorals_v" USING btree ("autosave");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "milestones_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_assignments_id";
  DROP TYPE "public"."enum_milestones_context";
  DROP TYPE "public"."enum_milestones_date_precision";
  DROP TYPE "public"."enum_milestones_origin";
  DROP TYPE "public"."enum_milestones_verification";
  DROP TYPE "public"."enum_milestones_status";
  DROP TYPE "public"."enum__milestones_v_version_context";
  DROP TYPE "public"."enum__milestones_v_version_date_precision";
  DROP TYPE "public"."enum__milestones_v_version_origin";
  DROP TYPE "public"."enum__milestones_v_version_verification";
  DROP TYPE "public"."enum__milestones_v_version_status";
  DROP TYPE "public"."enum_team_assignments_role_type";
  DROP TYPE "public"."enum_team_assignments_origin";
  DROP TYPE "public"."enum_team_assignments_verification";
  DROP TYPE "public"."enum_team_assignments_status";
  DROP TYPE "public"."enum__team_assignments_v_version_role_type";
  DROP TYPE "public"."enum__team_assignments_v_version_origin";
  DROP TYPE "public"."enum__team_assignments_v_version_verification";
  DROP TYPE "public"."enum__team_assignments_v_version_status";`)

  await db.execute(sql`
   UPDATE "people" p SET
     "role_title" = r."role_title",
     "role_type" = r."role_type"::"enum_people_role_type",
     "area" = r."area",
     "order" = COALESCE(r."order", 0),
     "current" = COALESCE(r."current", true)
   FROM "_migration_team_roles" r WHERE r."person_id" = p."id";
   -- People without a team role (for example, article authors) stay off the team page.
   UPDATE "people" p SET "current" = false
   WHERE NOT EXISTS (SELECT 1 FROM "_migration_team_roles" r WHERE r."person_id" = p."id");
   UPDATE "_people_v" v SET
     "version_role_title" = p."role_title",
     "version_role_type" = p."role_type"::text::"enum__people_v_version_role_type",
     "version_area" = p."area",
     "version_order" = p."order",
     "version_current" = p."current"
   FROM "people" p WHERE v."parent_id" = p."id";
   DROP TABLE "_migration_team_roles";
   -- The home page gains drafts; what is live today stays published.
   UPDATE "home_page" SET "_status" = 'published';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_milestones_context" AS ENUM('parish', 'patron');
  CREATE TYPE "public"."enum_milestones_date_precision" AS ENUM('exact', 'year', 'period', 'text');
  CREATE TYPE "public"."enum_milestones_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_milestones_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_milestones_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__milestones_v_version_context" AS ENUM('parish', 'patron');
  CREATE TYPE "public"."enum__milestones_v_version_date_precision" AS ENUM('exact', 'year', 'period', 'text');
  CREATE TYPE "public"."enum__milestones_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__milestones_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__milestones_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_assignments_role_type" AS ENUM('clergy', 'administration', 'pastoral', 'service');
  CREATE TYPE "public"."enum_team_assignments_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_team_assignments_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_team_assignments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_assignments_v_version_role_type" AS ENUM('clergy', 'administration', 'pastoral', 'service');
  CREATE TYPE "public"."enum__team_assignments_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__team_assignments_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__team_assignments_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "milestones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"context" "enum_milestones_context",
  	"title" varchar,
  	"body" jsonb,
  	"date_precision" "enum_milestones_date_precision" DEFAULT 'text',
  	"exact_date" timestamp(3) with time zone,
  	"year" numeric,
  	"period_label" varchar,
  	"display_label" varchar,
  	"order" numeric,
  	"image_id" integer,
  	"source_name" varchar,
  	"source_url" varchar,
  	"origin" "enum_milestones_origin" DEFAULT 'research',
  	"verification" "enum_milestones_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_milestones_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_milestones_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_context" "enum__milestones_v_version_context",
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_date_precision" "enum__milestones_v_version_date_precision" DEFAULT 'text',
  	"version_exact_date" timestamp(3) with time zone,
  	"version_year" numeric,
  	"version_period_label" varchar,
  	"version_display_label" varchar,
  	"version_order" numeric,
  	"version_image_id" integer,
  	"version_source_name" varchar,
  	"version_source_url" varchar,
  	"version_origin" "enum__milestones_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__milestones_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__milestones_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "team_assignments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"person_id" integer,
  	"role_title" varchar,
  	"role_type" "enum_team_assignments_role_type",
  	"area" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"order" numeric DEFAULT 0,
  	"current" boolean DEFAULT true,
  	"origin" "enum_team_assignments_origin" DEFAULT 'research',
  	"verification" "enum_team_assignments_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_assignments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_team_assignments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_person_id" integer,
  	"version_role_title" varchar,
  	"version_role_type" "enum__team_assignments_v_version_role_type",
  	"version_area" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_order" numeric DEFAULT 0,
  	"version_current" boolean DEFAULT true,
  	"version_origin" "enum__team_assignments_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__team_assignments_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_assignments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "navigation_header_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"external" boolean
  );
  
  CREATE TABLE "navigation_header_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"external" boolean
  );
  
  CREATE TABLE "navigation_footer_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_cta_label" varchar,
  	"header_cta_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "history_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"cover_id" integer,
  	"cover_caption" varchar,
  	"contribution_title" varchar,
  	"contribution_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "patron_page_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "patron_page_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "patron_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"cover_id" integer,
  	"cover_caption" varchar,
  	"reading_title" varchar,
  	"reading_body" varchar,
  	"reading_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contribution_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"body" jsonb,
  	"donation_notice" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "spirituality_page_practices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "spirituality_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"hero_image_id" integer,
  	"hero_title" varchar,
  	"hero_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pastorum_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"section_title" varchar,
  	"section_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "tithe_wall_page_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "tithe_wall_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"birthdays_title" varchar,
  	"birthdays_intro" varchar,
  	"tithe_title" varchar,
  	"tithe_body" jsonb,
  	"interest_title" varchar,
  	"interest_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "_home_page_v_version_service_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_faith_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_home_page_v_version_service_links" CASCADE;
  DROP TABLE "_home_page_v_version_faith_links" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP INDEX "_posts_v_autosave_idx";
  DROP INDEX "_events_v_autosave_idx";
  DROP INDEX "_communities_v_autosave_idx";
  DROP INDEX "_pastorals_v_autosave_idx";
  DROP INDEX "home_page__status_idx";
  ALTER TABLE "posts" ALTER COLUMN "format" DROP DEFAULT;
  ALTER TABLE "posts" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_posts_v" ALTER COLUMN "version_format" DROP DEFAULT;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "highlights" ALTER COLUMN "internal_path" SET DATA TYPE varchar;
  ALTER TABLE "highlights" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_highlights_v" ALTER COLUMN "version_internal_path" SET DATA TYPE varchar;
  ALTER TABLE "_highlights_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "notices" ALTER COLUMN "internal_path" SET DATA TYPE varchar;
  ALTER TABLE "notices" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_notices_v" ALTER COLUMN "version_internal_path" SET DATA TYPE varchar;
  ALTER TABLE "_notices_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "celebrations" ALTER COLUMN "celebration_type" DROP DEFAULT;
  ALTER TABLE "celebrations" ALTER COLUMN "time" SET DATA TYPE varchar;
  ALTER TABLE "celebrations" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_celebrations_v" ALTER COLUMN "version_celebration_type" DROP DEFAULT;
  ALTER TABLE "_celebrations_v" ALTER COLUMN "version_time" SET DATA TYPE varchar;
  ALTER TABLE "_celebrations_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "celebration_exceptions" ALTER COLUMN "exception_type" DROP DEFAULT;
  ALTER TABLE "celebration_exceptions" ALTER COLUMN "new_time" SET DATA TYPE varchar;
  ALTER TABLE "celebration_exceptions" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_celebration_exceptions_v" ALTER COLUMN "version_exception_type" DROP DEFAULT;
  ALTER TABLE "_celebration_exceptions_v" ALTER COLUMN "version_new_time" SET DATA TYPE varchar;
  ALTER TABLE "_celebration_exceptions_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "events" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_events_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "communities" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_communities_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "people" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_people_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "pastorals_meeting_info" ALTER COLUMN "time" SET DATA TYPE varchar;
  ALTER TABLE "pastorals" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_pastorals_v_version_meeting_info" ALTER COLUMN "time" SET DATA TYPE varchar;
  ALTER TABLE "_pastorals_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "sacrament_guides" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_sacrament_guides_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "projects" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_projects_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "sponsors" ALTER COLUMN "origin" SET DEFAULT 'research';
  ALTER TABLE "_sponsors_v" ALTER COLUMN "version_origin" SET DEFAULT 'research';
  ALTER TABLE "home_page_service_links" ALTER COLUMN "icon" SET DATA TYPE varchar;
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "opens_at" SET DATA TYPE varchar;
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "closes_at" SET DATA TYPE varchar;
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "second_opens_at" SET DATA TYPE varchar;
  ALTER TABLE "site_settings_secretariat_hours" ALTER COLUMN "second_closes_at" SET DATA TYPE varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "milestones_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_assignments_id" integer;
  ALTER TABLE "milestones" ADD CONSTRAINT "milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_parent_id_milestones_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."milestones"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_assignments" ADD CONSTRAINT "team_assignments_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_assignments_v" ADD CONSTRAINT "_team_assignments_v_parent_id_team_assignments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_assignments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_assignments_v" ADD CONSTRAINT "_team_assignments_v_version_person_id_people_id_fk" FOREIGN KEY ("version_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_groups_links" ADD CONSTRAINT "navigation_header_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_groups" ADD CONSTRAINT "navigation_header_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_groups_links" ADD CONSTRAINT "navigation_footer_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_groups" ADD CONSTRAINT "navigation_footer_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "history_page" ADD CONSTRAINT "history_page_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patron_page_facts" ADD CONSTRAINT "patron_page_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."patron_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "patron_page_sources" ADD CONSTRAINT "patron_page_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."patron_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "patron_page" ADD CONSTRAINT "patron_page_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "spirituality_page_practices" ADD CONSTRAINT "spirituality_page_practices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."spirituality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "spirituality_page" ADD CONSTRAINT "spirituality_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pastorum_page" ADD CONSTRAINT "pastorum_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tithe_wall_page_reasons" ADD CONSTRAINT "tithe_wall_page_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tithe_wall_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "milestones_image_idx" ON "milestones" USING btree ("image_id");
  CREATE INDEX "milestones_updated_at_idx" ON "milestones" USING btree ("updated_at");
  CREATE INDEX "milestones_created_at_idx" ON "milestones" USING btree ("created_at");
  CREATE INDEX "milestones__status_idx" ON "milestones" USING btree ("_status");
  CREATE INDEX "_milestones_v_parent_idx" ON "_milestones_v" USING btree ("parent_id");
  CREATE INDEX "_milestones_v_version_version_image_idx" ON "_milestones_v" USING btree ("version_image_id");
  CREATE INDEX "_milestones_v_version_version_updated_at_idx" ON "_milestones_v" USING btree ("version_updated_at");
  CREATE INDEX "_milestones_v_version_version_created_at_idx" ON "_milestones_v" USING btree ("version_created_at");
  CREATE INDEX "_milestones_v_version_version__status_idx" ON "_milestones_v" USING btree ("version__status");
  CREATE INDEX "_milestones_v_created_at_idx" ON "_milestones_v" USING btree ("created_at");
  CREATE INDEX "_milestones_v_updated_at_idx" ON "_milestones_v" USING btree ("updated_at");
  CREATE INDEX "_milestones_v_latest_idx" ON "_milestones_v" USING btree ("latest");
  CREATE INDEX "team_assignments_person_idx" ON "team_assignments" USING btree ("person_id");
  CREATE INDEX "team_assignments_updated_at_idx" ON "team_assignments" USING btree ("updated_at");
  CREATE INDEX "team_assignments_created_at_idx" ON "team_assignments" USING btree ("created_at");
  CREATE INDEX "team_assignments__status_idx" ON "team_assignments" USING btree ("_status");
  CREATE INDEX "_team_assignments_v_parent_idx" ON "_team_assignments_v" USING btree ("parent_id");
  CREATE INDEX "_team_assignments_v_version_version_person_idx" ON "_team_assignments_v" USING btree ("version_person_id");
  CREATE INDEX "_team_assignments_v_version_version_updated_at_idx" ON "_team_assignments_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_assignments_v_version_version_created_at_idx" ON "_team_assignments_v" USING btree ("version_created_at");
  CREATE INDEX "_team_assignments_v_version_version__status_idx" ON "_team_assignments_v" USING btree ("version__status");
  CREATE INDEX "_team_assignments_v_created_at_idx" ON "_team_assignments_v" USING btree ("created_at");
  CREATE INDEX "_team_assignments_v_updated_at_idx" ON "_team_assignments_v" USING btree ("updated_at");
  CREATE INDEX "_team_assignments_v_latest_idx" ON "_team_assignments_v" USING btree ("latest");
  CREATE INDEX "navigation_header_groups_links_order_idx" ON "navigation_header_groups_links" USING btree ("_order");
  CREATE INDEX "navigation_header_groups_links_parent_id_idx" ON "navigation_header_groups_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_groups_order_idx" ON "navigation_header_groups" USING btree ("_order");
  CREATE INDEX "navigation_header_groups_parent_id_idx" ON "navigation_header_groups" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_groups_links_order_idx" ON "navigation_footer_groups_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_groups_links_parent_id_idx" ON "navigation_footer_groups_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_groups_order_idx" ON "navigation_footer_groups" USING btree ("_order");
  CREATE INDEX "navigation_footer_groups_parent_id_idx" ON "navigation_footer_groups" USING btree ("_parent_id");
  CREATE INDEX "history_page_cover_idx" ON "history_page" USING btree ("cover_id");
  CREATE INDEX "patron_page_facts_order_idx" ON "patron_page_facts" USING btree ("_order");
  CREATE INDEX "patron_page_facts_parent_id_idx" ON "patron_page_facts" USING btree ("_parent_id");
  CREATE INDEX "patron_page_sources_order_idx" ON "patron_page_sources" USING btree ("_order");
  CREATE INDEX "patron_page_sources_parent_id_idx" ON "patron_page_sources" USING btree ("_parent_id");
  CREATE INDEX "patron_page_cover_idx" ON "patron_page" USING btree ("cover_id");
  CREATE INDEX "spirituality_page_practices_order_idx" ON "spirituality_page_practices" USING btree ("_order");
  CREATE INDEX "spirituality_page_practices_parent_id_idx" ON "spirituality_page_practices" USING btree ("_parent_id");
  CREATE INDEX "spirituality_page_hero_image_idx" ON "spirituality_page" USING btree ("hero_image_id");
  CREATE INDEX "pastorum_page_image_idx" ON "pastorum_page" USING btree ("image_id");
  CREATE INDEX "tithe_wall_page_reasons_order_idx" ON "tithe_wall_page_reasons" USING btree ("_order");
  CREATE INDEX "tithe_wall_page_reasons_parent_id_idx" ON "tithe_wall_page_reasons" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_milestones_fk" FOREIGN KEY ("milestones_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_assignments_fk" FOREIGN KEY ("team_assignments_id") REFERENCES "public"."team_assignments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_milestones_id_idx" ON "payload_locked_documents_rels" USING btree ("milestones_id");
  CREATE INDEX "payload_locked_documents_rels_team_assignments_id_idx" ON "payload_locked_documents_rels" USING btree ("team_assignments_id");
  ALTER TABLE "_posts_v" DROP COLUMN "autosave";
  ALTER TABLE "_events_v" DROP COLUMN "autosave";
  ALTER TABLE "_communities_v" DROP COLUMN "autosave";
  ALTER TABLE "people" DROP COLUMN "role_title";
  ALTER TABLE "people" DROP COLUMN "role_type";
  ALTER TABLE "people" DROP COLUMN "area";
  ALTER TABLE "people" DROP COLUMN "current";
  ALTER TABLE "people" DROP COLUMN "order";
  ALTER TABLE "_people_v" DROP COLUMN "version_role_title";
  ALTER TABLE "_people_v" DROP COLUMN "version_role_type";
  ALTER TABLE "_people_v" DROP COLUMN "version_area";
  ALTER TABLE "_people_v" DROP COLUMN "version_current";
  ALTER TABLE "_people_v" DROP COLUMN "version_order";
  ALTER TABLE "_pastorals_v" DROP COLUMN "autosave";
  ALTER TABLE "home_page" DROP COLUMN "_status";
  DROP TYPE "public"."enum_highlights_internal_path";
  DROP TYPE "public"."enum__highlights_v_version_internal_path";
  DROP TYPE "public"."enum_notices_internal_path";
  DROP TYPE "public"."enum__notices_v_version_internal_path";
  DROP TYPE "public"."enum_celebrations_time";
  DROP TYPE "public"."enum__celebrations_v_version_time";
  DROP TYPE "public"."enum_celebration_exceptions_new_time";
  DROP TYPE "public"."enum__celebration_exceptions_v_version_new_time";
  DROP TYPE "public"."enum_people_role_type";
  DROP TYPE "public"."enum__people_v_version_role_type";
  DROP TYPE "public"."enum_pastorals_meeting_info_time";
  DROP TYPE "public"."enum__pastorals_v_version_meeting_info_time";
  DROP TYPE "public"."enum_home_page_service_links_icon";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_service_links_icon";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum_site_settings_secretariat_hours_opens_at";
  DROP TYPE "public"."enum_site_settings_secretariat_hours_closes_at";
  DROP TYPE "public"."enum_site_settings_secretariat_hours_second_opens_at";
  DROP TYPE "public"."enum_site_settings_secretariat_hours_second_closes_at";`)
}
