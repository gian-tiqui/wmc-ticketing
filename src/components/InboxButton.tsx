import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

const InboxButton = () => {
  const overlayPanelRef = useRef<OverlayPanel>(null);

  return (
    <>
      <Button
        icon={`${PrimeIcons.INBOX}`}
        className="w-9 h-9"
        onClick={(e) => overlayPanelRef.current?.toggle(e)}
      ></Button>
      <OverlayPanel
        ref={overlayPanelRef}
        className="w-72 h-96 bg-slate-800"
      ></OverlayPanel>
    </>
  );
};

export default InboxButton;
