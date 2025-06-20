import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import useRefetchCategoriesStore from "../@utils/store/refetchDepartmentCategories";

const CategoriesPageHeader = () => {
  const [createCategoryVisible, setCreateCategoryVisible] =
    useState<boolean>(false);
  const { refetch } = useRefetchCategoriesStore();

  return (
    <>
      <CreateCategoryDialog
        visible={createCategoryVisible}
        refetch={refetch}
        setVisible={setCreateCategoryVisible}
      />
      <header className="flex justify-between w-full h-20 p-4 backdrop-blur-0">
        <h4 className="font-medium text-blue-600">Categories</h4>
        <div className="flex gap-4">
          <Button
            onClick={() => setCreateCategoryVisible(true)}
            icon={`${PrimeIcons.PLUS_CIRCLE} text-md`}
            className="w-8 h-8 bg-blue-600"
          />
        </div>
      </header>
    </>
  );
};

export default CategoriesPageHeader;
