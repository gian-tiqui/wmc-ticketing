import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

type Category = { name: string; SLA: number; parentId: number | null };

const createCategory = async (category: Category) => {
  return apiClient.post(`${URI.API_URI}/api/v1/categories`, { ...category });
};

const findCategoryById = async (categoryId: number | undefined) => {
  return apiClient.get(`${URI.API_URI}/api/v1/categories/${categoryId}`);
};

const updateCategoryByID = async (
  categoryId: number | undefined,
  updateDateDto: Category
) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/categories/${categoryId}`, {
    ...updateDateDto,
  });
};

const deleteCategoryById = async (categoryId: number | undefined) => {
  return apiClient.delete(`${URI.API_URI}/api/v1/categories/${categoryId}`);
};

export {
  findCategoryById,
  updateCategoryByID,
  deleteCategoryById,
  createCategory,
};
