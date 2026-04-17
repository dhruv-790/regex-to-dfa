import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DfaState, DfaTransition } from '@/lib/dfa-types';
import { Plus, Trash2, Settings2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DfaEditorProps {
  states: DfaState[];
  transitions: DfaTransition[];
  onAddState: (state: DfaState) => void;
  onAddTransition: (transition: DfaTransition) => void;
  onDeleteState: (id: string) => void;
  onDeleteTransition: (transition: DfaTransition) => void;
  onRegexConvert: (regex: string) => void;
}

export function DfaEditor({ 
  states, 
  transitions, 
  onAddState, 
  onAddTransition, 
  onDeleteState, 
  onDeleteTransition,
  onRegexConvert
}: DfaEditorProps) {
  const [regex, setRegex] = useState('(a|b)*abb');
  const [newStateLabel, setNewStateLabel] = useState('');
  const [newStateId, setNewStateId] = useState('');
  const [newStateType, setNewStateType] = useState<DfaState['type']>('normal');

  const [tSource, setTSource] = useState('');
  const [tTarget, setTTarget] = useState('');
  const [tSymbol, setTSymbol] = useState('');

  const handleAddState = () => {
    if (!newStateId) return;
    onAddState({
      id: newStateId,
      label: newStateLabel || newStateId,
      type: newStateType
    });
    setNewStateId('');
    setNewStateLabel('');
  };

  const handleAddTransition = () => {
    if (!tSource || !tTarget || tSymbol.length !== 1) return;
    onAddTransition({ source: tSource, target: tTarget, symbol: tSymbol });
    setTSymbol('');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm h-full overflow-y-auto p-4 bg-sidebar border-r border-border custom-scrollbar">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-headline font-bold text-primary">DFA Definition</h2>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Regex to DFA</h3>
          <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
        </div>
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="regex">Regular Expression</Label>
              <Input 
                id="regex" 
                placeholder="(a|b)*abb" 
                value={regex} 
                onChange={e => setRegex(e.target.value)}
                className="font-code text-secondary"
              />
              <p className="text-[10px] text-muted-foreground">Supported: a, b, |, *, +, ?, ( )</p>
            </div>
            <Button 
              className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold" 
              onClick={() => onRegexConvert(regex)}
            >
              Generate DFA
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator className="bg-border" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Manual States</h3>
        <Card className="bg-background/50 border-border">
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="sid">ID (e.g. q0)</Label>
                <Input id="sid" placeholder="q0" value={newStateId} onChange={e => setNewStateId(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sl">Label</Label>
                <Input id="sl" placeholder="Start" value={newStateLabel} onChange={e => setNewStateLabel(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={newStateType} onValueChange={(v: any) => setNewStateType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="initial_final">Initial & Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground" onClick={handleAddState}>
              <Plus className="w-4 h-4 mr-2" /> Add State
            </Button>
          </CardContent>
        </Card>

        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
          {states.map(s => (
            <div key={s.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50 group">
              <div className="flex flex-col w-full">
                <span className="font-medium text-sm">{s.label || s.id}</span>
                <span className="text-[10px] uppercase text-muted-foreground font-bold">{s.type.replace('_', ' & ')}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDeleteState(s.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transitions</h3>
        <Card className="bg-background/50 border-border">
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>From</Label>
                <Select value={tSource} onValueChange={setTSource}>
                  <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                  <SelectContent>
                    {states.map(s => <SelectItem key={s.id} value={s.id}>{s.id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>To</Label>
                <Select value={tTarget} onValueChange={setTTarget}>
                  <SelectTrigger><SelectValue placeholder="Target" /></SelectTrigger>
                  <SelectContent>
                    {states.map(s => <SelectItem key={s.id} value={s.id}>{s.id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ts">Symbol (a or b)</Label>
              <Input id="ts" maxLength={1} placeholder="a" value={tSymbol} onChange={e => setTSymbol(e.target.value.toLowerCase())} />
            </div>
            <Button className="w-full bg-accent hover:bg-accent/80 text-white" onClick={handleAddTransition}>
              <Plus className="w-4 h-4 mr-2" /> Add Transition
            </Button>
          </CardContent>
        </Card>

        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
          {transitions.map((t, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50 group">
              <span className="text-sm font-code">
                {t.source} <span className="text-primary mx-1">-- {t.symbol} --&gt;</span> {t.target}
              </span>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDeleteTransition(t)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
