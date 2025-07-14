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

// GET: List permissions
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const permissions = await prisma.permission.findMany();
  return NextResponse.json({ permissions });
}

// POST: Create permission
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { name, description, resource, action, isActive = true } = body;
  if (!name || !resource || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const permission = await prisma.permission.create({
      data: { name, description, resource, action, isActive },
    });
    return NextResponse.json({ permission });
  } catch (e) {
    return NextResponse.json({ error: 'Permission creation failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// PUT: Update permission
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { permissionId, name, description, resource, action, isActive } = body;
  if (!permissionId) {
    return NextResponse.json({ error: 'Missing permissionId' }, { status: 400 });
  }
  try {
    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (resource) data.resource = resource;
    if (action) data.action = action;
    if (typeof isActive === 'boolean') data.isActive = isActive;
    const permission = await prisma.permission.update({
      where: { id: permissionId },
      data,
    });
    return NextResponse.json({ permission });
  } catch (e) {
    return NextResponse.json({ error: 'Permission update failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// DELETE: Delete permission
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { permissionId } = body;
  if (!permissionId) {
    return NextResponse.json({ error: 'Missing permissionId' }, { status: 400 });
  }
  try {
    await prisma.permission.delete({ where: { id: permissionId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Permission deletion failed', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
} 