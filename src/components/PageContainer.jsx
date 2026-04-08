import { lazy, Suspense } from 'react'

// Staff pages
const StaffDashboard = lazy(() => import('../pages/staff/DashboardPage'))
const ProceduresPage = lazy(() => import('../pages/staff/ProceduresPage'))
const SchedulePage = lazy(() => import('../pages/staff/SchedulePage'))
const ChecklistPage = lazy(() => import('../pages/staff/ChecklistPage'))
const StaffHelp = lazy(() => import('../pages/staff/HelpPage'))

// Owner pages
const OwnerDashboard = lazy(() => import('../pages/owner/DashboardPage'))
const StaffMgmt = lazy(() => import('../pages/owner/StaffManagementPage'))
const InventoryPage = lazy(() => import('../pages/owner/InventoryPage'))
const AnalyticsPage = lazy(() => import('../pages/owner/AnalyticsPage'))

// Client pages
const ClientDashboard = lazy(() => import('../pages/client/DashboardPage'))
const BookingPage = lazy(() => import('../pages/client/BookingPage'))
const MyBookingsPage = lazy(() => import('../pages/client/MyBookingsPage'))
const LoyaltyPage = lazy(() => import('../pages/client/LoyaltyPage'))
const ServicesPage = lazy(() => import('../pages/client/ServicesPage'))

function LoadingScreen() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      Loading page...
    </div>
  )
}

export default function PageContainer({
  brainType,
  currentPage,
  selectedShop,
  user,
  onChat
}) {
  const pageMap = {
    staff: {
      dashboard: StaffDashboard,
      procedures: ProceduresPage,
      schedule: SchedulePage,
      checklist: ChecklistPage,
      help: StaffHelp
    },
    owner: {
      dashboard: OwnerDashboard,
      staff: StaffMgmt,
      inventory: InventoryPage,
      analytics: AnalyticsPage
    },
    client: {
      dashboard: ClientDashboard,
      booking: BookingPage,
      mybookings: MyBookingsPage,
      loyalty: LoyaltyPage,
      services: ServicesPage
    }
  }

  const BrainPages = pageMap[brainType] || pageMap.staff
  const PageComponent = BrainPages[currentPage] || BrainPages.dashboard

  return (
    <Suspense fallback={<LoadingScreen />}>
      <PageComponent
        selectedShop={selectedShop}
        user={user}
        onChat={onChat}
      />
    </Suspense>
  )
}
