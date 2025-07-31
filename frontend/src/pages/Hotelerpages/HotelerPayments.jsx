import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, Download, Eye, Plus, User } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';
import Modal from '../../components/Hoteler/common/Modal';
import { paymentsAPI } from '../../services/api';

const HotelerPayments = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    esewaRevenue: 0,
    cashRevenue: 0
  });

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: '',
    esewaId: '',
    accountName: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchPaymentData();
  }, [filterStatus, filterMethod, dateRange]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterMethod !== 'all') params.method = filterMethod;
      if (dateRange !== 'all') params.days = dateRange;

      // Fetch payments and payment methods
      const [paymentsResponse, methodsResponse] = await Promise.all([
        paymentsAPI.getHotelerPayments(params),
        paymentsAPI.getPaymentMethods()
      ]);

      if (paymentsResponse.success) {
        setTransactions(paymentsResponse.data.payments);
        setSummary(paymentsResponse.data.summary);
      } else {
        setError(paymentsResponse.message || 'Failed to fetch payments');
      }

      if (methodsResponse.success) {
        setPaymentMethods(methodsResponse.data);
      } else {
        setError(methodsResponse.message || 'Failed to fetch payment methods');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('Error fetching payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPaymentMethod = async () => {
    if (newPaymentMethod.type === 'eSewa' && (!newPaymentMethod.esewaId || !newPaymentMethod.accountName)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await paymentsAPI.addPaymentMethod(newPaymentMethod);
      
      if (response.success) {
        // Refresh payment methods
        const methodsResponse = await paymentsAPI.getPaymentMethods();
        if (methodsResponse.success) {
          setPaymentMethods(methodsResponse.data);
        }
        
        setShowAddPaymentModal(false);
        setNewPaymentMethod({ type: '', esewaId: '', accountName: '' });
      } else {
        alert(response.message || 'Failed to add payment method');
      }
    } catch (err) {
      console.error('Error adding payment method:', err);
      alert('An error occurred while adding payment method');
    }
  };

  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Use summary data from API instead of calculating from transactions
  const totalRevenue = summary.totalRevenue || 0;
  const pendingAmount = summary.pendingAmount || 0;
  const esewaRevenue = summary.esewaRevenue || 0;
  const cashRevenue = summary.cashRevenue || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600 mt-1">View customer payments and manage payment methods</p>
        </div>
        <Button 
          onClick={() => setShowAddPaymentModal(true)}
          style={{ backgroundColor: '#437057' }}
          className="hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#97B06720' }}>
              <DollarSign className="h-6 w-6" style={{ color: '#97B067' }} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {pendingAmount.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">eSewa Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {esewaRevenue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {cashRevenue.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.details}</p>
                  {method.accountName && (
                    <p className="text-xs text-gray-400">Account: {method.accountName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {method.primary && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Primary
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(method.status)}`}>
                  {method.status}
                </span>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Payment History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Customer Payment History</h3>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading transactions...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(!transactions || transactions.length === 0) ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.createdAt || transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{transaction.User?.name || transaction.guest || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{transaction.User?.email || transaction.guestPhone || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.Booking?.Room?.type || transaction.roomType || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{transaction.Booking?.nights || transaction.nights || 'N/A'} nights</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                          Rs. {Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.paymentMethod === 'cash' ? 'Pay at Hotel' : transaction.paymentMethod || transaction.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewTransactionDetails(transaction)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        title="Add Payment Method"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Type
            </label>
            <select
              value={newPaymentMethod.type}
              onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select payment method</option>
              <option value="eSewa">eSewa</option>
            </select>
          </div>

          {newPaymentMethod.type === 'eSewa' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  eSewa ID
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.esewaId}
                  onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, esewaId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your eSewa ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.accountName}
                  onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, accountName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account holder name"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={() => setShowAddPaymentModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPaymentMethod}
              style={{ backgroundColor: '#437057' }}
              className="hover:opacity-90"
              disabled={!newPaymentMethod.type || (newPaymentMethod.type === 'eSewa' && (!newPaymentMethod.esewaId || !newPaymentMethod.accountName))}
            >
              Add Payment Method
            </Button>
          </div>
        </div>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title="Transaction Details"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                <p className="text-sm text-gray-900">{selectedTransaction.transactionId || selectedTransaction.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-sm text-gray-900">{new Date(selectedTransaction.createdAt || selectedTransaction.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                <p className="text-sm text-gray-900">{selectedTransaction.User?.name || selectedTransaction.guest || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email/Phone</label>
                <p className="text-sm text-gray-900">{selectedTransaction.User?.email || selectedTransaction.guestPhone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                <p className="text-sm text-gray-900">{selectedTransaction.Booking?.Room?.type || selectedTransaction.roomType || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Nights</label>
                <p className="text-sm text-gray-900">{selectedTransaction.Booking?.nights || selectedTransaction.nights || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <p className="text-sm text-gray-900">{selectedTransaction.paymentMethod === 'cash' ? 'Pay at Hotel' : selectedTransaction.paymentMethod || selectedTransaction.method}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className={`text-sm font-medium ${selectedTransaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rs. {Math.abs(selectedTransaction.amount).toLocaleString()}
                </p>
              </div>
              {selectedTransaction.hotelerAmount && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hotelier Amount</label>
                  <p className="text-sm text-green-600 font-medium">
                    Rs. {selectedTransaction.hotelerAmount.toLocaleString()}
                  </p>
                </div>
              )}
              {selectedTransaction.adminCommission && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Commission</label>
                  <p className="text-sm text-gray-600">
                    Rs. {selectedTransaction.adminCommission.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HotelerPayments;