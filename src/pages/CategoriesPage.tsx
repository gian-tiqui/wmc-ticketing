import CategoriesTable from "../components/CategoriesTable";
import PageTemplate from "../templates/PageTemplate";

const CategoriesPage = () => {
  return (
    <PageTemplate>
      <div className="w-full h-screen overflow-hidden">
        <CategoriesTable />
      </div>
    </PageTemplate>
  );
};

export default CategoriesPage;
