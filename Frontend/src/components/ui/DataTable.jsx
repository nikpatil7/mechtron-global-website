import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable DataTable Component
 * 
 * @param {Array} data - Array of data objects to display
 * @param {Array} columns - Column configuration: [{ key, label, render?, width?, className? }]
 * @param {Array} actions - Action buttons config: [{ label, icon?, onClick, variant?, className? }]
 * @param {Object} filters - Filter configuration: { options: [{ label, value }], value, onChange }
 * @param {Boolean} loading - Show loading state
 * @param {String} emptyMessage - Message when no data
 * @param {String} className - Additional table container classes
 */
export default function DataTable({
  data = [],
  columns = [],
  actions = [],
  filters = null,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
}) {
  const [sortConfig, setSortConfig] = useState(null);

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="text-accent ml-1">↑</span> 
      : <span className="text-accent ml-1">↓</span>;
  };

  return (
    <div className={`bg-white rounded-xl shadow overflow-hidden ${className}`}>
      {/* Filters */}
      {filters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            {filters.options.map((option) => (
              <button
                key={option.value}
                onClick={() => filters.onChange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filters.value === option.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}

      {/* Table */}
      {!loading && sortedData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                      column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.className || ''}`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable !== false && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                    >
                      {column.render ? column.render(row, rowIndex) : (
                        <span className="text-sm text-gray-900">
                          {row[column.key] ?? '-'}
                        </span>
                      )}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex gap-2 justify-end">
                        {actions.map((action, actionIndex) => {
                          const variant = action.variant || 'default';
                          const variantClasses = {
                            default: 'text-primary-dark hover:text-accent',
                            edit: 'text-accent hover:text-accent/80',
                            delete: 'text-red-600 hover:text-red-700',
                            view: 'text-blue-600 hover:text-blue-700',
                          };

                          if (action.to) {
                            return (
                              <Link
                                key={actionIndex}
                                to={typeof action.to === 'function' ? action.to(row) : action.to}
                                className={`${variantClasses[variant]} font-medium transition ${
                                  action.className || ''
                                }`}
                              >
                                {action.icon && <span className="mr-1">{action.icon}</span>}
                                {action.label}
                              </Link>
                            );
                          }

                          return (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={`${variantClasses[variant]} font-medium transition ${
                                action.className || ''
                              }`}
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
