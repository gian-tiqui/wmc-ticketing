import CategoriesPageHeader from "../components/CategoriesPageHeader";
import CategoriesTable from "../components/CategoriesTable";
import PageTemplate from "../templates/PageTemplate";

const CategoriesPage = () => {
  return (
    <PageTemplate>
      <div className="w-full h-screen overflow-auto p">
        <CategoriesPageHeader />
        <CategoriesTable />
      </div>
    </PageTemplate>
  );
};

export default CategoriesPage;
