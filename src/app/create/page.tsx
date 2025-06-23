"use client";

import { useState } from "react";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { CategoryModal } from "~/app/_components/category-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DirectoryAdminListing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    slug: string;
  } | null>(null);
  const router = useRouter();

  const utils = api.useUtils();

  const { data: categories, isLoading } = api.categories.getAll.useQuery({});
  const createCategory = api.categories.create.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate();
      setIsModalOpen(false);
      toast.success("Category created successfully")
    },
    onError: (error)=>{
        toast.error(error.message)
    }
  });

  const updateCategory = api.categories.update.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate();
      setIsModalOpen(false);
      setEditingCategory(null);
      toast.success("Category updated successfully")

    },
    onError: (error)=>{
        toast.error(error.message)
    }
  });

  const deleteCategory = api.categories.delete.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate();
      toast.success("Category deleted successfully")

    },
  });

  const handleSubmit = async (data: { name: string; slug: string }) => {
    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory.id,
        name: data.name,
        slug: data.slug,
      });
    } else {
      createCategory.mutate(data);
    }
  };

  const handleEdit = (category: { id: string; name: string; slug: string }) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate({ id });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header with Add Button */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Category Management</h1>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingCategory={editingCategory}
        onSubmit={handleSubmit}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
            {categories?.map((category) => (
              <Card
                key={category.id}
                className="group relative h-full transition-shadow hover:shadow-lg"
                onClick={()=>{
                    router.push(`create/${category.id}`)
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-lg">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground mb-2 text-sm break-all">
                    Slug: {category.slug}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Created:{" "}
                    {new Date(category.created_at).toLocaleDateString()}
                  </p>
                </CardContent>

                {/* Hover Actions */}
                <div onClick={(e)=>{
                    e.stopPropagation()
                }} className="absolute top-3 right-3 grid grid-cols-2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => 
                        handleEdit(category)
                    }
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
                          delete the category "{category.name}" and all
                          associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            <p className="text-white">Delete</p>
                          
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>

          {categories?.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No categories found. Create your first category to get started.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DirectoryAdminListing;
