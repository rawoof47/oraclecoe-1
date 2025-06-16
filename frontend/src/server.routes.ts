export const routes = [
  // Static routes you want to prerender
  { path: '', redirectTo: '/index-2', pathMatch: 'full', renderMode: 'pre-render' },
  { path: 'index-1', renderMode: 'pre-render' },
  { path: 'index-2', renderMode: 'pre-render' },
  { path: 'index-3', renderMode: 'pre-render' },
  { path: 'about', renderMode: 'pre-render' },
  { path: 'pricing', renderMode: 'pre-render' },
  { path: 'testimonials', renderMode: 'pre-render' },
  { path: 'faq', renderMode: 'pre-render' },
  { path: 'contact', renderMode: 'pre-render' },
  { path: 'login', renderMode: 'pre-render' },
  { path: 'register', renderMode: 'pre-render' },
  { path: 'employers', renderMode: 'pre-render' },
  { path: 'employer-details', renderMode: 'pre-render' },
  { path: 'candidates', renderMode: 'pre-render' },
  { path: 'candidate-details', renderMode: 'pre-render' },
  { path: 'blog', renderMode: 'pre-render' },
  { path: 'blog-details', renderMode: 'pre-render' },
  { path: 'coming-soon', renderMode: 'pre-render' },
  { path: 'privacy-policy', renderMode: 'pre-render' },
  { path: 'terms-conditions', renderMode: 'pre-render' },

  // Dynamic routes (avoid pre-rendering, SSR only)


  // Protected dashboard routes (SSR only)
  { path: 'dashboard', renderMode: 'server' },
  { path: 'jobs', renderMode: 'server' },
  { path: 'favourite-jobs', renderMode: 'server' },
  { path: 'candidate-profile', renderMode: 'server' },
  { path: 'applied-jobs', renderMode: 'server' },
  { path: 'single-resume', renderMode: 'server' },
  { path: 'post-a-job', renderMode: 'server' },
  { path: 'job-applicants', renderMode: 'server' },
  { path: 'recruiter-dashboard', renderMode: 'server' },
  { path: 'recruiter/posted-jobs', renderMode: 'server' },
  { path: 'recruiter-profile', renderMode: 'server' },

  // Admin (SSR only)
  { path: 'admin/login', renderMode: 'server' },
  { path: 'admin-dashboard', renderMode: 'server' },

  // Fallback (SSR)
  { path: '**', renderMode: 'server' }
];

console.log('✅ Loaded server.routes.ts');

