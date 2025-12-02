'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import useAuth from '@/hooks/useAuth';
// import client from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/Card';
// import { Button } from '@/app/components/ui/button';
import { Button } from '@/app/components/ui/Button';
import { Users, DollarSign, TrendingUp, CheckCircle, Clock, FileText, CreditCard } from 'lucide-react';
// import AdminSidebar from '@/app/components/AdminSidebar';
import { ChartLineDefault as ChartLine } from '@/app/components/dashboard/chart-line';
import { usersAPI, paymentsAPI, billsAPI, dashboardAPI } from '@/lib/api';

interface DashboardStats {
  totalConsumers: number;
  pendingBills: number;
  paidBills: number;
  monthlyRevenue: number;
}

interface RecentBill {
  id: string;
  created_at: string;
  status: string;
  consumers: {
    full_name: string;
  }[];
  bills: {
    amount: number;
    due_date: string;
  }[];
}

export default function WaterBillingDashboard() {
 //   const { user, profile, loading, isAdmin } = useAuth();
   const [stats, setStats] = useState<DashboardStats>({
     totalConsumers: 0,
     pendingBills: 0,
     paidBills: 0,
     monthlyRevenue: 0
   });
   const [recentBills, setRecentBills] = useState<RecentBill[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadConsumers = async () => {
      try {
        setLoadingStats(true);
        const res = await usersAPI.getConsumers();
        const consumers = res?.data ?? [];
        const count = Array.isArray(consumers) ? consumers.length : 0;
        setStats((prev) => ({ ...prev, totalConsumers: count }));
      } catch (err) {
        console.error('Failed to load consumers:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    const loadDashboardStats = async () => {
      try {
        const res = await dashboardAPI.getBillStats();
        const data = res.data ?? {};

        setStats((prev) => ({
          ...prev,
          pendingBills: data.pendingBills ?? 0,
          paidBills: data.paidBills ?? 0,
          monthlyRevenue: data.monthlyRevenue ?? 0
        }));
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        // Fallback to manual calculation if endpoint fails
        try {
          let pendingBills = 0;
          let paidBills = 0;
          const billsRes = await billsAPI.getAll();
          const bills = billsRes?.data ?? [];
          const billsArray = Array.isArray(bills) ? bills : [];
          pendingBills = billsArray.filter((bill: any) => bill.status === 'pending').length;
          paidBills = billsArray.filter((bill: any) => bill.status === 'paid').length;

          let monthlyRevenue = 0;
          const paymentsRes = await paymentsAPI.getAll();
          const payments = paymentsRes?.data ?? [];
          const paymentsArray = Array.isArray(payments) ? payments : [];
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          monthlyRevenue = paymentsArray
            .filter((payment: any) => {
              const paymentDate = new Date(payment.created_at || payment.date);
              return paymentDate.getMonth() === currentMonth &&
                     paymentDate.getFullYear() === currentYear;
            })
            .reduce((total: number, payment: any) => total + (payment.amount || 0), 0);

          setStats((prev) => ({
            ...prev,
            pendingBills,
            paidBills,
            monthlyRevenue
          }));
        } catch (fallbackErr) {
          console.error('Fallback calculation also failed:', fallbackErr);
        }
      }
    };

    loadConsumers();
    loadDashboardStats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <AdminSidebar /> */}

      <div className="flex-1">
        <div className="p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Water Billing Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your water billing system efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Real-time notifications can be added here later */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consumers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalConsumers}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingBills}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.paidBills}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱{stats.monthlyRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <ChartLine />
            {/* <ChartAreaInteractive /> */}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Bill Management
                </CardTitle>
                <CardDescription>
                  Create and manage water bills for consumers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="cursor-pointer hover:shadow-lg w-full">
                  <Link href="/bills">Manage Bills</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Consumer Management
                </CardTitle>
                <CardDescription>
                  Add, edit, and manage consumer accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="cursor-pointer hover:shadow-lg w-full" variant="outline">
                  <Link href="/consumer">Manage Consumers</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Management
                </CardTitle>
                <CardDescription>
                  Process payments and manage transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="cursor-pointer hover:shadow-lg w-full" variant="outline">
                  <a href="/payments">Manage Payments</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bills</CardTitle>
              <CardDescription>Latest billing activity and consumer payments</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="text-center py-8">Loading recent bills...</div>
              ) : (
                <div className="space-y-4">
                  {recentBills.map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">
                            ₱{bill.bills?.[0]?.amount} - {bill.consumers?.[0]?.full_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(bill.bills?.[0]?.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                          bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentBills.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No recent bills
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
