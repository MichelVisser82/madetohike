import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface WireframeSectionProps {
  title: string;
  description: string;
  questions: string[];
  considerations: string[];
  userType?: 'guide' | 'hiker' | 'both';
  children?: React.ReactNode;
}

export function WireframeSection({ 
  title, 
  description, 
  questions, 
  considerations, 
  userType = 'both',
  children 
}: WireframeSectionProps) {
  const getUserTypeBadge = () => {
    if (userType === 'guide') return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Guide Flow</Badge>;
    if (userType === 'hiker') return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Hiker Flow</Badge>;
    return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Both Users</Badge>;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <CardTitle>{title}</CardTitle>
          {getUserTypeBadge()}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {children}
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="mb-2 text-green-700">Key Questions to Consider:</h4>
            <ul className="space-y-1 text-sm">
              {questions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="mb-2 text-blue-700">Technical Considerations:</h4>
            <ul className="space-y-1 text-sm">
              {considerations.map((consideration, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{consideration}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}