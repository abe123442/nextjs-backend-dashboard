import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';
import Navbar from '@/components/standalone/navbar';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { storeId: string }
}) {
  // Check if the user is authenticated, and redirect to login otherwise
  const { userId } = auth();
  if (!userId) {
    redirect('/login');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  });

  // if the store according to the provided storeId doesn't exist, then
  // the user has provided an invalid id
  if (!store) {
    redirect('/');
  }

  // return the corresponding navbar for the given storeId
  return (
    <>
      <div>
        <Navbar />
        {children}
      </div>
    </>
  )
}