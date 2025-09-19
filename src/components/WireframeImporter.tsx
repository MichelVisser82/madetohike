import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface WireframeImporterProps {
  onImport: (decisions: any) => void;
  onClose: () => void;
}

export function WireframeImporter({ onImport, onClose }: WireframeImporterProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    setError('');
    
    if (!value.trim()) {
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      if (parsed.answers || parsed.wireframeAnswers) {
        setIsValid(true);
      } else {
        setError('Invalid format: Expected wireframe answers data');
        setIsValid(false);
      }
    } catch (e) {
      setError('Invalid JSON format');
      setIsValid(false);
    }
  };

  const handleImport = () => {
    try {
      const decisions = JSON.parse(jsonInput);
      onImport(decisions);
    } catch (e) {
      setError('Failed to parse JSON');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleInputChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Wireframe Decisions
          </CardTitle>
          <p className="text-muted-foreground">
            Upload your wireframe decisions JSON file or paste the content to customize the marketplace according to your planning.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload JSON File</label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload your wireframe decisions JSON file
                </span>
              </label>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">OR</div>

          {/* Manual Paste */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste JSON Content</label>
            <Textarea
              value={jsonInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Paste your wireframe decisions JSON content here..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isValid && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Valid wireframe decisions detected! Ready to import.
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Expected Format:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Your JSON file should contain wireframe answers with decisions about:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Landing page design and CTAs</li>
                <li>• Search and filtering preferences</li>
                <li>• Booking flow and payment structure</li>
                <li>• User dashboard and guide features</li>
                <li>• Trust and safety requirements</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!isValid}
            >
              Import Decisions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}