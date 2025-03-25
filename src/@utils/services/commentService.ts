import { CreateComment } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const createComment = async (createCommentDto: CreateComment) => {
  return apiClient.post(`${URI.API_URI}/api/v1/comment`, {
    ...createCommentDto,
  });
};

export { createComment };
