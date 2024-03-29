import { loginedUserStatus } from "@/lib/user-actions";
import { BooksProvider } from "@/app/(core)/(bookshelf)/made4u/_components/books-context";
import { BooksShowcase } from "@/app/(core)/(bookshelf)/made4u/_components/books-showcase";
import { DatePicker } from "@/app/(core)/(bookshelf)/made4u/_components/date-picker";
import { getReferral } from "@/app/(core)/(bookshelf)/made4u/made4u-actions";

const MadeForYouPage: React.FC = async () => {
  const { uid } = await loginedUserStatus();
  const { books, user } = await getReferral({ uid, date: new Date() });
  const disabledDate = { before: user.createdAt, after: new Date() };

  return (
    <div className="flex h-full flex-1 flex-col space-y-6 border-none p-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Made for You
          </h2>
          <p className="text-muted-foreground text-sm">
            Your personal booklists. Updated daily.
          </p>
        </div>
      </div>
      <BooksProvider books={books}>
        <div className="flex flex-1 flex-col space-y-4">
          <DatePicker uid={uid} disabled={disabledDate} />
          <BooksShowcase className="flex-1" />
        </div>
      </BooksProvider>
    </div>
  );
};

export default MadeForYouPage;
