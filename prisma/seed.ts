import { PrismaClient } from '@prisma/client';
import { seedData, categoriesData } from './seedData';
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create 3 categories with nice logos

    // Upsert categories
    for (const cat of categoriesData) {
        await prisma.categories.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log('✅ Categories seeded/ensured.');

    // Get the created categories
    const allCategories = await prisma.categories.findMany();
    if (!allCategories.length) {
        throw new Error('No categories found. Seeding aborted.');
    }


    const toolDetails = seedData

    // Prepare 10 tools, assigning them to categories
    const toolsData = Array.from({ length: 10 }).map((_, i) => ({
        name: toolDetails[i]?.['name'] ?? `Tool - ${i + 1}`,
        slug: toolDetails[i]?.['name'].toLowerCase() ?? `Tool - ${i + 1}`,
        description: toolDetails[i]?.['description'] ?? "",
        logo_url: toolDetails[i]?.['logo'] ?? "https://logo.clearbit.com/google.com",
        category: allCategories[i % allCategories.length]!.id,
        website: `https://www.${toolDetails[i]?.['name'].toLowerCase()}.com`
    }));

    // Create tools (skip duplicates)
    const result = await prisma.tools.createMany({
        data: toolsData,
        skipDuplicates: true,
    });
    console.log(`✅ Tools seeded: ${result.count}`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🌱 Seed script finished.');
    }); 