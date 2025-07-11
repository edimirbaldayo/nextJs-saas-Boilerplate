import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to check if user is admin
async function isAdmin(userId: string) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.some(ur => ur.role.name === 'admin');
}

// GET: List roles
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const roles = await prisma.role.findMany();
  return NextResponse.json({ roles });
}

// POST: Create role
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { name, description, isActive = true } = body;
  if (!name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const role = await prisma.role.create({
      data: { name, description, isActive },
    });
    return NextResponse.json({ role });
  } catch (e) {
    return NextResponse.json({ error: 'Role creation failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// PUT: Update role
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { roleId, name, description, isActive } = body;
  if (!roleId) {
    return NextResponse.json({ error: 'Missing roleId' }, { status: 400 });
  }
  try {
    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (typeof isActive === 'boolean') data.isActive = isActive;
    const role = await prisma.role.update({
      where: { id: roleId },
      data,
    });
    return NextResponse.json({ role });
  } catch (e) {
    return NextResponse.json({ error: 'Role update failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// DELETE: Delete role
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { roleId } = body;
  if (!roleId) {
    return NextResponse.json({ error: 'Missing roleId' }, { status: 400 });
  }
  try {
    await prisma.role.delete({ where: { id: roleId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Role deletion failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
} 