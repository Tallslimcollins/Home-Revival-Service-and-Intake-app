import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  FileText, 
  Sliders, 
  AlertCircle, 
  Check, 
  Sparkles,
  History,
  Send,
  CornerDownRight
} from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { LineItem } from '../types';

export const AdminAdjustModal: React.FC = () => {
  const { 
    bookingForPriceAdjustment, 
    setBookingForPriceAdjustment, 
    updateBookingSpecificsAndPrice,
    isAdminMode 
  } = useBookingContext();

  if (!bookingForPriceAdjustment) return null;

  const booking = bookingForPriceAdjustment;

  // Local state for line items
  const [lineItems, setLineItems] = useState<LineItem[]>(() => [...(booking.lineItems || [])]);
  
  // Local state for new line item to add
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemType, setNewItemType] = useState<LineItem['type']>('materials');

  // Reason & internal notes
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  // Editable specifics
  const [specificsText, setSpecificsText] = useState(() => {
    return JSON.stringify(booking.specifics || {}, null, 2);
  });

  const calculatedTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

  const handleAddLineItem = () => {
    const amountNum = parseFloat(newItemAmount);
    if (!newItemDesc.trim() || isNaN(amountNum)) {
      alert('Please enter a description and a valid amount.');
      return;
    }

    const newItem: LineItem = {
      id: `li-adj-${Date.now()}`,
      description: newItemDesc.trim(),
      amount: amountNum,
      type: newItemType
    };

    setLineItems([...lineItems, newItem]);
    setNewItemDesc('');
    setNewItemAmount('');
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleItemAmountChange = (id: string, newAmount: number) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, amount: newAmount } : item));
  };

  const handleSaveAdjustments = () => {
    let parsedSpecifics = booking.specifics;
    try {
      parsedSpecifics = JSON.parse(specificsText);
    } catch (e) {
      alert('Specifics JSON format is invalid. Please verify JSON syntax or keep original.');
      return;
    }

    const reason = adjustmentReason.trim() || (isAdminMode ? 'Studio scope & materials adjustment by Stevan' : 'Customer adjusted options');

    updateBookingSpecificsAndPrice(
      booking.id,
      calculatedTotal,
      lineItems,
      parsedSpecifics,
      reason,
      adjustmentNotes.trim()
    );

    setBookingForPriceAdjustment(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E0D5] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-semibold tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                {isAdminMode ? "Stevan's Studio Adjuster" : "Client Scope Modification"}
              </span>
              <span className="text-xs text-[#8C827A] font-mono">{booking.id}</span>
            </div>
            <h2 className="text-xl font-bold font-editorial text-[#2C2825] mt-1">
              Adjust Price & Specifics: {booking.serviceTitle}
            </h2>
          </div>

          <button
            onClick={() => setBookingForPriceAdjustment(null)}
            className="p-2 text-[#8C827A] hover:text-[#2C2825] hover:bg-[#F2ECE2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Customer & Current Status banner */}
          <div className="bg-white p-4 rounded-2xl border border-[#E7E0D5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-semibold text-[#8C827A] uppercase">Client Details</span>
              <p className="text-sm font-bold text-[#2C2825]">{booking.customer.fullName}</p>
              <p className="text-xs text-[#5C554E]">{booking.customer.address}, {booking.customer.city} • {booking.customer.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-[#8C827A] uppercase">Current Total</span>
              <div className="text-xl font-bold font-editorial text-[#2C2825]">
                ${booking.totalPrice} <span className="text-xs text-stone-500 font-sans font-normal">(Paid: ${booking.amountPaid})</span>
              </div>
            </div>
          </div>

          {/* Section 1: Dynamic Line Items Editor */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-[#B25E29]" />
                <h3 className="text-sm font-bold text-[#2C2825]">Itemized Scope & Pricing Breakdown</h3>
              </div>
              <span className="text-xs text-[#8C827A]">Edit line amounts or add surcharges/credits</span>
            </div>

            {/* List of existing line items */}
            <div className="space-y-2.5">
              {lineItems.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE5D8]">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-[#2C2825] block">{item.description}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C827A]">
                      Type: {item.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-[#7A7168]">$</span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleItemAmountChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-24 text-xs font-bold pl-6 pr-2 py-1.5 bg-white border border-[#DCD3C5] rounded-lg text-right text-[#2C2825] focus:ring-1 focus:ring-[#B25E29]"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove line item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new line item row */}
            <div className="bg-[#F8F5EE] p-3.5 rounded-xl border border-dashed border-[#DCD3C5] space-y-3">
              <span className="text-xs font-bold text-[#554E46] flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5 text-[#B25E29]" />
                <span>Add Custom Line Item (Materials, Extra Hours, Discount, Custom Scale)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    placeholder="e.g., Heavy plaster anchor kit (2 large mirrors) or Extra 1.5 hrs"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full text-xs bg-white border border-[#DCD3C5] rounded-lg px-3 py-2 text-[#2C2825]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full text-xs bg-white border border-[#DCD3C5] rounded-lg px-2 py-2 text-[#2C2825]"
                  >
                    <option value="materials">Materials / Supplies</option>
                    <option value="extra_hours">Additional Labor Hours</option>
                    <option value="custom_fabric">Custom Fabric / Framing</option>
                    <option value="travel_surcharge">Travel / Distance Fee</option>
                    <option value="discount">Courtesy Credit / Discount (-)</option>
                    <option value="custom_adjustment">Custom Adjustment</option>
                  </select>
                </div>

                <div className="sm:col-span-2 relative">
                  <span className="absolute left-2.5 top-2 text-xs text-[#7A7168]">$</span>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    className="w-full text-xs pl-6 pr-2 py-2 bg-white border border-[#DCD3C5] rounded-lg text-[#2C2825]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="w-full h-full bg-[#2C2825] hover:bg-[#B25E29] text-white rounded-lg flex items-center justify-center transition-colors text-xs font-semibold py-2"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Total recap */}
            <div className="pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-[#2C2825]">New Calculated Total:</span>
              <div className="text-right">
                <span className="text-2xl font-bold font-editorial text-[#B25E29]">
                  ${calculatedTotal}
                </span>
                {calculatedTotal !== booking.totalPrice && (
                  <span className="block text-[11px] text-[#8C827A]">
                    Change: {calculatedTotal > booking.totalPrice ? `+$${calculatedTotal - booking.totalPrice}` : `-$${booking.totalPrice - calculatedTotal}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Specifics & Notes */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#F0EBE1] pb-2">
              <Sliders className="w-4 h-4 text-[#B25E29]" />
              <h3 className="text-sm font-bold text-[#2C2825]">Service Specifics & Execution Notes</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#554E46] mb-1">
                Reason for Price / Scope Adjustment (Visible to Client in Notification) *
              </label>
              <input
                type="text"
                placeholder="e.g. Added heavy masonry anchors for stairwell mirrors + $50 courtesy discount"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2.5 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#554E46] mb-1">
                Stevan's Studio Notes & Preparation Checklist
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Bring 10ft extension ladder, masonry drill bit, and 2-point heavy cleats."
                value={adjustmentNotes}
                onChange={(e) => setAdjustmentNotes(e.target.value)}
                className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl p-3 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
              ></textarea>
            </div>

            {/* Editable Raw Specifics JSON */}
            <div>
              <label className="block text-xs font-semibold text-[#554E46] mb-1">
                Specifics Configuration (Key-Value)
              </label>
              <textarea
                rows={4}
                value={specificsText}
                onChange={(e) => setSpecificsText(e.target.value)}
                className="w-full font-mono text-[11px] bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl p-3 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Adjustment History Log */}
          {booking.adjustments && booking.adjustments.length > 0 && (
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2C2825]">
                <History className="w-4 h-4 text-[#8C827A]" />
                <span>Prior Adjustment History for this Booking</span>
              </div>
              <div className="divide-y divide-[#E5DEC7] text-xs">
                {booking.adjustments.map(adj => (
                  <div key={adj.id} className="py-2">
                    <div className="flex justify-between items-center text-[#5C554E]">
                      <span className="font-semibold text-[#2C2825]">{adj.reason}</span>
                      <span className="text-[11px] text-[#8C827A]">
                        {new Date(adj.adjustedAt).toLocaleDateString()} by {adj.adjustedBy}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7A7168] flex items-center space-x-2 mt-0.5">
                      <span>Previous: ${adj.previousTotal}</span>
                      <CornerDownRight className="w-3 h-3 text-[#B25E29]" />
                      <span className="font-bold text-[#2C2825]">New: ${adj.newTotal}</span>
                      {adj.notes && <span className="italic">({adj.notes})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E7E0D5] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setBookingForPriceAdjustment(null)}
            className="text-xs text-[#554E46] hover:text-[#2C2825] font-medium"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleSaveAdjustments}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Changes & Notify Client</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
