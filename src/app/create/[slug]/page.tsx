"use client";

import type { Tools } from "@prisma/client";
import { ArrowLeft, Edit, Globe, Loader2, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ToolModal } from "~/app/_components/ToolModal";
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
import { Button } from "~/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { api } from "~/trpc/react";

type ToolData = {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
};

const ToolAdminListing = () => {
  const session = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tools | null>(null);
  const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({});

  const params = useParams();
  const router = useRouter();
  const categorySlug = params.slug as string;

  const utils = api.useUtils();

  const { data: category } = api.categories.getBySlug.useQuery({
    slug: categorySlug,
  });

  const { data: tools, isLoading } = api.tools.getByCategorySlug.useQuery({
    categorySlug,
    name: "",
  });

  const createTool = api.tools.create.useMutation({
    onSuccess: async() => {
      await utils.tools.getByCategorySlug.invalidate({ categorySlug });
      toast.success("Tool created successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateTool = api.tools.update.useMutation({
    onSuccess:async () => {
      await utils.tools.getByCategorySlug.invalidate({ categorySlug });
      toast.success("Tool updated successfully!");
      setEditingTool(null);
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteTool = api.tools.delete.useMutation({
    onSuccess: async() => {
      await utils.tools.getByCategorySlug.invalidate({ categorySlug });
      toast.success("Tool deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (data: ToolData) => {
    if (editingTool) {
      setTimeout(() => {
        setImgLoaded({ ...imgLoaded, [editingTool.id]: true });
      }, 1500);

      updateTool.mutate({ ...data, id: editingTool.id });
    } else if (category) {
      createTool.mutate({ ...data, category: category.id });
    }
  };

  const handleEdit = (tool: Tools) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTool.mutate({ id });
  };

  const openCreateModal = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  useEffect(()=>{
    if(session.status==='unauthenticated'){
      router.push("/api/auth/signin")
    }
  }, [session, router])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft /> Back to Categories
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Tools for {category?.name ?? "..."}
          </h1>
          <p className="opacity-45">/{category?.slug}</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <ToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTool={editingTool}
        onSubmit={handleSubmit}
        isSubmitting={createTool.isPending || updateTool.isPending}
      />

      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
            {tools?.map((tool) => (
              <Card
                key={tool.id}
                className="group relative flex h-full flex-col transition-shadow hover:shadow-lg"
              >
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  {tool.logo_url && imgLoaded[tool.id] !== false && (
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-lg">
                      <Image
                        src={tool.logo_url}
                        alt={`${tool.name} logo`}
                        className="h-full w-full object-contain"
                        onError={() =>
                          setImgLoaded((prev) => ({
                            ...prev,
                            [tool.id]: false,
                          }))
                        }
                        unoptimized
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <CardTitle className="mb-1 text-xl font-bold">
                      {tool.name}
                    </CardTitle>
                    {tool.created_at && (
                      <div className="text-muted-foreground mb-1 text-xs">
                        Created on{" "}
                        {new Date(tool.created_at).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </div>
                    )}
                    {tool.description ? null : (
                      <div className="text-muted-foreground mb-2 text-sm">
                        No description provided.
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardFooter>
                  {tool.website && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </Link>
                    </Button>
                  )}
                </CardFooter>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-3 right-3 grid grid-cols-2 gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(tool)}
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
                          delete the tool &quot;{tool.name}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(tool.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>

          {tools?.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No tools found for this category.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ToolAdminListing;
