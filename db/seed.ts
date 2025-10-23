import { db } from './index';
import { breeds } from './schema';
import fs from 'fs';
import path from 'path';

interface BreedTrait {
  name: string;
  score: number;
  traits?: BreedTrait[];
}

interface BreedData {
  name: string;
  description: string;
  height?: string;
  lifeSpan?: string;
  weight?: string;
  image: string;
  breedGroup: string;
  traits?: BreedTrait[];
}

async function seedBreeds() {
  try {
    console.log('Starting breed seeding...');

    // Read the JSON file
    const filePath = path.join(process.cwd(), 'src/lib/data/breeds_with_group_and_traits.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const breedsData: BreedData[] = JSON.parse(rawData);

    console.log(`Found ${breedsData.length} breeds to seed`);

    // Transform and insert data
    for (const breedData of breedsData) {
      // Transform traits data to a more suitable format for storage
      const transformedTraits = breedData.traits?.map(traitGroup => ({
        category: traitGroup.name,
        score: traitGroup.score,
        subTraits: traitGroup.traits?.map(subTrait => ({
          name: subTrait.name,
          score: subTrait.score
        })) || []
      })) || [];

      await db.insert(breeds).values({
        name: breedData.name,
        group: breedData.breedGroup,
        description: breedData.description,
        traits: transformedTraits,
        featured_image_url: breedData.image,
        height: breedData.height,
        weight: breedData.weight,
        life_span: breedData.lifeSpan,
      });

      console.log(`Inserted breed: ${breedData.name}`);
    }

    console.log('Breed seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding breeds:', error);
    throw error;
  }
}

// Run the seed function
seedBreeds();
