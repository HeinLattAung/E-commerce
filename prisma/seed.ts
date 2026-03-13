import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean existing data
  await db.review.deleteMany()
  await db.order.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany()

  console.log("  Cleared existing data")

  // ─── Users ─────────────────────────────────────────────

  const admin = await db.user.create({
    data: {
      name: "Admin",
      email: "admin@luxestore.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      image: "https://api.dicebear.com/9.x/initials/svg?seed=Admin",
    },
  })

  const customer = await db.user.create({
    data: {
      name: "Jane Cooper",
      email: "jane@example.com",
      password: await bcrypt.hash("customer123", 10),
      role: "USER",
      image: "https://api.dicebear.com/9.x/initials/svg?seed=JC",
      addresses: [
        {
          fullName: "Jane Cooper",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "US",
          phone: "+1 555-0100",
        },
      ],
    },
  })

  console.log("  Created users")

  // ─── Categories ────────────────────────────────────────

  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "Outerwear",
        slug: "outerwear",
        description: "Premium jackets, coats, and layering pieces for every season",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      },
    }),
    db.category.create({
      data: {
        name: "Leather Goods",
        slug: "leather-goods",
        description: "Handcrafted bags, wallets, and accessories in full-grain leather",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      },
    }),
    db.category.create({
      data: {
        name: "Footwear",
        slug: "footwear",
        description: "Artisan shoes and boots built for comfort and longevity",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
      },
    }),
    db.category.create({
      data: {
        name: "Timepieces",
        slug: "timepieces",
        description: "Precision watches that blend heritage craftsmanship with modern design",
        image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
      },
    }),
    db.category.create({
      data: {
        name: "Knitwear",
        slug: "knitwear",
        description: "Luxurious cashmere and merino wool essentials",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      },
    }),
  ])

  const [outerwear, leather, footwear, timepieces, knitwear] = categories

  console.log("  Created categories")

  // ─── Products ──────────────────────────────────────────

  const products = await Promise.all([
    // ═══ OUTERWEAR (5 products) ═══

    db.product.create({
      data: {
        name: "Italian Cashmere Overcoat",
        slug: "italian-cashmere-overcoat",
        description: "A timeless double-breasted overcoat cut from premium Italian cashmere. Features a half-canvas construction, horn buttons, and a silk-blend lining.",
        basePrice: 1295.0,
        featured: true,
        tags: ["cashmere", "overcoat", "italian", "winter"],
        categoryId: outerwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", alt: "Italian Cashmere Overcoat - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=800&q=80", alt: "Italian Cashmere Overcoat - detail", position: 1 },
        ],
        variants: [
          { sku: "ICO-BLK-S", size: "S", color: "Black", price: 1295.0, comparePrice: 1595.0, stock: 8, reservedStock: 0 },
          { sku: "ICO-BLK-M", size: "M", color: "Black", price: 1295.0, comparePrice: 1595.0, stock: 12, reservedStock: 0 },
          { sku: "ICO-BLK-L", size: "L", color: "Black", price: 1295.0, comparePrice: 1595.0, stock: 10, reservedStock: 0 },
          { sku: "ICO-CAM-M", size: "M", color: "Camel", price: 1295.0, comparePrice: 1595.0, stock: 10, reservedStock: 0 },
          { sku: "ICO-CAM-L", size: "L", color: "Camel", price: 1295.0, comparePrice: 1595.0, stock: 8, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Quilted Suede Bomber",
        slug: "quilted-suede-bomber",
        description: "A modern take on the classic MA-1 silhouette, crafted from butter-soft suede with diamond quilting and a Thinsulate lining for lightweight warmth.",
        basePrice: 875.0,
        featured: true,
        tags: ["bomber", "suede", "jacket", "quilted"],
        categoryId: outerwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", alt: "Quilted Suede Bomber - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80", alt: "Quilted Suede Bomber - styled", position: 1 },
        ],
        variants: [
          { sku: "QSB-TAN-S", size: "S", color: "Desert Tan", price: 875.0, stock: 5, reservedStock: 0 },
          { sku: "QSB-TAN-M", size: "M", color: "Desert Tan", price: 875.0, stock: 8, reservedStock: 0 },
          { sku: "QSB-TAN-L", size: "L", color: "Desert Tan", price: 875.0, stock: 7, reservedStock: 0 },
          { sku: "QSB-OLV-M", size: "M", color: "Olive", price: 875.0, stock: 6, reservedStock: 0 },
          { sku: "QSB-OLV-L", size: "L", color: "Olive", price: 875.0, stock: 4, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Wool Blend Trench Coat",
        slug: "wool-blend-trench-coat",
        description: "A refined trench coat in a luxurious wool-cashmere blend. Features a removable belt, storm flap, and checked cotton lining. The perfect transitional piece.",
        basePrice: 1150.0,
        featured: false,
        tags: ["trench", "wool", "coat", "classic"],
        categoryId: outerwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80", alt: "Wool Blend Trench Coat - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80", alt: "Wool Blend Trench Coat - back", position: 1 },
        ],
        variants: [
          { sku: "WTC-BGE-S", size: "S", color: "Beige", price: 1150.0, stock: 6, reservedStock: 0 },
          { sku: "WTC-BGE-M", size: "M", color: "Beige", price: 1150.0, stock: 9, reservedStock: 0 },
          { sku: "WTC-BGE-L", size: "L", color: "Beige", price: 1150.0, stock: 7, reservedStock: 0 },
          { sku: "WTC-NVY-M", size: "M", color: "Navy", price: 1150.0, stock: 8, reservedStock: 0 },
          { sku: "WTC-NVY-L", size: "L", color: "Navy", price: 1150.0, stock: 5, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Shearling Aviator Jacket",
        slug: "shearling-aviator-jacket",
        description: "An iconic aviator jacket in genuine Spanish merino shearling. The rugged exterior contrasts with the plush interior for a statement winter piece.",
        basePrice: 1850.0,
        featured: true,
        tags: ["shearling", "aviator", "jacket", "winter"],
        categoryId: outerwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80", alt: "Shearling Aviator Jacket - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80", alt: "Shearling Aviator Jacket - detail", position: 1 },
        ],
        variants: [
          { sku: "SAJ-BRN-S", size: "S", color: "Brown", price: 1850.0, stock: 3, reservedStock: 0 },
          { sku: "SAJ-BRN-M", size: "M", color: "Brown", price: 1850.0, stock: 5, reservedStock: 0 },
          { sku: "SAJ-BRN-L", size: "L", color: "Brown", price: 1850.0, stock: 4, reservedStock: 0 },
          { sku: "SAJ-BLK-M", size: "M", color: "Black", price: 1850.0, stock: 4, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Technical Rain Parka",
        slug: "technical-rain-parka",
        description: "Engineered with a 3-layer waterproof membrane and sealed seams. Minimalist aesthetic with hidden pockets, adjustable hood, and a Japanese YKK AquaGuard zipper.",
        basePrice: 695.0,
        featured: false,
        tags: ["parka", "rain", "waterproof", "technical"],
        categoryId: outerwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80", alt: "Technical Rain Parka - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1545594861-3bef43ff2fc8?w=800&q=80", alt: "Technical Rain Parka - side", position: 1 },
        ],
        variants: [
          { sku: "TRP-BLK-S", size: "S", color: "Matte Black", price: 695.0, stock: 10, reservedStock: 0 },
          { sku: "TRP-BLK-M", size: "M", color: "Matte Black", price: 695.0, stock: 14, reservedStock: 0 },
          { sku: "TRP-BLK-L", size: "L", color: "Matte Black", price: 695.0, stock: 11, reservedStock: 0 },
          { sku: "TRP-OLV-M", size: "M", color: "Olive", price: 695.0, stock: 8, reservedStock: 0 },
        ],
      },
    }),

    // ═══ LEATHER GOODS (5 products) ═══

    db.product.create({
      data: {
        name: "Full-Grain Leather Weekender",
        slug: "full-grain-leather-weekender",
        description: "Hand-stitched from vegetable-tanned full-grain leather that develops a rich patina over time. Solid brass hardware and a detachable shoulder strap.",
        basePrice: 685.0,
        featured: true,
        tags: ["leather", "bag", "weekender", "travel"],
        categoryId: leather.id,
        images: [
          { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", alt: "Leather Weekender - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", alt: "Leather Weekender - interior", position: 1 },
        ],
        variants: [
          { sku: "LW-COG-OS", size: "One Size", color: "Cognac", price: 685.0, stock: 15, reservedStock: 0 },
          { sku: "LW-BLK-OS", size: "One Size", color: "Black", price: 685.0, stock: 12, reservedStock: 0 },
          { sku: "LW-TAN-OS", size: "One Size", color: "Tan", price: 685.0, stock: 8, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Shell Cordovan Card Holder",
        slug: "shell-cordovan-card-holder",
        description: "Minimalist four-slot card holder made from Horween Shell Cordovan. The tight grain develops a mirror-like patina with use.",
        basePrice: 165.0,
        featured: false,
        tags: ["wallet", "card-holder", "leather", "minimalist"],
        categoryId: leather.id,
        images: [
          { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80", alt: "Card Holder - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&q=80", alt: "Card Holder - open", position: 1 },
        ],
        variants: [
          { sku: "SCCH-BLK-OS", size: "One Size", color: "Black", price: 165.0, stock: 25, reservedStock: 0 },
          { sku: "SCCH-BRG-OS", size: "One Size", color: "Burgundy", price: 165.0, stock: 20, reservedStock: 0 },
          { sku: "SCCH-COG-OS", size: "One Size", color: "Cognac", price: 165.0, stock: 18, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Italian Leather Briefcase",
        slug: "italian-leather-briefcase",
        description: "Professional briefcase in Tuscan full-grain leather with a padded 15-inch laptop compartment. Polished brass lock and hand-painted edges.",
        basePrice: 895.0,
        featured: true,
        tags: ["briefcase", "leather", "italian", "business"],
        categoryId: leather.id,
        images: [
          { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", alt: "Italian Briefcase - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80", alt: "Italian Briefcase - side", position: 1 },
        ],
        variants: [
          { sku: "ILB-BRN-OS", size: "One Size", color: "Dark Brown", price: 895.0, stock: 8, reservedStock: 0 },
          { sku: "ILB-BLK-OS", size: "One Size", color: "Black", price: 895.0, stock: 10, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Leather Crossbody Satchel",
        slug: "leather-crossbody-satchel",
        description: "A versatile crossbody satchel in pebbled calfskin leather. Adjustable strap, magnetic flap closure, and multiple internal compartments.",
        basePrice: 445.0,
        featured: false,
        tags: ["crossbody", "satchel", "leather", "everyday"],
        categoryId: leather.id,
        images: [
          { url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80", alt: "Crossbody Satchel - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", alt: "Crossbody Satchel - worn", position: 1 },
        ],
        variants: [
          { sku: "LCS-TAN-OS", size: "One Size", color: "Tan", price: 445.0, stock: 12, reservedStock: 0 },
          { sku: "LCS-BLK-OS", size: "One Size", color: "Black", price: 445.0, stock: 15, reservedStock: 0 },
          { sku: "LCS-OLV-OS", size: "One Size", color: "Olive", price: 465.0, stock: 7, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Vegetable-Tanned Belt",
        slug: "vegetable-tanned-belt",
        description: "A timeless dress belt in vegetable-tanned leather from a Florentine tannery. Solid brass buckle with a hand-burnished finish that deepens with age.",
        basePrice: 145.0,
        featured: false,
        tags: ["belt", "leather", "vegetable-tanned", "accessory"],
        categoryId: leather.id,
        images: [
          { url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80", alt: "Leather Belt - coiled", position: 0 },
          { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", alt: "Leather Belt - detail", position: 1 },
        ],
        variants: [
          { sku: "VTB-BRN-32", size: "32", color: "Brown", price: 145.0, stock: 20, reservedStock: 0 },
          { sku: "VTB-BRN-34", size: "34", color: "Brown", price: 145.0, stock: 22, reservedStock: 0 },
          { sku: "VTB-BRN-36", size: "36", color: "Brown", price: 145.0, stock: 18, reservedStock: 0 },
          { sku: "VTB-BLK-32", size: "32", color: "Black", price: 145.0, stock: 16, reservedStock: 0 },
          { sku: "VTB-BLK-34", size: "34", color: "Black", price: 145.0, stock: 20, reservedStock: 0 },
        ],
      },
    }),

    // ═══ FOOTWEAR (5 products) ═══

    db.product.create({
      data: {
        name: "Artisan Chelsea Boots",
        slug: "artisan-chelsea-boots",
        description: "Blake-stitched Chelsea boots in burnished calfskin with a Goodyear-welted commando sole. Made in a family-run workshop in Tuscany.",
        basePrice: 495.0,
        featured: true,
        tags: ["boots", "chelsea", "leather", "handmade"],
        categoryId: footwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80", alt: "Chelsea Boots - pair", position: 0 },
          { url: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&q=80", alt: "Chelsea Boots - side", position: 1 },
        ],
        variants: [
          { sku: "ACB-BRN-40", size: "EU 40", color: "Burnished Brown", price: 495.0, stock: 6, reservedStock: 0 },
          { sku: "ACB-BRN-41", size: "EU 41", color: "Burnished Brown", price: 495.0, stock: 8, reservedStock: 0 },
          { sku: "ACB-BRN-42", size: "EU 42", color: "Burnished Brown", price: 495.0, stock: 10, reservedStock: 0 },
          { sku: "ACB-BRN-43", size: "EU 43", color: "Burnished Brown", price: 495.0, stock: 10, reservedStock: 0 },
          { sku: "ACB-BLK-42", size: "EU 42", color: "Black", price: 495.0, stock: 9, reservedStock: 0 },
          { sku: "ACB-BLK-43", size: "EU 43", color: "Black", price: 495.0, stock: 8, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Court Classic Sneakers",
        slug: "court-classic-sneakers",
        description: "Clean-line court sneakers in tumbled Italian calfskin with a Margom rubber sole. Unlined for lightness with a removable OrthoLite insole.",
        basePrice: 385.0,
        featured: true,
        tags: ["sneakers", "leather", "minimalist", "court"],
        categoryId: footwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", alt: "Court Sneakers - pair", position: 0 },
          { url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80", alt: "Court Sneakers - side", position: 1 },
        ],
        variants: [
          { sku: "CCS-WHT-40", size: "EU 40", color: "White", price: 385.0, stock: 10, reservedStock: 0 },
          { sku: "CCS-WHT-41", size: "EU 41", color: "White", price: 385.0, stock: 12, reservedStock: 0 },
          { sku: "CCS-WHT-42", size: "EU 42", color: "White", price: 385.0, stock: 15, reservedStock: 0 },
          { sku: "CCS-WHT-43", size: "EU 43", color: "White", price: 385.0, stock: 13, reservedStock: 0 },
          { sku: "CCS-BLK-42", size: "EU 42", color: "Black", price: 385.0, stock: 11, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Suede Penny Loafers",
        slug: "suede-penny-loafers",
        description: "Classic penny loafers in brushed Italian suede with Blake-stitched leather soles. Unlined for a soft, glove-like fit that molds to your foot.",
        basePrice: 365.0,
        featured: false,
        tags: ["loafers", "suede", "penny", "italian"],
        categoryId: footwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80", alt: "Penny Loafers - pair", position: 0 },
          { url: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=800&q=80", alt: "Penny Loafers - top", position: 1 },
        ],
        variants: [
          { sku: "SPL-TAN-40", size: "EU 40", color: "Tobacco", price: 365.0, stock: 7, reservedStock: 0 },
          { sku: "SPL-TAN-41", size: "EU 41", color: "Tobacco", price: 365.0, stock: 9, reservedStock: 0 },
          { sku: "SPL-TAN-42", size: "EU 42", color: "Tobacco", price: 365.0, stock: 11, reservedStock: 0 },
          { sku: "SPL-NVY-42", size: "EU 42", color: "Navy", price: 365.0, stock: 6, reservedStock: 0 },
          { sku: "SPL-NVY-43", size: "EU 43", color: "Navy", price: 365.0, stock: 5, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Leather Derby Shoes",
        slug: "leather-derby-shoes",
        description: "Open-lacing derby shoes in hand-polished calfskin. Goodyear welted with a full leather sole and stacked heel. A versatile dress shoe for any occasion.",
        basePrice: 525.0,
        featured: false,
        tags: ["derby", "dress-shoes", "leather", "formal"],
        categoryId: footwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80", alt: "Derby Shoes - pair", position: 0 },
          { url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80", alt: "Derby Shoes - detail", position: 1 },
        ],
        variants: [
          { sku: "LDS-BLK-40", size: "EU 40", color: "Black", price: 525.0, stock: 5, reservedStock: 0 },
          { sku: "LDS-BLK-41", size: "EU 41", color: "Black", price: 525.0, stock: 7, reservedStock: 0 },
          { sku: "LDS-BLK-42", size: "EU 42", color: "Black", price: 525.0, stock: 10, reservedStock: 0 },
          { sku: "LDS-BRN-42", size: "EU 42", color: "Oxblood", price: 525.0, stock: 6, reservedStock: 0 },
          { sku: "LDS-BRN-43", size: "EU 43", color: "Oxblood", price: 525.0, stock: 5, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Hiking Boots Premium",
        slug: "hiking-boots-premium",
        description: "Rugged hiking boots in waterproof nubuck leather with Vibram Megagrip outsoles. Gore-Tex lining keeps feet dry while a cushioned midsole absorbs impact.",
        basePrice: 435.0,
        featured: false,
        tags: ["hiking", "boots", "waterproof", "outdoor"],
        categoryId: footwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", alt: "Hiking Boots - pair", position: 0 },
          { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80", alt: "Hiking Boots - side", position: 1 },
        ],
        variants: [
          { sku: "HBP-BRN-40", size: "EU 40", color: "Earth Brown", price: 435.0, stock: 8, reservedStock: 0 },
          { sku: "HBP-BRN-42", size: "EU 42", color: "Earth Brown", price: 435.0, stock: 12, reservedStock: 0 },
          { sku: "HBP-BRN-43", size: "EU 43", color: "Earth Brown", price: 435.0, stock: 10, reservedStock: 0 },
          { sku: "HBP-GRY-42", size: "EU 42", color: "Slate Grey", price: 435.0, stock: 7, reservedStock: 0 },
        ],
      },
    }),

    // ═══ TIMEPIECES (5 products) ═══

    db.product.create({
      data: {
        name: "Heritage Automatic Chronograph",
        slug: "heritage-automatic-chronograph",
        description: "A 42mm automatic chronograph powered by a Swiss ETA 7750 movement with 48-hour power reserve. Sapphire crystal and exhibition caseback. Water-resistant to 100m.",
        basePrice: 2450.0,
        featured: true,
        tags: ["watch", "automatic", "chronograph", "swiss"],
        categoryId: timepieces.id,
        images: [
          { url: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80", alt: "Chronograph - face", position: 0 },
          { url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80", alt: "Chronograph - wrist", position: 1 },
        ],
        variants: [
          { sku: "HAC-SLV-42", size: "42mm", color: "Silver / Black Dial", price: 2450.0, stock: 4, reservedStock: 0 },
          { sku: "HAC-GLD-42", size: "42mm", color: "Rose Gold / Navy Dial", price: 2750.0, stock: 3, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Ultra-Thin Dress Watch",
        slug: "ultra-thin-dress-watch",
        description: "At just 6.8mm thick, this dress watch pairs a Swiss Ronda movement with a domed sapphire crystal. Sunburst dial with hand-stitched alligator strap.",
        basePrice: 895.0,
        featured: false,
        tags: ["watch", "dress", "ultra-thin", "minimalist"],
        categoryId: timepieces.id,
        images: [
          { url: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&q=80", alt: "Dress Watch - face", position: 0 },
          { url: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=80", alt: "Dress Watch - wrist", position: 1 },
        ],
        variants: [
          { sku: "UTDW-SLV-38", size: "38mm", color: "Silver / Ivory Dial", price: 895.0, stock: 6, reservedStock: 0 },
          { sku: "UTDW-GLD-38", size: "38mm", color: "Gold / Champagne Dial", price: 995.0, stock: 4, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Titanium Diver Watch",
        slug: "titanium-diver-watch",
        description: "A professional dive watch in brushed Grade 5 titanium. 300m water resistance, unidirectional ceramic bezel, and Super-LumiNova indices. Swiss automatic movement.",
        basePrice: 1850.0,
        featured: true,
        tags: ["watch", "diver", "titanium", "automatic"],
        categoryId: timepieces.id,
        images: [
          { url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80", alt: "Diver Watch - face", position: 0 },
          { url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80", alt: "Diver Watch - wrist", position: 1 },
        ],
        variants: [
          { sku: "TDW-BLU-42", size: "42mm", color: "Blue Dial / Steel", price: 1850.0, stock: 5, reservedStock: 0 },
          { sku: "TDW-BLK-42", size: "42mm", color: "Black Dial / Steel", price: 1850.0, stock: 4, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Pilot Aviator Watch",
        slug: "pilot-aviator-watch",
        description: "Inspired by vintage cockpit instruments. 44mm case with a matte black dial, oversized Arabic numerals, and a riveted leather strap. Miyota 9015 automatic movement.",
        basePrice: 750.0,
        featured: false,
        tags: ["watch", "pilot", "aviator", "vintage"],
        categoryId: timepieces.id,
        images: [
          { url: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80", alt: "Pilot Watch - face", position: 0 },
          { url: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80", alt: "Pilot Watch - side", position: 1 },
        ],
        variants: [
          { sku: "PAW-BLK-44", size: "44mm", color: "Black / Brown Strap", price: 750.0, stock: 8, reservedStock: 0 },
          { sku: "PAW-GRN-44", size: "44mm", color: "Green / Black Strap", price: 750.0, stock: 6, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Moon Phase Calendar Watch",
        slug: "moon-phase-calendar-watch",
        description: "An elegant complication watch featuring a moon phase display and triple calendar. Enamel dial with blued steel hands. Powered by a decorated Swiss automatic movement.",
        basePrice: 3200.0,
        featured: false,
        tags: ["watch", "moon-phase", "calendar", "luxury"],
        categoryId: timepieces.id,
        images: [
          { url: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80", alt: "Moon Phase Watch - face", position: 0 },
          { url: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80", alt: "Moon Phase Watch - detail", position: 1 },
        ],
        variants: [
          { sku: "MPCW-SLV-40", size: "40mm", color: "Silver / White Dial", price: 3200.0, stock: 2, reservedStock: 0 },
          { sku: "MPCW-GLD-40", size: "40mm", color: "Rose Gold / Blue Dial", price: 3450.0, stock: 2, reservedStock: 0 },
        ],
      },
    }),

    // ═══ KNITWEAR (5 products) ═══

    db.product.create({
      data: {
        name: "Mongolian Cashmere Crewneck",
        slug: "mongolian-cashmere-crewneck",
        description: "Knitted from Grade-A Mongolian cashmere in a 12-gauge jersey stitch. Reinforced ribbing at cuffs, hem, and neckline for lasting shape.",
        basePrice: 345.0,
        featured: true,
        tags: ["cashmere", "sweater", "crewneck", "mongolian"],
        categoryId: knitwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", alt: "Cashmere Crewneck - folded", position: 0 },
          { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", alt: "Cashmere Crewneck - worn", position: 1 },
        ],
        variants: [
          { sku: "MCC-IVR-S", size: "S", color: "Ivory", price: 345.0, stock: 14, reservedStock: 0 },
          { sku: "MCC-IVR-M", size: "M", color: "Ivory", price: 345.0, stock: 18, reservedStock: 0 },
          { sku: "MCC-IVR-L", size: "L", color: "Ivory", price: 345.0, stock: 12, reservedStock: 0 },
          { sku: "MCC-NVY-M", size: "M", color: "Navy", price: 345.0, stock: 16, reservedStock: 0 },
          { sku: "MCC-NVY-L", size: "L", color: "Navy", price: 345.0, stock: 11, reservedStock: 0 },
          { sku: "MCC-BLK-M", size: "M", color: "Black", price: 345.0, stock: 13, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Extra-Fine Merino Turtleneck",
        slug: "extra-fine-merino-turtleneck",
        description: "16-gauge extra-fine merino wool (16.5 micron), soft enough to wear against bare skin. Slim modern fit that layers effortlessly under blazers.",
        basePrice: 195.0,
        featured: true,
        tags: ["merino", "turtleneck", "wool", "layering"],
        categoryId: knitwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", alt: "Merino Turtleneck - worn", position: 0 },
          { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", alt: "Merino Turtleneck - detail", position: 1 },
        ],
        variants: [
          { sku: "EFMT-BLK-S", size: "S", color: "Black", price: 195.0, stock: 20, reservedStock: 0 },
          { sku: "EFMT-BLK-M", size: "M", color: "Black", price: 195.0, stock: 25, reservedStock: 0 },
          { sku: "EFMT-BLK-L", size: "L", color: "Black", price: 195.0, stock: 18, reservedStock: 0 },
          { sku: "EFMT-CRM-M", size: "M", color: "Cream", price: 195.0, stock: 20, reservedStock: 0 },
          { sku: "EFMT-CRM-L", size: "L", color: "Cream", price: 195.0, stock: 14, reservedStock: 0 },
          { sku: "EFMT-BRG-M", size: "M", color: "Burgundy", price: 195.0, stock: 12, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Cable Knit Cardigan",
        slug: "cable-knit-cardigan",
        description: "A heritage cable-knit cardigan in a chunky lambswool blend. Genuine horn buttons and patch pockets. Inspired by traditional fisherman knitwear.",
        basePrice: 285.0,
        featured: false,
        tags: ["cardigan", "cable-knit", "wool", "heritage"],
        categoryId: knitwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80", alt: "Cable Knit Cardigan - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80", alt: "Cable Knit Cardigan - detail", position: 1 },
        ],
        variants: [
          { sku: "CKC-OAT-S", size: "S", color: "Oatmeal", price: 285.0, stock: 10, reservedStock: 0 },
          { sku: "CKC-OAT-M", size: "M", color: "Oatmeal", price: 285.0, stock: 14, reservedStock: 0 },
          { sku: "CKC-OAT-L", size: "L", color: "Oatmeal", price: 285.0, stock: 9, reservedStock: 0 },
          { sku: "CKC-CHR-M", size: "M", color: "Charcoal", price: 285.0, stock: 11, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Cashmere V-Neck Vest",
        slug: "cashmere-v-neck-vest",
        description: "A sleeveless V-neck vest in two-ply cashmere. Perfect for layering over dress shirts. Fine rib trim at armholes and hem.",
        basePrice: 225.0,
        featured: false,
        tags: ["vest", "cashmere", "v-neck", "layering"],
        categoryId: knitwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80", alt: "Cashmere Vest - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", alt: "Cashmere Vest - styled", position: 1 },
        ],
        variants: [
          { sku: "CVV-GRY-S", size: "S", color: "Light Grey", price: 225.0, stock: 12, reservedStock: 0 },
          { sku: "CVV-GRY-M", size: "M", color: "Light Grey", price: 225.0, stock: 16, reservedStock: 0 },
          { sku: "CVV-NVY-M", size: "M", color: "Navy", price: 225.0, stock: 13, reservedStock: 0 },
          { sku: "CVV-NVY-L", size: "L", color: "Navy", price: 225.0, stock: 10, reservedStock: 0 },
        ],
      },
    }),

    db.product.create({
      data: {
        name: "Merino Wool Zip Hoodie",
        slug: "merino-wool-zip-hoodie",
        description: "A refined take on the hoodie in extra-fine merino wool jersey. Full zip with a double-faced hood, kangaroo pockets, and rib-knit cuffs. Elevated casual comfort.",
        basePrice: 265.0,
        featured: false,
        tags: ["hoodie", "merino", "zip", "casual"],
        categoryId: knitwear.id,
        images: [
          { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", alt: "Merino Hoodie - front", position: 0 },
          { url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80", alt: "Merino Hoodie - side", position: 1 },
        ],
        variants: [
          { sku: "MWH-BLK-S", size: "S", color: "Black", price: 265.0, stock: 15, reservedStock: 0 },
          { sku: "MWH-BLK-M", size: "M", color: "Black", price: 265.0, stock: 20, reservedStock: 0 },
          { sku: "MWH-BLK-L", size: "L", color: "Black", price: 265.0, stock: 16, reservedStock: 0 },
          { sku: "MWH-GRY-M", size: "M", color: "Heather Grey", price: 265.0, stock: 14, reservedStock: 0 },
          { sku: "MWH-GRY-L", size: "L", color: "Heather Grey", price: 265.0, stock: 11, reservedStock: 0 },
        ],
      },
    }),
  ])

  console.log(`  Created ${products.length} products`)

  // ─── Sample Reviews ────────────────────────────────────

  const reviewsData = [
    { productIdx: 0, rating: 5, title: "Worth every penny", comment: "The cashmere quality is incredible. Drapes beautifully and keeps me warm without bulk." },
    { productIdx: 0, rating: 4, title: "Stunning coat", comment: "Beautiful craftsmanship. Runs slightly large, so consider sizing down." },
    { productIdx: 1, rating: 5, title: "Head turner", comment: "This bomber gets compliments every time I wear it. The suede is buttery soft." },
    { productIdx: 5, rating: 5, title: "Perfect travel companion", comment: "This bag is built to last a lifetime. The leather is already developing a gorgeous patina." },
    { productIdx: 10, rating: 5, title: "Best boots I own", comment: "The fit is perfect and the leather quality is superb. Feels custom-made." },
    { productIdx: 11, rating: 5, title: "Minimalist perfection", comment: "Clean design, comfortable right out of the box. The Margom sole gives great traction." },
    { productIdx: 15, rating: 5, title: "A real collector piece", comment: "The movement is smooth and accurate. Exhibition caseback is a beautiful touch." },
    { productIdx: 17, rating: 4, title: "Stunning diver", comment: "Incredible titanium build. Light on the wrist yet feels incredibly solid." },
    { productIdx: 20, rating: 4, title: "Incredibly soft", comment: "The cashmere is buttery soft and the fit is spot on. Wish there were more colors." },
    { productIdx: 21, rating: 4, title: "Great layering piece", comment: "Fits slim and layers well under blazers. The merino is soft and not itchy at all." },
  ]

  for (const r of reviewsData) {
    if (products[r.productIdx]) {
      await db.review.create({
        data: {
          userId: customer.id,
          productId: products[r.productIdx].id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
        },
      })
    }
  }

  // Update product ratings
  for (const product of products) {
    const reviews = await db.review.findMany({
      where: { productId: product.id },
    })
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      await db.product.update({
        where: { id: product.id },
        data: { rating: avg, numReviews: reviews.length },
      })
    }
  }

  console.log("  Created sample reviews")

  // ─── Sample Order ──────────────────────────────────────

  await db.order.create({
    data: {
      orderNumber: "LXS-SEED-0001",
      userId: customer.id,
      items: [
        {
          productId: products[20].id,
          variantSku: "MCC-NVY-M",
          name: "Mongolian Cashmere Crewneck",
          slug: "mongolian-cashmere-crewneck",
          image: products[20].images[0].url,
          size: "M",
          color: "Navy",
          price: 345.0,
          quantity: 1,
        },
        {
          productId: products[11].id,
          variantSku: "CCS-WHT-42",
          name: "Court Classic Sneakers",
          slug: "court-classic-sneakers",
          image: products[11].images[0].url,
          size: "EU 42",
          color: "White",
          price: 385.0,
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: "Jane Cooper",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "US",
        phone: "+1 555-0100",
      },
      itemsPrice: 730.0,
      shippingPrice: 0,
      taxPrice: 109.5,
      totalPrice: 839.5,
      status: "DELIVERED",
      isPaid: true,
      paidAt: new Date("2025-12-15"),
      isDelivered: true,
      deliveredAt: new Date("2025-12-20"),
      paymentResult: {
        id: "STRIPE-SEED-001",
        status: "COMPLETED",
        emailAddress: "jane@example.com",
        pricePaid: "839.50",
      },
    },
  })

  console.log("  Created sample order")
  console.log("✅ Seed complete!")
  console.log("")
  console.log(`  Total: ${products.length} products across 5 categories`)
  console.log("  Admin login:     admin@luxestore.com / admin123")
  console.log("  Customer login:  jane@example.com / customer123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
