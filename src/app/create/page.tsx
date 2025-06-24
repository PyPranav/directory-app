"use client";

import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CategoryModal } from "~/app/_components/CategoryModal";
import CategoryCard from "../_components/CategoryCard";
import { useSession } from "next-auth/react"

const DirectoryAdminListing = () => {
  const session = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    slug: string;
  } | null>(null);
  const router = useRouter();

  const utils = api.useUtils();

  const { data: categories, isLoading } = api.categories.getAll.useQuery({
    name: "",
  });
  const createCategory = api.categories.create.useMutation({
    onSuccess: async () => {
      await utils.categories.getAll.invalidate();
      setIsModalOpen(false);
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateCategory = api.categories.update.useMutation({
    onSuccess: async () => {
      await utils.categories.getAll.invalidate();
      setIsModalOpen(false);
      setEditingCategory(null);
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteCategory = api.categories.delete.useMutation({
    onSuccess: async () => {
      await utils.categories.getAll.invalidate();
      toast.success("Category deleted successfully");
    },
  });

  const handleSubmit = async (data: { name: string; slug: string, metadataDescription?:string }) => {
    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory.id,
        name: data.name,
        slug: data.slug,
        metadataDescription:data.metadataDescription
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

  
  useEffect(()=>{
    if(session.status==='unauthenticated'){
      router.push("/api/auth/signin")
    }
  }, [session, router])

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
              <CategoryCard
              onCardClick={() => {
                router.push(
                  `create/${category.slug}`,
                );
              }}
                category={category}
                key={category.id}
                handleEdit={() => handleEdit(category)}
                handleDelete={() => handleDelete(category.id)}
              />
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
