import { Response } from 'express';

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Sends a standardized JSON API response.
 *
 * @param res        - Express Response object.
 * @param statusCode - HTTP status code.
 * @param success    - Whether the operation succeeded.
 * @param message    - Human-readable message.
 * @param data       - Optional payload to include in the response.
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
): void => {
  const body: IApiResponse<T> = { success, message };
  if (data !== undefined) body.data = data;
  res.status(statusCode).json(body);
};
