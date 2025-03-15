import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJsonField<T>(jsonString: string | null): T | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

export function stringifyJsonField<T>(data: T): string {
  return JSON.stringify(data);
}

/**
 * Safely handle API errors and return appropriate response
 */
export async function handleApiError(
  fn: () => Promise<Response>,
  errorMessage = 'An error occurred'
): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
