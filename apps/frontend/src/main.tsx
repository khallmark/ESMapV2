import { createRoot } from 'react-dom/client';
import { RemixBrowser } from '@remix-run/react';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<RemixBrowser />);