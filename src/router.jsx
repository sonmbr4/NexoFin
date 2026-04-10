import { match } from "path-to-regexp";
import { events } from "./Logic/Events";
import { useEffect, useState } from "react";

export function Router({
  routes = [],
  defaultComponent: DefaultComponent = () => (
    <h1>404 - Página no encontrada</h1>
  ),
}) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener(events.POPSTATE, onLocationChange);
    window.addEventListener(events.PUSHSTATE, onLocationChange);

    return () => {
      window.removeEventListener(events.POPSTATE, onLocationChange);
      window.removeEventListener(events.PUSHSTATE, onLocationChange);
    };
  }, []);

  let routeParams = {};

  const Page = routes.find(({ path }) => {
    if (path === currentPath) return true;
    const matcherUrl = match(path, { decode: decodeURIComponent });
    const matched = matcherUrl(currentPath);

    if (!matched) return false;
    routeParams = matched.params;
    return true;
  })?.Component;

  return Page ? (
    <Page params={routeParams} />
  ) : 
    <DefaultComponent routeParams={routeParams} />;
}
