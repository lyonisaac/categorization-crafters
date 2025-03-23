
import React from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Check, Clock } from 'lucide-react';

interface RulePreviewProps {
  rule: {
    id: string;
    name: string;
    criteria: string;
    actions: string;
    lastModified: string;
    status?: 'active' | 'inactive' | 'pending';
  };
  children: React.ReactNode;
}

const statusConfig = {
  active: { icon: Check, color: 'text-app-success', label: 'Active' },
  inactive: { icon: Clock, color: 'text-app-warning', label: 'Inactive' },
  pending: { icon: Clock, color: 'text-app-muted', label: 'Pending Activation' },
};

const HoverCardPreview: React.FC<RulePreviewProps> = ({ rule, children }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const status = rule.status || 'active';
  const StatusIcon = statusConfig[status].icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 glass-card border border-white/30 shadow-md p-0">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-fredoka font-medium">{rule.name}</h4>
              <div className={`flex items-center gap-1 text-xs ${statusConfig[status].color}`}>
                <StatusIcon size={14} />
                <span>{statusConfig[status].label}</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Info size={12} /> Criteria
                </div>
                <p className="text-foreground">{rule.criteria}</p>
              </div>
              
              <div>
                <div className="font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Info size={12} /> Actions
                </div>
                <p className="text-foreground">{rule.actions}</p>
              </div>
              
              <div className="pt-1 text-xs text-muted-foreground">
                Last modified: {formatDate(rule.lastModified)}
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardPreview;
