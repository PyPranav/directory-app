import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleRouterError = (error: unknown, required?: string[]) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle unique constraint violations
    if (error.code === "P2002") {
      const target = error.meta?.target as string[];
      required?.forEach(element => {
        if (target?.includes(element)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `A category with this ${element} already exists`,
          });
        }
      });
      
      throw new TRPCError({
        code: "CONFLICT",
        message: "A category with these details already exists",
      });
    }
  }

  if (error instanceof TRPCError) {
    throw error;
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
