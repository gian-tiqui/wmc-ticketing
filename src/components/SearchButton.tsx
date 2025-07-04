import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import SearchDialog from "./SearchDialog";
import { useState } from "react";

const SearchButton = () => {
  const [searchDialogVisible, setSearchDialogVisible] =
    useState<boolean>(false);

  return (
    <>
      <SearchDialog
        visible={searchDialogVisible}
        setVisible={setSearchDialogVisible}
      />
      <Button
        className="hidden h-8 gap-2 text-xs bg-blue-600 md:flex hover:border-blue-500 hover:border"
        icon={`${PrimeIcons.SEARCH} text-xs`}
        onClick={() => setSearchDialogVisible(true)}
      >
        Search
      </Button>
      <Button
        className="justify-center bg-blue-600 md:hidden w-9 hover:border-blue-500 h-9 hover:border"
        icon={`${PrimeIcons.SEARCH}`}
        onClick={() => setSearchDialogVisible(true)}
      ></Button>
    </>
  );
};

export default SearchButton;
