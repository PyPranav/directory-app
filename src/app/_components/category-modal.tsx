"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const formSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  slug: z.string().min(4, "Slug must be at least 4 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: { id: string; name: string; slug: string } | null;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export const CategoryModal = ({
  isOpen,
  onClose,
  editingCategory,
  onSubmit,
  isSubmitting,
}: CategoryModalProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Reset form when modal opens/closes or editing category changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        form.reset({
          name: editingCategory.name,
          slug: editingCategory.slug,
        });
      } else {
        form.reset();
      }
    }
  }, [isOpen, editingCategory, form]);

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter category name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter category slug"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || form.formState.isSubmitting}
              >
                {isSubmitting || form.formState.isSubmitting
                  ? "Saving..."
                  : editingCategory
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 