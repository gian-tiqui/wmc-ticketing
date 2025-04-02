import React from "react";
import { ImageLocation } from "../types/types";
import { Directory, FileType } from "../@utils/enums/enum";
import extractOriginalName from "../@utils/functions/extractOriginalName";
import getImageFromServer from "../@utils/functions/getImageFromServer";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Image } from "primereact/image";

interface Props {
  imageLocation: ImageLocation;
}

const ServiceReportItem: React.FC<Props> = ({ imageLocation }) => {
  const fileUrl = getImageFromServer(
    Directory.UPLOADS,
    Directory.SERVICE_REPORT,
    imageLocation.path
  );

  if (imageLocation.fileTypeId === FileType.PDF)
    return (
      <div>
        <Button
          icon={`${PrimeIcons.FILE_PDF}`}
          onClick={() => window.open(fileUrl, "_blank")}
          className="w-full gap-2"
        >
          {extractOriginalName(imageLocation.path)}
        </Button>
      </div>
    );
  else if (imageLocation.fileTypeId === FileType.IMAGE)
    return (
      <div>
        <Image src={fileUrl} />
      </div>
    );
  else return <div>error loading a file</div>;
};

export default ServiceReportItem;
