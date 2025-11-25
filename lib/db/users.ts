import { prisma } from "./connection";

type Role = "administrator" | "user";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserByName(name: string) {
  return await prisma.user.findFirst({
    where: { name },
  });
}

export async function getUserByIdentifier(identifier: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { name: identifier },
      ],
    },
  });
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) {
  return await prisma.user.create({
    data: {
      ...data,
      role: data.role ?? "user",
    },
  });
}

export async function updateUser(
  id: number,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
  }
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}

