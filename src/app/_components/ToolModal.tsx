"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import MarkdownPreview from "./MarkdownPreview";

const formSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  slug: z.string().min(4, "Slug must be at least 4 characters"),
  description: z.string().optional(),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  metadataDescription: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTool: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    logo_url?: string | null;
    website?: string | null;
    metadataDescription?: string | null;
  } | null;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export const ToolModal = ({
  isOpen,
  onClose,
  editingTool,
  onSubmit,
  isSubmitting,
}: ToolModalProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logo_url: "",
      website: "",
      metadataDescription: ""
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (editingTool) {
        form.reset({
          name: editingTool.name,
          slug: editingTool.slug,
          description: editingTool.description ?? "",
          logo_url: editingTool.logo_url ?? "",
          website: editingTool.website ?? "",
          metadataDescription: editingTool.metadataDescription ?? ""
        });
      } else {
        form.reset({
          name: "",
          slug: "",
          description: "",
          logo_url: "",
          website: "",
        });
      }
    }
  }, [isOpen, editingTool, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90%]">
        <DialogHeader>
          <DialogTitle>
            {editingTool ? "Edit Tool" : "Add New Tool"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter tool name" />
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
                  <FormLabel>Slug*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter tool slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <div className="mb-1 text-xs text-muted-foreground">
                      You can use <span className="font-semibold">Markdown</span> here for formatting.
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <FormControl>
                          <Textarea {...field} placeholder="Write a description using Markdown..." className="min-h-[500px]" />
                        </FormControl>
                      </div>
                      <div className="w-px bg-border hidden md:block mx-2" />
                      <div className="flex-1">
                        <div className="rounded-md border bg-muted p-5 min-h-[140px] overflow-auto" style={{ maxHeight: 500 }}>
                          <MarkdownPreview content={field.value ?? ""} />
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="metadataDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Write metadata description for this category" className="min-h-[50px] " />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || form.formState.isSubmitting}
              >
                {isSubmitting ? "Saving..." : editingTool ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 