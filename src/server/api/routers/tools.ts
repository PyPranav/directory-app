import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { handleRouterError } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const toolsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(4),
        description: z.string().optional(),
        category: z.string(),
        logo_url: z.string().optional(),
        website: z.string().optional(),
        slug: z.string().min(4),
        metadataDescription: z.string().optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const categoryExists = await ctx.db.categories.findUnique({
          where: { id: input.category },
        });
        if (!categoryExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Category not found",
          });
        }
        const checkUniqueSlug = await ctx.db.tools.findFirst({
          where: { category: input.category, slug: input.slug },
        })
        if (checkUniqueSlug) {
          throw new TRPCError({ message: "please enter a unique slug", code: "BAD_REQUEST" })
        }
        const newData = await ctx.db.tools.create({
          data: input,
        });

        if (newData) {
          return {
            message: "Tool created successfully",
            data: newData,
            status: "success",
          };
        }
      } catch (error) {
        handleRouterError(error, ["slug"]);
      }
    }),
  getByCategorySlug: publicProcedure
    .input(z.object({ name: z.string(), categorySlug: z.string() }))
    .query(async ({ ctx, input: { name, categorySlug } }) => {

      try {
        const category = await ctx.db.categories.findUnique({
          where: {
            slug: categorySlug,
          },
        });
        if (category) {
          return ctx.db.tools.findMany({
            where: {
              name: {
                contains: name,
              },
              category: category.id,
            },
            orderBy: {
              created_at: "desc",
            },
          });
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid Slug",
          });
        }
      }
      catch (err) {
        handleRouterError(err)
      }
    }),
  getByCategory: publicProcedure
    .input(z.object({ name: z.string(), category: z.string() }))
    .query(async ({ ctx, input: { name, category } }) => {
      try {
        return ctx.db.tools.findMany({
          where: {
            name: {
              contains: name,
              mode: "insensitive"
            },
            category: category,
          },
          orderBy: {
            created_at: "desc",
          },

        })
      } catch (err) {
        handleRouterError(err)
      }
    }
    ),
  getBySlugs: publicProcedure
    .input(z.object({ toolSlug: z.string(), categorySlug: z.string() }))
    .query(async ({ ctx, input: { toolSlug, categorySlug } }) => {
      try {
        const category = await ctx.db.categories.findUnique({
          where: {
            slug: categorySlug,
          },
        });
        if (category) {
          return ctx.db.tools.findFirstOrThrow({
            include: {
              Categories: true,
            },
            where: {
              slug: toolSlug,
              category: category.id,
            },

          });
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid Slug",
          });
        }
      }
      catch (err) {
        handleRouterError(err)
      }
    }),
  getAll: publicProcedure.input(z.object({
    name: z.string().optional(),
  })).query(({ ctx, input }) => {
    try {
      return ctx.db.tools.findMany({
        include: {
          Categories: true,
        },
        where: {
          name: {
            contains: input.name,
            mode: "insensitive"
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      })
    }
    catch (err) {
      handleRouterError(err)
    }
  }
  ),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        const deleted = await ctx.db.tools.delete({
          where: {
            id,
          },
        });

        if (deleted) {
          return {
            message: "Tool deleted successfully",
            status: "success",
          };
        }
      } catch (error) {
        handleRouterError(error);
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        logo_url: z.string().optional(),
        website: z.string().optional(),
        slug: z.string().optional(),
        id: z.string(),
        metadataDescription: z.string().optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const oldData = await ctx.db.tools.findUnique({
          where: {
            id: input.id
          }
        })
        if (!oldData) {
          throw new TRPCError({ message: "please enter a valid id", code: "BAD_REQUEST" })

        }
        const checkUnique = await ctx.db.tools.findFirst({
          where: {
            category: oldData.category, slug: input.slug, id: {
              not: input.id
            }
          },
        })
        if (checkUnique) {
          throw new TRPCError({ message: "please enter a unique slug", code: "BAD_REQUEST" })
        }
        const newData = await ctx.db.tools.update({
          data: input,
          where: {
            id: input.id,
          },
        });

        if (newData) {
          return {
            message: "Tools created successfully",
            data: newData,
            status: "success",
          };
        }
      } catch (error) {
        handleRouterError(error, ["slug"]);
      }
    }),
});
