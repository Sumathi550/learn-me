// Client-side environment configuration fallback for Learn Me
(function (global) {
    global.__ENV__ = global.__ENV__ || {};
    if (!global.__ENV__.VITE_SUPABASE_URL) {
        global.__ENV__.VITE_SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
    }
    if (!global.__ENV__.VITE_SUPABASE_PUBLISHABLE_KEY) {
        global.__ENV__.VITE_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YOUR_KEY";
    }
    global.VITE_SUPABASE_URL = global.__ENV__.VITE_SUPABASE_URL;
    global.VITE_SUPABASE_PUBLISHABLE_KEY = global.__ENV__.VITE_SUPABASE_PUBLISHABLE_KEY;
})(typeof window !== 'undefined' ? window : globalThis);
