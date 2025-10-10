const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
};

const DR_CANINE = "Dr. Canine";
const PAW_FESSOR_BARK = "Paw-fessor Bark";
const VET_WOOF = "Vet. Woof";
const ANGELINA_GATES = "Angelina Gates";
const BUSOLA_BANKS = "Busola Banks";
const SAMY_TOM = "Samy Tom";

export const posts = [
  {
    id: "1",
    slug: generateSlug("The Ultimate Guide to Puppy Training"),
    title: "The Ultimate Guide to Puppy Training",
    excerpt:
      "Discover essential tips and tricks for training your new puppy, from basic commands to housebreaking. This comprehensive guide covers everything from potty training to basic obedience, ensuring a well-behaved and happy companion.",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1694&q=80",
    content: `
      <p>Bringing a new puppy home is an exciting time, but it also comes with responsibilities, especially when it comes to training. Early training is crucial for developing a well-behaved and happy dog.</p>
      <h2>Potty Training Essentials</h2>
      <p>One of the first things to tackle is potty training. Consistency is key. Take your puppy out frequently, especially after waking up, eating, and playing. Reward them immediately when they go to the bathroom outside. Crate training can also be a valuable tool, as dogs are naturally clean animals and will try to avoid soiling their sleeping area.</p>
      <h2>Basic Obedience Commands</h2>
      <p>Start with basic commands like "sit," "stay," "come," and "down." Use positive reinforcement methods, such as treats and praise, to encourage desired behaviors. Keep training sessions short, fun, and engaging to maintain your puppy's attention.</p>
      <h2>Socialization is Key</h2>
      <p>Exposing your puppy to various sights, sounds, people, and other dogs during their critical socialization period (up to 16 weeks) is vital. This helps them grow into confident and well-adjusted adults. Enroll in puppy classes to provide structured socialization opportunities.</p>
      <h2>Dealing with Nipping and Biting</h2>
      <p>Puppies explore the world with their mouths, and nipping is a common behavior. Teach bite inhibition by yelping loudly when your puppy nips too hard, then withdrawing attention. Redirect their biting to appropriate chew toys.</p>
      <p>Remember, patience and consistency are your best friends in puppy training. Celebrate small victories and enjoy the journey of raising your furry companion!</p>
    `,
    tags: [
      {
        label: "Training",
        color: "blue",
      },
      {
        label: "Puppies",
        color: "green",
      },
    ],
    publishedAt: "August 20, 2025",
    author: {
      name: DR_CANINE,
      avatarUrl: "https://tinyurl.com/2p8fy9ym",
    },
  },
  {
    id: "2",
    slug: generateSlug("Top 10 Dog Breeds for Families"),
    title: "Top 10 Dog Breeds for Families",
    excerpt:
      "Find out which dog breeds are best suited for families with children, considering temperament and energy levels. This guide helps you choose a loyal and loving companion that will thrive in a family environment.",
    image: "/images/hannah-lim-708852-unsplash.jpg",
    content: `
      <p>Choosing the right dog breed for your family is a significant decision. A family dog should be patient, gentle, and able to handle the energy of children. Here are some top breeds known for their family-friendly traits:</p>
      <h2>1. Labrador Retriever</h2>
      <p>Known for their friendly nature and patience, Labradors are excellent with children. They are energetic and love to play, making them perfect companions for active families.</p>
      <h2>2. Golden Retriever</h2>
      <p>Golden Retrievers are intelligent, devoted, and incredibly gentle. Their calm demeanor and eagerness to please make them ideal family pets.</p>
      <h2>3. Beagle</h2>
      <p>Beagles are cheerful, curious, and love to be part of family activities. Their sturdy build makes them great playmates for kids, but they do require plenty of exercise.</p>
      <h2>4. Poodle</h2>
      <p>Poodles, especially Standard Poodles, are highly intelligent and easily trainable. They are also known for being gentle and protective of their families, and their hypoallergenic coats are a bonus.</p>
      <h2>5. Irish Setter</h2>
      <p>Irish Setters are outgoing, playful, and good-natured. They thrive on human companionship and are very patient with children, though they need ample space to run and play.</p>
      <h2>6. Collie</h2>
      <p>Collies are famous for their loyalty and protective instincts. They are gentle and predictable, making them wonderful guardians and playmates for children.</p>
      <h2>7. Newfoundland</h2>
      <p>Often called "nature's babysitters," Newfoundlands are incredibly gentle, patient, and protective. Their calm temperament makes them excellent with children, despite their large size.</p>
      <h2>8. Bulldog</h2>
      <p>Bulldogs are known for their calm and docile nature. They are sturdy and tolerant, making them great companions for children who might be a bit rough during play.</p>
      <h2>9. Basset Hound</h2>
      <p>Basset Hounds are laid-back and friendly, with a gentle disposition. They are good with children and other pets, making them a relaxed addition to any family.</p>
      <h2>10. Vizsla</h2>
      <p>Vizslas are affectionate, energetic, and highly intelligent. They form strong bonds with their families and are great with active children, always ready for an adventure.</p>
      <p>When choosing a family dog, always consider the individual dog's temperament and ensure proper training and socialization for a harmonious household.</p>
    `,
    tags: [
      {
        label: "Breeds",
        color: "blue",
      },
      {
        label: "Family",
        color: "red",
      },
    ],
    publishedAt: "July 15, 2025",
    author: {
      name: PAW_FESSOR_BARK,
      avatarUrl: "https://tinyurl.com/2p8h98w8",
    },
  },
  {
    id: "3",
    slug: generateSlug("Healthy Dog Diet: What to Feed Your Furry Friend"),
    title: "Healthy Dog Diet: What to Feed Your Furry Friend",
    excerpt:
      "Learn about the best nutritional practices and food choices to keep your dog healthy and happy. A balanced diet is crucial for their overall well-being, energy levels, and longevity.",
    image: "/images/marko-blazevic-447504-unsplash.jpg",
    content: `
      <p>A healthy diet is the cornerstone of a long and happy life for your dog. Just like humans, dogs require a balanced intake of nutrients to thrive. Understanding what to feed your furry friend can be overwhelming with so many options available.</p>
      <h2>Understanding Your Dog's Nutritional Needs</h2>
      <p>Dogs are omnivores, meaning their diet should include a mix of proteins, fats, carbohydrates, vitamins, and minerals. The exact proportions can vary based on age, breed, activity level, and health conditions.</p>
      <h3>Proteins</h3>
      <p>High-quality protein sources like chicken, beef, lamb, and fish are essential for muscle development and repair. Look for dog foods where a named meat source is the first ingredient.</p>
      <h3>Fats</h3>
      <p>Healthy fats, such as those found in fish oil and flaxseed, provide energy and support skin and coat health. Omega-3 and Omega-6 fatty acids are particularly important.</p>
      <h3>Carbohydrates</h3>
      <p>Complex carbohydrates from sources like sweet potatoes, brown rice, and oats provide sustained energy. Avoid excessive fillers and artificial ingredients.</p>
      <h3>Vitamins and Minerals</h3>
      <p>A balanced diet should naturally provide all necessary vitamins and minerals. If you're feeding a commercial dog food, ensure it's "complete and balanced" according to AAFCO standards.</p>
      <h2>Types of Dog Food</h2>
      <ul>
        <li><strong>Dry Kibble:</strong> Convenient and cost-effective, but choose high-quality brands with real meat as the primary ingredient.</li>
        <li><strong>Wet Food:</strong> Can be more palatable and hydrating, often used as a topper or for dogs with dental issues.</li>
        <li><strong>Raw Food (BARF Diet):</strong> Advocates believe it's more natural, but requires careful preparation to ensure nutritional completeness and safety. Consult a vet before starting a raw diet.</li>
        <li><strong>Home-cooked Meals:</strong> Can be a great option if prepared correctly with veterinary guidance to ensure all nutritional needs are met.</li>
      </ul>
      <h2>Foods to Avoid</h2>
      <p>Never feed your dog chocolate, grapes, raisins, onions, garlic, xylitol (a sweetener), and avocado, as these can be toxic. Always research human foods before sharing them with your dog.</p>
      <p>Consult your veterinarian to determine the best diet plan for your dog's specific needs and health status.</p>
    `,
    tags: [
      {
        label: "Health",
        color: "blue",
      },
      {
        label: "Nutrition",
        color: "orange",
      },
    ],
    publishedAt: "June 10, 2025",
    author: {
      name: VET_WOOF,
      avatarUrl: "https://tinyurl.com/2p98t7nh",
    },
  },
  {
    id: "4",
    slug: generateSlug("Fun Activities to Do With Your Dog"),
    title: "Fun Activities to Do With Your Dog",
    excerpt:
      "Explore exciting ways to bond with your dog, from outdoor adventures to engaging indoor games. Keeping your dog active and mentally stimulated is vital for their happiness and well-being.",
    image: "/images/ipet-photo-1316903-unsplash.jpg",
    content: `
      <p>Dogs thrive on interaction and activity. Engaging in fun activities with your dog not only strengthens your bond but also provides essential physical and mental stimulation. Here are some ideas to keep your furry friend entertained:</p>
      <h2>Outdoor Adventures</h2>
      <ul>
        <li><strong>Hiking:</strong> Explore nature trails together. Ensure the trails are dog-friendly and bring plenty of water for both of you.</li>
        <li><strong>Swimming:</strong> Many dogs love to swim. Find a safe lake, river, or dog-friendly pool for a refreshing activity.</li>
        <li><strong>Fetch and Frisbee:</strong> Classic games that provide great exercise and tap into your dog's natural instincts.</li>
        <li><strong>Dog Parks:</strong> A fantastic way for your dog to socialize and burn off energy with other canines.</li>
        <li><strong>Agility Training:</b> Enroll in an agility class or set up a mini course in your backyard. It's a great mental and physical workout.</li>
      </ul>
      <h2>Indoor Fun</h2>
      <ul>
        <li><strong>Puzzle Toys:</strong> These toys challenge your dog to figure out how to get treats, providing mental stimulation.</li>
        <li><strong>Hide-and-Seek:</strong> A simple game that can be played indoors. Hide treats or yourself and have your dog find them.</li>
        <li><strong>Tug-of-War:</strong> A great way to engage in interactive play, but ensure your dog understands the "drop it" command.</li>
        <li><strong>Obedience Training:</strong> Continue practicing commands and teaching new tricks indoors. It keeps their minds sharp.</li>
        <li><strong>Scent Games:</strong> Hide treats around the house and encourage your dog to use their nose to find them.</li>
      </ul>
      <p>Remember to tailor activities to your dog's breed, age, and energy level. Always prioritize their safety and well-being during any activity.</p>
    `,
    tags: [
      {
        label: "Activities",
        color: "yellow",
      },
      {
        label: "Bonding",
        color: "purple",
      },
    ],
    publishedAt: "May 25, 2025",
    author: {
      name: DR_CANINE,
      avatarUrl: "https://tinyurl.com/2p8fy9ym",
    },
  },
  {
    id: "5",
    slug: generateSlug("Understanding Dog Behavior: A Guide for Owners"),
    title: "Understanding Dog Behavior: A Guide for Owners",
    excerpt:
      "Decode your dog's body language and common behaviors to build a stronger relationship. Learning to interpret their signals can prevent misunderstandings and foster a harmonious home.",
    image:
      "https://images.unsplash.com/photo-1561037406-61edfb95f107?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1694&q=80",
    content: `
      <p>Understanding your dog's behavior is crucial for effective communication and building a strong, trusting relationship. Dogs communicate primarily through body language, and learning to interpret their signals can help you respond appropriately to their needs and emotions.</p>
      <h2>Common Dog Behaviors and Their Meanings</h2>
      <h3>Tail Wags</h3>
      <ul>
        <li><strong>High, fast wag:</strong> Excitement, happiness.</li>
        <li><strong>Low, slow wag:</b> Uncertainty, submission.</li>
        <li><strong>Tail tucked:</b> Fear, anxiety.</li>
      </ul>
      <h3>Ear Positions</h3>
      <ul>
        <li><strong>Ears forward:</b> Alert, interested.</li>
        <li><strong>Ears flattened back:</b> Fear, aggression, or submission.</li>
        <li><strong>Ears relaxed:</b> Content, calm.</li>
      </ul>
      <h3>Body Posture</h3>
      <ul>
        <li><strong>Play bow (front end down, rear end up):</b> Inviting play.</li>
        <li><strong>Stiff, rigid body:</b> Alert, potentially aggressive or fearful.</li>
        <li><strong>Rolling over, exposing belly:</b> Submission, trust, or asking for a belly rub.</li>
      </ul>
      <h3>Vocalizations</h3>
      <ul>
        <li><strong>Barks:</b> Can mean anything from excitement to alarm. Context is key.</li>
        <li><strong>Whines:</b> Seeking attention, discomfort, or excitement.</li>
        <li><strong>Growls:</b> A warning sign. Respect a growl and investigate the cause.</li>
      </ul>
      <h2>Addressing Problem Behaviors</h2>
      <p>If your dog exhibits undesirable behaviors like excessive barking, chewing, or aggression, it's important to understand the root cause. These behaviors are often a symptom of underlying issues such as anxiety, boredom, lack of exercise, or fear.</p>
      <p>Consult with a professional dog trainer or veterinary behaviorist for guidance on addressing specific behavioral challenges. Positive reinforcement and consistent training are key to modifying behavior.</p>
      <p>By paying attention to your dog's cues and understanding their natural instincts, you can foster a deeper connection and ensure a happy, well-adjusted companion.</p>
    `,
    tags: [
      {
        label: "Behavior",
        color: "green",
      },
      {
        label: "Understanding",
        color: "blue",
      },
    ],
    publishedAt: "April 18, 2025",
    author: {
      name: PAW_FESSOR_BARK,
      avatarUrl: "https://tinyurl.com/2p8h98w8",
    },
  },
  {
    id: "6",
    slug: generateSlug("Grooming Essentials for a Happy Dog"),
    title: "Grooming Essentials for a Happy Dog",
    excerpt:
      "Learn about the essential grooming practices to keep your dog's coat healthy and clean. Regular grooming not only keeps them looking good but also contributes to their overall health and comfort.",
    image:
      "https://images.unsplash.com/photo-1596492784531-fd017a67a702?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1694&q=80",
    content: `
      <p>Grooming is an essential part of dog care that goes beyond just aesthetics. Regular grooming helps maintain your dog's hygiene, prevents health issues, and strengthens the bond between you and your pet.</p>
      <h2>Brushing</h2>
      <p>Brushing your dog's coat regularly helps remove loose hair, dirt, and prevents mats and tangles. The type of brush you use will depend on your dog's coat type. Short-haired dogs may only need weekly brushing, while long-haired breeds might require daily attention.</p>
      <h2>Bathing</h2>
      <p>How often your dog needs a bath depends on their activity level, coat type, and any skin conditions. Use a dog-specific shampoo to avoid irritating their skin. Over-bathing can strip natural oils, leading to dry skin.</p>
      <h2>Nail Trimming</h2>
      <p>Long nails can be uncomfortable and even painful for dogs, affecting their gait and potentially leading to paw problems. Trim your dog's nails regularly, being careful not to cut into the quick. If you're unsure, ask a vet or professional groomer for a demonstration.</p>
      <h2>Ear Cleaning</h2>
      <p>Check your dog's ears regularly for dirt, wax buildup, or signs of infection. Clean them with a vet-approved ear cleaner and cotton balls. Avoid using cotton swabs, which can push debris further into the ear canal.</p>
      <h2>Dental Care</h2>
      <p>Dental hygiene is just as important for dogs as it is for humans. Brush your dog's teeth daily with dog-specific toothpaste and a toothbrush. Dental chews and professional dental cleanings can also help prevent plaque and tartar buildup.</p>
      <h2>Eye Care</h2>
      <p>Wipe away any discharge from your dog's eyes with a damp cloth. For breeds prone to tear stains, special products can help keep the area clean.</p>
      <p>Make grooming a positive experience with treats and praise. If your dog is resistant, introduce grooming gradually and keep sessions short.</p>
    `,
    tags: [
      {
        label: "Grooming",
        color: "pink",
      },
      {
        label: "Care",
        color: "purple",
      },
    ],
    publishedAt: "March 01, 2025",
    author: {
      name: ANGELINA_GATES,
      avatarUrl: "https://tinyurl.com/2p98t7nh",
    },
  },
  {
    id: "7",
    slug: generateSlug("Adopting a Rescue Dog: What You Need to Know"),
    title: "Adopting a Rescue Dog: What You Need to Know",
    excerpt:
      "Considerations and tips for bringing a rescue dog into your home and helping them adjust. Providing a loving home to a dog in need is a rewarding experience.",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1694&q=80",
    content: `
      <p>Adopting a rescue dog is a wonderful way to give a deserving animal a second chance at a happy life. While it's incredibly rewarding, it also comes with unique considerations. Here's what you need to know to help your new companion adjust.</p>
      <h2>Patience is Paramount</h2>
      <p>Rescue dogs often come from unknown backgrounds and may have experienced trauma or neglect. Give your new dog time to decompress and adjust to their new environment. The "3-3-3 rule" is a good guideline: 3 days to decompress, 3 weeks to learn your routine, and 3 months to feel at home.</p>
      <h2>Prepare Your Home</h2>
      <p>Before your rescue dog arrives, dog-proof your home. Remove any potential hazards, set up a comfortable bed or crate, and have food, water bowls, and toys ready. Create a safe, quiet space where they can retreat if they feel overwhelmed.</p>
      <h2>Establish a Routine</h2>
      <p>Dogs thrive on routine. Establish a consistent schedule for feeding, walks, potty breaks, and playtime. This predictability helps reduce anxiety and builds confidence in their new surroundings.</p>
      <h2>Training and Socialization</h2>
      <p>Many rescue dogs may not have had formal training or extensive socialization. Be patient and use positive reinforcement methods. Consider enrolling in obedience classes to strengthen your bond and address any behavioral issues. Gradual and positive introductions to new people, places, and other animals are important.</p>
      <h2>Health Check-up</h2>
      <p>Schedule a veterinary check-up soon after adoption. Your vet can assess your dog's overall health, update vaccinations, and discuss any potential health concerns based on their history.</p>
      <h2>Understanding Their Past (If Known)</h2>
      <p>If the rescue organization provides information about your dog's past, use it to understand potential triggers or sensitivities. However, don't dwell on it; focus on building a positive future together.</p>
      <p>Adopting a rescue dog is a journey of love, patience, and understanding. The bond you form will be incredibly strong and fulfilling.</p>
    `,
    tags: [
      {
        label: "Adoption",
        color: "red",
      },
      {
        label: "Rescue",
        color: "blue",
      },
    ],
    publishedAt: "February 14, 2025",
    author: {
      name: BUSOLA_BANKS,
      avatarUrl: "https://tinyurl.com/2p8fy9ym",
    },
  },
  {
    id: "8",
    slug: generateSlug("Traveling with Your Dog: Tips for a Smooth Journey"),
    title: "Traveling with Your Dog: Tips for a Smooth Journey",
    excerpt:
      "Make your travels with your canine companion stress-free with these essential tips and preparations. Whether it's a road trip or a flight, planning ahead ensures a safe and enjoyable experience for both of you.",
    image:
      "https://images.unsplash.com/photo-1560807624-8c7871079c25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1694&q=80",
    content: `
      <p>Traveling with your dog can be a fantastic experience, creating lasting memories. However, it requires careful planning and preparation to ensure a smooth and stress-free journey for both you and your canine companion.</p>
      <h2>Before You Go</h2>
      <ul>
        <li><strong>Vet Visit:</strong> Ensure your dog is up-to-date on vaccinations and has a clean bill of health. Discuss any necessary medications for anxiety or motion sickness.</li>
        <li><strong>Identification:</strong> Make sure your dog has up-to-date ID tags on their collar and is microchipped. Carry a recent photo of your dog.</li>
        <li><strong>Research Pet-Friendly Accommodations:</strong> Book hotels, rentals, or campsites that explicitly welcome pets.</li>
        <li><strong>Pack a Pet Travel Kit:</strong> Include food, water, bowls, leash, collar, waste bags, favorite toys, bedding, medications, and a first-aid kit.</li>
        <li><strong>Crate Training:</strong> If traveling by car or plane, ensure your dog is comfortable and secure in their crate.</li>
      </ul>
      <h2>Road Trips</h2>
      <ul>
        <li><strong>Safety First:</strong> Secure your dog in a well-ventilated crate or with a safety harness and seatbelt. Never let them ride with their head out the window.</li>
        <li><strong>Frequent Stops:</strong> Plan for regular potty breaks, exercise, and water.</li>
        <li><strong>Avoid Feeding Before Travel:</strong> To prevent car sickness, feed your dog a few hours before departure.</li>
      </ul>
      <h2>Air Travel</h2>
      <ul>
        <li><strong>Airline Regulations:</strong> Each airline has specific rules for pet travel (in-cabin vs. cargo). Research these thoroughly and book well in advance.</li>
        <li><strong>Proper Carrier:</strong> Ensure the carrier meets airline specifications and is comfortable for your dog to stand, turn around, and lie down in.</li>
        <li><strong>Consult Your Vet:</strong> Discuss sedation options with your vet, but be aware that many vets advise against it due to potential respiratory and cardiovascular problems.</li>
      </ul>
      <h2>During Your Trip</h2>
      <ul>
        <li><strong>Maintain Routine:</strong> Stick to your dog's feeding and walking schedule as much as possible.</li>
        <li><strong>Stay Hydrated:</strong> Offer water frequently, especially in warm weather.</li>
        <li><strong>Be Mindful of New Environments:</strong> Keep your dog on a leash in unfamiliar areas and be aware of local pet regulations.</li>
      </ul>
      <p>With proper planning, traveling with your dog can be an enriching experience for everyone involved.</p>
    `,
    tags: [
      {
        label: "Travel",
        color: "yellow",
      },
      {
        label: "Adventure",
        color: "green",
      },
    ],
    publishedAt: "January 05, 2025",
    author: {
      name: SAMY_TOM,
      avatarUrl: "https://tinyurl.com/2p8h98w8",
    },
  },
];
