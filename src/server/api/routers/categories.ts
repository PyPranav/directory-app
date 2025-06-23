import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { success } from "zod/v4";
import { handleRouterError } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(4), slug: z.string().min(4) }))
    .mutation(async ({ ctx, input, signal }) => {
      try {
        const newData = await ctx.db.categories.create({
          data: input,
        });

        if (newData) {
          return {
            message: "Category created successfully",
            data: newData,
            status: "success",
          };
        }
      } catch (error) {
        handleRouterError(error, ["slug"]);
      }
    }),
  getAll: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ ctx, input: { name } }) =>
      ctx.db.categories.findMany({
        where: {
          name: {
            contains: name,
          },
        },
        orderBy: {
          created_at: "desc",
        },
      }),
    ),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input: { id } }) =>
      ctx.db.categories.findUnique({
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
        const deleted = await ctx.db.categories.delete({
          where: {
            id,
          },
        });

        if (deleted) {
          return {
            message: "Category deleted successfully",
            status: "success",
          };
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input, signal }) => {
      try {
        const newData = await ctx.db.categories.update({
          data: input,
          where: {
            id: input.id,
          },
        });

        if (newData) {
          return {
            message: "Category created successfully",
            data: newData,
            status: "success",
          };
        }
      } catch (error) {
        handleRouterError(error, ["slug"]);
      }
    }),
});
