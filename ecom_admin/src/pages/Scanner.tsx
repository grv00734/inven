import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Camera,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QrReader } from "@blackbox-vision/react-qr-reader"; // ✅ modern QR scanner

interface ScanResult {
  id: string;
  deliveryId: string;
  customer: string;
  address: string;
  status: "success" | "failed";
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const mockScanHistory: ScanResult[] = [
  {
    id: "1",
    deliveryId: "DEL-001",
    customer: "Reliance Retail",
    address: "123 MG Road, Bengaluru",
    status: "success",
    timestamp: "2024-01-15 14:25:30",
  },
  {
    id: "2",
    deliveryId: "DEL-002",
    customer: "Tata Consultancy",
    address: "456 IT Park, Hyderabad",
    status: "failed",
    timestamp: "2024-01-15 13:45:15",
  },
];

export default function Scanner() {
  const [qrInput, setQrInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(mockScanHistory);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const { toast } = useToast();

  const handleScan = () => {
    if (!qrInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a QR code or delivery ID",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      const isLocationValid = Math.random() > 0.3; // Simulate 70% success

      const newScan: ScanResult = {
        id: Date.now().toString(),
        deliveryId: qrInput,
        customer: "Sample Customer",
        address: "Sample Address",
        status: isLocationValid ? "success" : "failed",
        timestamp: new Date().toLocaleString(),
        location: currentLocation || undefined,
      };

      setScanHistory([newScan, ...scanHistory]);
      setQrInput("");
      setIsScanning(false);

      toast({
        title: isLocationValid ? "Delivery Verified" : "Verification Failed",
        description: isLocationValid
          ? "Package delivery has been confirmed"
          : "Location verification failed - outside delivery radius",
        variant: isLocationValid ? "default" : "destructive",
      });
    }, 2000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location Acquired",
            description: "GPS coordinates captured successfully",
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to get current location",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };

  const handleQrScan = (text: string) => {
    if (text) {
      setQrInput(text);
      setShowQrScanner(false);
      toast({
        title: "QR Code Scanned",
        description: `Scanned: ${text}`,
      });
    }
  };

  const handleQrError = (error: any) => {
    toast({
      title: "QR Scan Error",
      description: "Could not access camera or scan QR code",
      variant: "destructive",
    });
    setShowQrScanner(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">QR Scanner</h1>
        <p className="text-muted-foreground">
          Scan delivery QR codes to verify package delivery locations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scanner Interface */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Delivery Verification
            </CardTitle>
            <CardDescription>
              Scan QR code or manually enter delivery ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery ID / QR Code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter delivery ID or scan QR code"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  disabled={isScanning}
                />
                <Button
                  variant="outline"
                  className="px-3"
                  onClick={() => setShowQrScanner((v) => !v)}
                  type="button"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              {showQrScanner && (
                <div className="mt-2 rounded border p-2 bg-muted">
                  <QrReader
                    onResult={(result, error) => {
                      if (result?.text) handleQrScan(result.text);
                      if (error) handleQrError(error);
                    }}
                    constraints={{ facingMode: "environment" }}
                    style={{ width: "100%" }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowQrScanner(false)}
                  >
                    Close Scanner
                  </Button>
                </div>
              )}
            </div>

            {/* Location Display */}
            <div className="space-y-2">
              <label className="text-sm font-medium">GPS Location</label>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {currentLocation
                      ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`
                      : "Location not acquired"}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={getCurrentLocation}>
                  Get Location
                </Button>
              </div>
            </div>

            {/* Verify Button */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleScan}
                disabled={isScanning || !qrInput.trim()}
                className="flex-1 gradient-primary"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Verify Delivery
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera Preview Placeholder */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Preview
            </CardTitle>
            <CardDescription>
              Point camera at QR code for automatic scanning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Camera preview would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan History */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scan History
          </CardTitle>
          <CardDescription>
            Recent delivery verification attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-base"
              >
                <div className="flex items-center gap-3">
                  {scan.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{scan.deliveryId}</span>
                      <Badge
                        className={
                          scan.status === "success"
                            ? "status-online"
                            : "bg-destructive text-destructive-foreground"
                        }
                      >
                        {scan.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {scan.customer}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {scan.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{scan.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
