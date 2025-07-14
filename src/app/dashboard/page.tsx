import { WelcomeCard } from '@/components/dashboard/welcome-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UserInfo } from '@/components/auth/user-info'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StatsOverview />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <UserInfo />
          <QuickActions />
        </div>
      </div>
    </div>
  )
} 