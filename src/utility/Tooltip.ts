import Tooltip from '../components/generic/Tooltip.svelte';

export default function tooltip(element) {
    let title;
    let tooltipComponent;
    function mouseOver(event) {
        // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
        // remember to set it back on `mouseleave`
        title = element.getAttribute('title');
        element.removeAttribute('title');

        tooltipComponent = new Tooltip({
            props: {
                title: title,
                x: event.pageX,
                y: event.pageY,
            },
            target: document.body,
        });
    }
    function mouseMove(event) {
        tooltipComponent.$set({
            x: event.pageX,
            y: event.pageY,
        })
    }
    function mouseLeave() {
        tooltipComponent.$destroy();
        element.setAttribute('title', title);
    }

    element.addEventListener('mouseover', mouseOver, false);
    element.addEventListener('mouseleave', mouseLeave, false);
    element.addEventListener('mousemove', mouseMove, false);

    return {
        destroy() {
            element.removeEventListener('mouseover', mouseOver);
            element.removeEventListener('mouseleave', mouseLeave);
            element.removeEventListener('mousemove', mouseMove);
        }
    }
}