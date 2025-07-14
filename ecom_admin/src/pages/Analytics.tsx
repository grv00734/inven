import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Package,
  Truck,
  DollarSign,
  Users
} from "lucide-react";

const forecastData = [
  { date: "Mon", demand: 45, actual: 42 },
  { date: "Tue", demand: 52, actual: 48 },
  { date: "Wed", demand: 38, actual: 41 },
  { date: "Thu", demand: 67, actual: null },
  { date: "Fri", demand: 71, actual: null },
  { date: "Sat", demand: 58, actual: null },
  { date: "Sun", demand: 43, actual: null },
];

const topProducts = [
  { name: "Wireless Headphones", sold: 124, trend: "up", change: "+12%" },
  { name: "Smartphone Case", sold: 98, trend: "up", change: "+8%" },
  { name: "Bluetooth Speaker", sold: 87, trend: "down", change: "-3%" },
  { name: "USB Cable", sold: 156, trend: "up", change: "+15%" },
  { name: "Laptop Stand", sold: 43, trend: "down", change: "-5%" },
];

const deliveryMetrics = [
  { metric: "On-time Delivery Rate", value: "94.5%", change: "+2.1%", trend: "up" },
  { metric: "Average Delivery Time", value: "2.3 hrs", change: "-0.2 hrs", trend: "up" },
  { metric: "Customer Satisfaction", value: "4.8/5", change: "+0.1", trend: "up" },
  { metric: "Failed Deliveries", value: "1.2%", change: "-0.3%", trend: "up" },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Data-driven insights for inventory management and delivery optimization
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$145,892</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders Processed</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% from last month
                </p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15.3% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold">94.5%</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.1% from last month
                </p>
              </div>
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Demand Forecast Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              7-Day Demand Forecast
            </CardTitle>
            <CardDescription>
              AI-powered demand prediction vs actual sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 p-4">
              {forecastData.map((day, index) => (
                <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex flex-col items-center gap-1 h-48 justify-end">
                    {/* Predicted demand bar */}
                    <div 
                      className="w-full bg-primary/30 rounded-t flex items-end justify-center"
                      style={{ height: `${(day.demand / 80) * 100}%` }}
                    >
                      <span className="text-xs text-muted-foreground mb-1">{day.demand}</span>
                    </div>
                    {/* Actual sales bar (if available) */}
                    {day.actual && (
                      <div 
                        className="w-3/4 bg-primary rounded-t flex items-end justify-center -mt-1"
                        style={{ height: `${(day.actual / 80) * 100}%` }}
                      >
                        <span className="text-xs text-primary-foreground mb-1">{day.actual}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium">{day.date}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/30 rounded"></div>
                <span>Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Actual</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
            <CardDescription>
              Best-selling items this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.sold} units sold</div>
                    </div>
                  </div>
                  <Badge 
                    className={product.trend === "up" ? "status-online" : "status-warning"}
                  >
                    <div className="flex items-center gap-1">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {product.change}
                    </div>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Performance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Performance Metrics
          </CardTitle>
          <CardDescription>
            Key performance indicators for delivery operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {deliveryMetrics.map((metric) => (
              <div key={metric.metric} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{metric.metric}</span>
                  <Badge 
                    className={metric.trend === "up" ? "status-online" : "status-warning"}
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ML Insights */}
      <Card className="shadow-card gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Machine learning recommendations for inventory optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-medium">Restock Recommendation</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Based on demand patterns, consider restocking:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Smartphone Cases: Order 50 units</li>
                <li>• Bluetooth Speakers: Order 25 units</li>
                <li>• USB Cables: Order 75 units</li>
              </ul>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Seasonal Forecast</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Predicted demand for next week:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Electronics: +15% increase expected</li>
                <li>• Accessories: Stable demand</li>
                <li>• Office supplies: +8% increase</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}