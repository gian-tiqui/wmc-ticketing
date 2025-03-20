import { useEffect, useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import { useNavigate } from "react-router-dom";
import useCrmSidebarStore from "../@utils/store/crmSidebar";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState<number>(7);
  const { isExpanded, setIsExpanded } = useCrmSidebarStore();

  useEffect(() => {
    if (isExpanded) setIsExpanded(false);
  }, [isExpanded, setIsExpanded]);

  useEffect(() => {
    if (counter === 0) {
      navigate(-1);
      return;
    }

    const timer = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, navigate]);

  return (
    <PageTemplate>
      <main className="grid w-full h-full place-content-center">
        <section className="w-full text-center">
          <p className="mb-3 text-3xl font-medium">
            <span className="text-blue-400">404</span> Page Not found
          </p>
          <p className="font-medium">
            Redirecting you to the previous page {counter}...
          </p>
        </section>
      </main>
    </PageTemplate>
  );
};

export default NotFoundPage;
