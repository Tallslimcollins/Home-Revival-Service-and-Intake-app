import { ClientIntakeInquiry } from '../types';

export const INITIAL_INTAKE_INQUIRIES: ClientIntakeInquiry[] = [
  {
    id: 'INTK-2026-104',
    createdAt: '2026-09-24T18:45:00Z',
    status: 'new',
    currentSituation: 'Just moved into a 1920s bungalow in Midtown. Boxes everywhere, living room has nice vintage furniture from our old home but the flow feels cramped and disconnected. Walls are plaster and we are afraid of cracking them.',
    heaviestChallenge: 'Facing the living room and entryway alone. Every evening after work we just sit surrounded by piles not knowing where to start.',
    priorityFocus: 'Single-room setup + art hanging on plaster walls',
    neighborhood: 'Midtown (Central Gardens)',
    address: '1842 Central Ave',
    homeAgeOrWallTypes: 'Historic Plaster & Lath, 9-ft ceilings',
    photoNotes: 'Uploaded 3 living room angles showing current layout and packed picture frames.',
    fullName: 'David & Amanda Sterling',
    email: 'd.sterling.arch@gmail.com',
    phone: '(901) 555-0422',
    preferredContactMethod: 'email',
    adminNotes: 'Great fit for Room Setup + Styling (From $450) or Art Hang ($400). Plaster bit kit required.'
  },
  {
    id: 'INTK-2026-098',
    createdAt: '2026-09-23T09:15:00Z',
    status: 'reviewed',
    currentSituation: 'We have accumulated art over 15 years—inherited Southern oil landscapes, concert posters, and family portraits—and they have been sitting leaning against hallway baseboards for 8 months.',
    heaviestChallenge: 'Deciding what goes where and hanging heavy frames securely without ruining the wall.',
    priorityFocus: 'Salon-style gallery wall and stairwell placement',
    neighborhood: 'East Memphis',
    address: '4920 Shady Grove Rd',
    homeAgeOrWallTypes: 'Drywall, 10-ft ceilings',
    photoNotes: 'Hallway and high stairwell landing photos attached.',
    fullName: 'Caroline Patterson',
    email: 'cpatterson.design@outlook.com',
    phone: '(901) 555-0891',
    preferredContactMethod: 'email',
    adminNotes: 'Classic Art Hang starting flat rate ($400). 12-15 pieces.'
  }
];
