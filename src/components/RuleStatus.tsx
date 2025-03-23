
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Check, Clock, AlertTriangle } from 'lucide-react';

type StatusType = 'active' | 'inactive' | 'pending';

interface RuleStatusProps {
  status: StatusType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  active: { 
    icon: Check, 
    color: 'bg-app-success/20 text-app-success border-app-success/30', 
    label: 'Active',
    description: 'This rule is active and processing transactions'
  },
  inactive: { 
    icon: AlertTriangle, 
    color: 'bg-app-warning/20 text-app-warning border-app-warning/30', 
    label: 'Inactive',
    description: 'This rule is currently inactive'
  },
  pending: { 
    icon: Clock, 
    color: 'bg-app-muted/20 text-app-muted border-app-muted/30', 
    label: 'Pending',
    description: 'This rule is scheduled to activate soon'
  },
};

const RuleStatus: React.FC<RuleStatusProps> = ({ status, showLabel = false, size = 'md' }) => {
  const { icon: StatusIcon, color, label, description } = statusConfig[status];
  
  const sizeClasses = {
    sm: 'text-xs py-0 px-1.5',
    md: 'text-xs py-0.5 px-2',
    lg: 'text-sm py-1 px-2.5',
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={`font-fredoka ${color} ${sizeClasses[size]} flex items-center gap-1`}>
          <StatusIcon size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />
          {showLabel && <span>{label}</span>}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RuleStatus;
