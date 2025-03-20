import { Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getSecretQuestions = async (query?: Query) => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/secret-question?search=${
        query?.search || ""
      }&limit=${50}`
    );

    if (response.status === 200) {
      const questions = response.data.secretQuestions;

      return questions;
    }
  } catch (error) {
    console.error(error);

    return [];
  }
};

export { getSecretQuestions };
