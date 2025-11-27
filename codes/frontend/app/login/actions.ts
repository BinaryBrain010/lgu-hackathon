"use server"

import { cookies } from "next/headers"
import { AuthService, type LoginResponse } from "@/lib/services/auth-service"

type ActionResult = {
  status: "idle" | "success" | "error"
  message?: string
  user?: LoginResponse["data"]["user"]
}

const defaultCredentials = {
  username: "student1@acadflow.edu",
  password: "student123",
}

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const username = (formData.get("username") as string) || defaultCredentials.username
    const password = (formData.get("password") as string) || defaultCredentials.password

    const response = await AuthService.login({ username, password })

    if (!response.success) {
      return { status: "error", message: response.message ?? "Login failed" }
    }

    const cookieStore = cookies()
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

export const initialLoginState: ActionResult = {
  status: "idle",
}

