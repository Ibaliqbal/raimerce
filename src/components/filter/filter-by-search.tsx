import { useState, KeyboardEvent, FormEvent } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/router";
import { Button } from "../ui/button"; // Pastikan Anda memiliki komponen Button

const FilterBySearch = () => {
  const router = useRouter();
  const { q, ...otherQueries } = router.query;
  const [search, setSearch] = useState((q as string) || "");

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    if (!search || search.trim() === "") {
      router.push(
        {
          pathname: router.pathname,
          query: otherQueries,
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(
        {
          pathname: router.pathname,
          query: { ...otherQueries, q: encodeURIComponent(search) },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <Input
        placeholder="Search something..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="mr-2"
      />
      <Button type="submit">Search</Button>
    </form>
  );
};

export default FilterBySearch;
