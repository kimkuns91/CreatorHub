import { FaSearch } from "react-icons/fa";
import { Input } from "./ui/input";

const SearchInput = () => {
  return (
    <div className="relative sm:block hidden">
      <FaSearch className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input placeholder="검색" className="pl-10 bg-primary/10" />
    </div>
  );
};

export default SearchInput;
