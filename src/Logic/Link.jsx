import { events } from "./Events";

export function navigate(href) {
    window.history.pushState({}, '', href);

    const navEvent = new Event(events.PUSHSTATE);
    window.dispatchEvent(navEvent);
}

export function Link({ target, to, ...props }){
    const handleCick = (event) => {
        const isMainEvent = event.button === 0;
        const isModifiedEvent = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
        const isManageableEvent = target === undefined || target === '_self';

        if (isMainEvent && isManageableEvent && !isModifiedEvent){
            event.preventDefault();
            navigate(to);
        }
    };

    return <a onClick={handleCick}  href={to} target={target} {...props}></a>
}