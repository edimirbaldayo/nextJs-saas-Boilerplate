import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to check if user is admin
async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      userRoles: { include: { role: true } },
    },
  });
  return user?.userRoles.some((ur: { role: { name: string } }) => ur.role.name === 'admin');
}

// POST: Assign permission(s) to a role
export async function POST(req: NextRequest, { params }: { params: { roleId: string } }) {
  const session = await getServerSession(authOptions);
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { roleId } = params;
  const { permissionIds } = await req.json(); // expects { permissionIds: string[] }
  if (!Array.isArray(permissionIds) || !roleId) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  try {
    const created = await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      skipDuplicates: true,
    });
    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign permissions', details: error }, { status: 500 });
  }
}

// DELETE: Unassign permission(s) from a role
export async function DELETE(req: NextRequest, { params }: { params: { roleId: string } }) {
  const session = await getServerSession(authOptions);
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { roleId } = params;
  const { permissionIds } = await req.json(); // expects { permissionIds: string[] }
  if (!Array.isArray(permissionIds) || !roleId) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  try {
    const deleted = await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
      },
    });
    return NextResponse.json({ success: true, count: deleted.count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unassign permissions', details: error }, { status: 500 });
  }
} 