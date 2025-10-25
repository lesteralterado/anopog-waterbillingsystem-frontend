'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import useAuth from '@/hooks/useAuth';
// import client from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/Card';
// import { Button } from '@/app/components/ui/button';
import { Button } from '@/app/components/ui/Button';
import { Droplets, Users, DollarSign, Bell, TrendingUp, Calendar, CheckCircle, Clock, FileText, CreditCard } from 'lucide-react';
// import AdminSidebar from '@/app/components/AdminSidebar';

interface DashboardStats {
  totalConsumers: number;
  pendingBills: number;
  paidBills: number;
  totalRevenue: number;
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
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalConsumers: 0,
    pendingBills: 0,
    paidBills: 0,
    totalRevenue: 0
  });
  const [recentBills, setRecentBills] = useState<RecentBill[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

//   useEffect(() => {
//     if (!loading) {
//       // if (!user || !isAdmin) {
//       //   router.push('/');
//       //   return;
//       // }
//       fetchStats();
//       fetchRecentBookings();
//     }
//   }, [user, isAdmin, loading, router]);

//   const fetchRecentBookings = async () => {
//     try {
//       const { data, error } = await client
//         .from('bookings')
//         .select(`
//           id,
//           created_at,
//           status,
//           profiles!inner (
//             full_name
//           ),
//           cars!inner (
//             model,
//             make
//           )
//         `)
//         .order('created_at', { ascending: false })
//         .limit(5);

//       if (error) throw error;
//       setRecentBookings(data || []);
//     } catch (error) {
//       console.error('Error fetching recent bookings:', error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       // Get total bookings
//       const { count: totalBookings } = await client
//         .from('bookings')
//         .select('*', { count: 'exact', head: true });

//       // Get pending bookings
//       const { count: pendingBookings } = await client
//         .from('bookings')
//         .select('*', { count: 'exact', head: true })
//         .eq('status', 'pending');

//       // Get confirmed bookings
//       const { count: confirmedBookings } = await client
//         .from('bookings')
//         .select('*', { count: 'exact', head: true })
//         .eq('status', 'confirmed');

//       // Get total revenue from paid bookings
//       const { data: revenueData } = await client
//         .from('bookings')
//         .select('total_price')
//         .eq('payment_status', 'paid');

//       const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;

//       setStats({
//         totalBookings: totalBookings || 0,
//         pendingBookings: pendingBookings || 0,
//         confirmedBookings: confirmedBookings || 0,
//         totalRevenue
//       });
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoadingStats(false);
//     }
//   };


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

  // if (!isAdmin) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-lg text-red-500">Access denied. Admin privileges required.</div>
  //     </div>
  //   );
  // }

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
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱{stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  From paid bills
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
                <Button className="w-full">
                  <a href="/bills">Manage Bills</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
                <Button className="w-full" variant="outline">
                  <a href="/consumer">Manage Consumers</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
                <Button className="w-full" variant="outline">
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
