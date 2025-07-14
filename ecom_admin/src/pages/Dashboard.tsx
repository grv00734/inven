import {
  Package,
  Truck,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statsData = [
  {
    title: "Total Inventory",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Package,
    description: "Items in stock",
  },
  {
    title: "Active Deliveries",
    value: "23",
    change: "+2",
    changeType: "positive" as const,
    icon: Truck,
    description: "In transit",
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "-3",
    changeType: "negative" as const,
    icon: AlertTriangle,
    description: "Need restock",
  },
  {
    title: "Revenue Today",
    value: "₹12,847",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs yesterday",
  },
];

const recentDeliveries = [
  { id: "D001", customer: "Reliance Retail", status: "delivered", time: "2 hours ago" },
  { id: "D002", customer: "Tata Consultancy", status: "in-transit", time: "4 hours ago" },
  { id: "D003", customer: "Big Bazaar", status: "pending", time: "6 hours ago" },
  { id: "D004", customer: "Metro Foods", status: "delivered", time: "1 day ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of inventory, deliveries, and analytics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="shadow-card gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-xs mt-1 ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change} <span className="text-muted-foreground">{stat.description}</span>
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage inventory and deliveries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-4 rounded-lg border border-border hover:bg-accent transition-base text-left">
              <Package className="h-5 w-5 mb-2 text-primary" />
              <div className="text-sm font-medium">Add Product</div>
              <div className="text-xs text-muted-foreground">Stock new items</div>
            </button>
            <button className="p-4 rounded-lg border border-border hover:bg-accent transition-base text-left">
              <Truck className="h-5 w-5 mb-2 text-primary" />
              <div className="text-sm font-medium">Track Delivery</div>
              <div className="text-xs text-muted-foreground">Monitor shipments</div>
            </button>
            <button
              className="p-4 rounded-lg border border-border hover:bg-accent transition-base text-left"
              onClick={() =>
                window.open(
                  "https://forecasting-engine-rebalancer-predictive-alerts.streamlit.app/",
                  "_blank"
                )
              }
            >
              <BarChart3 className="h-5 w-5 mb-2 text-primary" />
              <div className="text-sm font-medium">View Reports</div>
              <div className="text-xs text-muted-foreground">Analytics & insights</div>
            </button>
            <button className="p-4 rounded-lg border border-border hover:bg-accent transition-base text-left">
              <Users className="h-5 w-5 mb-2 text-primary" />
              <div className="text-sm font-medium">Manage Team</div>
              <div className="text-xs text-muted-foreground">User access</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
          <CardDescription>Latest delivery updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {recentDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <div className="font-medium">{delivery.customer}</div>
                  <div className="text-xs text-muted-foreground">
                    {delivery.status} • {delivery.time}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}