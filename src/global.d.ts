// .d.ts
declare module '@elastic/eui/es/components/icon/assets/*' {
  import * as React from 'react'
  import type { SVGProps } from 'react'
  interface SVGRProps {
    title?: string
    titleId?: string
  }
  export const icon: ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => React.JSX.Element
  export {}
}
