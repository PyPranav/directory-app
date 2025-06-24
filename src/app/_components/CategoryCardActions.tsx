import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

const CategoryCardActions = ({
    handleEdit,
    handleDelete,
    categoryName,
  }: {
    handleEdit?: () => void;
    handleDelete?: () => void;
    categoryName: string;
  }) => {
    return ( 
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 grid grid-cols-2 gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={handleEdit}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the tool &quot;{categoryName}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
        </div>
     );
    }
 
export default CategoryCardActions;