import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { success } from "zod/v4";
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
      }),
    )
    .mutation(async ({ ctx, input, signal }) => {
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
       handleRouterError(error, ['slug'])
      }
    }),
  getByCategory: publicProcedure
    .input(z.object({ name: z.string(), category: z.string() }))
    .query(({ ctx, input: { name, category } }) =>
      ctx.db.tools.findMany({
        where: {
          name: {
            contains: name,
          },
          category,
        },
        orderBy:{
            created_at:'desc'
        }
      }),
    ),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input: { id } }) =>
      ctx.db.tools.findUnique({
        where: {
          id,
        },
      }),
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
        handleRouterError(error)
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
      }),
    )
    .mutation(async ({ ctx, input, signal }) => {
      try {
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
        handleRouterError(error, ['slug'])
      }
    }),
});
