import { useAuth } from "@clerk/nextjs";

interface AuthCredentials {
	token: string;
	userId: string;
}

interface RequestConfig extends RequestInit {
	body?: string;
}

interface ApiResponse<T = unknown> {
	result?: T;
	error?: string;
	message?: string;
}

class SecurityClient {
	private baseUrl: string;
	private auth: ReturnType<typeof useAuth>;
	private defaultHeaders: Record<string, string>;

	constructor(auth: ReturnType<typeof useAuth>) {
		this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
		this.auth = auth;
		this.defaultHeaders = {
			"Content-Type": "application/json",
		};
	}

	// Method to get auth credentials from Clerk session
	private async getAuthCredentials(): Promise<AuthCredentials> {
		try {
			if (!this.auth) throw new Error("Authentication not initialized");

			const token = await this.auth.getToken();
			const userId = this.auth.userId;

			if (!token || !userId) throw new Error("Missing authentication details");

			return {
				token: `Bearer ${token}`,
				userId,
			};
		} catch (error) {
			console.error("Error getting auth credentials:", error);
			throw new Error("Authentication failed");
		}
	}

	// Generic fetch method
	private async fetchRequest<T = unknown>(
		method: string,
		path: string,
		body: unknown = null
	): Promise<ApiResponse<T>> {
		try {
			const { token, userId } = await this.getAuthCredentials();

			const config: RequestConfig = {
				method,
				headers: {
					...this.defaultHeaders,
					Authorization: token,
					"X-User-Id": userId,
				},
			};

			if (body) {
				config.body = JSON.stringify(body);
			}

			const response = await fetch(`${this.baseUrl}${path}`, config);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
			}

			// Return null for 204 No Content
			if (response.status === 204) return null as unknown as ApiResponse<T>;

			return await response.json();
		} catch (error) {
			console.error(`Error in ${method} ${path} request:`, error);
			throw error;
		}
	}

	// GET request
	async get<T = unknown>(path: string): Promise<ApiResponse<T>> {
		return this.fetchRequest<T>("GET", path);
	}

	// POST request
	async post<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
		return this.fetchRequest<T>("POST", path, body);
	}

	// PUT request
	async put<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
		return this.fetchRequest<T>("PUT", path, body);
	}

	// DELETE request
	async delete<T = unknown>(path: string, body: unknown = null): Promise<ApiResponse<T>> {
		return this.fetchRequest<T>("DELETE", path, body);
	}

	// PATCH request
	async patch<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
		return this.fetchRequest<T>("PATCH", path, body);
	}
}

export function useRestSecurityClient(): SecurityClient {
	const auth = useAuth();
	return new SecurityClient(auth);
}
