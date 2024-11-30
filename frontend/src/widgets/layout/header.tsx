import { ModeToggle } from "@/shared/ui-kit";
import { Link } from "react-router";

export function Header() {
  return (
    <header className="h-[60px] border-b flex justify-between items-center px-6">
      <Link
        to="/"
        className="py-3 px-1 scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl"
      >
        Data Hamsters
      </Link>
      <ModeToggle />
    </header>
  );
}
