import { useEffect, useState } from 'react'

import ChangeProfileMobile from '@/components/Template/ChangeProfileMobile'
import BackgroundMain from '@/components/Template/BackgroundMain'
import ChangeProfilePopup from '@/components/Template/ChangeProfilePopup'
import Header from '@/components/Template/Header'
import Sidebar from '@/components/Template/Sidebar'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { getStoredUser } from '@/services/api'
import {
  getPrimaryNavigationItemsForUser,
  getSecondaryNavigationItemsForUser,
} from '@/services/accessControl'

const defaultUser = {
  name: 'Al fatih',
  role: 'Frontend Developer',
}

function normalizeUser(user) {
  const normalizedName =
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    user?.username ||
    defaultUser.name

  const normalizedRole =
    user?.role ||
    user?.job_position ||
    user?.jobPosition ||
    user?.position ||
    user?.department ||
    defaultUser.role

  return {
    ...defaultUser,
    ...user,
    name: normalizedName,
    role: normalizedRole,
  }
}

function toTitleCase(value) {
  return String(value ?? '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function findNavigationLabel(items, path) {
  for (const item of items) {
    if (item.href === path) {
      return item.label
    }

    if (item.children?.length) {
      const childLabel = findNavigationLabel(item.children, path)

      if (childLabel) {
        return childLabel
      }
    }
  }

  return ''
}

function getActivePageLabel(items, path) {
  const matchedLabel = findNavigationLabel(items, path)

  if (matchedLabel) {
    return matchedLabel
  }

  const normalizedPath = String(path ?? '').trim().replace(/^\/+/, '')

  if (!normalizedPath) {
    return 'Dashboard'
  }

  return toTitleCase(normalizedPath)
}

function AppLayout({
  children,
  className = '',
  headerProps = {},
  user,
}) {
  const isDesktop = useBreakpoint('lg')
  const [, setProfileVersion] = useState(0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isChangeProfileOpen, setIsChangeProfileOpen] = useState(false)
  const resolvedUser = normalizeUser({
    ...(getStoredUser() || {}),
    ...(user || {}),
  })
  const primaryNavigationItems = getPrimaryNavigationItemsForUser(resolvedUser)
  const secondaryNavigationItems = getSecondaryNavigationItemsForUser(resolvedUser)
  const activePath = headerProps.activePath ?? '/dashboard'
  const activePageLabel = getActivePageLabel(
    [...primaryNavigationItems, ...secondaryNavigationItems],
    activePath,
  )

  useEffect(() => {
    if (isDesktop) {
      setIsMobileSidebarOpen(false)
      return
    }

    setIsSidebarCollapsed(false)
  }, [isDesktop])

  const sidebarCollapsed = isDesktop && isSidebarCollapsed
  const appShellClassName = [
    'dashboard-shell',
    sidebarCollapsed ? 'dashboard-shell--sidebar-collapsed' : '',
    isMobileSidebarOpen ? 'dashboard-shell--sidebar-open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleSidebarAction = (action) => {
    if (action === 'change-profile') {
      setIsChangeProfileOpen(true)
    }
  }

  const handleRefresh = () => {
    headerProps.onRefresh?.()
  }

  return (
    <div className={appShellClassName}>
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={!isDesktop && isMobileSidebarOpen}
        activePath={activePath}
        userName={resolvedUser.name}
        userRole={resolvedUser.role}
        primaryItems={primaryNavigationItems}
        secondaryItems={secondaryNavigationItems}
        onAction={handleSidebarAction}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="dashboard-stage">
        <Header
          {...headerProps}
          directoryProps={{
            rootLabel: headerProps.title ?? 'Pilargroup',
            currentLabel: activePageLabel,
          }}
          onRefresh={handleRefresh}
          showMenuButton={!isDesktop}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
          userName={resolvedUser.name}
          userRole={resolvedUser.role}
        />

        <main
          className="dashboard-main"
          style={{ position: 'relative', overflowX: 'hidden', isolation: 'isolate' }}
        >
          <BackgroundMain />
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </main>
      </div>

      <button
        type="button"
        className={`sidebar-overlay${!isDesktop && isMobileSidebarOpen ? ' active' : ''}`}
        aria-label="Close sidebar overlay"
        tabIndex={!isDesktop && isMobileSidebarOpen ? 0 : -1}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {isDesktop ? (
        <ChangeProfilePopup
          isOpen={isChangeProfileOpen}
          user={resolvedUser}
          onClose={() => setIsChangeProfileOpen(false)}
          onUpdated={() => setProfileVersion((currentVersion) => currentVersion + 1)}
        />
      ) : (
        <ChangeProfileMobile
          isOpen={isChangeProfileOpen}
          user={resolvedUser}
          onClose={() => setIsChangeProfileOpen(false)}
          onUpdated={() => setProfileVersion((currentVersion) => currentVersion + 1)}
        />
      )}
    </div>
  )
}

export default AppLayout
