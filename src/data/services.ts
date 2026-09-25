import { ServiceOffering } from '../types';

export const GLOBAL_BILLING_TERMS = 
  "Materials, specialty hardware, sample paint, purchases, hauling, and unusually complex installs are billed or quoted separately.";

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'art-hang', label: 'Art Hang' },
  { id: 'window-treatment', label: 'Window Treatment Plan' },
  { id: 'styling-revival', label: 'Styling & Revival Plans' },
  { id: 'organizing-moving', label: 'Reset, Organizing & Move-In' },
  { id: 'color-finish', label: 'Color Palette (Sherwin-Williams)' },
  { id: 'custom-fabric', label: 'Custom Fabric Wall Art' },
] as const;

export const SERVICES_CATALOGUE: ServiceOffering[] = [
  {
    id: 'art-hang',
    title: 'Art Hang',
    category: 'art-hang',
    menuBadge: 'Fast visible win',
    tagline: 'Standard framed art, family photos, small vintage pieces, and gallery-wall layouts throughout the home.',
    description: 'Expert placement guidance, measuring, layout, and standard hanging for standard framed art, family photos, small vintage pieces, and gallery-wall layouts throughout the home.',
    detailedPoints: [
      'Standard framed art, family photos, and small vintage pieces',
      'Gallery-wall layouts and cohesive grouping throughout the home',
      'Includes placement guidance, measuring, layout, and standard hanging',
      'Immediate visual order and elevated spatial warmth'
    ],
    exclusions: [
      'Large mirrors, oversized pieces, fragile artwork, and specialty hardware are quoted separately.'
    ],
    pricingModel: 'flat',
    basePrice: 400,
    displayPriceLabel: '$400',
    priceSuffix: 'flat starting point',
    estimatedDuration: 'Standard session',
    iconName: 'Frame',
    popular: true,
    defaultSpecifics: {
      estimatedPieces: 8,
      wallType: 'Drywall',
      hasOversizedOrMirrors: 'None (Standard artwork only)',
      arrangementStyle: 'Curated Gallery Wall',
    },
    specificOptions: [
      {
        id: 'estimatedPieces',
        name: 'Estimated Number of Pieces to Hang',
        type: 'number',
        defaultValue: 8,
        unit: 'pieces'
      },
      {
        id: 'wallType',
        name: 'Primary Wall Surface',
        type: 'select',
        options: ['Drywall', 'Historic Plaster & Lath', 'Brick / Masonry', 'Wood Shiplap'],
        defaultValue: 'Drywall'
      },
      {
        id: 'arrangementStyle',
        name: 'Layout Preference',
        type: 'select',
        options: ['Curated Gallery Wall', 'Single Focal Artworks', 'Symmetrical Grid', 'Eclectic Mix Across Rooms'],
        defaultValue: 'Curated Gallery Wall'
      },
      {
        id: 'hasOversizedOrMirrors',
        name: 'Oversized Art or Heavy Mirrors (Quoted separately on-site)',
        type: 'select',
        options: [
          'None (Standard artwork only)',
          '1-2 Heavy Mirrors (Requires custom cleats / quoted separately)',
          'Multiple Oversized Works (Quoted separately)'
        ],
        defaultValue: 'None (Standard artwork only)'
      }
    ]
  },
  {
    id: 'window-treatment-plan',
    title: 'Window Treatment Plan',
    category: 'window-treatment',
    menuBadge: 'Ready-made only',
    tagline: 'Measure first. Order right. Install once.',
    description: 'Accurate window measuring; ready-made curtain, shade, rod, and simple hardware recommendations; local and online product suggestions; guidance on ordering.',
    detailedPoints: [
      'Measure first. Order right. Install once.',
      'Comprehensive on-site window measuring for proper architectural height and stack-back',
      'Ready-made curtain, shade, rod, and simple hardware recommendations',
      'Local and online product suggestions tailored to your budget and style',
      'Step-by-step guidance on ordering with correct lengths and fullness'
    ],
    exclusions: [
      'Strictly ready-made only. Not for custom drapery, motorized shades, workroom treatments, luxury hardware systems, or designer-specified installations.',
      'Return installation is quoted separately once selections are confirmed.'
    ],
    pricingModel: 'flat',
    basePrice: 300,
    displayPriceLabel: '$300 plan',
    priceSuffix: '',
    estimatedDuration: 'Comprehensive measuring & plan',
    iconName: 'Sliders',
    popular: true,
    defaultSpecifics: {
      windowCount: 5,
      ceilingHeight: '9 to 10 ft',
      treatmentType: 'Curtains & Drapes (Ready-made)',
      orderingAssistance: 'Include curated shopping links'
    },
    specificOptions: [
      {
        id: 'windowCount',
        name: 'Number of Windows to Measure',
        type: 'number',
        defaultValue: 5,
        unit: 'windows'
      },
      {
        id: 'ceilingHeight',
        name: 'Approximate Ceiling Height',
        type: 'select',
        options: ['8 ft Standard', '9 to 10 ft Tall', '12+ ft Vaulted'],
        defaultValue: '9 to 10 ft Tall'
      },
      {
        id: 'treatmentType',
        name: 'Preferred Treatment Direction',
        type: 'select',
        options: [
          'Curtains & Drapes (Ready-made)',
          'Woven Roman Shades (Ready-made)',
          'Mix of Drapes & Shades'
        ],
        defaultValue: 'Curtains & Drapes (Ready-made)'
      }
    ]
  },
  {
    id: 'room-setup-styling',
    title: 'Room Setup + Styling',
    category: 'styling-revival',
    menuBadge: 'One room',
    tagline: 'For one room that has the pieces, but not the peace.',
    description: 'Arranging, editing, hanging, placing, styling, and finishing the room with what the client already has.',
    detailedPoints: [
      'For one room that has the pieces, but not the peace',
      'Arranging furniture for intuitive flow, conversation, and sightlines',
      'Editing visual clutter and reprioritizing beloved objects',
      'Hanging art and placing lamps/accents with balanced scale',
      'Finishing the room using what you already own'
    ],
    exclusions: [
      'Larger rooms, sourcing, purchases, or extra hands-on work are quoted separately.'
    ],
    pricingModel: 'from',
    basePrice: 450,
    displayPriceLabel: 'From $450',
    priceSuffix: '',
    estimatedDuration: 'Single room transformation session',
    iconName: 'LayoutGrid',
    popular: true,
    defaultSpecifics: {
      roomType: 'Living / Family Room',
      primaryGoal: 'Better flow, warmth, and visual calm',
      hasExtraFurnitureToStoreOrDonate: false
    },
    specificOptions: [
      {
        id: 'roomType',
        name: 'Target Room',
        type: 'select',
        options: [
          'Living / Family Room',
          'Primary Bedroom',
          'Dining Room',
          'Home Library / Study',
          'Sunroom / Sitting Niche'
        ],
        defaultValue: 'Living / Family Room'
      },
      {
        id: 'primaryGoal',
        name: 'Primary Spatial Need',
        type: 'select',
        options: [
          'Better flow, warmth, and visual calm',
          'Awkward layout rearrangement',
          'Unifying mismatched furniture & heirlooms',
          'Layering lighting, rugs, and decor'
        ],
        defaultValue: 'Better flow, warmth, and visual calm'
      }
    ]
  },
  {
    id: 'home-reset-organizing',
    title: 'Home Reset + Organizing',
    category: 'organizing-moving',
    menuBadge: 'Hands-on help',
    tagline: 'For rooms, closets, corners, and piles that have gotten too heavy to face alone.',
    description: 'Hands-on cleaning, sorting, organizing, editing, rearranging, and light styling for overburdened spaces.',
    detailedPoints: [
      'For rooms, closets, corners, and piles that have gotten too heavy to face alone',
      'Practical cleaning, sorting, and non-judgmental editing',
      'Organizing and establishing intuitive homes for daily items',
      'Rearranging shelves and storage using your existing furniture and bins',
      'Light styling to leave the space calm and immediately usable'
    ],
    exclusions: [
      'Not for biohazard cleanup, pest remediation, hoarding-level cleanouts without a custom plan, heavy hauling, or recurring maid-service maintenance.'
    ],
    pricingModel: 'from',
    basePrice: 450,
    displayPriceLabel: 'From $450',
    priceSuffix: '',
    estimatedDuration: 'Intensive hands-on session',
    iconName: 'Layers',
    defaultSpecifics: {
      targetZone: 'Walk-In Closet & Dressing Area',
      sortingStrategy: 'Sort & edit with client present',
      hasDonationItems: true
    },
    specificOptions: [
      {
        id: 'targetZone',
        name: 'Primary Target Zone',
        type: 'select',
        options: [
          'Walk-In Closet & Dressing Area',
          'Kitchen & Walk-In Pantry',
          'Home Office & Studio Corner',
          'Living Space Overhaul',
          'Utility Room & Storage Niche'
        ],
        defaultValue: 'Walk-In Closet & Dressing Area'
      },
      {
        id: 'sortingStrategy',
        name: 'Working Style',
        type: 'select',
        options: [
          'Side-by-side editing with Stevan',
          'Stevan sorts & categorizes for quick client approval',
          'Full hands-on reset'
        ],
        defaultValue: 'Side-by-side editing with Stevan'
      }
    ]
  },
  {
    id: 'move-in-unpack-setup',
    title: 'Move-In Unpack + Setup',
    category: 'organizing-moving',
    menuBadge: 'Move-in help',
    tagline: 'Unpacking, placing, arranging, and prioritizing key rooms first.',
    description: 'Unpacking, placing, arranging, and prioritizing key rooms first so the home feels livable immediately instead of like a storage unit.',
    detailedPoints: [
      'Priority room triage: Kitchen, Primary Bedroom, and Living Room functional first',
      'Immediate unpacking and purposeful furniture placement',
      'Organizing essential daily zones before clutter hardens into habit',
      'Transforming move-in chaos into a serene, livable home from day one'
    ],
    exclusions: [
      'Multi-day setup available by custom quote.',
      'Heavy hauling and whole-home box removal quoted separately.'
    ],
    pricingModel: 'from',
    basePrice: 350,
    displayPriceLabel: 'From $350',
    priceSuffix: '',
    estimatedDuration: 'Move-in priority session',
    iconName: 'PackageCheck',
    defaultSpecifics: {
      keyFocusRooms: 'Kitchen + Primary Bedroom',
      approximateBoxesCount: '15 - 30 Essential Boxes',
      hasFurnitureAssembled: true
    },
    specificOptions: [
      {
        id: 'keyFocusRooms',
        name: 'Priority Rooms to Tackle First',
        type: 'select',
        options: [
          'Kitchen + Primary Bedroom',
          'Living Room + Main Floor Flow',
          'Home Office + Kitchen',
          'Primary Suite + Living Room'
        ],
        defaultValue: 'Kitchen + Primary Bedroom'
      },
      {
        id: 'approximateBoxesCount',
        name: 'Estimated Boxes for Priority Spaces',
        type: 'select',
        options: [
          'Under 15 Boxes (Express Setup)',
          '15 - 30 Essential Boxes',
          '30+ Boxes (May require custom multi-day quote)'
        ],
        defaultValue: '15 - 30 Essential Boxes'
      }
    ]
  },
  {
    id: 'full-home-revival-plan',
    title: 'Full Home Revival Plan',
    category: 'styling-revival',
    menuBadge: 'Bigger picture',
    tagline: 'For homes that need more than one good day.',
    description: 'Multi-room walkthrough, room-by-room priorities, design direction, repair priorities, styling, sourcing, and phasing. Includes a practical next-step execution plan.',
    detailedPoints: [
      'For homes that need more than one good day',
      'Comprehensive multi-room walkthrough with Stevan',
      'Room-by-room prioritized master roadmap',
      'Design direction, spatial flow, and atmospheric color strategy',
      'Repair and architectural touchup priorities',
      'Sourcing, styling, and phased execution timeline you can follow at your own pace'
    ],
    exclusions: [
      'Execution of phased services, physical materials, and specialty contractors are quoted separately.'
    ],
    pricingModel: 'from',
    basePrice: 1500,
    displayPriceLabel: 'From $1,500',
    priceSuffix: '',
    estimatedDuration: 'Multi-room walkthrough + master roadmap',
    iconName: 'Compass',
    popular: true,
    defaultSpecifics: {
      homeScale: '2,000 - 3,500 sq ft',
      topPriority: 'Overall flow, room identity, and lighting',
      preferredPace: 'Phased over 3 - 6 months'
    },
    specificOptions: [
      {
        id: 'homeScale',
        name: 'Home Size',
        type: 'select',
        options: ['Under 2,000 sq ft', '2,000 - 3,500 sq ft', '3,500+ sq ft'],
        defaultValue: '2,000 - 3,500 sq ft'
      },
      {
        id: 'topPriority',
        name: 'Primary Transformation Goal',
        type: 'select',
        options: [
          'Overall flow, room identity, and lighting',
          'Complete decorative reset using existing belongings',
          'Pre-renovation space planning & design triage',
          'Unifying architectural finishes and decor'
        ],
        defaultValue: 'Overall flow, room identity, and lighting'
      }
    ]
  },
  {
    id: 'color-palette-plan',
    title: 'Color Palette Plan (Sherwin-Williams)',
    category: 'color-finish',
    menuBadge: 'Paint direction',
    tagline: 'Room-by-room Sherwin-Williams color direction, finish sheens, and painter prep notes.',
    description: 'A cohesive room-by-room color direction specified exclusively in Sherwin-Williams codes. Evaluates morning vs afternoon light, flooring undertones, and architectural sheens.',
    detailedPoints: [
      'Comprehensive Sherwin-Williams color specifications for walls, ceilings, and trim',
      'Natural light exposure and temperature analysis for each space',
      'Sheen and finish recommendations (flat, matte, satin, semi-gloss) for durability',
      'Written specification sheet ready to hand directly to your painting contractor'
    ],
    exclusions: [
      'Painting labor and physical gallons of paint are quoted/purchased separately.',
      'Sample paint pots billed separately if needed.'
    ],
    pricingModel: 'flat',
    basePrice: 350,
    displayPriceLabel: '$350',
    priceSuffix: 'flat rate',
    estimatedDuration: 'Consultation & written guide',
    iconName: 'Sparkles',
    popular: true,
    defaultSpecifics: {
      numberOfRooms: 4,
      includeColorTestingAddOn: false,
      includeTrimAndDoors: true,
      paletteAtmosphere: 'Warm Earthy & Soulful'
    },
    specificOptions: [
      {
        id: 'numberOfRooms',
        name: 'Number of Rooms to Specify',
        type: 'number',
        defaultValue: 4,
        unit: 'rooms',
        description: 'Up to 5 rooms included in base flat rate'
      },
      {
        id: 'includeColorTestingAddOn',
        name: 'Color Testing Add-On — $125',
        type: 'boolean',
        defaultValue: false,
        priceModifier: 125,
        description: 'On-wall sample paint swatching and sheen evaluation (sample paint billed separately if needed)'
      },
      {
        id: 'includeTrimAndDoors',
        name: 'Include Architectural Trim, Doors & Ceilings',
        type: 'boolean',
        defaultValue: true
      },
      {
        id: 'paletteAtmosphere',
        name: 'Atmospheric Direction',
        type: 'select',
        options: ['Warm Earthy & Soulful', 'Airy Natural & Crisp', 'Moody & Saturated', 'Classic Mid-South Heritage'],
        defaultValue: 'Warm Earthy & Soulful'
      }
    ]
  },
  {
    id: 'custom-fabric-art',
    title: 'Custom Fabric Wall Art',
    category: 'custom-fabric',
    menuBadge: 'Custom work',
    tagline: 'Large-format fabric wall art combining printed fabric, scale, color, pattern, and selective hand-painted detailing.',
    description: 'Built to provide acoustic warmth and visual scale without cold glass glare. Quoted custom by size, design, materials, and installation needs.',
    detailedPoints: [
      'Large-format textile wall art tailored to specific wall dimensions and sightlines',
      'Printed fabric murals and botanical panels built on solid pine stretchers',
      'Internal acoustic batting layer softens room echo and warms acoustics',
      'Selective hand-painted acrylic & metallic leaf detailing by Stevan',
      'Quoted custom by size, design, materials, and installation needs'
    ],
    exclusions: [
      'Quoted custom by size, design, materials, and installation needs.'
    ],
    pricingModel: 'custom_quote',
    basePrice: 0,
    displayPriceLabel: 'Custom Quote',
    priceSuffix: 'Quoted by scale & design',
    estimatedDuration: 'Custom Commission (Install included)',
    iconName: 'Palette',
    popular: true,
    defaultSpecifics: {
      approximateScale: '40" x 60" Statement Scale',
      subjectDirection: 'Botanical & Flora Study',
      acousticBattingBacking: true,
      floaterFrameOption: 'Natural Rubbed Hardwood Frame'
    },
    specificOptions: [
      {
        id: 'approximateScale',
        name: 'Anticipated Dimensions / Scale',
        type: 'select',
        options: [
          '36" x 48" Single Focal Panel',
          '40" x 60" Statement Panel',
          '48" x 72" Grand Architectural Scale',
          'Multi-Panel Triptych (Three Panels)',
          'Custom Wall-Scale Mural'
        ],
        defaultValue: '40" x 60" Statement Scale'
      },
      {
        id: 'subjectDirection',
        name: 'Visual Theme',
        type: 'select',
        options: [
          'Botanical & Flora Study',
          'Architectural Archive & Vintage Vignettes',
          'Warm Earth Tones Abstract',
          'Custom Client Theme'
        ],
        defaultValue: 'Botanical & Flora Study'
      },
      {
        id: 'floaterFrameOption',
        name: 'Hardwood Floater Frame Preference',
        type: 'select',
        options: [
          'Natural Rubbed White Oak Frame',
          'Walnut Stained Hardwood Frame',
          'Unframed Clean Textile Wrap'
        ],
        defaultValue: 'Natural Rubbed White Oak Frame'
      }
    ]
  }
];
