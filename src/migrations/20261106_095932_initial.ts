import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'contributor', 'secretary');
  CREATE TYPE "public"."enum_media_media_type" AS ENUM('photograph', 'illustration', 'document', 'artwork');
  CREATE TYPE "public"."enum_posts_editorial_areas" AS ENUM('communication', 'spirituality', 'pastorum', 'institutional');
  CREATE TYPE "public"."enum_posts_format" AS ENUM('news', 'article', 'photos', 'video');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('general', 'church-brazil', 'pope-vatican', 'communities-pastorals', 'community-memory');
  CREATE TYPE "public"."enum_posts_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_posts_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_editorial_areas" AS ENUM('communication', 'spirituality', 'pastorum', 'institutional');
  CREATE TYPE "public"."enum__posts_v_version_format" AS ENUM('news', 'article', 'photos', 'video');
  CREATE TYPE "public"."enum__posts_v_version_category" AS ENUM('general', 'church-brazil', 'pope-vatican', 'communities-pastorals', 'community-memory');
  CREATE TYPE "public"."enum__posts_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__posts_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_highlights_placement" AS ENUM('home', 'communication');
  CREATE TYPE "public"."enum_highlights_destination_type" AS ENUM('post', 'event', 'internal', 'external');
  CREATE TYPE "public"."enum_highlights_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_highlights_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_highlights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__highlights_v_version_placement" AS ENUM('home', 'communication');
  CREATE TYPE "public"."enum__highlights_v_version_destination_type" AS ENUM('post', 'event', 'internal', 'external');
  CREATE TYPE "public"."enum__highlights_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__highlights_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__highlights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_notices_contexts" AS ENUM('home', 'communication', 'agenda', 'schedules', 'secretariat', 'contact');
  CREATE TYPE "public"."enum_notices_destination_type" AS ENUM('none', 'internal', 'external');
  CREATE TYPE "public"."enum_notices_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_notices_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_notices_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__notices_v_version_contexts" AS ENUM('home', 'communication', 'agenda', 'schedules', 'secretariat', 'contact');
  CREATE TYPE "public"."enum__notices_v_version_destination_type" AS ENUM('none', 'internal', 'external');
  CREATE TYPE "public"."enum__notices_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__notices_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__notices_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_communities_type" AS ENUM('matrix', 'chapel');
  CREATE TYPE "public"."enum_communities_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_communities_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_communities_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__communities_v_version_type" AS ENUM('matrix', 'chapel');
  CREATE TYPE "public"."enum__communities_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__communities_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__communities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_celebrations_celebration_type" AS ENUM('mass', 'confession', 'adoration', 'other');
  CREATE TYPE "public"."enum_celebrations_weekday" AS ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  CREATE TYPE "public"."enum_celebrations_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_celebrations_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_celebrations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__celebrations_v_version_celebration_type" AS ENUM('mass', 'confession', 'adoration', 'other');
  CREATE TYPE "public"."enum__celebrations_v_version_weekday" AS ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  CREATE TYPE "public"."enum__celebrations_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__celebrations_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__celebrations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_celebration_exceptions_exception_type" AS ENUM('cancellation', 'change', 'extra');
  CREATE TYPE "public"."enum_celebration_exceptions_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_celebration_exceptions_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_celebration_exceptions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__celebration_exceptions_v_version_exception_type" AS ENUM('cancellation', 'change', 'extra');
  CREATE TYPE "public"."enum__celebration_exceptions_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__celebration_exceptions_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__celebration_exceptions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_events_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__events_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
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
  CREATE TYPE "public"."enum_people_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_people_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_people_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__people_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__people_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_assignments_role_type" AS ENUM('clergy', 'administration', 'pastoral', 'service');
  CREATE TYPE "public"."enum_team_assignments_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_team_assignments_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_team_assignments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_assignments_v_version_role_type" AS ENUM('clergy', 'administration', 'pastoral', 'service');
  CREATE TYPE "public"."enum__team_assignments_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__team_assignments_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__team_assignments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pastorals_meeting_info_weekday" AS ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  CREATE TYPE "public"."enum_pastorals_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_pastorals_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_pastorals_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pastorals_v_version_meeting_info_weekday" AS ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  CREATE TYPE "public"."enum__pastorals_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__pastorals_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__pastorals_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sacrament_guides_guide_type" AS ENUM('baptism', 'marriage', 'catechesis', 'general');
  CREATE TYPE "public"."enum_sacrament_guides_form_type" AS ENUM('none', 'baptism', 'marriage');
  CREATE TYPE "public"."enum_sacrament_guides_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_sacrament_guides_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_sacrament_guides_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sacrament_guides_v_version_guide_type" AS ENUM('baptism', 'marriage', 'catechesis', 'general');
  CREATE TYPE "public"."enum__sacrament_guides_v_version_form_type" AS ENUM('none', 'baptism', 'marriage');
  CREATE TYPE "public"."enum__sacrament_guides_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__sacrament_guides_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__sacrament_guides_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_projects_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__projects_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sponsors_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum_sponsors_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum_sponsors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sponsors_v_version_origin" AS ENUM('official', 'research', 'archive', 'demonstration');
  CREATE TYPE "public"."enum__sponsors_v_version_verification" AS ENUM('pending', 'reviewed', 'approved');
  CREATE TYPE "public"."enum__sponsors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_messages_subject" AS ENUM('sacraments', 'participation', 'partnerships', 'communication', 'other');
  CREATE TYPE "public"."enum_contact_messages_relation" AS ENUM('parishioner', 'visitor', 'interested');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'in_progress', 'answered', 'archived');
  CREATE TYPE "public"."enum_sacrament_requests_request_type" AS ENUM('baptism', 'marriage');
  CREATE TYPE "public"."enum_sacrament_requests_status" AS ENUM('new', 'in_progress', 'awaiting_documents', 'scheduled', 'completed', 'archived');
  CREATE TYPE "public"."enum_tithe_interests_status" AS ENUM('new', 'in_progress', 'contacted', 'archived');
  CREATE TYPE "public"."enum_newsletter_subscribers_status" AS ENUM('pending', 'confirmed', 'unsubscribed');
  CREATE TYPE "public"."enum_site_settings_secretariat_hours_weekday" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'contributor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"source" varchar,
  	"media_type" "enum_media_media_type" DEFAULT 'photograph' NOT NULL,
  	"recorded_at" timestamp(3) with time zone,
  	"usage_authorized" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "posts_editorial_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_editorial_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"format" "enum_posts_format",
  	"category" "enum_posts_category" DEFAULT 'general',
  	"published_at" timestamp(3) with time zone,
  	"cover_id" integer,
  	"video_url" varchar,
  	"author_id" integer,
  	"source_name" varchar,
  	"source_url" varchar,
  	"origin" "enum_posts_origin" DEFAULT 'research',
  	"verification" "enum_posts_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"communities_id" integer,
  	"pastorals_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_editorial_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_editorial_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_format" "enum__posts_v_version_format",
  	"version_category" "enum__posts_v_version_category" DEFAULT 'general',
  	"version_published_at" timestamp(3) with time zone,
  	"version_cover_id" integer,
  	"version_video_url" varchar,
  	"version_author_id" integer,
  	"version_source_name" varchar,
  	"version_source_url" varchar,
  	"version_origin" "enum__posts_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__posts_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"communities_id" integer,
  	"pastorals_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "highlights_placement" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_highlights_placement",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "highlights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"eyebrow" varchar,
  	"summary" varchar,
  	"image_id" integer,
  	"cta_label" varchar,
  	"destination_type" "enum_highlights_destination_type",
  	"post_id" integer,
  	"event_id" integer,
  	"internal_path" varchar,
  	"external_url" varchar,
  	"order" numeric DEFAULT 0,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"origin" "enum_highlights_origin" DEFAULT 'research',
  	"verification" "enum_highlights_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_highlights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_highlights_v_version_placement" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__highlights_v_version_placement",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_highlights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_eyebrow" varchar,
  	"version_summary" varchar,
  	"version_image_id" integer,
  	"version_cta_label" varchar,
  	"version_destination_type" "enum__highlights_v_version_destination_type",
  	"version_post_id" integer,
  	"version_event_id" integer,
  	"version_internal_path" varchar,
  	"version_external_url" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_origin" "enum__highlights_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__highlights_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__highlights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "notices_contexts" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_notices_contexts",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "notices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"destination_type" "enum_notices_destination_type" DEFAULT 'none',
  	"internal_path" varchar,
  	"external_url" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"order" numeric,
  	"origin" "enum_notices_origin" DEFAULT 'research',
  	"verification" "enum_notices_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_notices_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_notices_v_version_contexts" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__notices_v_version_contexts",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_notices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_destination_type" "enum__notices_v_version_destination_type" DEFAULT 'none',
  	"version_internal_path" varchar,
  	"version_external_url" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_order" numeric,
  	"version_origin" "enum__notices_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__notices_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__notices_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "communities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"type" "enum_communities_type",
  	"region" varchar,
  	"description" jsonb,
  	"address" varchar,
  	"map_url" varchar,
  	"cover_id" integer,
  	"public_phone" varchar,
  	"public_email" varchar,
  	"public_whatsapp" varchar,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"origin" "enum_communities_origin" DEFAULT 'research',
  	"verification" "enum_communities_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_communities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_communities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_type" "enum__communities_v_version_type",
  	"version_region" varchar,
  	"version_description" jsonb,
  	"version_address" varchar,
  	"version_map_url" varchar,
  	"version_cover_id" integer,
  	"version_public_phone" varchar,
  	"version_public_email" varchar,
  	"version_public_whatsapp" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_active" boolean DEFAULT true,
  	"version_origin" "enum__communities_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__communities_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__communities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "celebrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"celebration_type" "enum_celebrations_celebration_type",
  	"community_id" integer,
  	"weekday" "enum_celebrations_weekday",
  	"time" varchar,
  	"valid_from" timestamp(3) with time zone,
  	"valid_to" timestamp(3) with time zone,
  	"notes" varchar,
  	"active" boolean DEFAULT true,
  	"origin" "enum_celebrations_origin" DEFAULT 'research',
  	"verification" "enum_celebrations_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_celebrations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_celebrations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_celebration_type" "enum__celebrations_v_version_celebration_type",
  	"version_community_id" integer,
  	"version_weekday" "enum__celebrations_v_version_weekday",
  	"version_time" varchar,
  	"version_valid_from" timestamp(3) with time zone,
  	"version_valid_to" timestamp(3) with time zone,
  	"version_notes" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_origin" "enum__celebrations_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__celebrations_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__celebrations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "celebration_exceptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"celebration_id" integer,
  	"community_id" integer,
  	"date" timestamp(3) with time zone,
  	"exception_type" "enum_celebration_exceptions_exception_type",
  	"new_time" varchar,
  	"reason" varchar,
  	"origin" "enum_celebration_exceptions_origin" DEFAULT 'research',
  	"verification" "enum_celebration_exceptions_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_celebration_exceptions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_celebration_exceptions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_celebration_id" integer,
  	"version_community_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_exception_type" "enum__celebration_exceptions_v_version_exception_type",
  	"version_new_time" varchar,
  	"version_reason" varchar,
  	"version_origin" "enum__celebration_exceptions_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__celebration_exceptions_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__celebration_exceptions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"community_id" integer,
  	"location_text" varchar,
  	"cover_id" integer,
  	"participation_info" jsonb,
  	"registration_url" varchar,
  	"archived" boolean DEFAULT false,
  	"origin" "enum_events_origin" DEFAULT 'research',
  	"verification" "enum_events_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_community_id" integer,
  	"version_location_text" varchar,
  	"version_cover_id" integer,
  	"version_participation_info" jsonb,
  	"version_registration_url" varchar,
  	"version_archived" boolean DEFAULT false,
  	"version_origin" "enum__events_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__events_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
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
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"biography" jsonb,
  	"photo_id" integer,
  	"public_email" varchar,
  	"public_phone" varchar,
  	"public_contact_authorized" boolean DEFAULT false,
  	"origin" "enum_people_origin" DEFAULT 'research',
  	"verification" "enum_people_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_people_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_people_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_biography" jsonb,
  	"version_photo_id" integer,
  	"version_public_email" varchar,
  	"version_public_phone" varchar,
  	"version_public_contact_authorized" boolean DEFAULT false,
  	"version_origin" "enum__people_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__people_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__people_v_version_status" DEFAULT 'draft',
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
  
  CREATE TABLE "pastorals_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pastorals_meeting_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"weekday" "enum_pastorals_meeting_info_weekday",
  	"time" varchar,
  	"location" varchar
  );
  
  CREATE TABLE "pastorals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"mission" jsonb,
  	"participation_info" jsonb,
  	"requirements" jsonb,
  	"cover_id" integer,
  	"contact_via_secretariat" boolean DEFAULT true,
  	"order" numeric,
  	"active" boolean DEFAULT true,
  	"origin" "enum_pastorals_origin" DEFAULT 'research',
  	"verification" "enum_pastorals_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pastorals_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pastorals_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"communities_id" integer
  );
  
  CREATE TABLE "_pastorals_v_version_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pastorals_v_version_meeting_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"weekday" "enum__pastorals_v_version_meeting_info_weekday",
  	"time" varchar,
  	"location" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pastorals_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_mission" jsonb,
  	"version_participation_info" jsonb,
  	"version_requirements" jsonb,
  	"version_cover_id" integer,
  	"version_contact_via_secretariat" boolean DEFAULT true,
  	"version_order" numeric,
  	"version_active" boolean DEFAULT true,
  	"version_origin" "enum__pastorals_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__pastorals_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pastorals_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pastorals_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"communities_id" integer
  );
  
  CREATE TABLE "sacrament_guides_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb
  );
  
  CREATE TABLE "sacrament_guides_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" jsonb
  );
  
  CREATE TABLE "sacrament_guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"guide_type" "enum_sacrament_guides_guide_type",
  	"intro" jsonb,
  	"contact_info" jsonb,
  	"form_type" "enum_sacrament_guides_form_type" DEFAULT 'none',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"origin" "enum_sacrament_guides_origin" DEFAULT 'research',
  	"verification" "enum_sacrament_guides_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sacrament_guides_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sacrament_guides_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sacrament_guides_v_version_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sacrament_guides_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_guide_type" "enum__sacrament_guides_v_version_guide_type",
  	"version_intro" jsonb,
  	"version_contact_info" jsonb,
  	"version_form_type" "enum__sacrament_guides_v_version_form_type" DEFAULT 'none',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_origin" "enum__sacrament_guides_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__sacrament_guides_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sacrament_guides_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"cover_id" integer,
  	"institutional_contacts" jsonb,
  	"cta_label" varchar,
  	"order" numeric,
  	"active" boolean DEFAULT true,
  	"origin" "enum_projects_origin" DEFAULT 'research',
  	"verification" "enum_projects_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_cover_id" integer,
  	"version_institutional_contacts" jsonb,
  	"version_cta_label" varchar,
  	"version_order" numeric,
  	"version_active" boolean DEFAULT true,
  	"version_origin" "enum__projects_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__projects_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "sponsors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"project_id" integer,
  	"approved" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"origin" "enum_sponsors_origin" DEFAULT 'research',
  	"verification" "enum_sponsors_verification" DEFAULT 'pending',
  	"reviewed_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sponsors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sponsors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_url" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_project_id" integer,
  	"version_approved" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_origin" "enum__sponsors_v_version_origin" DEFAULT 'research',
  	"version_verification" "enum__sponsors_v_version_verification" DEFAULT 'pending',
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sponsors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" "enum_contact_messages_subject" NOT NULL,
  	"relation" "enum_contact_messages_relation" NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new' NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"internal_notes" varchar,
  	"retention_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sacrament_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"request_type" "enum_sacrament_requests_request_type" NOT NULL,
  	"applicant_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"preferred_date" timestamp(3) with time zone,
  	"community_id" integer,
  	"payload" jsonb,
  	"notes" varchar,
  	"status" "enum_sacrament_requests_status" DEFAULT 'new' NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"internal_notes" varchar,
  	"retention_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tithe_interests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_tithe_interests_status" DEFAULT 'new' NOT NULL,
  	"internal_notes" varchar,
  	"retention_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "enum_newsletter_subscribers_status" DEFAULT 'pending' NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"consent_at" timestamp(3) with time zone,
  	"confirmed_at" timestamp(3) with time zone,
  	"unsubscribe_token" varchar,
  	"source" varchar,
  	"retention_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"posts_id" integer,
  	"highlights_id" integer,
  	"notices_id" integer,
  	"communities_id" integer,
  	"celebrations_id" integer,
  	"celebration_exceptions_id" integer,
  	"events_id" integer,
  	"milestones_id" integer,
  	"people_id" integer,
  	"team_assignments_id" integer,
  	"pastorals_id" integer,
  	"sacrament_guides_id" integer,
  	"projects_id" integer,
  	"sponsors_id" integer,
  	"contact_messages_id" integer,
  	"sacrament_requests_id" integer,
  	"tithe_interests_id" integer,
  	"newsletter_subscribers_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_secretariat_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"weekday" "enum_site_settings_secretariat_hours_weekday" NOT NULL,
  	"opens_at" varchar,
  	"closes_at" varchar,
  	"second_opens_at" varchar,
  	"second_closes_at" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short_name" varchar,
  	"logo_id" integer,
  	"diocese" varchar,
  	"forania" varchar,
  	"address" varchar,
  	"postal_code" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"email" varchar,
  	"map_url" varchar,
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"liturgy_url" varchar,
  	"donation_info" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
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
  
  CREATE TABLE "home_page_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"url" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "home_page_faith_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"communication_title" varchar,
  	"communication_intro" varchar,
  	"participation_title" varchar,
  	"participation_body" varchar,
  	"participation_image_id" integer,
  	"sacraments_title" varchar,
  	"sacraments_intro" varchar,
  	"communities_title" varchar,
  	"communities_intro" varchar,
  	"projects_title" varchar,
  	"projects_intro" varchar,
  	"sponsors_title" varchar,
  	"sponsors_intro" varchar,
  	"faith_title" varchar,
  	"faith_intro" varchar,
  	"show_communication" boolean DEFAULT true,
  	"show_agenda" boolean DEFAULT true,
  	"show_sacraments" boolean DEFAULT true,
  	"show_communities" boolean DEFAULT true,
  	"show_projects" boolean DEFAULT true,
  	"show_sponsors" boolean DEFAULT true,
  	"show_faith" boolean DEFAULT true,
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
  
  CREATE TABLE "secretariat_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"special_celebrations_title" varchar,
  	"special_celebrations_body" varchar,
  	"special_celebrations_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"form_intro" varchar,
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
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_editorial_areas" ADD CONSTRAINT "posts_editorial_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_gallery" ADD CONSTRAINT "posts_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_gallery" ADD CONSTRAINT "posts_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_people_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_communities_fk" FOREIGN KEY ("communities_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_pastorals_fk" FOREIGN KEY ("pastorals_id") REFERENCES "public"."pastorals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_editorial_areas" ADD CONSTRAINT "_posts_v_version_editorial_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_gallery" ADD CONSTRAINT "_posts_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_gallery" ADD CONSTRAINT "_posts_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_people_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_communities_fk" FOREIGN KEY ("communities_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_pastorals_fk" FOREIGN KEY ("pastorals_id") REFERENCES "public"."pastorals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "highlights_placement" ADD CONSTRAINT "highlights_placement_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "highlights" ADD CONSTRAINT "highlights_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "highlights" ADD CONSTRAINT "highlights_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "highlights" ADD CONSTRAINT "highlights_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_highlights_v_version_placement" ADD CONSTRAINT "_highlights_v_version_placement_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_highlights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_highlights_v" ADD CONSTRAINT "_highlights_v_parent_id_highlights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."highlights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_highlights_v" ADD CONSTRAINT "_highlights_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_highlights_v" ADD CONSTRAINT "_highlights_v_version_post_id_posts_id_fk" FOREIGN KEY ("version_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_highlights_v" ADD CONSTRAINT "_highlights_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notices_contexts" ADD CONSTRAINT "notices_contexts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_notices_v_version_contexts" ADD CONSTRAINT "_notices_v_version_contexts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_notices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_parent_id_notices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "communities" ADD CONSTRAINT "communities_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_communities_v" ADD CONSTRAINT "_communities_v_parent_id_communities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_communities_v" ADD CONSTRAINT "_communities_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "celebrations" ADD CONSTRAINT "celebrations_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_celebrations_v" ADD CONSTRAINT "_celebrations_v_parent_id_celebrations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."celebrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_celebrations_v" ADD CONSTRAINT "_celebrations_v_version_community_id_communities_id_fk" FOREIGN KEY ("version_community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "celebration_exceptions" ADD CONSTRAINT "celebration_exceptions_celebration_id_celebrations_id_fk" FOREIGN KEY ("celebration_id") REFERENCES "public"."celebrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "celebration_exceptions" ADD CONSTRAINT "celebration_exceptions_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_celebration_exceptions_v" ADD CONSTRAINT "_celebration_exceptions_v_parent_id_celebration_exceptions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."celebration_exceptions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_celebration_exceptions_v" ADD CONSTRAINT "_celebration_exceptions_v_version_celebration_id_celebrations_id_fk" FOREIGN KEY ("version_celebration_id") REFERENCES "public"."celebrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_celebration_exceptions_v" ADD CONSTRAINT "_celebration_exceptions_v_version_community_id_communities_id_fk" FOREIGN KEY ("version_community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_community_id_communities_id_fk" FOREIGN KEY ("version_community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "milestones" ADD CONSTRAINT "milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_parent_id_milestones_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."milestones"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_assignments" ADD CONSTRAINT "team_assignments_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_assignments_v" ADD CONSTRAINT "_team_assignments_v_parent_id_team_assignments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_assignments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_assignments_v" ADD CONSTRAINT "_team_assignments_v_version_person_id_people_id_fk" FOREIGN KEY ("version_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pastorals_activities" ADD CONSTRAINT "pastorals_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pastorals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pastorals_meeting_info" ADD CONSTRAINT "pastorals_meeting_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pastorals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pastorals" ADD CONSTRAINT "pastorals_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pastorals_rels" ADD CONSTRAINT "pastorals_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pastorals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pastorals_rels" ADD CONSTRAINT "pastorals_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pastorals_rels" ADD CONSTRAINT "pastorals_rels_communities_fk" FOREIGN KEY ("communities_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pastorals_v_version_activities" ADD CONSTRAINT "_pastorals_v_version_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pastorals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pastorals_v_version_meeting_info" ADD CONSTRAINT "_pastorals_v_version_meeting_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pastorals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pastorals_v" ADD CONSTRAINT "_pastorals_v_parent_id_pastorals_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pastorals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pastorals_v" ADD CONSTRAINT "_pastorals_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pastorals_v_rels" ADD CONSTRAINT "_pastorals_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pastorals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pastorals_v_rels" ADD CONSTRAINT "_pastorals_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pastorals_v_rels" ADD CONSTRAINT "_pastorals_v_rels_communities_fk" FOREIGN KEY ("communities_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sacrament_guides_sections" ADD CONSTRAINT "sacrament_guides_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sacrament_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sacrament_guides_requirements" ADD CONSTRAINT "sacrament_guides_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sacrament_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sacrament_guides_v_version_sections" ADD CONSTRAINT "_sacrament_guides_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sacrament_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sacrament_guides_v_version_requirements" ADD CONSTRAINT "_sacrament_guides_v_version_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sacrament_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sacrament_guides_v" ADD CONSTRAINT "_sacrament_guides_v_parent_id_sacrament_guides_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sacrament_guides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sponsors_v" ADD CONSTRAINT "_sponsors_v_parent_id_sponsors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sponsors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sponsors_v" ADD CONSTRAINT "_sponsors_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sponsors_v" ADD CONSTRAINT "_sponsors_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sacrament_requests" ADD CONSTRAINT "sacrament_requests_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_highlights_fk" FOREIGN KEY ("highlights_id") REFERENCES "public"."highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notices_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_communities_fk" FOREIGN KEY ("communities_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_celebrations_fk" FOREIGN KEY ("celebrations_id") REFERENCES "public"."celebrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_celebration_exceptions_fk" FOREIGN KEY ("celebration_exceptions_id") REFERENCES "public"."celebration_exceptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_milestones_fk" FOREIGN KEY ("milestones_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_assignments_fk" FOREIGN KEY ("team_assignments_id") REFERENCES "public"."team_assignments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pastorals_fk" FOREIGN KEY ("pastorals_id") REFERENCES "public"."pastorals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sacrament_guides_fk" FOREIGN KEY ("sacrament_guides_id") REFERENCES "public"."sacrament_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sacrament_requests_fk" FOREIGN KEY ("sacrament_requests_id") REFERENCES "public"."sacrament_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tithe_interests_fk" FOREIGN KEY ("tithe_interests_id") REFERENCES "public"."tithe_interests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_secretariat_hours" ADD CONSTRAINT "site_settings_secretariat_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_groups_links" ADD CONSTRAINT "navigation_header_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_groups" ADD CONSTRAINT "navigation_header_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_groups_links" ADD CONSTRAINT "navigation_footer_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_groups" ADD CONSTRAINT "navigation_footer_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_service_links" ADD CONSTRAINT "home_page_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_faith_links" ADD CONSTRAINT "home_page_faith_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_participation_image_id_media_id_fk" FOREIGN KEY ("participation_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "history_page" ADD CONSTRAINT "history_page_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patron_page_facts" ADD CONSTRAINT "patron_page_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."patron_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "patron_page_sources" ADD CONSTRAINT "patron_page_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."patron_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "patron_page" ADD CONSTRAINT "patron_page_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "secretariat_page" ADD CONSTRAINT "secretariat_page_special_celebrations_image_id_media_id_fk" FOREIGN KEY ("special_celebrations_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "spirituality_page_practices" ADD CONSTRAINT "spirituality_page_practices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."spirituality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "spirituality_page" ADD CONSTRAINT "spirituality_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pastorum_page" ADD CONSTRAINT "pastorum_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tithe_wall_page_reasons" ADD CONSTRAINT "tithe_wall_page_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tithe_wall_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "posts_editorial_areas_order_idx" ON "posts_editorial_areas" USING btree ("order");
  CREATE INDEX "posts_editorial_areas_parent_idx" ON "posts_editorial_areas" USING btree ("parent_id");
  CREATE INDEX "posts_gallery_order_idx" ON "posts_gallery" USING btree ("_order");
  CREATE INDEX "posts_gallery_parent_id_idx" ON "posts_gallery" USING btree ("_parent_id");
  CREATE INDEX "posts_gallery_image_idx" ON "posts_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_communities_id_idx" ON "posts_rels" USING btree ("communities_id");
  CREATE INDEX "posts_rels_pastorals_id_idx" ON "posts_rels" USING btree ("pastorals_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_editorial_areas_order_idx" ON "_posts_v_version_editorial_areas" USING btree ("order");
  CREATE INDEX "_posts_v_version_editorial_areas_parent_idx" ON "_posts_v_version_editorial_areas" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_gallery_order_idx" ON "_posts_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_posts_v_version_gallery_parent_id_idx" ON "_posts_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_gallery_image_idx" ON "_posts_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_communities_id_idx" ON "_posts_v_rels" USING btree ("communities_id");
  CREATE INDEX "_posts_v_rels_pastorals_id_idx" ON "_posts_v_rels" USING btree ("pastorals_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "highlights_placement_order_idx" ON "highlights_placement" USING btree ("order");
  CREATE INDEX "highlights_placement_parent_idx" ON "highlights_placement" USING btree ("parent_id");
  CREATE INDEX "highlights_image_idx" ON "highlights" USING btree ("image_id");
  CREATE INDEX "highlights_post_idx" ON "highlights" USING btree ("post_id");
  CREATE INDEX "highlights_event_idx" ON "highlights" USING btree ("event_id");
  CREATE INDEX "highlights_updated_at_idx" ON "highlights" USING btree ("updated_at");
  CREATE INDEX "highlights_created_at_idx" ON "highlights" USING btree ("created_at");
  CREATE INDEX "highlights__status_idx" ON "highlights" USING btree ("_status");
  CREATE INDEX "_highlights_v_version_placement_order_idx" ON "_highlights_v_version_placement" USING btree ("order");
  CREATE INDEX "_highlights_v_version_placement_parent_idx" ON "_highlights_v_version_placement" USING btree ("parent_id");
  CREATE INDEX "_highlights_v_parent_idx" ON "_highlights_v" USING btree ("parent_id");
  CREATE INDEX "_highlights_v_version_version_image_idx" ON "_highlights_v" USING btree ("version_image_id");
  CREATE INDEX "_highlights_v_version_version_post_idx" ON "_highlights_v" USING btree ("version_post_id");
  CREATE INDEX "_highlights_v_version_version_event_idx" ON "_highlights_v" USING btree ("version_event_id");
  CREATE INDEX "_highlights_v_version_version_updated_at_idx" ON "_highlights_v" USING btree ("version_updated_at");
  CREATE INDEX "_highlights_v_version_version_created_at_idx" ON "_highlights_v" USING btree ("version_created_at");
  CREATE INDEX "_highlights_v_version_version__status_idx" ON "_highlights_v" USING btree ("version__status");
  CREATE INDEX "_highlights_v_created_at_idx" ON "_highlights_v" USING btree ("created_at");
  CREATE INDEX "_highlights_v_updated_at_idx" ON "_highlights_v" USING btree ("updated_at");
  CREATE INDEX "_highlights_v_latest_idx" ON "_highlights_v" USING btree ("latest");
  CREATE INDEX "notices_contexts_order_idx" ON "notices_contexts" USING btree ("order");
  CREATE INDEX "notices_contexts_parent_idx" ON "notices_contexts" USING btree ("parent_id");
  CREATE INDEX "notices_updated_at_idx" ON "notices" USING btree ("updated_at");
  CREATE INDEX "notices_created_at_idx" ON "notices" USING btree ("created_at");
  CREATE INDEX "notices__status_idx" ON "notices" USING btree ("_status");
  CREATE INDEX "_notices_v_version_contexts_order_idx" ON "_notices_v_version_contexts" USING btree ("order");
  CREATE INDEX "_notices_v_version_contexts_parent_idx" ON "_notices_v_version_contexts" USING btree ("parent_id");
  CREATE INDEX "_notices_v_parent_idx" ON "_notices_v" USING btree ("parent_id");
  CREATE INDEX "_notices_v_version_version_updated_at_idx" ON "_notices_v" USING btree ("version_updated_at");
  CREATE INDEX "_notices_v_version_version_created_at_idx" ON "_notices_v" USING btree ("version_created_at");
  CREATE INDEX "_notices_v_version_version__status_idx" ON "_notices_v" USING btree ("version__status");
  CREATE INDEX "_notices_v_created_at_idx" ON "_notices_v" USING btree ("created_at");
  CREATE INDEX "_notices_v_updated_at_idx" ON "_notices_v" USING btree ("updated_at");
  CREATE INDEX "_notices_v_latest_idx" ON "_notices_v" USING btree ("latest");
  CREATE UNIQUE INDEX "communities_slug_idx" ON "communities" USING btree ("slug");
  CREATE INDEX "communities_cover_idx" ON "communities" USING btree ("cover_id");
  CREATE INDEX "communities_updated_at_idx" ON "communities" USING btree ("updated_at");
  CREATE INDEX "communities_created_at_idx" ON "communities" USING btree ("created_at");
  CREATE INDEX "communities__status_idx" ON "communities" USING btree ("_status");
  CREATE INDEX "_communities_v_parent_idx" ON "_communities_v" USING btree ("parent_id");
  CREATE INDEX "_communities_v_version_version_slug_idx" ON "_communities_v" USING btree ("version_slug");
  CREATE INDEX "_communities_v_version_version_cover_idx" ON "_communities_v" USING btree ("version_cover_id");
  CREATE INDEX "_communities_v_version_version_updated_at_idx" ON "_communities_v" USING btree ("version_updated_at");
  CREATE INDEX "_communities_v_version_version_created_at_idx" ON "_communities_v" USING btree ("version_created_at");
  CREATE INDEX "_communities_v_version_version__status_idx" ON "_communities_v" USING btree ("version__status");
  CREATE INDEX "_communities_v_created_at_idx" ON "_communities_v" USING btree ("created_at");
  CREATE INDEX "_communities_v_updated_at_idx" ON "_communities_v" USING btree ("updated_at");
  CREATE INDEX "_communities_v_latest_idx" ON "_communities_v" USING btree ("latest");
  CREATE INDEX "celebrations_community_idx" ON "celebrations" USING btree ("community_id");
  CREATE INDEX "celebrations_updated_at_idx" ON "celebrations" USING btree ("updated_at");
  CREATE INDEX "celebrations_created_at_idx" ON "celebrations" USING btree ("created_at");
  CREATE INDEX "celebrations__status_idx" ON "celebrations" USING btree ("_status");
  CREATE INDEX "_celebrations_v_parent_idx" ON "_celebrations_v" USING btree ("parent_id");
  CREATE INDEX "_celebrations_v_version_version_community_idx" ON "_celebrations_v" USING btree ("version_community_id");
  CREATE INDEX "_celebrations_v_version_version_updated_at_idx" ON "_celebrations_v" USING btree ("version_updated_at");
  CREATE INDEX "_celebrations_v_version_version_created_at_idx" ON "_celebrations_v" USING btree ("version_created_at");
  CREATE INDEX "_celebrations_v_version_version__status_idx" ON "_celebrations_v" USING btree ("version__status");
  CREATE INDEX "_celebrations_v_created_at_idx" ON "_celebrations_v" USING btree ("created_at");
  CREATE INDEX "_celebrations_v_updated_at_idx" ON "_celebrations_v" USING btree ("updated_at");
  CREATE INDEX "_celebrations_v_latest_idx" ON "_celebrations_v" USING btree ("latest");
  CREATE INDEX "celebration_exceptions_celebration_idx" ON "celebration_exceptions" USING btree ("celebration_id");
  CREATE INDEX "celebration_exceptions_community_idx" ON "celebration_exceptions" USING btree ("community_id");
  CREATE INDEX "celebration_exceptions_updated_at_idx" ON "celebration_exceptions" USING btree ("updated_at");
  CREATE INDEX "celebration_exceptions_created_at_idx" ON "celebration_exceptions" USING btree ("created_at");
  CREATE INDEX "celebration_exceptions__status_idx" ON "celebration_exceptions" USING btree ("_status");
  CREATE INDEX "_celebration_exceptions_v_parent_idx" ON "_celebration_exceptions_v" USING btree ("parent_id");
  CREATE INDEX "_celebration_exceptions_v_version_version_celebration_idx" ON "_celebration_exceptions_v" USING btree ("version_celebration_id");
  CREATE INDEX "_celebration_exceptions_v_version_version_community_idx" ON "_celebration_exceptions_v" USING btree ("version_community_id");
  CREATE INDEX "_celebration_exceptions_v_version_version_updated_at_idx" ON "_celebration_exceptions_v" USING btree ("version_updated_at");
  CREATE INDEX "_celebration_exceptions_v_version_version_created_at_idx" ON "_celebration_exceptions_v" USING btree ("version_created_at");
  CREATE INDEX "_celebration_exceptions_v_version_version__status_idx" ON "_celebration_exceptions_v" USING btree ("version__status");
  CREATE INDEX "_celebration_exceptions_v_created_at_idx" ON "_celebration_exceptions_v" USING btree ("created_at");
  CREATE INDEX "_celebration_exceptions_v_updated_at_idx" ON "_celebration_exceptions_v" USING btree ("updated_at");
  CREATE INDEX "_celebration_exceptions_v_latest_idx" ON "_celebration_exceptions_v" USING btree ("latest");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_community_idx" ON "events" USING btree ("community_id");
  CREATE INDEX "events_cover_idx" ON "events" USING btree ("cover_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_community_idx" ON "_events_v" USING btree ("version_community_id");
  CREATE INDEX "_events_v_version_version_cover_idx" ON "_events_v" USING btree ("version_cover_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
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
  CREATE UNIQUE INDEX "people_slug_idx" ON "people" USING btree ("slug");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people__status_idx" ON "people" USING btree ("_status");
  CREATE INDEX "_people_v_parent_idx" ON "_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_slug_idx" ON "_people_v" USING btree ("version_slug");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_version_version__status_idx" ON "_people_v" USING btree ("version__status");
  CREATE INDEX "_people_v_created_at_idx" ON "_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "_people_v" USING btree ("updated_at");
  CREATE INDEX "_people_v_latest_idx" ON "_people_v" USING btree ("latest");
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
  CREATE INDEX "pastorals_activities_order_idx" ON "pastorals_activities" USING btree ("_order");
  CREATE INDEX "pastorals_activities_parent_id_idx" ON "pastorals_activities" USING btree ("_parent_id");
  CREATE INDEX "pastorals_meeting_info_order_idx" ON "pastorals_meeting_info" USING btree ("_order");
  CREATE INDEX "pastorals_meeting_info_parent_id_idx" ON "pastorals_meeting_info" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pastorals_slug_idx" ON "pastorals" USING btree ("slug");
  CREATE INDEX "pastorals_cover_idx" ON "pastorals" USING btree ("cover_id");
  CREATE INDEX "pastorals_updated_at_idx" ON "pastorals" USING btree ("updated_at");
  CREATE INDEX "pastorals_created_at_idx" ON "pastorals" USING btree ("created_at");
  CREATE INDEX "pastorals__status_idx" ON "pastorals" USING btree ("_status");
  CREATE INDEX "pastorals_rels_order_idx" ON "pastorals_rels" USING btree ("order");
  CREATE INDEX "pastorals_rels_parent_idx" ON "pastorals_rels" USING btree ("parent_id");
  CREATE INDEX "pastorals_rels_path_idx" ON "pastorals_rels" USING btree ("path");
  CREATE INDEX "pastorals_rels_people_id_idx" ON "pastorals_rels" USING btree ("people_id");
  CREATE INDEX "pastorals_rels_communities_id_idx" ON "pastorals_rels" USING btree ("communities_id");
  CREATE INDEX "_pastorals_v_version_activities_order_idx" ON "_pastorals_v_version_activities" USING btree ("_order");
  CREATE INDEX "_pastorals_v_version_activities_parent_id_idx" ON "_pastorals_v_version_activities" USING btree ("_parent_id");
  CREATE INDEX "_pastorals_v_version_meeting_info_order_idx" ON "_pastorals_v_version_meeting_info" USING btree ("_order");
  CREATE INDEX "_pastorals_v_version_meeting_info_parent_id_idx" ON "_pastorals_v_version_meeting_info" USING btree ("_parent_id");
  CREATE INDEX "_pastorals_v_parent_idx" ON "_pastorals_v" USING btree ("parent_id");
  CREATE INDEX "_pastorals_v_version_version_slug_idx" ON "_pastorals_v" USING btree ("version_slug");
  CREATE INDEX "_pastorals_v_version_version_cover_idx" ON "_pastorals_v" USING btree ("version_cover_id");
  CREATE INDEX "_pastorals_v_version_version_updated_at_idx" ON "_pastorals_v" USING btree ("version_updated_at");
  CREATE INDEX "_pastorals_v_version_version_created_at_idx" ON "_pastorals_v" USING btree ("version_created_at");
  CREATE INDEX "_pastorals_v_version_version__status_idx" ON "_pastorals_v" USING btree ("version__status");
  CREATE INDEX "_pastorals_v_created_at_idx" ON "_pastorals_v" USING btree ("created_at");
  CREATE INDEX "_pastorals_v_updated_at_idx" ON "_pastorals_v" USING btree ("updated_at");
  CREATE INDEX "_pastorals_v_latest_idx" ON "_pastorals_v" USING btree ("latest");
  CREATE INDEX "_pastorals_v_rels_order_idx" ON "_pastorals_v_rels" USING btree ("order");
  CREATE INDEX "_pastorals_v_rels_parent_idx" ON "_pastorals_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pastorals_v_rels_path_idx" ON "_pastorals_v_rels" USING btree ("path");
  CREATE INDEX "_pastorals_v_rels_people_id_idx" ON "_pastorals_v_rels" USING btree ("people_id");
  CREATE INDEX "_pastorals_v_rels_communities_id_idx" ON "_pastorals_v_rels" USING btree ("communities_id");
  CREATE INDEX "sacrament_guides_sections_order_idx" ON "sacrament_guides_sections" USING btree ("_order");
  CREATE INDEX "sacrament_guides_sections_parent_id_idx" ON "sacrament_guides_sections" USING btree ("_parent_id");
  CREATE INDEX "sacrament_guides_requirements_order_idx" ON "sacrament_guides_requirements" USING btree ("_order");
  CREATE INDEX "sacrament_guides_requirements_parent_id_idx" ON "sacrament_guides_requirements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "sacrament_guides_slug_idx" ON "sacrament_guides" USING btree ("slug");
  CREATE INDEX "sacrament_guides_created_at_idx" ON "sacrament_guides" USING btree ("created_at");
  CREATE INDEX "sacrament_guides__status_idx" ON "sacrament_guides" USING btree ("_status");
  CREATE INDEX "_sacrament_guides_v_version_sections_order_idx" ON "_sacrament_guides_v_version_sections" USING btree ("_order");
  CREATE INDEX "_sacrament_guides_v_version_sections_parent_id_idx" ON "_sacrament_guides_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_sacrament_guides_v_version_requirements_order_idx" ON "_sacrament_guides_v_version_requirements" USING btree ("_order");
  CREATE INDEX "_sacrament_guides_v_version_requirements_parent_id_idx" ON "_sacrament_guides_v_version_requirements" USING btree ("_parent_id");
  CREATE INDEX "_sacrament_guides_v_parent_idx" ON "_sacrament_guides_v" USING btree ("parent_id");
  CREATE INDEX "_sacrament_guides_v_version_version_slug_idx" ON "_sacrament_guides_v" USING btree ("version_slug");
  CREATE INDEX "_sacrament_guides_v_version_version_created_at_idx" ON "_sacrament_guides_v" USING btree ("version_created_at");
  CREATE INDEX "_sacrament_guides_v_version_version__status_idx" ON "_sacrament_guides_v" USING btree ("version__status");
  CREATE INDEX "_sacrament_guides_v_created_at_idx" ON "_sacrament_guides_v" USING btree ("created_at");
  CREATE INDEX "_sacrament_guides_v_updated_at_idx" ON "_sacrament_guides_v" USING btree ("updated_at");
  CREATE INDEX "_sacrament_guides_v_latest_idx" ON "_sacrament_guides_v" USING btree ("latest");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "sponsors_logo_idx" ON "sponsors" USING btree ("logo_id");
  CREATE INDEX "sponsors_project_idx" ON "sponsors" USING btree ("project_id");
  CREATE INDEX "sponsors_updated_at_idx" ON "sponsors" USING btree ("updated_at");
  CREATE INDEX "sponsors_created_at_idx" ON "sponsors" USING btree ("created_at");
  CREATE INDEX "sponsors__status_idx" ON "sponsors" USING btree ("_status");
  CREATE INDEX "_sponsors_v_parent_idx" ON "_sponsors_v" USING btree ("parent_id");
  CREATE INDEX "_sponsors_v_version_version_logo_idx" ON "_sponsors_v" USING btree ("version_logo_id");
  CREATE INDEX "_sponsors_v_version_version_project_idx" ON "_sponsors_v" USING btree ("version_project_id");
  CREATE INDEX "_sponsors_v_version_version_updated_at_idx" ON "_sponsors_v" USING btree ("version_updated_at");
  CREATE INDEX "_sponsors_v_version_version_created_at_idx" ON "_sponsors_v" USING btree ("version_created_at");
  CREATE INDEX "_sponsors_v_version_version__status_idx" ON "_sponsors_v" USING btree ("version__status");
  CREATE INDEX "_sponsors_v_created_at_idx" ON "_sponsors_v" USING btree ("created_at");
  CREATE INDEX "_sponsors_v_updated_at_idx" ON "_sponsors_v" USING btree ("updated_at");
  CREATE INDEX "_sponsors_v_latest_idx" ON "_sponsors_v" USING btree ("latest");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "sacrament_requests_community_idx" ON "sacrament_requests" USING btree ("community_id");
  CREATE INDEX "sacrament_requests_updated_at_idx" ON "sacrament_requests" USING btree ("updated_at");
  CREATE INDEX "sacrament_requests_created_at_idx" ON "sacrament_requests" USING btree ("created_at");
  CREATE INDEX "tithe_interests_updated_at_idx" ON "tithe_interests" USING btree ("updated_at");
  CREATE INDEX "tithe_interests_created_at_idx" ON "tithe_interests" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");
  CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribe_token_idx" ON "newsletter_subscribers" USING btree ("unsubscribe_token");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_highlights_id_idx" ON "payload_locked_documents_rels" USING btree ("highlights_id");
  CREATE INDEX "payload_locked_documents_rels_notices_id_idx" ON "payload_locked_documents_rels" USING btree ("notices_id");
  CREATE INDEX "payload_locked_documents_rels_communities_id_idx" ON "payload_locked_documents_rels" USING btree ("communities_id");
  CREATE INDEX "payload_locked_documents_rels_celebrations_id_idx" ON "payload_locked_documents_rels" USING btree ("celebrations_id");
  CREATE INDEX "payload_locked_documents_rels_celebration_exceptions_id_idx" ON "payload_locked_documents_rels" USING btree ("celebration_exceptions_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_milestones_id_idx" ON "payload_locked_documents_rels" USING btree ("milestones_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_team_assignments_id_idx" ON "payload_locked_documents_rels" USING btree ("team_assignments_id");
  CREATE INDEX "payload_locked_documents_rels_pastorals_id_idx" ON "payload_locked_documents_rels" USING btree ("pastorals_id");
  CREATE INDEX "payload_locked_documents_rels_sacrament_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("sacrament_guides_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_sacrament_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("sacrament_requests_id");
  CREATE INDEX "payload_locked_documents_rels_tithe_interests_id_idx" ON "payload_locked_documents_rels" USING btree ("tithe_interests_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_secretariat_hours_order_idx" ON "site_settings_secretariat_hours" USING btree ("_order");
  CREATE INDEX "site_settings_secretariat_hours_parent_id_idx" ON "site_settings_secretariat_hours" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "navigation_header_groups_links_order_idx" ON "navigation_header_groups_links" USING btree ("_order");
  CREATE INDEX "navigation_header_groups_links_parent_id_idx" ON "navigation_header_groups_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_groups_order_idx" ON "navigation_header_groups" USING btree ("_order");
  CREATE INDEX "navigation_header_groups_parent_id_idx" ON "navigation_header_groups" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_groups_links_order_idx" ON "navigation_footer_groups_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_groups_links_parent_id_idx" ON "navigation_footer_groups_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_groups_order_idx" ON "navigation_footer_groups" USING btree ("_order");
  CREATE INDEX "navigation_footer_groups_parent_id_idx" ON "navigation_footer_groups" USING btree ("_parent_id");
  CREATE INDEX "home_page_service_links_order_idx" ON "home_page_service_links" USING btree ("_order");
  CREATE INDEX "home_page_service_links_parent_id_idx" ON "home_page_service_links" USING btree ("_parent_id");
  CREATE INDEX "home_page_faith_links_order_idx" ON "home_page_faith_links" USING btree ("_order");
  CREATE INDEX "home_page_faith_links_parent_id_idx" ON "home_page_faith_links" USING btree ("_parent_id");
  CREATE INDEX "home_page_participation_image_idx" ON "home_page" USING btree ("participation_image_id");
  CREATE INDEX "history_page_cover_idx" ON "history_page" USING btree ("cover_id");
  CREATE INDEX "patron_page_facts_order_idx" ON "patron_page_facts" USING btree ("_order");
  CREATE INDEX "patron_page_facts_parent_id_idx" ON "patron_page_facts" USING btree ("_parent_id");
  CREATE INDEX "patron_page_sources_order_idx" ON "patron_page_sources" USING btree ("_order");
  CREATE INDEX "patron_page_sources_parent_id_idx" ON "patron_page_sources" USING btree ("_parent_id");
  CREATE INDEX "patron_page_cover_idx" ON "patron_page" USING btree ("cover_id");
  CREATE INDEX "secretariat_page_special_celebrations_image_idx" ON "secretariat_page" USING btree ("special_celebrations_image_id");
  CREATE INDEX "spirituality_page_practices_order_idx" ON "spirituality_page_practices" USING btree ("_order");
  CREATE INDEX "spirituality_page_practices_parent_id_idx" ON "spirituality_page_practices" USING btree ("_parent_id");
  CREATE INDEX "spirituality_page_hero_image_idx" ON "spirituality_page" USING btree ("hero_image_id");
  CREATE INDEX "pastorum_page_image_idx" ON "pastorum_page" USING btree ("image_id");
  CREATE INDEX "tithe_wall_page_reasons_order_idx" ON "tithe_wall_page_reasons" USING btree ("_order");
  CREATE INDEX "tithe_wall_page_reasons_parent_id_idx" ON "tithe_wall_page_reasons" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "posts_editorial_areas" CASCADE;
  DROP TABLE "posts_gallery" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_editorial_areas" CASCADE;
  DROP TABLE "_posts_v_version_gallery" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "highlights_placement" CASCADE;
  DROP TABLE "highlights" CASCADE;
  DROP TABLE "_highlights_v_version_placement" CASCADE;
  DROP TABLE "_highlights_v" CASCADE;
  DROP TABLE "notices_contexts" CASCADE;
  DROP TABLE "notices" CASCADE;
  DROP TABLE "_notices_v_version_contexts" CASCADE;
  DROP TABLE "_notices_v" CASCADE;
  DROP TABLE "communities" CASCADE;
  DROP TABLE "_communities_v" CASCADE;
  DROP TABLE "celebrations" CASCADE;
  DROP TABLE "_celebrations_v" CASCADE;
  DROP TABLE "celebration_exceptions" CASCADE;
  DROP TABLE "_celebration_exceptions_v" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "milestones" CASCADE;
  DROP TABLE "_milestones_v" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "_people_v" CASCADE;
  DROP TABLE "team_assignments" CASCADE;
  DROP TABLE "_team_assignments_v" CASCADE;
  DROP TABLE "pastorals_activities" CASCADE;
  DROP TABLE "pastorals_meeting_info" CASCADE;
  DROP TABLE "pastorals" CASCADE;
  DROP TABLE "pastorals_rels" CASCADE;
  DROP TABLE "_pastorals_v_version_activities" CASCADE;
  DROP TABLE "_pastorals_v_version_meeting_info" CASCADE;
  DROP TABLE "_pastorals_v" CASCADE;
  DROP TABLE "_pastorals_v_rels" CASCADE;
  DROP TABLE "sacrament_guides_sections" CASCADE;
  DROP TABLE "sacrament_guides_requirements" CASCADE;
  DROP TABLE "sacrament_guides" CASCADE;
  DROP TABLE "_sacrament_guides_v_version_sections" CASCADE;
  DROP TABLE "_sacrament_guides_v_version_requirements" CASCADE;
  DROP TABLE "_sacrament_guides_v" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "_sponsors_v" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "sacrament_requests" CASCADE;
  DROP TABLE "tithe_interests" CASCADE;
  DROP TABLE "newsletter_subscribers" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_secretariat_hours" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_header_groups_links" CASCADE;
  DROP TABLE "navigation_header_groups" CASCADE;
  DROP TABLE "navigation_footer_groups_links" CASCADE;
  DROP TABLE "navigation_footer_groups" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "home_page_service_links" CASCADE;
  DROP TABLE "home_page_faith_links" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "history_page" CASCADE;
  DROP TABLE "patron_page_facts" CASCADE;
  DROP TABLE "patron_page_sources" CASCADE;
  DROP TABLE "patron_page" CASCADE;
  DROP TABLE "secretariat_page" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contribution_page" CASCADE;
  DROP TABLE "spirituality_page_practices" CASCADE;
  DROP TABLE "spirituality_page" CASCADE;
  DROP TABLE "pastorum_page" CASCADE;
  DROP TABLE "tithe_wall_page_reasons" CASCADE;
  DROP TABLE "tithe_wall_page" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_media_type";
  DROP TYPE "public"."enum_posts_editorial_areas";
  DROP TYPE "public"."enum_posts_format";
  DROP TYPE "public"."enum_posts_category";
  DROP TYPE "public"."enum_posts_origin";
  DROP TYPE "public"."enum_posts_verification";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_editorial_areas";
  DROP TYPE "public"."enum__posts_v_version_format";
  DROP TYPE "public"."enum__posts_v_version_category";
  DROP TYPE "public"."enum__posts_v_version_origin";
  DROP TYPE "public"."enum__posts_v_version_verification";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_highlights_placement";
  DROP TYPE "public"."enum_highlights_destination_type";
  DROP TYPE "public"."enum_highlights_origin";
  DROP TYPE "public"."enum_highlights_verification";
  DROP TYPE "public"."enum_highlights_status";
  DROP TYPE "public"."enum__highlights_v_version_placement";
  DROP TYPE "public"."enum__highlights_v_version_destination_type";
  DROP TYPE "public"."enum__highlights_v_version_origin";
  DROP TYPE "public"."enum__highlights_v_version_verification";
  DROP TYPE "public"."enum__highlights_v_version_status";
  DROP TYPE "public"."enum_notices_contexts";
  DROP TYPE "public"."enum_notices_destination_type";
  DROP TYPE "public"."enum_notices_origin";
  DROP TYPE "public"."enum_notices_verification";
  DROP TYPE "public"."enum_notices_status";
  DROP TYPE "public"."enum__notices_v_version_contexts";
  DROP TYPE "public"."enum__notices_v_version_destination_type";
  DROP TYPE "public"."enum__notices_v_version_origin";
  DROP TYPE "public"."enum__notices_v_version_verification";
  DROP TYPE "public"."enum__notices_v_version_status";
  DROP TYPE "public"."enum_communities_type";
  DROP TYPE "public"."enum_communities_origin";
  DROP TYPE "public"."enum_communities_verification";
  DROP TYPE "public"."enum_communities_status";
  DROP TYPE "public"."enum__communities_v_version_type";
  DROP TYPE "public"."enum__communities_v_version_origin";
  DROP TYPE "public"."enum__communities_v_version_verification";
  DROP TYPE "public"."enum__communities_v_version_status";
  DROP TYPE "public"."enum_celebrations_celebration_type";
  DROP TYPE "public"."enum_celebrations_weekday";
  DROP TYPE "public"."enum_celebrations_origin";
  DROP TYPE "public"."enum_celebrations_verification";
  DROP TYPE "public"."enum_celebrations_status";
  DROP TYPE "public"."enum__celebrations_v_version_celebration_type";
  DROP TYPE "public"."enum__celebrations_v_version_weekday";
  DROP TYPE "public"."enum__celebrations_v_version_origin";
  DROP TYPE "public"."enum__celebrations_v_version_verification";
  DROP TYPE "public"."enum__celebrations_v_version_status";
  DROP TYPE "public"."enum_celebration_exceptions_exception_type";
  DROP TYPE "public"."enum_celebration_exceptions_origin";
  DROP TYPE "public"."enum_celebration_exceptions_verification";
  DROP TYPE "public"."enum_celebration_exceptions_status";
  DROP TYPE "public"."enum__celebration_exceptions_v_version_exception_type";
  DROP TYPE "public"."enum__celebration_exceptions_v_version_origin";
  DROP TYPE "public"."enum__celebration_exceptions_v_version_verification";
  DROP TYPE "public"."enum__celebration_exceptions_v_version_status";
  DROP TYPE "public"."enum_events_origin";
  DROP TYPE "public"."enum_events_verification";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_origin";
  DROP TYPE "public"."enum__events_v_version_verification";
  DROP TYPE "public"."enum__events_v_version_status";
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
  DROP TYPE "public"."enum_people_origin";
  DROP TYPE "public"."enum_people_verification";
  DROP TYPE "public"."enum_people_status";
  DROP TYPE "public"."enum__people_v_version_origin";
  DROP TYPE "public"."enum__people_v_version_verification";
  DROP TYPE "public"."enum__people_v_version_status";
  DROP TYPE "public"."enum_team_assignments_role_type";
  DROP TYPE "public"."enum_team_assignments_origin";
  DROP TYPE "public"."enum_team_assignments_verification";
  DROP TYPE "public"."enum_team_assignments_status";
  DROP TYPE "public"."enum__team_assignments_v_version_role_type";
  DROP TYPE "public"."enum__team_assignments_v_version_origin";
  DROP TYPE "public"."enum__team_assignments_v_version_verification";
  DROP TYPE "public"."enum__team_assignments_v_version_status";
  DROP TYPE "public"."enum_pastorals_meeting_info_weekday";
  DROP TYPE "public"."enum_pastorals_origin";
  DROP TYPE "public"."enum_pastorals_verification";
  DROP TYPE "public"."enum_pastorals_status";
  DROP TYPE "public"."enum__pastorals_v_version_meeting_info_weekday";
  DROP TYPE "public"."enum__pastorals_v_version_origin";
  DROP TYPE "public"."enum__pastorals_v_version_verification";
  DROP TYPE "public"."enum__pastorals_v_version_status";
  DROP TYPE "public"."enum_sacrament_guides_guide_type";
  DROP TYPE "public"."enum_sacrament_guides_form_type";
  DROP TYPE "public"."enum_sacrament_guides_origin";
  DROP TYPE "public"."enum_sacrament_guides_verification";
  DROP TYPE "public"."enum_sacrament_guides_status";
  DROP TYPE "public"."enum__sacrament_guides_v_version_guide_type";
  DROP TYPE "public"."enum__sacrament_guides_v_version_form_type";
  DROP TYPE "public"."enum__sacrament_guides_v_version_origin";
  DROP TYPE "public"."enum__sacrament_guides_v_version_verification";
  DROP TYPE "public"."enum__sacrament_guides_v_version_status";
  DROP TYPE "public"."enum_projects_origin";
  DROP TYPE "public"."enum_projects_verification";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_origin";
  DROP TYPE "public"."enum__projects_v_version_verification";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_sponsors_origin";
  DROP TYPE "public"."enum_sponsors_verification";
  DROP TYPE "public"."enum_sponsors_status";
  DROP TYPE "public"."enum__sponsors_v_version_origin";
  DROP TYPE "public"."enum__sponsors_v_version_verification";
  DROP TYPE "public"."enum__sponsors_v_version_status";
  DROP TYPE "public"."enum_contact_messages_subject";
  DROP TYPE "public"."enum_contact_messages_relation";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_sacrament_requests_request_type";
  DROP TYPE "public"."enum_sacrament_requests_status";
  DROP TYPE "public"."enum_tithe_interests_status";
  DROP TYPE "public"."enum_newsletter_subscribers_status";
  DROP TYPE "public"."enum_site_settings_secretariat_hours_weekday";`)
}
