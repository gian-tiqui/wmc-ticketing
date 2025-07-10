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

      {/* Desktop Version */}
      <Button
        className="items-center hidden gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 border shadow-lg md:flex bg-white/20 hover:bg-white/30 border-white/30 hover:border-white/50 rounded-xl backdrop-blur-sm hover:shadow-xl"
        icon={`${PrimeIcons.SEARCH} text-sm`}
        onClick={() => setSearchDialogVisible(true)}
      >
        Search
      </Button>

      {/* Mobile Version */}
      <Button
        className="flex items-center justify-center w-10 h-10 text-white transition-all duration-200 border shadow-lg md:hidden bg-white/20 hover:bg-white/30 border-white/30 hover:border-white/50 rounded-xl backdrop-blur-sm hover:shadow-xl"
        icon={`${PrimeIcons.SEARCH} text-sm`}
        onClick={() => setSearchDialogVisible(true)}
      />
    </>
  );
};

export default SearchButton;
