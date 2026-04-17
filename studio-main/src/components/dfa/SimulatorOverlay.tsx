import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessingStep } from '@/lib/dfa-types';

interface SimulatorOverlayProps {
  inputString: string;
  onInputChange: (val: string) => void;
  currentStep: ProcessingStep | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onExplain: () => void;
  isAccepted: boolean | null;
  isProcessing: boolean;
}

export function SimulatorOverlay({
  inputString,
  onInputChange,
  currentStep,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onExplain,
  isAccepted,
  isProcessing
}: SimulatorOverlayProps) {
  const pathString = currentStep?.path.join(' → ') || 'No path';
  const remaining = currentStep?.remainingString || inputString;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 pointer-events-none">
      <Card className="pointer-events-auto bg-sidebar/95 backdrop-blur-md border-primary/30 shadow-2xl overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <Input
                placeholder="Enter test string (e.g. ababba)"
                value={inputString}
                onChange={(e) => onInputChange(e.target.value)}
                className="bg-background border-border text-lg font-code pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isAccepted === true && (
                  <div className="flex items-center text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ACCEPTED
                  </div>
                )}
                {isAccepted === false && (
                  <div className="flex items-center text-destructive text-xs font-bold bg-destructive/10 px-2 py-1 rounded border border-destructive/20">
                    <AlertCircle className="w-3 h-3 mr-1" /> REJECTED
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={onReset} title="Reset Simulation" className="border-border hover:text-primary">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onStepBackward} disabled={!currentStep || currentStep.stepIndex === 0} title="Step Backward" className="border-border hover:text-primary">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                variant={isPlaying ? "destructive" : "default"} 
                size="icon" 
                onClick={onTogglePlay}
                title={isPlaying ? "Pause" : "Play"}
                className={cn(!isPlaying && "bg-primary text-primary-foreground hover:bg-primary/90")}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              <Button variant="outline" size="icon" onClick={onStepForward} disabled={remaining.length === 0} title="Step Forward" className="border-border hover:text-primary">
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button 
                onClick={onExplain} 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold"
                disabled={isProcessing}
              >
                <Info className="w-4 h-4 mr-2" /> Trace Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-background/50 rounded-lg p-3 border border-border/50">
              <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">String Progress</span>
              <div className="font-code text-xl tracking-widest flex items-center">
                <span className="text-primary opacity-50">{inputString.slice(0, currentStep?.stepIndex || 0)}</span>
                <span className="text-primary underline decoration-2 underline-offset-4 animate-pulse">{inputString[currentStep?.stepIndex || 0] || ''}</span>
                <span className="text-foreground">{inputString.slice((currentStep?.stepIndex || 0) + 1)}</span>
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 border border-border/50">
              <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">State Path</span>
              <div className="font-code text-sm truncate text-secondary">
                {pathString}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
