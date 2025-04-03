import { UpdateNotificationDto } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const updateNotificationById = async (
  notificationId: number | undefined,
  updateNotificationDto: UpdateNotificationDto
) => {
  return apiClient.patch(
    `${URI.API_URI}/api/v1/notification/${notificationId}`,
    {
      ...updateNotificationDto,
    }
  );
};

export { updateNotificationById };
