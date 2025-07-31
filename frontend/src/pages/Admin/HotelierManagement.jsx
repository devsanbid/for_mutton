import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Building, Mail, Phone, Calendar, CheckCircle, XCircle, Clock, Ban, Shield } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';
import { getAllHoteliers, updateHotelierStatus } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const HotelierManagement = () => {
  const [hoteliers, setHoteliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalHoteliers: 0,
    limit: 10
  });
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => {
    fetchHoteliers();
  }, [pagination.currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionMenu && !event.target.closest('.action-menu-container')) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionMenu]);

  const fetchHoteliers = async () => {
    try {
      setLoading(true);
      const data = await getAllHoteliers(
        pagination.currentPage,
        pagination.limit,
        searchTerm
      );
      
      // Filter by status on frontend if needed
      let filteredHoteliers = data.hoteliers || [];
      if (statusFilter !== 'All') {
        filteredHoteliers = filteredHoteliers.filter(hotelier => hotelier.status === statusFilter);
      }
      
      setHoteliers(filteredHoteliers);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 1,
        totalHoteliers: data.totalHoteliers || 0
      }));
    } catch (error) {
      console.error('Error fetching hoteliers:', error);
      toast.error('Failed to load hoteliers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (hotelierId) => {
    try {
      await updateHotelierStatus(hotelierId, 'approved');
      setHoteliers(hoteliers.map(hotelier => 
        hotelier.id === hotelierId ? { ...hotelier, status: 'approved' } : hotelier
      ));
      toast.success('Hotelier approved successfully!');
    } catch (error) {
      console.error('Error approving hotelier:', error);
      toast.error('Failed to approve hotelier');
    }
    setShowActionMenu(null);
  };

  const handleReject = async (hotelierId) => {
    if (window.confirm('Are you sure you want to reject this hotelier application?')) {
      try {
        await updateHotelierStatus(hotelierId, 'rejected');
        setHoteliers(hoteliers.map(hotelier => 
          hotelier.id === hotelierId ? { ...hotelier, status: 'rejected' } : hotelier
        ));
        toast.success('Hotelier rejected');
      } catch (error) {
        console.error('Error rejecting hotelier:', error);
        toast.error('Failed to reject hotelier');
      }
      setShowActionMenu(null);
    }
  };

  const handleSuspend = async (hotelierId) => {
    if (window.confirm('Are you sure you want to suspend this hotelier?')) {
      try {
        await updateHotelierStatus(hotelierId, 'suspended');
        setHoteliers(hoteliers.map(hotelier => 
          hotelier.id === hotelierId ? { ...hotelier, status: 'suspended' } : hotelier
        ));
        toast.success('Hotelier suspended');
      } catch (error) {
        console.error('Error suspending hotelier:', error);
        toast.error('Failed to suspend hotelier');
      }
      setShowActionMenu(null);
    }
  };

  const handleReactivate = async (hotelierId) => {
    try {
      await updateHotelierStatus(hotelierId, 'approved');
      setHoteliers(hoteliers.map(hotelier => 
        hotelier.id === hotelierId ? { ...hotelier, status: 'approved' } : hotelier
      ));
      toast.success('Hotelier reactivated successfully!');
    } catch (error) {
      console.error('Error reactivating hotelier:', error);
      toast.error('Failed to reactivate hotelier');
    }
    setShowActionMenu(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'suspended':
        return <Ban className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotelier Management</h2>
          <p className="text-gray-600">Manage hotelier registrations and accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hoteliers by name, owner, or email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hoteliers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Hotelier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Hotels
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] sticky right-0 bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                        <div className="ml-3">
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sticky right-0 bg-white shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.1)]">
                      <div className="h-8 w-8 bg-gray-200 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : hoteliers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No hoteliers found
                  </td>
                </tr>
              ) : (
                hoteliers.map((hotelier) => (
                <tr key={hotelier.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]" title={hotelier.name}>{hotelier.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[150px]" title={hotelier.ownerName}>{hotelier.ownerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate max-w-[140px]" title={hotelier.email}>{hotelier.email}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{hotelier.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-[120px]" title={hotelier.location}>{hotelier.location}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{hotelier.registrationDate ? new Date(hotelier.registrationDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{hotelier.hotels?.length || 0}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Rs. {(hotelier.totalRevenue || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hotelier.status)}`}>
                      {getStatusIcon(hotelier.status)}
                      <span className="ml-1">{hotelier.status.charAt(0).toUpperCase() + hotelier.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.1)]">
                    <div className="relative action-menu-container">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === hotelier.id ? null : hotelier.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-center w-8 h-8"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {showActionMenu === hotelier.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200">
                          <div className="p-2">
                            {hotelier.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(hotelier.id)}
                                  className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg flex items-center"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(hotelier.id)}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </button>
                              </>
                            )}
                            {hotelier.status === 'approved' && (
                              <button
                                onClick={() => handleSuspend(hotelier.id)}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend
                              </button>
                            )}
                            {hotelier.status === 'suspended' && (
                              <button
                                onClick={() => handleReactivate(hotelier.id)}
                                className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg flex items-center"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Reactivate
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalHoteliers)} of {pagination.totalHoteliers} hoteliers
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded-lg ${
                    page === pagination.currentPage
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{hoteliers.filter(h => h.status === 'pending').length}</div>
          <div className="text-sm text-gray-600">Pending Approval</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">{hoteliers.filter(h => h.status === 'approved').length}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-red-600">{hoteliers.filter(h => h.status === 'suspended').length}</div>
          <div className="text-sm text-gray-600">Suspended</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-gray-600">{hoteliers.reduce((sum, h) => sum + (h.revenue || 0), 0).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue (Rs.)</div>
        </div>
      </div>
    </div>
  );
};

export default HotelierManagement;