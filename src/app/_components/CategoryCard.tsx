import type { Categories } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import CategoryCardActions from "./CategoryCardActions";


const CategoryCard = ({
  category,
  showAction = true,
  handleDelete,
  handleEdit,
  onCardClick
}: {
  category: Categories & { toolsCount?: number };
  showAction?: boolean;
  handleDelete?: () => void;
  handleEdit?: () => void;
  onCardClick?: ()=> void;
}) => {
  return (
    <Card
      className="group relative h-full transition-shadow hover:shadow-lg"
      onClick={
        onCardClick
      }
    >
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground mb-2 text-sm break-all">
          /{category.slug}
        </p>
        <p className="text-muted-foreground text-xs">
          Created: {new Date(category.created_at).toLocaleDateString()}
        </p>
      </CardContent>

      {/* Hover Actions */}
      {showAction && (
        <CategoryCardActions
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          categoryName={category.name}
        />
      )}
    </Card>
  );
};

export default CategoryCard;
