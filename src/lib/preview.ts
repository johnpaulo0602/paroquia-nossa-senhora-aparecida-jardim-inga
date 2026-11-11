/**
 * Address the panel loads in the preview pane. It goes through `/preview`, which checks
 * that an editor is logged in and then shows drafts on the real page.
 */
export const previewURL = (path: string): string => `/preview?path=${encodeURIComponent(path)}`
