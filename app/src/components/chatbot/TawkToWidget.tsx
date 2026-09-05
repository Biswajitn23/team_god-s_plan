import { useEffect } from 'react';

interface TawkToWidgetProps {
  propertyId?: string;
  widgetId?: string;
}

export const TawkToWidget: React.FC<TawkToWidgetProps> = ({
  propertyId = "YOUR_PROPERTY_ID", // You'll need to replace this with your actual property ID
  widgetId = "YOUR_WIDGET_ID"      // You'll need to replace this with your actual widget ID
}) => {
  useEffect(() => {
    // Check if Tawk_API is already loaded
    if (typeof window !== 'undefined' && !(window as any).Tawk_API) {
      // Set up Tawk_API
      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();

      // Create and append the script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }

      // Customize the widget
      (window as any).Tawk_API.onLoad = function() {
        console.log('Tawk.to widget loaded successfully');
        
        // Set widget position (bottom-right by default)
        (window as any).Tawk_API.setAttributes({
          name: 'AyuSetu User',
          hash: 'ayusetu-hash'
        });
      };

      // Handle when chat is minimized/maximized
      (window as any).Tawk_API.onChatMinimized = function() {
        console.log('Chat minimized');
      };

      (window as any).Tawk_API.onChatMaximized = function() {
        console.log('Chat maximized');
      };
    }

    return () => {
      // Cleanup if needed
      if (typeof window !== 'undefined' && (window as any).Tawk_API) {
        // Remove the widget when component unmounts
        try {
          (window as any).Tawk_API.hideWidget();
        } catch (error) {
          console.log('Error hiding Tawk.to widget:', error);
        }
      }
    };
  }, [propertyId, widgetId]);

  return null; // This component doesn't render anything visible
};

export default TawkToWidget;