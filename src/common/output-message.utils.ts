// import * as Sentry from '@sentry/node';
import { HttpException, HttpStatus } from '@nestjs/common';

export function commonResponse(success: boolean, message: string, payload: any = null) {

  // console.log({ payload });

  if (success) {
    return { success, message, data: payload };
  } else {
    let httpStatus = HttpStatus.BAD_REQUEST;
    if (payload.status === HttpStatus.UNAUTHORIZED) {
      httpStatus = HttpStatus.UNAUTHORIZED;
    } else if (payload.status === HttpStatus.NOT_ACCEPTABLE) {
      httpStatus = HttpStatus.NOT_ACCEPTABLE;
    }

    throw new HttpException(
      {
        success,
        message: payload.message || message,
        error: payload.message,
      },
      httpStatus,
    );
  }
}

export function listFilterResponse(
  success: boolean,
  message: string,
  total: number,
  take: number,
  page: number,
  data: any,
) {
  const res = {
    success,
    message,
    total,
    page,
    take,
    data,
  };
  return res;
}
