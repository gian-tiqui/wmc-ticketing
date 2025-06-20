import { Toast } from "primereact/toast";
import { MutableRefObject } from "react";

const handleErrors = (
  error: unknown,
  refObject: MutableRefObject<Toast | null>
) => {
  const errorObj = error as any;

  if (!errorObj?.response?.data) {
    refObject.current?.show({
      severity: "error",
      summary: "Error",
      detail: errorObj?.message || "An unexpected error occurred",
    });
    return;
  }

  const {
    response: {
      data: { message, error: err },
    },
    status,
  } = errorObj as {
    response: { data: { message: string; error: string } };
    status: number;
  };

  if (status === 401) {
    refObject.current?.show({
      severity: "error",
      summary: err || "Unauthorized",
      detail: message || "You are not authorized to perform this action",
    });
    return;
  }

  if (status === 404) {
    refObject.current?.show({
      severity: "error",
      summary: err || "Not Found",
      detail: message || "The requested resource was not found",
    });
    return;
  }

  if (status === 400) {
    refObject.current?.show({
      severity: "error",
      summary: err || "Bad Request",
      detail: message || "Invalid request data",
    });
    return;
  }

  refObject.current?.show({
    severity: "error",
    summary: err || "Server Error",
    detail: message || "There is a problem in the server. Please wait",
  });
};

export default handleErrors;
