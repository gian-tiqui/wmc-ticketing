import { CreateComment } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const createComment = async (createCommentDto: CreateComment) => {
  return apiClient.post(`${URI.API_URI}/api/v1/comment`, {
    ...createCommentDto,
  });
};

const findCommentById = async (commentId: number | null) => {
  if (!commentId) return;
  return apiClient.get(`${URI.API_URI}/api/v1/comment/${commentId}`);
};

const updateCommentById = async (
  commentId: number,
  updateComment: { comment: string }
) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/comment/${commentId}`, {
    ...updateComment,
  });
};

const uploadCommentPhotosByCommentId = async (
  commentId: number,
  formData: FormData
) => {
  return apiClient.post(
    `${URI.API_URI}/api/v1/comment/${commentId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const deleteCommentById = async (commentId: number | null) => {
  if (!commentId) return;
  return apiClient.delete(`${URI.API_URI}/api/v1/comment/${commentId}`);
};

export {
  createComment,
  findCommentById,
  updateCommentById,
  uploadCommentPhotosByCommentId,
  deleteCommentById,
};
