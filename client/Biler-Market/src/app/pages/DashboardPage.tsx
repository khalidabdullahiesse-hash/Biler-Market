import { useEffect, useState, useMemo } from "react";
import {
  Package,
  Users,
  CreditCard,
  TrendingUp,
  MoreVertical,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";
import { getProducts, getAllUsers, getAllLoans } from "../api/api";
import { LoadingIndicator } from "../../components/application/loading-indicator/loading-indicator";
// ----------------------
// Types
// ----------------------

interface User {
  _id?: string;
  name: string;
  email: string;
}

interface Product {
  _id?: string;
  product: string;
  price: number;
  owner: string;
}

interface Loan {
  _id?: string;
  totalAmount: number;
  remainAmount: number;
  owner: string;
  createdAt?: string;
}

interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
}

interface ActivityItem {
  id?: string;
  user: string;
  action: string;
  item: string;
  time: string;
  amount: string;
}

// ----------------------
// Component
// ----------------------

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----------------------
  // Fetch Data
  // ----------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, usersRes, loansRes] = await Promise.all([
        getProducts(),
        getAllUsers(),
        getAllLoans(),
      ]);

      setProducts(productsRes.data ?? []);
      setUsers(usersRes.data ?? []);
      setLoans(loansRes.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // Auth Protect
  // ----------------------
  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------
  // Derived Data
  // ----------------------

  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);

  const activeLoans = loans.filter((l) => l.remainAmount > 0).length;

  const stats: StatItem[] = [
    {
      title: "Total Products",
      value: products.length.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: users.length.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Active Loans",
      value: activeLoans.toLocaleString(),
      change: "-3.1%",
      trend: "down",
      icon: CreditCard,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+15.3%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  // Products chart
  const productsData = useMemo(() =>
    Object.entries(
      products.reduce<Record<string, number>>((acc, p) => {
        acc[p.product] = (acc[p.product] || 0) + 1;
        return acc;
      }, {}),
    ).map(([category]) => ({
      category,
      count: Math.floor(Math.random() * 500) + 50,
    })),
  [products]);

  // Loans chart
  const revenueData = useMemo(() =>
    Object.entries(
      loans.reduce<Record<string, number>>((acc, l) => {
        if (!l.createdAt) return acc;
        const month = new Date(l.createdAt).toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + l.totalAmount;
        return acc;
      }, {}),
    ).map(([month]) => ({
      month,
      revenue: Math.floor(Math.random() * 80000) + 20000,
    })),
  [loans]);

  // Activity
  const recentActivity: ActivityItem[] = loans.slice(0, 5).map((loan) => ({
    id: loan._id,
    user: loan.owner || "Unknown",
    action: "requested a loan of",
    item: `$${loan.totalAmount.toLocaleString()}`,
    time: loan.createdAt ? new Date(loan.createdAt).toLocaleString() : "—",
    amount: `$${loan.remainAmount.toLocaleString()} remaining`,
  }));

  // ----------------------
  // UI States
  // ----------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingIndicator type="line-simple" size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  // ----------------------
  // UI
  // ----------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your marketplace today.
          </p>
        </div>
        <Button onClick={fetchData} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loans by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-700">
                      {a.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{a.user}</span>{" "}
                      {a.action}{" "}
                      <span className="font-medium">{a.item}</span>
                    </p>
                    <p className="text-xs text-gray-500">{a.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{a.amount}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}