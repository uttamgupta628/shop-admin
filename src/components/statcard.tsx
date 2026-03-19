// src/components/StatCard.tsx
import React from 'react';
import { 
  
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo';
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  footer?: React.ReactNode;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/50',
    iconBg: 'bg-green-500',
    iconColor: 'text-white',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-500 to-green-600'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/50',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500 to-red-600'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/50',
    iconBg: 'bg-yellow-500',
    iconColor: 'text-white',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-600 dark:text-yellow-400',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-purple-600'
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950/50',
    iconBg: 'bg-pink-500',
    iconColor: 'text-white',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-pink-600'
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconBg: 'bg-indigo-500',
    iconColor: 'text-white',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-indigo-600'
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color = 'blue',
  isLoading = false,
  onClick,
  className = '',
  footer
}) => {
  const colors = colorVariants[color];

  // Format large numbers
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
    }
    return val.toString();
  };

  // Get trend icon and color
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return trend.isPositive !== false ? 
        <ArrowUpRight className="w-4 h-4 text-green-500" /> : 
        <ArrowDownRight className="w-4 h-4 text-red-500" />;
    } else if (trend.value < 0) {
      return trend.isPositive !== false ? 
        <ArrowDownRight className="w-4 h-4 text-red-500" /> : 
        <ArrowUpRight className="w-4 h-4 text-green-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    
    if (trend.value > 0) {
      return trend.isPositive !== false ? 'text-green-500' : 'text-red-500';
    } else if (trend.value < 0) {
      return trend.isPositive !== false ? 'text-red-500' : 'text-green-500';
    }
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 animate-pulse ${className}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 
        p-6 transition-all duration-200 hover:shadow-md hover:border-${color}-200 
        dark:hover:border-${color}-800 ${onClick ? 'cursor-pointer' : ''} 
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatValue(value)}
            </h3>
            
            {trend && (
              <div className={`flex items-center gap-0.5 text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{Math.abs(trend.value)}%</span>
                {trend.label && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>

          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {description}
            </p>
          )}

          {footer && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {footer}
            </div>
          )}
        </div>

        <div className={`
          ${colors.iconBg} bg-gradient-to-br ${colors.gradient} 
          p-3 rounded-lg shadow-lg shadow-${color}-500/20
        `}>
          <div className={`w-5 h-5 ${colors.iconColor}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// Additional variant: Mini Stat Card
export const MiniStatCard: React.FC<StatCardProps> = (props) => {
  return (
    <StatCard {...props} className={`p-4 ${props.className || ''}`} />
  );
};

// Additional variant: Horizontal Stat Card
export const HorizontalStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'blue',
  className = ''
}) => {
  const colors = colorVariants[color];

  return (
    <div className={`
      bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 
      p-4 flex items-center gap-4 ${className}
    `}>
      <div className={`
        ${colors.iconBg} bg-gradient-to-br ${colors.gradient} 
        p-2 rounded-lg shadow-lg shadow-${color}-500/20
      `}>
        <div className={`w-4 h-4 ${colors.iconColor}`}>
          {icon}
        </div>
      </div>

      <div className="flex-1">
        <p className="text-xs text-gray-600 dark:text-gray-400">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{value}</span>
          {trend && (
            <span className={`text-xs ${trend.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};