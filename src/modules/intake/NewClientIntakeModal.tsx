import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  UploadCloud, 
  Home, 
  HeartHandshake, 
  MessageSquare, 
  Info,
  Compass,
  FileCheck
} from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import confetti from 'canvas-confetti';

export const NewClientIntakeModal: React.FC = () => {
  const { isIntakeModalOpen, setIsIntakeModalOpen, createIntakeInquiry } = useBookingContext();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [createdIntakeId, setCreatedIntakeId] = useState<string | null>(null);

  // Form State
  const [currentSituation, setCurrentSituation] = useState('');
  const [heaviestChallenge, setHeaviestChallenge] = useState('');
  const [priorityFocus, setPriorityFocus] = useState("I Don't Know Yet / Need Stevan's Guidance");

  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Midtown Memphis');
  const [homeAgeOrWallTypes, setHomeAgeOrWallTypes] = useState('Drywall (Standard)');

  const [photoNotes, setPhotoNotes] = useState('');
  const [simulatedPhotos, setSimulatedPhotos] = useState<string[]>([]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'email' | 'phone' | 'text'>('email');

  if (!isIntakeModalOpen) return null;

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setSimulatedPhotos(prev => [...prev, ...fileNames]);
    }
  };

  const handleClose = () => {
    setIsIntakeModalOpen(false);
    setStep(1);
    setCreatedIntakeId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert('Please provide your name, email, and phone so Stevan can reply to your inquiry.');
      return;
    }

    const newIntake = createIntakeInquiry({
      currentSituation: currentSituation.trim() || 'General room overview requested.',
      heaviestChallenge: heaviestChallenge.trim() || 'Overwhelmed with spatial arrangement.',
      priorityFocus,
      neighborhood,
      address: address.trim() || 'Memphis Area Residence',
      homeAgeOrWallTypes,
      photoNotes: photoNotes.trim() + (simulatedPhotos.length > 0 ? ` [${simulatedPhotos.length} photo(s) attached: ${simulatedPhotos.join(', ')}]` : ''),
      fullName,
      email,
      phone,
      preferredContactMethod
    });

    setCreatedIntakeId(newIntake.id);
    setStep(5);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E0D5] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#FAF3EC] text-[#9A4616] border border-[#ECD8C8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#9A4616]">
                  New Client Consultation
                </span>
                {step <= 4 && (
                  <span className="text-xs text-[#8C827A]">• Step {step} of 4</span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-editorial text-[#2C2825]">
                Home Revival by Stevan Collins Lazich
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-[#8C827A] hover:text-[#2C2825] hover:bg-[#F2ECE2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Steps 1-4) */}
        {step <= 4 && (
          <div className="grid grid-cols-4 bg-[#F0EBE1] h-1.5">
            <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 1 ? 'w-full' : 'w-0'}`}></div>
            <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
            <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 4 ? 'w-full' : 'w-0'}`}></div>
          </div>
        )}

        {/* Reassurance Banner */}
        {step === 1 && (
          <div className="bg-[#F6EFE6] px-6 py-3.5 border-b border-[#EADDCF] text-xs text-[#6F4E2E] flex items-center space-x-3 italic">
            <HeartHandshake className="w-5 h-5 text-[#B25E29] shrink-0" />
            <p className="leading-relaxed">
              "You do not need to clean before asking for help. You do not need to apologize for being overwhelmed. You do not need to know the answer before we begin."
            </p>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: THE SITUATION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#2C2825]">
                  1. The Situation & Spatial Priorities
                </h3>
                <p className="text-xs text-[#7A7168] mt-0.5">
                  Tell Stevan what feels stagnant, heavy, or ready for change in your home.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2825] mb-1.5">
                  What space or problem are you ready to tackle first?
                </label>
                <div className="space-y-2">
                  {/* Primary Guidance Option */}
                  <button
                    type="button"
                    onClick={() => setPriorityFocus("I Don't Know Yet / Need Stevan's Guidance")}
                    className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all ${
                      priorityFocus === "I Don't Know Yet / Need Stevan's Guidance"
                        ? 'bg-[#2C2825] text-white border-[#2C2825] shadow-sm'
                        : 'bg-[#FAF3EC] text-[#8C461C] border-[#ECD8C8] hover:bg-[#F5ECE1]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sparkles className="w-4 h-4 text-[#B25E29] shrink-0" />
                      <div>
                        <div className="text-xs font-bold">I Don't Know Yet / Need Stevan's Guidance</div>
                        <div className={`text-[11px] ${priorityFocus === "I Don't Know Yet / Need Stevan's Guidance" ? 'text-stone-300' : 'text-[#8C7B6C]'}`}>
                          Unsure where to start — looking for Stevan's experienced eye and suggestions.
                        </div>
                      </div>
                    </div>
                    {priorityFocus === "I Don't Know Yet / Need Stevan's Guidance" && (
                      <CheckCircle2 className="w-4 h-4 text-[#DFC08C] shrink-0" />
                    )}
                  </button>

                  {/* Specific Service Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {[
                      'Single-Room Setup + Flow Reset',
                      'Art Hang & Gallery Wall Layout',
                      'Window Treatment Measuring & Direction',
                      'Move-In Unpack & Livable Setup',
                      'Sherwin-Williams Color Palette Direction',
                      'Multi-Room Master Walkthrough Roadmap',
                      'Closet / Declutter / Storage Overhaul',
                      'Bespoke Fabric Wall Art Commission'
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPriorityFocus(option)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          priorityFocus === option
                            ? 'bg-[#2C2825] text-white border-[#2C2825] shadow-sm font-semibold'
                            : 'bg-white text-[#4A453F] border-[#E2DAD0] hover:bg-[#F7F3EC]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2825] mb-1">
                  What is going on in your home right now? <span className="font-normal text-[#8C827A]">(A sentence or two is plenty)</span>
                </label>
                <textarea
                  rows={2}
                  value={currentSituation}
                  onChange={(e) => setCurrentSituation(e.target.value)}
                  placeholder="e.g. Recently moved in, rooms feel cold or mismatched, or furniture layout feels awkward and blocks natural light..."
                  className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-2xl p-3 text-[#2C2825] placeholder:text-[#9E948A] focus:outline-none focus:ring-1 focus:ring-[#B25E29]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2825] mb-1">
                  What feels heaviest or hardest to face alone? <span className="font-normal text-[#8C827A]">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={heaviestChallenge}
                  onChange={(e) => setHeaviestChallenge(e.target.value)}
                  placeholder="e.g. Figuring out which pieces to keep vs edit, drilling into historic plaster walls, or finding the momentum to start..."
                  className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-2xl p-3 text-[#2C2825] placeholder:text-[#9E948A] focus:outline-none focus:ring-1 focus:ring-[#B25E29]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                >
                  <span>Continue: Home Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: HOME & PROPERTY DETAILS */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#2C2825]">
                  2. Home & Property Details
                </h3>
                <p className="text-xs text-[#7A7168] mt-0.5">
                  Helps Stevan prepare the right architectural measuring tools, drill bits, and anchors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C2825] mb-1">
                    Neighborhood / Mid-South Area *
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2.5 text-[#2C2825]"
                  >
                    <option value="Midtown Memphis (Central Gardens, Cooper-Young, Evergreen)">Midtown Memphis (Central Gardens, Cooper-Young, Evergreen)</option>
                    <option value="Downtown Memphis / South Main / Harbor Town">Downtown Memphis / South Main / Harbor Town</option>
                    <option value="East Memphis (High Point Terrace, Hedgemoor)">East Memphis (High Point Terrace, Hedgemoor)</option>
                    <option value="Germantown / Collierville">Germantown / Collierville</option>
                    <option value="Bartlett / Cordova / Lakeland">Bartlett / Cordova / Lakeland</option>
                    <option value="Other Mid-South Area">Other Mid-South Area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C2825] mb-1">
                    Wall Type & Architectural Features
                  </label>
                  <select
                    value={homeAgeOrWallTypes}
                    onChange={(e) => setHomeAgeOrWallTypes(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2.5 text-[#2C2825]"
                  >
                    <option value="Drywall (Standard modern construction)">Drywall (Standard modern construction)</option>
                    <option value="Historic Plaster & Lath (1900-1940s vintage homes)">Historic Plaster & Lath (1900-1940s vintage homes)</option>
                    <option value="Exposed Brick or Masonry">Exposed Brick or Masonry</option>
                    <option value="Wood Paneling / Shiplap">Wood Paneling / Shiplap</option>
                    <option value="Mix of Drywall and Historic Plaster">Mix of Drywall and Historic Plaster</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2825] mb-1">
                  Street Address or Cross Streets
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 1940 Oliver Ave, Midtown Memphis"
                  className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3.5 py-2.5 text-[#2C2825]"
                />
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] flex items-start space-x-3 text-xs text-[#6F6458]">
                <Home className="w-5 h-5 text-[#B25E29] shrink-0 mt-0.5" />
                <p leading-relaxed>
                  Stevan brings commercial-grade stud finders, heavy-duty plaster toggle anchors, and precision brackets tailored to your exact wall structure so delicate surfaces never crack.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center space-x-1 text-xs text-[#554E46] hover:text-[#2C2825] font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to situation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                >
                  <span>Continue: Photos & Visuals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTOS & VISUALS (OPTIONAL) */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#2C2825]">
                  3. Photos & Visual Context (Optional)
                </h3>
                <p className="text-xs text-[#7A7168] mt-0.5">
                  A photo is worth a thousand words. Quick phone snaps from a couple corners are ideal.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#D6CBBF] bg-white rounded-2xl p-6 text-center hover:bg-[#FAF8F5] transition-colors relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSimulatePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-full bg-[#FAF3EC] text-[#9A4616] flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-[#2C2825]">
                  Tap to upload room or wall snapshots
                </div>
                <p className="text-[11px] text-[#8C827A] mt-1 italic">
                  "Quick phone snaps are perfect. No tidying up."
                </p>
                <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F0EBE1] text-[#645A50] text-[11px] font-medium">
                  <UploadCloud className="w-3 h-3" />
                  <span>Select from Camera or Photos</span>
                </div>
              </div>

              {/* Uploaded files chips */}
              {simulatedPhotos.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-[#8C827A] tracking-wider">
                    Attached Files ({simulatedPhotos.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {simulatedPhotos.map((name, i) => (
                      <span key={i} className="inline-flex items-center space-x-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[200px]">{name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#2C2825] mb-1">
                  Photo Notes or Description
                </label>
                <input
                  type="text"
                  value={photoNotes}
                  onChange={(e) => setPhotoNotes(e.target.value)}
                  placeholder="e.g. Photo 1 is the blank dining wall, Photo 2 is our frame collection leaning on floor"
                  className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3.5 py-2.5 text-[#2C2825]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-1 text-xs text-[#554E46] hover:text-[#2C2825] font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                >
                  <span>Continue: Contact Info</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & EXPECTATIONS */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#2C2825]">
                  4. Your Contact Details & What to Expect
                </h3>
                <p className="text-xs text-[#7A7168] mt-0.5">
                  Stevan responds directly to coordinate your recommendations.
                </p>
              </div>

              {/* Personal Review Expectation Banner */}
              <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#ECD8C8] text-xs text-[#7D3B12] flex items-start space-x-3 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-[#B25E29] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5 text-[#2C2825]">
                    Personal Stevan Collins Lazich Review Commitment:
                  </strong>
                  <span>
                    "Stevan reviews every intake personally and will email back within 24 hours with the recommended service, package, price direction, and booking link that make the most sense."
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C2825] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3.5 py-2.5 text-[#2C2825]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C2825] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleanor@example.com"
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3.5 py-2.5 text-[#2C2825]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C2825] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(901) 555-0194"
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3.5 py-2.5 text-[#2C2825]"
                  />
                </div>
              </div>

              {/* Communication Preference Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2C2825]">
                  How would you prefer Stevan to connect with you first?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreferredContactMethod('phone')}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      preferredContactMethod === 'phone'
                        ? 'bg-[#2C2825] text-white border-[#2C2825] shadow-sm'
                        : 'bg-white text-[#4A453F] border-[#E2DAD0] hover:bg-[#F7F3EC]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold mb-1 flex items-center justify-between">
                        <span>📞 Phone Call First</span>
                        {preferredContactMethod === 'phone' && <CheckCircle2 className="w-3.5 h-3.5 text-[#DFC08C]" />}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${preferredContactMethod === 'phone' ? 'text-stone-300' : 'text-[#7A7168]'}`}>
                        A relaxed 10-minute chat to discuss your home before suggesting anything.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredContactMethod('email')}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      preferredContactMethod === 'email'
                        ? 'bg-[#2C2825] text-white border-[#2C2825] shadow-sm'
                        : 'bg-white text-[#4A453F] border-[#E2DAD0] hover:bg-[#F7F3EC]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold mb-1 flex items-center justify-between">
                        <span>✉️ Email Proposal</span>
                        {preferredContactMethod === 'email' && <CheckCircle2 className="w-3.5 h-3.5 text-[#DFC08C]" />}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${preferredContactMethod === 'email' ? 'text-stone-300' : 'text-[#7A7168]'}`}>
                        Initial thoughts, service ideas, and transparent pricing to review at your pace.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredContactMethod('text')}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      preferredContactMethod === 'text'
                        ? 'bg-[#2C2825] text-white border-[#2C2825] shadow-sm'
                        : 'bg-white text-[#4A453F] border-[#E2DAD0] hover:bg-[#F7F3EC]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold mb-1 flex items-center justify-between">
                        <span>💬 Text / SMS</span>
                        {preferredContactMethod === 'text' && <CheckCircle2 className="w-3.5 h-3.5 text-[#DFC08C]" />}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${preferredContactMethod === 'text' ? 'text-stone-300' : 'text-[#7A7168]'}`}>
                        Quick text message to coordinate and say hello.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Cautious, Low-Pressure Reassurance */}
              <div className="p-3.5 bg-[#FAF3EC] rounded-2xl border border-[#ECD8C8] text-[11px] text-[#7D3B12] leading-relaxed">
                <strong>No-Pressure Promise:</strong> "No sales pitches, no assumptions, and zero commitment. Stevan connects with you first to get a feel for your space and ensure we're the right fit."
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center space-x-1 text-xs text-[#554E46] hover:text-[#2C2825] font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-7 py-3 rounded-full text-xs font-semibold bg-[#B25E29] hover:bg-[#C96B30] text-white transition-all shadow-md hover:shadow-lg"
                >
                  <span>Submit Intake to Stevan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: CONFIRMATION SCREEN */}
          {step === 5 && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#8C827A]">
                  Intake Reference ID: {createdIntakeId}
                </span>
                <h3 className="text-2xl font-bold font-editorial text-[#2C2825] mt-1">
                  Thank You, {fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-[#5C554E] max-w-md mx-auto mt-2 leading-relaxed">
                  Your home details have been received directly at the studio. An archived copy has been logged and BCC'd to <strong>scl@stevancollinslazich.com</strong>.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex items-center space-x-2 text-[#9A4616] font-semibold">
                  <Compass className="w-4 h-4" />
                  <span>What Happens Next (Within 24 Hours)</span>
                </div>
                <ul className="space-y-1.5 text-[#554E46] text-xs">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-[#B25E29] font-bold">•</span>
                    <span>
                      {preferredContactMethod === 'phone' && (
                        <span>Stevan will give you a relaxed phone call at <strong>{phone}</strong> to chat through your space and answer any questions.</span>
                      )}
                      {preferredContactMethod === 'email' && (
                        <span>Stevan will review your notes and email you directly at <strong>{email}</strong> with personalized suggestions and options.</span>
                      )}
                      {preferredContactMethod === 'text' && (
                        <span>Stevan will send a text to <strong>{phone}</strong> to coordinate next steps.</span>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-[#B25E29] font-bold">•</span>
                    <span>No deposit or payment is due until you and Stevan agree on a customized roadmap.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors"
                >
                  Return to Home Revival
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
