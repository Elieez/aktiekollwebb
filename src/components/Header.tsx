import Link from "next/link";
import CompanySearch from "@/components/SearchBar";

export default function Header() {
  return (
    <header className="bg-[#1A202C] shadow-sm sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-4">
        {/* Left: Logo & Title */}
        <div className="flex items-baseline gap-3">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white hover:text-gray-300 transition-colors cursor-pointer">
              AktieKoll
            </h1>
          </Link>
          <p className="text-sm text-gray-300">
            Track the latest insider transactions
          </p>
        </div>

        {/* Right: Searchbar */}
        <div className="w-full md:w-1/3">
          <CompanySearch />
        </div>
      </div>
    </header>
  );
}
