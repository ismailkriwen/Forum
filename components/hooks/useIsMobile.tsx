"use client";

import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const parser = new UAParser();
    const userAgent = window.navigator.userAgent;
    const result = parser.setUA(userAgent).getResult();
    const isMobileDevice = /mobile/i.test(result.device.type!);
    setIsMobile(isMobileDevice);
  }, []);

  return isMobile;
};
