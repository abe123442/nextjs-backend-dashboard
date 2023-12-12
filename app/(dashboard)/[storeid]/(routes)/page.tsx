import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId
    }
  });

  return (
    <div className="p-4">
      <p>Active Store ID: {store?.id}</p>
      <p>Active Store Name: {store?.name}</p>
    </div>
  );
};

export default DashboardPage;