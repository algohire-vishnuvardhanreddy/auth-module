// Mock authentication utilities - no real Firebase integration
// All functions simulate async operations with delays

export interface User {
  uid: string;
  email: string;
  displayName: string;
  portal: "recruiter" | "client" | null;
  mfaEnabled: boolean;
  mfaMethod: "authenticator" | "email" | null;
}

export interface SessionData {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
}

// Mock session storage
let mockSession: SessionData = {
  user: null,
  token: null,
  expiresAt: null,
};

// Mock MFA secrets storage
const mockMfaSecrets = new Map<string, string>();
const mockEmailCodes = new Map<string, { code: string; expiresAt: number }>();

export const mockAuth = {
  // Sign in with email/password
  signIn: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user: User = {
      uid: `user_${Date.now()}`,
      email,
      displayName: email.split("@")[0],
      portal: null,
      mfaEnabled: false,
      mfaMethod: null,
    };

    mockSession = {
      user,
      token: `mock_token_${Date.now()}`,
      expiresAt: Date.now() + 3600000, // 1 hour
    };

    return user;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    mockSession = { user: null, token: null, expiresAt: null };
  },

  // Get current session
  getSession: (): SessionData => {
    // Check if session expired
    if (mockSession.expiresAt && Date.now() > mockSession.expiresAt) {
      mockSession = { user: null, token: null, expiresAt: null };
    }
    return mockSession;
  },

  // OAuth sign in
  signInWithOAuth: async (provider: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const user: User = {
      uid: `oauth_${Date.now()}`,
      email: `user@${provider}.com`,
      displayName: `${provider} User`,
      portal: null,
      mfaEnabled: false,
      mfaMethod: null,
    };

    mockSession = {
      user,
      token: `oauth_token_${Date.now()}`,
      expiresAt: Date.now() + 3600000,
    };

    return user;
  },

  // MFA - Generate TOTP secret
  generateMfaSecret: async (): Promise<{ secret: string; qrCode: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const secret = `MOCK${Math.random()
      .toString(36)
      .substring(2, 15)
      .toUpperCase()}`;
    const qrCode = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" textAnchor="middle" fontSize="12">QR Code Mock</text></svg>`;

    return { secret, qrCode };
  },

  // MFA - Verify TOTP code
  verifyMfaCode: async (code: string, secret: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock validation - accept "123456" or any 6-digit code for demo
    return code.length === 6 && /^\d+$/.test(code);
  },

  // MFA - Enable for user
  enableMfa: async (
    method: "authenticator" | "email",
    secret?: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (mockSession.user) {
      mockSession.user.mfaEnabled = true;
      mockSession.user.mfaMethod = method;

      if (method === "authenticator" && secret) {
        mockMfaSecrets.set(mockSession.user.uid, secret);
      }
    }
  },

  // MFA - Send email code
  sendEmailCode: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    mockEmailCodes.set(email, {
      code,
      expiresAt: Date.now() + 300000, // 5 minutes
    });

    console.log(`[v0] Mock email code sent to ${email}: ${code}`);
  },

  // MFA - Verify email code
  verifyEmailCode: async (email: string, code: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const stored = mockEmailCodes.get(email);
    if (!stored) return false;

    if (Date.now() > stored.expiresAt) {
      mockEmailCodes.delete(email);
      return false;
    }

    return stored.code === code;
  },

  // Set portal context
  setPortal: (portal: "recruiter" | "client"): void => {
    if (mockSession.user) {
      mockSession.user.portal = portal;
    }
  },

  // Force session expiry (for testing)
  expireSession: (): void => {
    if (mockSession.expiresAt) {
      mockSession.expiresAt = Date.now() - 1000;
    }
  },

  // Generate signed JWT-like tokens
  generateSignedToken: (user: User): string => {
    // Mock JWT structure: header.payload.signature
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        portal: user.portal,
        exp: Date.now() + 3600000, // 1 hour
        iat: Date.now(),
      })
    );
    const signature = btoa(`mock_signature_${Date.now()}`);
    return `${header}.${payload}.${signature}`;
  },

  // Get portal redirect URL with token
  getPortalRedirectUrl: (
    portal: "recruiter" | "client",
    token: string
  ): string => {
    const portalPath =
      portal === "recruiter" ? "recruiterportal" : "clientportal";
    return `/mock/${portalPath}?t=${token}`;
  },

  // Magic link methods
  sendMagicLink: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`[v0] Magic link sent to ${email}`);
  },

  // Password reset method
  sendPasswordReset: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`[v0] Password reset email sent to ${email}`);
  },
};
