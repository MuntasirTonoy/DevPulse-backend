import { Response } from 'express';

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

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
