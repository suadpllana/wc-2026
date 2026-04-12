import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "../constants/worldCupData";

export default function AdUnit({ slot, format = "auto", style = {} }) {
  const ref = useRef(null);
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
    if (!enabled) return;

    try {
      if (ref.current && ref.current.offsetWidth > 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ad blockers can prevent ad rendering. sda
    }
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div ref={ref} className="w-full overflow-hidden rounded-lg" style={{ minHeight: 80, ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: 80 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
