import { useEffect, useState } from 'react'
import { UserPlus01 } from '@untitledui/icons'

import AppLayout from '@/layouts/AppLayout'
import { sharedBreadcrumbItems } from '@/constants/breadcrumbs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getManagedUsers } from '@/services/manageUsers'

const USERS_PER_PAGE = 10

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const paginationItems = [1]
  const windowStart = Math.max(2, currentPage - 1)
  const windowEnd = Math.min(totalPages - 1, currentPage + 1)

  if (windowStart > 2) {
    paginationItems.push('start-ellipsis')
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    paginationItems.push(page)
  }

  if (windowEnd < totalPages - 1) {
    paginationItems.push('end-ellipsis')
  }

  paginationItems.push(totalPages)

  return paginationItems
}

function UserPage() {
  usePageTitle()

  const [searchQuery, setSearchQuery] = useState('')
  const [userList, setUserList] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const loadUsers = async () => {
    setUsersError('')
    setIsLoadingUsers(true)

    try {
      const users = await getManagedUsers()
      setUserList(users)
    } catch (error) {
      setUserList([])
      setUsersError(error?.message || 'Failed to load users from database.')
    } finally {
      setIsLoadingUsers(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [normalizedSearchQuery])

  const handleRefresh = () => {
    setSearchQuery('')
    setCurrentPage(1)
    void loadUsers()
  }

  const filteredUsers = userList.filter(({ id, name, email, division, role, status }) => {
    if (!normalizedSearchQuery) {
      return true
    }

    return [id, name, email, division, role, status].some((field) =>
      field.toLowerCase().includes(normalizedSearchQuery),
    )
  })
  const totalUsers = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * USERS_PER_PAGE
  const pageEndIndex = pageStartIndex + USERS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(pageStartIndex, pageEndIndex)
  const paginationItems = getPaginationItems(safeCurrentPage, totalPages)
  const visibleFrom = totalUsers === 0 ? 0 : pageStartIndex + 1
  const visibleTo = Math.min(pageEndIndex, totalUsers)

  let tableMessage = ''

  if (isLoadingUsers) {
    tableMessage = 'Loading users from database...'
  } else if (usersError) {
    tableMessage = usersError
  } else if (normalizedSearchQuery) {
    tableMessage = 'No users found. Try another keyword or use refresh to reset the search.'
  } else {
    tableMessage = 'No users available.'
  }

  return (
    <AppLayout
      headerProps={{
        title: 'Pilar Group',
        subtitle: 'Manage your recruitment process',
        breadcrumb: sharedBreadcrumbItems,
        searchProps: {
          value: searchQuery,
          placeholder: 'Search users...',
          onChange: (event) => setSearchQuery(event.target.value),
          ariaLabel: 'Search users',
        },
        notificationProps: {
          ariaLabel: 'Open notifications',
          modalTitle: 'Notifications',
        },
        onRefresh: handleRefresh,
        activePath: '/users',
      }}
    >
      <section className="dashboard-content">
        <article className="dashboard-panel users-table-card">
          <div className="dashboard-panel__header users-table-card__header">
            <div>
              <p className="dashboard-panel__eyebrow">User Directory</p>
              <h2 className="dashboard-panel__title">Users Table</h2>
              <p className="users-table-card__description">
                Daftar user diambil langsung dari database melalui endpoint user
                management.
              </p>
            </div>

            <button
              type="button"
              className="users-table-card__action"
              disabled
              title="Form registrasi belum disesuaikan dengan payload API /api/users."
            >
              <UserPlus01 size={18} aria-hidden="true" />
              Registrasi User
            </button>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Email</th>
                  <th scope="col">Division</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last Active</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>
                        <div className="users-table__identity">
                          <span className="users-table__avatar">{getInitials(user.name)}</span>

                          <div>
                            <strong className="users-table__name">{user.name}</strong>
                            <p className="users-table__meta">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {user.email !== '-' ? (
                          <a
                            href={`mailto:${user.email}`}
                            className="users-table__link"
                            onClick={(event) => event.preventDefault()}
                          >
                            {user.email}
                          </a>
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>{user.division}</td>
                      <td>{user.role}</td>
                      <td>
                        <span
                          className={`users-table__status users-table__status--${user.statusKey}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>{user.lastActive}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="users-table__empty">{tableMessage}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoadingUsers && !usersError && totalUsers > 0 ? (
            <div className="users-table-pagination">
              <p className="users-table-pagination__summary">
                Showing {visibleFrom}-{visibleTo} of {totalUsers} users
              </p>

              <div className="users-table-pagination__controls" aria-label="Users pagination">
                <button
                  type="button"
                  className="users-table-pagination__button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                >
                  Previous
                </button>

                {paginationItems.map((item) =>
                  typeof item === 'number' ? (
                    <button
                      key={item}
                      type="button"
                      className={`users-table-pagination__button${
                        item === safeCurrentPage ? ' users-table-pagination__button--active' : ''
                      }`}
                      onClick={() => setCurrentPage(item)}
                      aria-current={item === safeCurrentPage ? 'page' : undefined}
                    >
                      {item}
                    </button>
                  ) : (
                    <span
                      key={item}
                      className="users-table-pagination__ellipsis"
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  ),
                )}

                <button
                  type="button"
                  className="users-table-pagination__button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </article>
      </section>
    </AppLayout>
  )
}

export default UserPage
