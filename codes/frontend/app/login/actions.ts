"use server"

import { cookies } from "next/headers"
import { AuthService, type LoginResponse } from "@/lib/services/auth-service"
import { FEATURE_COOKIE_KEY, getDefaultPermissionsForRole, sanitizePermissions } from "@/lib/permissions"

type ActionResult = {
  status: "idle" | "success" | "error"
  message?: string
  user?: LoginResponse["data"]["user"]
}

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const username = (formData.get("username") as string)?.trim()
    const password = (formData.get("password") as string)?.trim()

    if (!username || !password) {
      return {
        status: "error",
        message: "Please provide both email and password.",
      }
    }

    const response = await AuthService.login({ username, password })

    if (!response.success) {
      return { status: "error", message: response.message ?? "Login failed" }
    }

    const cookieStore = await cookies()
    cookieStore.set("acadflow_token", response.data.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    cookieStore.set("acadflow_user", JSON.stringify(response.data.user), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    })

    const normalizedPermissions = sanitizePermissions(response.data.permissions)
    const fallbackPermissions = getDefaultPermissionsForRole(response.data.user.role)
    const permissionsToStore = normalizedPermissions.length > 0 ? normalizedPermissions : fallbackPermissions

    cookieStore.set(FEATURE_COOKIE_KEY, JSON.stringify(permissionsToStore), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    })

    return {
      status: "success",
      message: response.message,
      user: response.data.user,
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unexpected error",
    }
  }
}
