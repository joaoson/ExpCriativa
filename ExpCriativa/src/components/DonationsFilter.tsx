import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";

const DonationsFilter = ({
  onSortChange,
  onSearchChange
}: {
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">

      <div className="flex flex-col gap-1 w-full md:w-1/2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by donor message or organization name"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 w-full md:w-1/4">
        <Label>Sort By</Label>
        <Select onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value-asc">Value (Ascending)</SelectItem>
            <SelectItem value="value-desc">Value (Desceding)</SelectItem>
            <SelectItem value="alpha-asc">Alphabetical (Asceding)</SelectItem>
            <SelectItem value="alpha-desc">Alphabetical (Descending)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DonationsFilter;
