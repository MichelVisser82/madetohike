import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { RefreshCw, Download, Eye, EyeOff } from 'lucide-react';

export function LocalStorageRecovery() {
  const [storageData, setStorageData] = useState<{[key: string]: any}>({});
  const [showRawData, setShowRawData] = useState(false);

  const scanLocalStorage = () => {
    const data: {[key: string]: any} = {};
    
    // Scan for MadeToHike related data
    const keys = Object.keys(localStorage).filter(key => 
      key.includes('madetohike') || key.includes('guide') || key.includes('answers')
    );
    
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = {
            raw: value,
            parsed: JSON.parse(value),
            size: value.length,
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        data[key] = {
          raw: localStorage.getItem(key),
          error: error.message,
          size: localStorage.getItem(key)?.length || 0
        };
      }
    });
    
    setStorageData(data);
  };

  useEffect(() => {
    scanLocalStorage();
  }, []);

  const exportStorageData = () => {
    const exportData = {
      scanTime: new Date().toISOString(),
      storageData: storageData,
      allLocalStorageKeys: Object.keys(localStorage)
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `localStorage-recovery-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const restoreFromKey = (key: string) => {
    const data = storageData[key];
    if (data && data.parsed && Array.isArray(data.parsed)) {
      // This looks like it could be answers data
      console.log(`Attempting to restore from key: ${key}`, data.parsed);
      alert(`Found ${data.parsed.length} items in ${key}. Check console for details.`);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          localStorage Recovery Tool
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={scanLocalStorage}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Rescan
            </Button>
            <Button size="sm" variant="outline" onClick={exportStorageData}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowRawData(!showRawData)}
            >
              {showRawData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showRawData ? 'Hide Raw' : 'Show Raw'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Scanning localStorage for MadeToHike related data...
          </div>
          
          {Object.keys(storageData).length === 0 ? (
            <div className="text-center p-8 bg-amber-50 rounded-lg">
              <p className="text-amber-800">No MadeToHike data found in localStorage.</p>
              <p className="text-sm text-amber-600 mt-2">
                This could mean the data was never saved, cleared, or is stored under different keys.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-96 w-full">
              <div className="space-y-4">
                {Object.entries(storageData).map(([key, data]) => (
                  <Card key={key} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{key}</Badge>
                        <Badge variant="secondary">{data.size} chars</Badge>
                        {data.error && <Badge variant="destructive">Error</Badge>}
                      </div>
                      {data.parsed && Array.isArray(data.parsed) && (
                        <Button size="sm" variant="outline" onClick={() => restoreFromKey(key)}>
                          Inspect ({data.parsed.length} items)
                        </Button>
                      )}
                    </div>
                    
                    {data.error ? (
                      <div className="text-red-600 text-sm">{data.error}</div>
                    ) : (
                      <>
                        {data.parsed && typeof data.parsed === 'object' && (
                          <div className="bg-green-50 p-3 rounded text-sm">
                            <strong>Parsed Data:</strong>
                            {Array.isArray(data.parsed) ? (
                              <div>Array with {data.parsed.length} items</div>
                            ) : (
                              <div>Object with keys: {Object.keys(data.parsed).join(', ')}</div>
                            )}
                            
                            {showRawData && (
                              <Textarea 
                                value={JSON.stringify(data.parsed, null, 2)} 
                                readOnly 
                                className="mt-2 font-mono text-xs h-32"
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-blue-800 mb-2">Expected Storage Keys:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div><code>madetohike-guide-answers</code> - Your question answers</div>
              <div><code>madetohike-guide-state</code> - Current progress state</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-yellow-800 mb-2">Recovery Steps:</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Click "Rescan" to refresh the localStorage scan</li>
              <li>Look for keys containing "madetohike", "guide", or "answers"</li>
              <li>Use "Inspect" buttons to examine data in console</li>
              <li>Use "Export All" to save a backup of current localStorage</li>
              <li>Contact support with exported data if needed</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}