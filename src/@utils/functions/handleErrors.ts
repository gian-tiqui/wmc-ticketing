import { Toast } from "primereact/toast";
import { MutableRefObject } from "react";

const handleErrors = (
  error: unknown,
  refObject: MutableRefObject<Toast | null>
) => {
  console.log(error);

  const {
    response: {
      data: { message, error: err },
    },
    status,
  } = error as {
    response: { data: { message: string; error: string } };
    status: number;
  };

  if (status === 401) {
    refObject.current?.show({
      severity: "error",
      summary: err,
      detail: message,
    });
    return;
  }

  if (status === 404) {
    refObject.current?.show({
      severity: "error",
      summary: err,
      detail: message,
    });
    return;
  }

  if (status === 400) {
    refObject.current?.show({
      severity: "error",
      summary: err,
      detail: message,
    });
    return;
  }

  refObject.current?.show({
    severity: "error",
    summary: err,
    detail: "There is a problem in the server. Please wait",
  });
};

export default handleErrors;
