import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ✅ Static routes to prerender
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'index-1', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },

  // ✅ Dynamic routes — SSR only
  { path: 'job-details/:id', renderMode: RenderMode.Server },
  { path: 'job-applicants/:jobId', renderMode: RenderMode.Server },

  // ✅ Fallback (SSR only)
  { path: '**', renderMode: RenderMode.Server }
];
