import React, { createContext, useContext, useState, useEffect } from "react";

// Standard HIPAA RBAC Roles
export const ROLES = {
  SUPER_ADMIN: "SuperAdmin",    // Doctor Shalini Mandapatti (Owner / Medical Director)
  DOCTOR: "Doctor",            // Associate Dentist / Clinical Provider
  RECEPTIONIST: "Receptionist",// Front Desk Administrator
  PATIENT: "Patient"           // Verified Patient Portal User
};

// Role Permissions Matrix
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    "dashboard:view",
    "appointments:read",
    "appointments:write",
    "patients:read",
    "patients:write",
    "schedule:manage",
    "insurance:verify",
    "ai:manage",
    "hipaa:audit",
    "security:admin"
  ],
  [ROLES.DOCTOR]: [
    "dashboard:view",
    "appointments:read",
    "appointments:write",
    "patients:read",
    "patients:write",
    "schedule:view",
    "insurance:verify"
  ],
  [ROLES.RECEPTIONIST]: [
    "dashboard:view",
    "appointments:read",
    "appointments:write",
    "patients:read",
    "patients:write",
    "schedule:manage",
    "insurance:verify",
    "ai:view"
  ],
  [ROLES.PATIENT]: [
    "portal:view",
    "appointments:read",
    "insurance:view"
  ]
};

// Demo User Profiles for Instant Verification & Testing
export const DEMO_USERS = {
  [ROLES.SUPER_ADMIN]: {
    id: "USR-001",
    username: "Allrightdental",
    name: "Doctor Shalini Mandapatti, DDS",
    title: "Clinic Owner & Lead Dentist",
    role: ROLES.SUPER_ADMIN,
    email: "drshalini@allrightdental.com",
    phone: "(215) 295-1348",
    mfaEnabled: true,
    mfaMethod: "TOTP",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"
  },
  [ROLES.DOCTOR]: {
    id: "USR-002",
    username: "dr.associate",
    name: "Dr. Marcus Vance, DDS",
    title: "Associate Endodontist",
    role: ROLES.DOCTOR,
    email: "dr.vance@allrightdental.com",
    phone: "(215) 295-1349",
    mfaEnabled: true,
    mfaMethod: "TOTP",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256"
  },
  [ROLES.RECEPTIONIST]: {
    id: "USR-003",
    username: "frontdesk",
    name: "Sarah Jenkins",
    title: "Lead Patient Care Coordinator",
    role: ROLES.RECEPTIONIST,
    email: "reception@allrightdental.com",
    phone: "(215) 295-1348",
    mfaEnabled: true,
    mfaMethod: "SMS",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
  },
  [ROLES.PATIENT]: {
    id: "PAT-004",
    username: "piyush",
    name: "Piyush Junghare",
    title: "Registered Patient",
    role: ROLES.PATIENT,
    email: "ujunghare635@gmail.com",
    phone: "(215) 555-0199",
    mfaEnabled: true,
    mfaMethod: "SMS",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("allright_auth_user");
      if (savedUser) return JSON.parse(savedUser);
      // Default to SuperAdmin if legacy isLoggedIn was true
      if (localStorage.getItem("isLoggedIn") === "true") {
        return DEMO_USERS[ROLES.SUPER_ADMIN];
      }
    } catch (e) {
      console.warn("Auth initialization fallback:", e);
    }
    return null;
  });

  const [pendingMfaUser, setPendingMfaUser] = useState(null);
  const [mfaCode, setMfaCode] = useState("123456");

  // Keep localStorage synchronized
  useEffect(() => {
    if (user) {
      localStorage.setItem("allright_auth_user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("allright_auth_user");
      localStorage.removeItem("isLoggedIn");
    }
  }, [user]);

  // Step 1: Primary Authentication (Credentials)
  const loginPrimary = (username, password) => {
    const cleanUser = (username || "").trim().toLowerCase();
    
    // Check SuperAdmin default credentials
    if ((cleanUser === "allrightdental" || cleanUser === "admin") && (password === "allrightdental25*" || password === "admin123")) {
      const targetUser = DEMO_USERS[ROLES.SUPER_ADMIN];
      setPendingMfaUser(targetUser);
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setMfaCode(generatedCode);
      return { success: true, requiresMfa: true, mfaMethod: targetUser.mfaMethod, user: targetUser, demoCode: generatedCode };
    }

    // Check Doctor
    if (cleanUser === "doctor" || cleanUser === "dr.associate") {
      const targetUser = DEMO_USERS[ROLES.DOCTOR];
      setPendingMfaUser(targetUser);
      const generatedCode = "654321";
      setMfaCode(generatedCode);
      return { success: true, requiresMfa: true, mfaMethod: targetUser.mfaMethod, user: targetUser, demoCode: generatedCode };
    }

    // Check Receptionist
    if (cleanUser === "reception" || cleanUser === "frontdesk") {
      const targetUser = DEMO_USERS[ROLES.RECEPTIONIST];
      setPendingMfaUser(targetUser);
      const generatedCode = "889900";
      setMfaCode(generatedCode);
      return { success: true, requiresMfa: true, mfaMethod: targetUser.mfaMethod, user: targetUser, demoCode: generatedCode };
    }

    // Check Patient
    if (cleanUser === "patient" || cleanUser === "piyush") {
      const targetUser = DEMO_USERS[ROLES.PATIENT];
      setPendingMfaUser(targetUser);
      const generatedCode = "112233";
      setMfaCode(generatedCode);
      return { success: true, requiresMfa: true, mfaMethod: targetUser.mfaMethod, user: targetUser, demoCode: generatedCode };
    }

    return { success: false, message: "Invalid credentials. Use username 'Allrightdental' & password 'allrightdental25*'" };
  };

  // Step 2: Multi-Factor Authentication Verification
  const verifyMfa = (enteredCode) => {
    if (!pendingMfaUser) {
      return { success: false, message: "No authentication session in progress." };
    }
    // Accept matching generated code, or standard test bypass code 123456
    if (enteredCode === mfaCode || enteredCode === "123456" || enteredCode === "889900") {
      const authenticatedUser = {
        ...pendingMfaUser,
        mfaVerifiedAt: new Date().toISOString()
      };
      setUser(authenticatedUser);
      setPendingMfaUser(null);
      return { success: true, user: authenticatedUser };
    }

    return { success: false, message: "Invalid verification code. Please try again or use code: " + mfaCode };
  };

  // Fast Instant Role Switcher (For developer & client demo convenience)
  const switchRole = (role) => {
    if (DEMO_USERS[role]) {
      const switchedUser = {
        ...DEMO_USERS[role],
        mfaVerifiedAt: new Date().toISOString()
      };
      setUser(switchedUser);
      setPendingMfaUser(null);
      return switchedUser;
    }
  };

  const logout = () => {
    setUser(null);
    setPendingMfaUser(null);
    localStorage.removeItem("allright_auth_user");
    localStorage.removeItem("isLoggedIn");
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated: !!user,
        pendingMfaUser,
        mfaCode,
        loginPrimary,
        verifyMfa,
        switchRole,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

