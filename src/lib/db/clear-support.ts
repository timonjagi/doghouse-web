import { db } from "./index";
import { support_categories, support_faqs } from "./schema";

async function clearSupportTables() {
  try {
    console.log("Clearing support tables...");

    // Delete FAQs first (due to foreign key constraint)
    await db.delete(support_faqs);
    console.log("Cleared support_faqs table");

    // Then delete categories
    await db.delete(support_categories);
    console.log("Cleared support_categories table");

    console.log("Support tables cleared successfully!");
  } catch (error) {
    console.error("Error clearing support tables:", error);
    throw error;
  }
}

// Run the clear function
clearSupportTables();
