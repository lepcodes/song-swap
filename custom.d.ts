declare module '*.svg' {
  import * as React from 'react'; // <-- The modern ES Module syntax
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}