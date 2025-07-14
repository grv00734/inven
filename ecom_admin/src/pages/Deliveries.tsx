import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  User,
  Phone,
  Navigation,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  driver: string;
  status: "pending" | "picked-up" | "in-transit" | "delivered" | "failed";
  items: number;
  destination: string;
  estimatedTime: string;
  actualTime?: string;
  distance: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    orderId: "ORD-2024-001",
    customer: "Reliance Retail",
    driver: "Amit Sharma",
    status: "delivered",
    items: 5,
    destination: "123 MG Road, Bengaluru",
    estimatedTime: "2:30 PM",
    actualTime: "2:25 PM",
    distance: "3.2 km",
  },
  {
    id: "DEL-002",
    orderId: "ORD-2024-002",
    customer: "Tata Consultancy",
    driver: "Priya Singh",
    status: "in-transit",
    items: 12,
    destination: "456 IT Park, Hyderabad",
    estimatedTime: "4:15 PM",
    distance: "7.8 km",
  },
  {
    id: "DEL-003",
    orderId: "ORD-2024-003",
    customer: "Big Bazaar",
    driver: "Rahul Verma",
    status: "picked-up",
    items: 8,
    destination: "789 Market Street, Mumbai",
    estimatedTime: "5:45 PM",
    distance: "12.1 km",
  },
  {
    id: "DEL-004",
    orderId: "ORD-2024-004",
    customer: "Spencer's Retail",
    driver: "Neha Patel",
    status: "pending",
    items: 3,
    destination: "321 Mall Road, Delhi",
    estimatedTime: "6:30 PM",
    distance: "4.5 km",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500 text-white";
    case "in-transit":
      return "bg-yellow-500 text-white";
    case "picked-up":
      return "bg-blue-500 text-white";
    case "pending":
      return "bg-gray-400 text-white";
    case "failed":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <Package className="h-4 w-4" />;
    case "in-transit":
      return <Truck className="h-4 w-4" />;
    case "picked-up":
      return <Navigation className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function Deliveries() {
  const [deliveries] = useState<Delivery[]>(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Management</h1>
          <p className="text-muted-foreground">Track and manage all delivery operations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Deliveries" value={deliveries.length} icon={<Truck className="h-8 w-8 text-primary" />} />
        <StatCard label="In Transit" value={deliveries.filter(d => d.status === "in-transit").length} icon={<Navigation className="h-8 w-8 text-yellow-500" />} />
        <StatCard label="Delivered" value={deliveries.filter(d => d.status === "delivered").length} icon={<Package className="h-8 w-8 text-green-500" />} />
        <StatCard label="Pending" value={deliveries.filter(d => d.status === "pending").length} icon={<Clock className="h-8 w-8 text-gray-500" />} />
      </div>

      {/* Deliveries Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Active Deliveries
          </CardTitle>
          <CardDescription>Monitor all delivery operations in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id} className="hover:bg-muted/50 transition-base">
                    <TableCell className="font-mono text-sm">{delivery.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{delivery.customer}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {delivery.destination.split(",")[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {delivery.driver}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(delivery.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(delivery.status)}
                          {delivery.status.replace("-", " ")}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{delivery.items} items</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{delivery.estimatedTime}</span>
                        {delivery.actualTime && (
                          <span className="text-xs text-green-600">
                            Actual: {delivery.actualTime}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{delivery.distance}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDelivery(delivery)}
                          >
                            Track
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Delivery Tracking - {delivery.id}</DialogTitle>
                            <DialogDescription>
                              Real-time delivery information and GPS tracking
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Customer</Label>
                                <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Driver</Label>
                                <p className="text-sm text-muted-foreground">{delivery.driver}</p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">Destination</Label>
                              <p className="text-sm text-muted-foreground">{delivery.destination}</p>
                            </div>

                            {/* Mock GPS Map */}
                            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <p className="text-sm text-muted-foreground">Live GPS Tracking</p>
                                <p className="text-xs text-muted-foreground">Driver location updated 30s ago</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1">
                                <Phone className="h-4 w-4 mr-2" />
                                Call Driver
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <MapPin className="h-4 w-4 mr-2" />
                                View Route
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Basic Label component
function Label({
  className = "",
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
}

// Optional stat card component for cleaner JSX
function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="shadow-card gradient-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
