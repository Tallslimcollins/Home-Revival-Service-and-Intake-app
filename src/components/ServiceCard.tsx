import React from 'react';
import { 
  Frame, 
  Palette, 
  Sparkles, 
  Layers, 
  LayoutGrid, 
  PackageCheck, 
  Sliders, 
  Compass, 
  Clock, 
  Check, 
  ArrowRight,
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';
import { ServiceOffering } from '../types';
import { useBookingContext } from '../context/BookingContext';

interface ServiceCardProps {
  service: ServiceOffering;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { setSelectedServiceForBooking } = useBookingContext();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Frame': return <Frame className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'LayoutGrid': return <LayoutGrid className="w-5 h-5" />;
      case 'PackageCheck': return <PackageCheck className="w-5 h-5" />;
      case 'Sliders': return <Sliders className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E7E0D5] p-7 flex flex-col justify-between hover:shadow-xl hover:border-[#D4A373] transition-all duration-300 relative group overflow-hidden">
      {/* Decorative subtle top edge line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4A373]/20 via-[#B25E29]/40 to-[#2C2825]/20 group-hover:from-[#B25E29] group-hover:to-[#D4A373] transition-all"></div>

      <div>
        {/* Header row: Verified Menu Badge & Display Price */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[#FAF3EC] text-[#9A4616] border border-[#ECD8C8]">
            {service.menuBadge}
          </span>
          <div className="text-right">
            <span className="text-2xl font-bold font-editorial text-[#2C2825]">
              {service.displayPriceLabel}
            </span>
            {service.priceSuffix && (
              <span className="text-[11px] text-[#8C827A] ml-1 font-medium block">
                {service.priceSuffix}
              </span>
            )}
          </div>
        </div>

        {/* Title & Icon */}
        <div className="flex items-center space-x-3 mt-2 mb-2">
          <div className="p-2.5 rounded-2xl bg-[#F7F4EE] text-[#B25E29] border border-[#EADBCC] group-hover:bg-[#B25E29] group-hover:text-white transition-colors">
            {getIcon(service.iconName)}
          </div>
          <h3 className="text-xl font-bold font-editorial text-[#2C2825] leading-snug">
            {service.title}
          </h3>
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium text-[#7D5329] mb-3 italic">
          "{service.tagline}"
        </p>

        {/* Description */}
        <p className="text-xs text-[#5C554E] leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Feature bullets */}
        <div className="space-y-2 mb-4 pt-4 border-t border-[#F2ECE2]">
          {service.detailedPoints.map((point, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-[#4A453F]">
              <span className="w-4 h-4 rounded-full bg-[#EFE9DF] text-[#7A6B5D] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* Scope Boundaries / Exclusions Guardrail */}
        {service.exclusions && service.exclusions.length > 0 && (
          <div className="bg-[#FBF9F6] p-3 rounded-2xl border border-[#E8E2D5] mb-5 text-[11px] text-[#6E645A] space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-[#8C461C]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Scope Boundaries & Exclusions:</span>
            </div>
            {service.exclusions.map((exc, idx) => (
              <p key={idx} className="pl-5 text-[#5A524A] leading-relaxed">
                • {exc}
              </p>
            ))}
          </div>
        )}

        {/* Specifics preview tag */}
        <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE5D8] mb-6 text-xs text-[#6B6156]">
          <div className="flex items-center space-x-1.5 font-semibold text-[#3D3731] mb-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B25E29]" />
            <span>Configurable specifics & adjustable scope:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {service.specificOptions.map(opt => (
              <span key={opt.id} className="bg-white px-2 py-0.5 rounded-md border border-[#E0D7C8] text-[11px] text-[#554E46]">
                {opt.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
        <div className="flex items-center text-xs text-[#8C827A] space-x-1">
          <Clock className="w-3.5 h-3.5 text-[#A5998D]" />
          <span>{service.estimatedDuration}</span>
        </div>

        <button
          onClick={() => setSelectedServiceForBooking(service)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-all shadow-sm hover:shadow"
        >
          <span>{service.pricingModel === 'custom_quote' ? 'Request Custom Quote' : 'Schedule & Customize'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
