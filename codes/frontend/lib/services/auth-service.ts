export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
    }
    token: string
    permissions: string[]
  }
  message: string
}

export class AuthService {
  private static readonly baseUrl = "http://localhost:3001/api/v1/auth"

  static async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || "Unable to login")
    }

    return (await response.json()) as LoginResponse
  }
}

