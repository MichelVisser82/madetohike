import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download, Eye, EyeOff } from "lucide-react";

interface Answer {
  questionId: string;
  answer: string;
  timestamp: number;
}

interface AnswerData {
  answers: Answer[];
  completedAt: number;
}

export function AnswerDisplay() {
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Try to load answers from localStorage
    const storedAnswers = localStorage.getItem('madetohike-answers');
    if (storedAnswers) {
      try {
        const parsed = JSON.parse(storedAnswers);
        setAnswerData(parsed);
      } catch (error) {
        console.error('Error parsing stored answers:', error);
      }
    }
  }, []);

  const downloadAnswers = () => {
    if (!answerData) return;
    
    const dataStr = JSON.stringify(answerData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `madetohike-wireframe-answers-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!answerData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Answers Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No completed answers were found in browser storage. Please complete the Interactive Guide first.
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedDate = new Date(answerData.completedAt).toLocaleDateString();
  const answerCount = answerData.answers.length;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Planning Summary</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAnswers}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{answerCount}</div>
              <div className="text-sm text-muted-foreground">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">27</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((answerCount / 27) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{completedDate}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Answers */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Your Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {answerData.answers.map((answer, index) => (
                <div key={answer.questionId} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      Question {index + 1}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(answer.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-1">{answer.questionId}</div>
                  <div className="text-sm text-muted-foreground">
                    {answer.answer.length > 200 
                      ? `${answer.answer.substring(0, 200)}...` 
                      : answer.answer
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Ready for Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your wireframe planning is complete! You can now proceed to the Implementation Guide 
            to make technical and strategic decisions about building your marketplace.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => {
              const implementationTab = document.querySelector('[value="implementation"]') as HTMLElement;
              implementationTab?.click();
            }}>
              Start Implementation Planning
            </Button>
            <Button variant="outline" onClick={downloadAnswers}>
              Download Your Answers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}