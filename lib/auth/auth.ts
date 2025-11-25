import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/db/users";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Create session (simple cookie-based session)
export async function createSession(userId: number, email: string, name: string, role: "administrator" | "user") {
  const cookieStore = await cookies();
  
  // Ensure role is valid
  const validRole = (role === "administrator" || role === "user") ? role : "user";
  
  // Debug logging (development only)
  if (process.env.NODE_ENV === "development") {
    console.log("[createSession] Creating session:", {
      userId,
      email,
      name,
      role: validRole,
      roleType: typeof validRole,
      roleValue: JSON.stringify(validRole),
    });
  }
  
  const sessionData = {
    userId,
    email,
    name,
    role: validRole,
    createdAt: new Date().toISOString(),
  };
  
  cookieStore.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  // Debug: Verify session was set (development only)
  if (process.env.NODE_ENV === "development") {
    const verifySession = cookieStore.get("session");
    if (verifySession) {
      try {
        const parsed = JSON.parse(verifySession.value);
        console.log("[createSession] Session verified:", {
          role: parsed.role,
          roleType: typeof parsed.role,
        });
      } catch (e) {
        console.error("[createSession] Error verifying session:", e);
      }
    }
  }
}

// Get session
export async function getSession(): Promise<{ userId: number; email: string; name: string; role: "administrator" | "user"; createdAt: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  
  if (!session) {
    return null;
  }
  
  try {
    const sessionData = JSON.parse(session.value);
    
    // Always fetch role from database to ensure it's up-to-date
    // NOTE: We don't update the cookie here because cookies can only be modified
    // in Server Actions or Route Handlers, not in Server Components
    if (sessionData.userId) {
      const user = await getUserById(sessionData.userId);
      
      // Debug logging (development only)
      if (process.env.NODE_ENV === "development") {
        console.log("[getSession] User from DB (full object):", JSON.stringify(user, null, 2));
        console.log("[getSession] User from DB (extracted):", {
          userId: user?.id,
          email: user?.email,
          name: user?.name,
          role: user?.role,
          roleType: typeof user?.role,
          roleValue: JSON.stringify(user?.role),
          hasRole: "role" in (user || {}),
          userKeys: user ? Object.keys(user) : [],
        });
        console.log("[getSession] Session data from cookie:", {
          userId: sessionData.userId,
          role: sessionData.role,
          roleType: typeof sessionData.role,
        });
      }
      
      if (user && user.role) {
        // Return session with role from database (always sync, but don't update cookie)
        const updatedSessionData = {
          ...sessionData,
          role: user.role,
        };
        
        // Debug logging (development only)
        if (process.env.NODE_ENV === "development") {
          console.log("[getSession] Returning session with role from DB:", {
            role: updatedSessionData.role,
            roleType: typeof updatedSessionData.role,
            roleValue: JSON.stringify(updatedSessionData.role),
            isAdmin: updatedSessionData.role === "administrator",
          });
        }
        
        return updatedSessionData;
      } else {
        // Default to user if user not found
        if (process.env.NODE_ENV === "development") {
          console.warn("[getSession] User not found or role missing, defaulting to 'user'");
        }
        return {
          ...sessionData,
          role: "user",
        };
      }
    } else {
      // Default to user if userId is missing
      if (process.env.NODE_ENV === "development") {
        console.warn("[getSession] userId missing, defaulting to 'user'");
      }
      return {
        ...sessionData,
        role: "user",
      };
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getSession] Error parsing session:", error);
    }
    return null;
  }
}

// Delete session (logout)
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Helper function to check if user has required role
export async function requireRole(requiredRole: "administrator" | "user"): Promise<{ success: true; session: { userId: number; email: string; name: string; role: "administrator" | "user"; createdAt: string } } | { success: false; message: string }> {
  const session = await getSession();
  
  if (!session) {
    return { success: false, message: "Unauthorized: No session found" };
  }
  
  if (requiredRole === "administrator" && session.role !== "administrator") {
    return { success: false, message: "Forbidden: Administrator access required" };
  }
  
  return { success: true, session };
}

// Helper function to check if user is administrator
export async function requireAdministrator(): Promise<{ success: true; session: { userId: number; email: string; name: string; role: "administrator" | "user"; createdAt: string } } | { success: false; message: string }> {
  return requireRole("administrator");
}

