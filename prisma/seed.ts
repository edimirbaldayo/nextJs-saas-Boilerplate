import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
      isActive: true,
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Standard user with limited access',
      isActive: true,
    },
  })

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      description: 'Moderator with elevated permissions',
      isActive: true,
    },
  })

  console.log('✅ Roles created:', { adminRole, userRole, moderatorRole })

  // Create default permissions
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.upsert({
      where: { name: 'user:create' },
      update: {},
      create: {
        name: 'user:create',
        description: 'Create new users',
        resource: 'user',
        action: 'create',
        isActive: true,
      },
    }),
    prisma.permission.upsert({
      where: { name: 'user:read' },
      update: {},
      create: {
        name: 'user:read',
        description: 'Read user information',
        resource: 'user',
        action: 'read',
        isActive: true,
      },
    }),
    prisma.permission.upsert({
      where: { name: 'user:update' },
      update: {},
      create: {
        name: 'user:update',
        description: 'Update user information',
        resource: 'user',
        action: 'update',
        isActive: true,
      },
    }),
    prisma.permission.upsert({
      where: { name: 'user:delete' },
      update: {},
      create: {
        name: 'user:delete',
        description: 'Delete users',
        resource: 'user',
        action: 'delete',
        isActive: true,
      },
    }),

    // Role permissions
    prisma.permission.upsert({
      where: { name: 'role:create' },
      update: {},
      create: {
        name: 'role:create',
        description: 'Create new roles',
        resource: 'role',
        action: 'create',
        isActive: true,
      },
    }),
    prisma.permission.upsert({
      where: { name: 'role:read' },
      update: {},
      create: {
        name: 'role:read',
        description: 'Read role information',
        resource: 'role',
        action: 'read',
        isActive: true,
      },
    }),
    prisma.permission.upsert({
      where: { name: 'role:update' },
      update: {},
      create: {
        name: 'role:update',
        description: 'Update role information',
        resource: 'role',
        action: 'update',
        isActive: true,
      },
    }),
    prisma.permission.upsert({
      where: { name: 'role:delete' },
      update: {},
      create: {
        name: 'role:delete',
        description: 'Delete roles',
        resource: 'role',
        action: 'delete',
        isActive: true,
      },
    }),

    // Dashboard permissions
    prisma.permission.upsert({
      where: { name: 'dashboard:access' },
      update: {},
      create: {
        name: 'dashboard:access',
        description: 'Access dashboard',
        resource: 'dashboard',
        action: 'access',
        isActive: true,
      },
    }),
    prisma.permission.upsert({
      where: { name: 'dashboard:admin' },
      update: {},
      create: {
        name: 'dashboard:admin',
        description: 'Admin dashboard access',
        resource: 'dashboard',
        action: 'admin',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Permissions created:', permissions.length)

  // Assign permissions to roles
  const rolePermissions = [
    // Admin gets all permissions
    ...permissions.map(permission => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),

    // User gets basic permissions
    {
      roleId: userRole.id,
      permissionId: permissions.find(p => p.name === 'user:read')!.id,
    },
    {
      roleId: userRole.id,
      permissionId: permissions.find(p => p.name === 'user:update')!.id,
    },
    {
      roleId: userRole.id,
      permissionId: permissions.find(p => p.name === 'dashboard:access')!.id,
    },

    // Moderator gets elevated permissions
    {
      roleId: moderatorRole.id,
      permissionId: permissions.find(p => p.name === 'user:read')!.id,
    },
    {
      roleId: moderatorRole.id,
      permissionId: permissions.find(p => p.name === 'user:update')!.id,
    },
    {
      roleId: moderatorRole.id,
      permissionId: permissions.find(p => p.name === 'role:read')!.id,
    },
    {
      roleId: moderatorRole.id,
      permissionId: permissions.find(p => p.name === 'dashboard:access')!.id,
    },
  ]

  await Promise.all(
    rolePermissions.map(rp =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: rp.roleId,
            permissionId: rp.permissionId,
          },
        },
        update: {},
        create: rp,
      })
    )
  )

  console.log('✅ Role permissions assigned')

  // Create default admin user
  const hashedPassword = await hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dashboard.com' },
    update: {},
    create: {
      email: 'admin@dashboard.com',
      name: 'Admin User',
      password: hashedPassword,
      emailVerified: new Date(),
      isActive: true,
      userProfile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          bio: 'System administrator',
        },
      },
    },
  })

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample regular user
  const userPassword = await hash('user123', 12)
  
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@dashboard.com' },
    update: {},
    create: {
      email: 'user@dashboard.com',
      name: 'Regular User',
      password: userPassword,
      emailVerified: new Date(),
      isActive: true,
      userProfile: {
        create: {
          firstName: 'Regular',
          lastName: 'User',
          bio: 'Standard user account',
        },
      },
    },
  })

  // Assign user role to regular user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: regularUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: regularUser.id,
      roleId: userRole.id,
    },
  })

  console.log('✅ Regular user created:', regularUser.email)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 