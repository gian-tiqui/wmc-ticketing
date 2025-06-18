import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const findCategoryById = async (categoryId: number | undefined) => {
  return apiClient.get(`${URI.API_URI}/api/v1/categories/${categoryId}`);
};

export { findCategoryById };
