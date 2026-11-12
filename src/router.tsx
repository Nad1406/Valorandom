import type { RouteObject } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SingleRandomPage } from '@/pages/SingleRandomPage';
import { SquadRandomPage } from '@/pages/SquadRandomPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PageShell />,
    children: [
      {
        index: true,
        element: <SingleRandomPage />,
      },
      {
        path: 'squad',
        element: <SquadRandomPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createHashRouter(routes);
