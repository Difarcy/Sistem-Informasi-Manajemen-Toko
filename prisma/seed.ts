import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password untuk user default
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@storemanager.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@storemanager.com",
      password: hashedPassword,
      role: "administrator",
    },
  });

  console.log("✅ Admin user created:", admin.email);
  console.log("📧 Email: admin@storemanager.com");
  console.log("🔑 Password: admin123");

  const userPassword = await bcrypt.hash("user123", 10);
  const staff = await prisma.user.upsert({
    where: { email: "user@storemanager.com" },
    update: {},
    create: {
      name: "Petugas Gudang",
      email: "user@storemanager.com",
      password: userPassword,
      role: "user",
    },
  });

  console.log("✅ Default staff user:", staff.email);
  console.log("📧 Email: user@storemanager.com");
  console.log("🔑 Password: user123");

  async function ensureCategory(name: string, description: string) {
    const existing = await prisma.category.findFirst({ where: { name } });
    if (existing) return existing;

    return prisma.category.create({
      data: {
        name,
        description,
      },
    });
  }

  await ensureCategory("Alat Tulis", "Kategori untuk alat tulis kantor");
  await ensureCategory("Elektronik", "Kategori untuk produk elektronik");

  const schoolCategory = await ensureCategory(
    "Peralatan Sekolah",
    "Kebutuhan alat tulis dan perlengkapan sekolah"
  );

  const schoolProducts = [
    {
      name: "Buku Tulis 58 Lembar",
      sku: "SCH-001",
      description: "Buku tulis isi 58 lembar untuk kebutuhan sekolah sehari-hari.",
      price: 12000,
      stock: 120,
      minStock: 30,
      unit: "pcs",
    },
    {
      name: "Pensil HB Premium",
      sku: "SCH-002",
      description: "Pensil HB dengan kualitas grafit halus dan tahan patah.",
      price: 3500,
      stock: 200,
      minStock: 40,
      unit: "pcs",
    },
    {
      name: "Pulpen Gel Hitam",
      sku: "SCH-003",
      description: "Pulpen gel warna hitam dengan tinta cepat kering.",
      price: 5500,
      stock: 150,
      minStock: 30,
      unit: "pcs",
    },
    {
      name: "Penghapus Putih",
      sku: "SCH-004",
      description: "Penghapus berkualitas untuk pensil tanpa meninggalkan bekas.",
      price: 2500,
      stock: 180,
      minStock: 40,
      unit: "pcs",
    },
    {
      name: "Penggaris 30 cm",
      sku: "SCH-005",
      description: "Penggaris plastik transparan dengan skala jelas.",
      price: 6000,
      stock: 90,
      minStock: 20,
      unit: "pcs",
    },
    {
      name: "Spidol Whiteboard",
      sku: "SCH-006",
      description: "Spidol whiteboard warna hitam dengan tinta pekat.",
      price: 8000,
      stock: 110,
      minStock: 25,
      unit: "pcs",
    },
    {
      name: "Tip-X Cair",
      sku: "SCH-007",
      description: "Penghapus cair untuk koreksi tulisan.",
      price: 7000,
      stock: 75,
      minStock: 20,
      unit: "pcs",
    },
    {
      name: "Buku Gambar A4",
      sku: "SCH-008",
      description: "Buku gambar ukuran A4 kertas tebal.",
      price: 15000,
      stock: 85,
      minStock: 20,
      unit: "pcs",
    },
    {
      name: "Kotak Pensil Kanvas",
      sku: "SCH-009",
      description: "Kotak pensil berbahan kanvas dengan resleting.",
      price: 32000,
      stock: 60,
      minStock: 15,
      unit: "pcs",
    },
    {
      name: "Tas Sekolah Anak",
      sku: "SCH-010",
      description: "Tas sekolah ergonomis dengan kompartemen laptop mini.",
      price: 175000,
      stock: 40,
      minStock: 10,
      unit: "pcs",
    },
  ];

  for (const product of schoolProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        ...product,
        categoryId: schoolCategory.id,
      },
      create: {
        ...product,
        categoryId: schoolCategory.id,
      },
    });
  }

  console.log("✅ Sample school supplies created/updated");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

