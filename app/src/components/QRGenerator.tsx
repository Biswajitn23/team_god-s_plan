import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { GovernmentCard, GovernmentCardContent, GovernmentCardHeader, GovernmentCardTitle } from "./ui/government-card";
import { GovernmentButton } from "./ui/government-button";
import { Download, RefreshCw } from "lucide-react";

interface QRGeneratorProps {
  data: string;
  title?: string;
  batchId?: string;
  className?: string;
}

export const QRGenerator = ({ 
  data, 
  title = "QR Code", 
  batchId,
  className = "" 
}: QRGeneratorProps) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateQR = async () => {
    setIsLoading(true);
    try {
      const qrString = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        color: {
          dark: '#1f4e79', // Government blue
          light: '#FFFFFF'
        },
        width: 256
      });
      setQrCode(qrString);
    } catch (error) {
      console.error('QR code generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.download = `ayusetu-qr-${batchId || 'code'}.png`;
    link.href = qrCode;
    link.click();
  };

  useEffect(() => {
    if (data) {
      generateQR();
    }
  }, [data]);

  return (
    <GovernmentCard className={`${className} text-center`}>
      <GovernmentCardHeader>
        <GovernmentCardTitle className="flex items-center justify-between">
          {title}
          {batchId && (
            <span className="text-sm font-mono text-muted-foreground">
              #{batchId}
            </span>
          )}
        </GovernmentCardTitle>
      </GovernmentCardHeader>
      <GovernmentCardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : qrCode ? (
          <>
            <div className="flex justify-center">
              <img 
                src={qrCode} 
                alt="QR Code" 
                className="border-2 border-primary/20 rounded-lg shadow-lg"
              />
            </div>
            <div className="text-xs text-muted-foreground font-mono break-all p-2 bg-muted rounded">
              {data}
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data to generate QR code
          </div>
        )}
        
        <div className="flex gap-2 justify-center">
          <GovernmentButton
            variant="outline"
            size="sm"
            onClick={generateQR}
            disabled={!data || isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            पुनः जेनरेट / Regenerate
          </GovernmentButton>
          <GovernmentButton
            variant="success"
            size="sm"
            onClick={downloadQR}
            disabled={!qrCode}
          >
            <Download className="h-4 w-4 mr-2" />
            डाउनलोड / Download
          </GovernmentButton>
        </div>
      </GovernmentCardContent>
    </GovernmentCard>
  );
};