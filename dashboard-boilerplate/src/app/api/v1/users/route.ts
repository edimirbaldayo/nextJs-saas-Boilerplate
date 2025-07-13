import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Helper to check if user is admin
async function isAdmin(userId: string) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.some(ur => ur.role.name === 'admin');
}

// GET: List users
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    include: {
      userRoles: { include: { role: true } },
      userProfile: true,
    },
  });
  return NextResponse.json({ users });
}

// POST: Create user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { email, name, password, roleId, profile } = body;
  if (!email || !password || !roleId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const userData: any = {
      email,
      name,
      password: hashedPassword,
      emailVerified: new Date(),
      userRoles: { create: { roleId } },
    };
    if (profile) {
      userData.userProfile = { create: profile };
    }
    const user = await prisma.user.create({
      data: userData,
    });
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: 'User creation failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// PUT: Update user
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { userId, email, name, password, roleId, profile } = body;
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  try {
    const data: any = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (password) data.password = await bcrypt.hash(password, 12);
    if (profile) {
      data.userProfile = { upsert: { update: profile, create: profile } };
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });
    // Update role if provided
    if (roleId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId } },
        update: {},
        create: { userId, roleId },
      });
    }
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: 'User update failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// DELETE: Delete user
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { userId } = body;
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'User deletion failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// PATCH: Assign role or activate/deactivate user
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { userId, roleId, isActive } = body;
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  try {
    let user;
    // Toggle isActive if provided
    if (typeof isActive === 'boolean') {
      user = await prisma.user.update({ where: { id: userId }, data: { isActive } });
    }
    // Assign role if provided
    if (roleId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId } },
        update: {},
        create: { userId, roleId },
      });
    }
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } }, userProfile: true },
    });
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: 'User patch failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
} 