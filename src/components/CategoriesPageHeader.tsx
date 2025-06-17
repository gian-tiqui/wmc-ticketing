import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";

const CategoriesPageHeader = () => {
  return (
    <header className="flex justify-between w-full h-20 p-4 backdrop-blur-0">
      <h4 className="font-medium text-blue-600">Categories</h4>
      <div className="flex gap-4">
        <Button
          icon={`${PrimeIcons.PLUS_CIRCLE} text-md`}
          className="w-8 h-8 bg-blue-600"
        />
      </div>
    </header>
  );
};

export default CategoriesPageHeader;
