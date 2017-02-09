import { RoutesInterface } from '../interfaces/RoutesInterface';

// declare your custom routes
const declaration: Array<RoutesInterface> = [{
  route: '/welcome',
  controller: 'WelcomeController',
  function: 'index',
  method: 'all',
  is_public: true
}];

export const routes = { routes: declaration };
