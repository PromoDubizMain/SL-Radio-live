import type { SVGProps } from 'react';

export function BizFMLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      data-ai-hint="radio logo"
    >
      <circle cx="50" cy="50" r="48" stroke="hsl(var(--primary-foreground))" strokeWidth="4" fill="hsl(var(--primary))" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="48"
        fontWeight="bold"
        fill="hsl(var(--primary-foreground))"
      >
        B
      </text>
    </svg>
  );
}
