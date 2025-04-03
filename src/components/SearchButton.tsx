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
        className="w-40 gap-2 hover:border-blue-500 h-9 hover:border"
        icon={`${PrimeIcons.SEARCH}`}
        onClick={() => setSearchDialogVisible(true)}
      >
        Search
      </Button>
    </>
  );
};

export default SearchButton;
