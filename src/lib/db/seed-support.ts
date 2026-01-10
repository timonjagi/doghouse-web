import { db } from "./index";
import { support_categories, support_faqs } from "./schema";
import fs from "fs";
import path from "path";

interface SupportCategoryData {
  name: string;
  description: string;
  icon: string;
  sort_order: number;
}

interface SupportFAQData {
  question: string;
  answer: string;
  category_name: string;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes?: number;
  is_featured: boolean;
}

async function seedSupportCategories() {
  try {
    console.log("Starting support categories seeding...");

    const filePath = path.join(
      process.cwd(),
      "src/lib/data/support_categories.json"
    );
    const rawData = fs.readFileSync(filePath, "utf-8");
    const categoriesData: SupportCategoryData[] = JSON.parse(rawData);

    console.log(`Found ${categoriesData.length} categories to seed`);

    for (const categoryData of categoriesData) {
      await db.insert(support_categories).values({
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon,
        sort_order: categoryData.sort_order,
      });

      console.log(`Inserted category: ${categoryData.name}`);
    }

    console.log("Support categories seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding support categories:", error);
    throw error;
  }
}

async function seedSupportFAQs() {
  try {
    console.log("Starting support FAQs seeding...");

    const faqsFilePath = path.join(
      process.cwd(),
      "src/lib/data/support_faqs.json"
    );
    const faqsRawData = fs.readFileSync(faqsFilePath, "utf-8");
    const faqsData: SupportFAQData[] = JSON.parse(faqsRawData);

    console.log(`Found ${faqsData.length} FAQs to seed`);

    // Get existing categories to map names to IDs
    const existingCategories = await db.select().from(support_categories);
    const categoryMap = new Map<string, string>();
    existingCategories.forEach((category) => {
      categoryMap.set(category.name, category.id);
    });

    for (const faqData of faqsData) {
      const categoryId = categoryMap.get(faqData.category_name);

      if (!categoryId) {
        console.warn(
          `Category not found for FAQ: ${faqData.question}. Skipping...`
        );
        continue;
      }

      await db.insert(support_faqs).values({
        category_id: categoryId,
        question: faqData.question,
        answer: faqData.answer,
        view_count: faqData.view_count,
        helpful_votes: faqData.helpful_votes,
        not_helpful_votes: faqData.not_helpful_votes || 0,
        is_featured: faqData.is_featured,
        // created_by will be null for now (system-generated FAQs)
      });

      console.log(`Inserted FAQ: ${faqData.question.substring(0, 50)}...`);
    }

    console.log("Support FAQs seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding support FAQs:", error);
    throw error;
  }
}

// Run support seeding functions
async function main() {
  try {
    await seedSupportCategories();
    await seedSupportFAQs();
    console.log("Support data seeding completed successfully!");
  } catch (error) {
    console.error("Error during support seeding:", error);
    process.exit(1);
  }
}

main();
