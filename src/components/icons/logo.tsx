import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 30"
      width="120"
      height="30"
      {...props}
    >
      <text
        x="0"
        y="22"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(var(--sidebar-foreground))"
      >
        SEO Content Forge
      </text>
    </svg>
  );
}
