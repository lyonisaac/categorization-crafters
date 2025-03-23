import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Check, Clock, AlertTriangle, X } from 'lucide-react';
import { getStatusBadgeClass, getStatusDisplayText } from '@/utils/rule-sort-utils';

type StatusType = 'active' | 'inactive' | 'pending';

interface RuleStatusProps {
  status: StatusType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (status: 'active' | 'inactive') => void;
}

const statusConfig = {
  active: { 
    icon: Check, 
    description: 'This rule is active and processing transactions'
  },
  inactive: { 
    icon: AlertTriangle, 
    description: 'This rule is currently inactive'
  },
  pending: { 
    icon: Clock, 
    description: 'This rule is scheduled to activate soon'
  },
};

const RuleStatus: React.FC<RuleStatusProps> = ({ 
  status, 
  showLabel = false, 
  size = 'md', 
  interactive = false,
  onChange 
}) => {
  const { icon: StatusIcon, description } = statusConfig[status];
  const color = getStatusBadgeClass(status);
  const label = getStatusDisplayText(status);
  
  const sizeClasses = {
    sm: showLabel ? 'text-xs py-0 px-1.5' : 'h-4 w-4 p-0',
    md: showLabel ? 'text-xs py-0.5 px-2' : 'h-5 w-5 p-0',
    lg: showLabel ? 'text-sm py-1 px-2.5' : 'h-6 w-6 p-0',
  };
  
  if (interactive && onChange) {
    return (
      <div className="flex space-x-4 mt-1">
        <div 
          className={`cursor-pointer rounded-md px-4 py-2 flex items-center gap-2 transition-all ${
            status === 'active' 
              ? 'bg-app-success/20 border border-app-success/30' 
              : 'bg-white/40 border border-gray-200 hover:bg-white/60'
          }`}
          onClick={() => onChange('active')}
        >
          <Check size={16} className={status === 'active' ? 'text-app-success' : 'text-gray-400'} />
          <span className="font-body text-sm">Active</span>
        </div>
        <div 
          className={`cursor-pointer rounded-md px-4 py-2 flex items-center gap-2 transition-all ${
            status === 'inactive' 
              ? 'bg-app-warning/20 border border-app-warning/30' 
              : 'bg-white/40 border border-gray-200 hover:bg-white/60'
          }`}
          onClick={() => onChange('inactive')}
        >
          <X size={16} className={status === 'inactive' ? 'text-app-warning' : 'text-gray-400'} />
          <span className="font-body text-sm">Inactive</span>
        </div>
      </div>
    );
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          className={`font-fredoka ${color} ${sizeClasses[size]} flex items-center justify-center ${!showLabel ? 'rounded-full aspect-square' : 'gap-1'}`}
        >
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
