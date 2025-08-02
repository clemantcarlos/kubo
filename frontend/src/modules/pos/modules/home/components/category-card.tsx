import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

type Category = {
  name: string;
  count: number;
};

interface CategorySelectorProps {
  categories: Category[];
  onSelect?: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onSelect,
}) => {
  const [selected, setSelected] = useState<string>(categories[0]?.name || "");

  const handleSelect = (name: string) => {
    setSelected(name);
    if (onSelect) onSelect(name);
  };

  return (
    <div className="flex gap-2 p-2">
      {categories.map((cat) => (
        <Button
          key={cat.name}
          variant={selected === cat.name ? "default" : "outline"}
          onClick={() => handleSelect(cat.name)}
          className="flex flex-col items-center px-4 py-2"
        >
          <Bell className="w-4 h-4 mr-2" />
          <span className="font-semibold">{cat.name}</span>
          <span className="text-xs text-muted-foreground">{cat.count} items</span>
        </Button>
      ))}
    </div>
  );
};