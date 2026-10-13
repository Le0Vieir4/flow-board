import { forwardRef } from 'react';
import { iconMap, type IconName, type IconProps } from './icon-map';

function createIcon(name: IconName) {
  const LucideIcon = iconMap[name];
  return forwardRef<SVGSVGElement, IconProps>(
    ({ size = 16, className, ...props }, ref) => (
      <LucideIcon
        ref={ref}
        size={size}
        className={className}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      />
    )
  );
}

export const Icons = Object.fromEntries(
  Object.keys(iconMap).map((key) => [key, createIcon(key as IconName)])
) as Record<IconName, React.ForwardRefExoticComponent<IconProps>>;