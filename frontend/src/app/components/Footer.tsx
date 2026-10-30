import React from 'react';
import { Icon } from './Icon';

export function Footer() {
  return (
    <footer className="pt-2 pb-6 border-t border-[#bfc7d2]/30 flex flex-col md:flex-row items-center justify-between text-[#3f4850] text-[10px] gap-4">
      <div className="flex items-center gap-2 text-[#131b2e]">
        <Icon name="check_circle" className="text-[#006194] text-base" />
        <span>
          <strong>Ingat!</strong> Sistem ini hanya memberikan klasifikasi citra medis, bukan diagnosis final GERD definitif.
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-[#3f4850]">
        <span>Kepatuhan: Lyon Consensus 2.0</span>
        <span>•</span>
        <span>HL7 FHIR Interoperability</span>
        <span>•</span>
        <span>PHI De-identification Valid</span>
        <span>•</span>
        <span className="text-[#006194] font-bold">GERD AI v2.4.1</span>
      </div>
    </footer>
  );
}

export default Footer;
