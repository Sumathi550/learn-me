/**
 * Learn Me - Supabase Client & Centralized Auth State Manager
 * (student-web/js/supabaseClient.js)
 * 
 * Securely communicates with Supabase Authentication using the Publishable API key.
 * Preserves existing session storage format for complete backwards-compatibility.
 */
(function (global) {
    // 1. Resolve configuration from window.__ENV__, window global, or defaults
    const env = global.__ENV__ || {};
    const supabaseUrl = env.VITE_SUPABASE_URL || global.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_REF.supabase.co';
    const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || global.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_YOUR_KEY';

    const TOKEN_KEY = 'learnMeAuthToken';
    const USER_KEY = 'learnMeCurrentUser';

    // 2. Initialize Supabase client
    let client = null;
    if (global.supabase && typeof global.supabase.createClient === 'function') {
        try {
            client = global.supabase.createClient(supabaseUrl, supabasePublishableKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    storage: global.localStorage
                }
            });
        } catch (e) {
            console.warn('Failed to initialize Supabase client:', e.message);
        }
    }

    // Helper: Synchronize Supabase User & Session with application localStorage
    function syncUserSession(user, session) {
        if (!user || !session) return;
        try {
            const token = session.access_token;
            const displayName = user.user_metadata?.name || user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'Learner');
            const currentUser = {
                id: user.id, // Supabase Auth user ID as identity reference
                email: user.email,
                name: displayName,
                role: user.user_metadata?.role || 'user'
            };
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        } catch (e) {
            console.error('Failed to sync Supabase user session:', e);
        }
    }

    function clearUserSession() {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        } catch (e) {}
    }

    // 3. Central Auth State Listener
    if (client && client.auth) {
        client.auth.onAuthStateChange((event, session) => {
            if (session && session.user) {
                syncUserSession(session.user, session);
            } else if (event === 'SIGNED_OUT') {
                clearUserSession();
            }
        });
    }

    // 4. Clean Unified Service Object
    const SupabaseService = {
        client,
        url: supabaseUrl,
        publishableKey: supabasePublishableKey,

        /**
         * Sign Up a new student account
         */
        async signUp({ email, password, name }) {
            if (!client) {
                throw new Error('Supabase client is not initialized. Please verify configuration.');
            }

            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name || '',
                        full_name: name || '',
                        role: 'user'
                    }
                }
            });

            if (error) throw error;

            if (data && data.session && data.user) {
                syncUserSession(data.user, data.session);
            }

            return data;
        },

        /**
         * Sign in with existing credentials
         */
        async signInWithPassword({ email, password }) {
            if (!client) {
                throw new Error('Supabase client is not initialized. Please verify configuration.');
            }

            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data && data.session && data.user) {
                syncUserSession(data.user, data.session);
            }

            return data;
        },

        /**
         * Sign out current user
         */
        async signOut() {
            clearUserSession();
            if (client && client.auth) {
                try {
                    await client.auth.signOut();
                } catch (e) {
                    console.warn('Supabase sign out notice:', e.message);
                }
            }
        },

        /**
         * Retrieve current active session
         */
        async getSession() {
            if (!client || !client.auth) return null;
            try {
                const { data } = await client.auth.getSession();
                return data?.session || null;
            } catch (e) {
                return null;
            }
        },

        /**
         * Retrieve current authenticated user
         */
        async getUser() {
            if (!client || !client.auth) return null;
            try {
                const { data } = await client.auth.getUser();
                return data?.user || null;
            } catch (e) {
                return null;
            }
        },

        /**
         * Register auth state change listener
         */
        onAuthStateChange(callback) {
            if (!client || !client.auth) return { data: { subscription: { unsubscribe: () => {} } } };
            return client.auth.onAuthStateChange(callback);
        }
    };

    // Attach to global window object
    global.SupabaseService = SupabaseService;
    global.supabaseClient = client;

})(typeof window !== 'undefined' ? window : globalThis);
