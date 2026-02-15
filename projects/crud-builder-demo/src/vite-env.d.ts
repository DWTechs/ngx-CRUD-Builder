/// <reference types="vite/client" />

// Declare module for markdown files imported with ?raw
declare module "*.md?raw" {
  const content: string;
  export default content;
}
