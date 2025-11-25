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

  const categoryDefinitions = [
    { key: "stationery", name: "Peralatan Sekolah", description: "Kebutuhan alat tulis dan perlengkapan sekolah" },
    { key: "office", name: "Alat Tulis Kantor", description: "ATK untuk operasional kantor dan gudang" },
    { key: "electronics", name: "Elektronik Kasir", description: "Perangkat pendukung kasir dan display" },
    { key: "cleaning", name: "Kebersihan", description: "Produk kebersihan gudang dan toko" },
    { key: "packaging", name: "Packaging", description: "Bahan packaging dan logistik" },
    { key: "display", name: "Peralatan Display", description: "Kebutuhan etalase dan display toko" },
    { key: "furniture", name: "Furniture Toko", description: "Meja, kursi, dan rak penunjang operasional" },
    { key: "safety", name: "Keselamatan Kerja", description: "APD dan perlengkapan keamanan gudang" },
  ] as const;

  const categoryMap: Record<string, { id: number }> = {};
  for (const category of categoryDefinitions) {
    const record = await ensureCategory(category.name, category.description);
    categoryMap[category.key] = record;
  }

  const productsData = [
    {
      sku: "SCH-001",
      name: "Buku Tulis 58 Lembar",
      description: "Buku tulis isi 58 lembar untuk kebutuhan sekolah sehari-hari.",
      price: 12000,
      stock: 120,
      minStock: 30,
      unit: "pcs",
      categoryKey: "stationery",
    },
    {
      sku: "SCH-002",
      name: "Pensil HB Premium",
      description: "Pensil HB dengan kualitas grafit halus dan tahan patah.",
      price: 3500,
      stock: 200,
      minStock: 40,
      unit: "pcs",
      categoryKey: "stationery",
    },
    {
      sku: "SCH-003",
      name: "Pulpen Gel Hitam",
      description: "Pulpen gel warna hitam dengan tinta cepat kering.",
      price: 5500,
      stock: 150,
      minStock: 30,
      unit: "pcs",
      categoryKey: "stationery",
    },
    {
      sku: "SCH-004",
      name: "Penghapus Putih",
      description: "Penghapus berkualitas untuk pensil tanpa meninggalkan bekas.",
      price: 2500,
      stock: 180,
      minStock: 40,
      unit: "pcs",
      categoryKey: "stationery",
    },
    {
      sku: "SCH-005",
      name: "Penggaris 30 cm",
      description: "Penggaris plastik transparan dengan skala jelas.",
      price: 6000,
      stock: 90,
      minStock: 20,
      unit: "pcs",
      categoryKey: "stationery",
    },
    {
      sku: "OFF-001",
      name: "Kertas A4 80gsm",
      description: "Kertas printer ukuran A4 untuk kebutuhan dokumen.",
      price: 48000,
      stock: 70,
      minStock: 20,
      unit: "rim",
      categoryKey: "office",
    },
    {
      sku: "OFF-002",
      name: "Stapler Heavy Duty",
      description: "Stapler besar untuk dokumen tebal hingga 100 lembar.",
      price: 85000,
      stock: 25,
      minStock: 5,
      unit: "pcs",
      categoryKey: "office",
    },
    {
      sku: "ELE-001",
      name: "Printer Thermal Kasir",
      description: "Printer thermal kecepatan tinggi untuk struk.",
      price: 950000,
      stock: 12,
      minStock: 3,
      unit: "unit",
      categoryKey: "electronics",
    },
    {
      sku: "ELE-002",
      name: "Barcode Scanner Wireless",
      description: "Scanner barcode nirkabel jarak 10 meter.",
      price: 1250000,
      stock: 8,
      minStock: 2,
      unit: "unit",
      categoryKey: "electronics",
    },
    {
      sku: "ELE-003",
      name: "Display LED Harga",
      description: "Display harga tiga baris untuk kasir.",
      price: 1850000,
      stock: 5,
      minStock: 1,
      unit: "unit",
      categoryKey: "electronics",
    },
    {
      sku: "CLN-001",
      name: "Disinfektan Literan",
      description: "Cairan disinfektan konsentrat untuk gudang.",
      price: 68000,
      stock: 60,
      minStock: 15,
      unit: "botol",
      categoryKey: "cleaning",
    },
    {
      sku: "CLN-002",
      name: "Lap Microfiber",
      description: "Lap microfiber ukuran besar untuk kebersihan rak.",
      price: 18000,
      stock: 90,
      minStock: 25,
      unit: "pcs",
      categoryKey: "cleaning",
    },
    {
      sku: "CLN-003",
      name: "Sapu Gudang",
      description: "Sapu khusus lantai gudang dengan gagang aluminium.",
      price: 45000,
      stock: 35,
      minStock: 10,
      unit: "pcs",
      categoryKey: "cleaning",
    },
    {
      sku: "PKG-001",
      name: "Dus Ekspedisi Uk. M",
      description: "Dus karton ukuran medium untuk pengiriman.",
      price: 9000,
      stock: 300,
      minStock: 80,
      unit: "pcs",
      categoryKey: "packaging",
    },
    {
      sku: "PKG-002",
      name: "Bubble Wrap Tebal",
      description: "Bubble wrap ketebalan 10mm untuk barang elektronik.",
      price: 65000,
      stock: 40,
      minStock: 10,
      unit: "roll",
      categoryKey: "packaging",
    },
    {
      sku: "PKG-003",
      name: "Lakban Bening 100yd",
      description: "Lakban bening kualitas ekspor.",
      price: 17000,
      stock: 120,
      minStock: 30,
      unit: "roll",
      categoryKey: "packaging",
    },
    {
      sku: "DIS-001",
      name: "Manekin Dewasa",
      description: "Manekin full body untuk display pakaian etalase.",
      price: 650000,
      stock: 6,
      minStock: 2,
      unit: "unit",
      categoryKey: "display",
    },
    {
      sku: "DIS-002",
      name: "Rak Display Akrilik",
      description: "Rak display akrilik 4 tingkat untuk produk kecil.",
      price: 285000,
      stock: 15,
      minStock: 4,
      unit: "unit",
      categoryKey: "display",
    },
    {
      sku: "FUR-001",
      name: "Meja Kasir Modular",
      description: "Meja kasir dengan laci penyimpanan dan kabel management.",
      price: 2100000,
      stock: 4,
      minStock: 1,
      unit: "unit",
      categoryKey: "furniture",
    },
    {
      sku: "FUR-002",
      name: "Kursi Staff Hidrolik",
      description: "Kursi staff dengan penyesuaian tinggi dan sandaran ergonomis.",
      price: 650000,
      stock: 10,
      minStock: 3,
      unit: "unit",
      categoryKey: "furniture",
    },
    {
      sku: "FUR-003",
      name: "Rak Gudang Heavy Duty",
      description: "Rak gudang 5 tingkat kapasitas 500kg per tingkat.",
      price: 3200000,
      stock: 5,
      minStock: 2,
      unit: "unit",
      categoryKey: "furniture",
    },
    {
      sku: "SAFE-001",
      name: "Helm Safety Standar SNI",
      description: "Helm keselamatan dengan suspensi 6 titik.",
      price: 78000,
      stock: 40,
      minStock: 10,
      unit: "pcs",
      categoryKey: "safety",
    },
    {
      sku: "SAFE-002",
      name: "Rompi Reflektif",
      description: "Rompi dengan strip reflektif untuk area loading dock.",
      price: 95000,
      stock: 55,
      minStock: 15,
      unit: "pcs",
      categoryKey: "safety",
    },
    {
      sku: "SAFE-003",
      name: "Sepatu Safety Baja",
      description: "Sepatu safety ujung baja anti slip.",
      price: 420000,
      stock: 20,
      minStock: 6,
      unit: "pasang",
      categoryKey: "safety",
    },
  ];

  for (const product of productsData) {
    const category = categoryMap[product.categoryKey];
    if (!category) continue;

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        unit: product.unit,
        categoryId: category.id,
      },
      create: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        unit: product.unit,
        categoryId: category.id,
      },
    });
  }

  console.log("✅ Sample categories & products created/updated");

  const sampleReferences = ["PO-2024-001", "PO-2024-002", "PO-2024-003", "SO-2024-001", "SO-2024-002", "SO-2024-003"];
  await prisma.transaction.deleteMany({
    where: {
      reference: {
        in: sampleReferences,
      },
    },
  });

  const transactionSeeds = [
    {
      reference: "PO-2024-001",
      type: "MASUK" as const,
      notes: "Restock alat tulis",
      items: [
        { sku: "SCH-001", quantity: 40, price: 11500 },
        { sku: "SCH-002", quantity: 60, price: 3200 },
        { sku: "OFF-001", quantity: 15, price: 46000 },
      ],
    },
    {
      reference: "PO-2024-002",
      type: "MASUK" as const,
      notes: "Restock elektronik kasir",
      items: [
        { sku: "ELE-001", quantity: 3, price: 900000 },
        { sku: "ELE-002", quantity: 4, price: 1180000 },
      ],
    },
    {
      reference: "SO-2024-001",
      type: "KELUAR" as const,
      notes: "Pengiriman ke cabang A",
      items: [
        { sku: "SCH-003", quantity: 25, price: 6000 },
        { sku: "PKG-001", quantity: 50, price: 9500 },
        { sku: "PKG-003", quantity: 30, price: 17500 },
      ],
    },
    {
      reference: "PO-2024-003",
      type: "MASUK" as const,
      notes: "Pengadaan furniture & keselamatan",
      items: [
        { sku: "FUR-001", quantity: 2, price: 2050000 },
        { sku: "FUR-003", quantity: 2, price: 3100000 },
        { sku: "SAFE-001", quantity: 25, price: 76000 },
        { sku: "SAFE-003", quantity: 8, price: 400000 },
      ],
    },
    {
      reference: "SO-2024-002",
      type: "KELUAR" as const,
      notes: "Stok untuk event sekolah",
      items: [
        { sku: "SCH-005", quantity: 30, price: 6200 },
        { sku: "SCH-006", quantity: 20, price: 8200 },
        { sku: "CLN-002", quantity: 15, price: 18500 },
      ],
    },
    {
      reference: "SO-2024-003",
      type: "KELUAR" as const,
      notes: "Pembukaan cabang baru",
      items: [
        { sku: "DIS-002", quantity: 6, price: 280000 },
        { sku: "PKG-002", quantity: 10, price: 66000 },
        { sku: "SAFE-002", quantity: 20, price: 92000 },
        { sku: "FUR-002", quantity: 4, price: 630000 },
      ],
    },
  ];

  for (const transaction of transactionSeeds) {
    const preparedItems = [];
    for (const item of transaction.items) {
      const product = await prisma.product.findUnique({ where: { sku: item.sku } });
      if (!product) continue;

      preparedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      });

      await prisma.product.update({
        where: { id: product.id },
        data:
          transaction.type === "MASUK"
            ? { stock: { increment: item.quantity } }
            : { stock: { decrement: item.quantity } },
      });
    }

    if (!preparedItems.length) continue;

    const totalAmount = preparedItems.reduce((sum, item) => sum + item.subtotal, 0);

    await prisma.transaction.create({
      data: {
        reference: transaction.reference,
        type: transaction.type,
        notes: transaction.notes,
        totalAmount,
        items: {
          create: preparedItems,
        },
      },
    });
  }

  console.log("✅ Sample transactions created");

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

