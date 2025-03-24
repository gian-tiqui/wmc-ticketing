import PageTemplate from "../templates/PageTemplate";

const UnauthorizedPage = () => {
  return (
    <PageTemplate>
      <main className="grid w-full h-full place-content-center">
        <section className="w-full text-center">
          <p className="mb-3 text-3xl font-medium">
            <span className="text-blue-400">401</span> Unauthorized
          </p>
          <p className="font-medium">
            You are not allowed to access that page.
          </p>
        </section>
      </main>
    </PageTemplate>
  );
};

export default UnauthorizedPage;
