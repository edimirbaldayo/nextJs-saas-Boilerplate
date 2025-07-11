const stats = [
  {
    name: 'Total Users',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: '👥'
  },
  {
    name: 'Active Sessions',
    value: '567',
    change: '+5%',
    changeType: 'positive',
    icon: '🟢'
  },
  {
    name: 'Revenue',
    value: '$12,345',
    change: '+8%',
    changeType: 'positive',
    icon: '💰'
  },
  {
    name: 'Error Rate',
    value: '0.5%',
    change: '-2%',
    changeType: 'negative',
    icon: '⚠️'
  }
]

export function StatsOverview() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 