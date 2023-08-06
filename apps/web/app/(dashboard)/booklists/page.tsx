import { prisma } from "@/lib/database";
import { loginUser } from "@/lib/user";
import { columns } from "@/app/(dashboard)/booklists/_components/columns";
import { DataTable } from "@/app/(dashboard)/booklists/_components/data-table";

const BooklistsPage: React.FC = async () => {
  const booklists = await getBooklists();

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your booklists.
          </p>
        </div>
      </div>
      <DataTable data={booklists} columns={columns} />
    </div>
  );
};

async function getBooklists(uid?: number) {
  return await prisma.booklist.findMany({
    where: { userId: uid ?? loginUser().uid },
    select: { id: true, title: true, status: true, priority: true },
  });
}

export type Booklist = Awaited<ReturnType<typeof getBooklists>>[number];

export default BooklistsPage;