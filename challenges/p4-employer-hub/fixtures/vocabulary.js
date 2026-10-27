/*
 * Shared plain-language vocabulary. Synthetic, no real people.
 *
 * `SKILLS[].name` is deliberately a plain phrase an ordinary person would use
 * about their own work, so a sibling project (P1 Show Your Skills) can emit the
 * same `id` and this hub can read it without a translation layer. ERI's §12
 * names that handoff. Keep ids stable; add, don't rename.
 *
 * `keywords` exist for ONE purpose: turning an employer's own typed sentence
 * into a quotable span of their own words. They never describe a person.
 */

export const SKILLS = [
  { id: 'organizing', name: 'organizing things', keywords: ['organiz', 'organis', 'tidy', 'arrang', 'straighten'] },
  { id: 'sorting', name: 'sorting items into groups', keywords: ['sort', 'separat', 'group items', 'categoris', 'categoriz'] },
  { id: 'counting-stock', name: 'counting stock', keywords: ['count', 'inventory', 'stock level', 'stocktake', 'tally'] },
  { id: 'attention-to-detail', name: 'noticing small details', keywords: ['detail', 'accurac', 'accurate', 'double-check', 'double check', 'quality check', 'spot errors', 'catch mistakes'] },
  { id: 'following-checklists', name: 'following a checklist', keywords: ['checklist', 'procedure', 'step by step', 'opening duties', 'closing duties', 'follow a process', 'same steps'] },
  { id: 'careful-repetition', name: 'doing careful repeat work', keywords: ['repetitiv', 'repeat', 'over and over', 'assembl'] },
  { id: 'labelling', name: 'labelling and pricing', keywords: ['label', 'price tag', 'pricing', 'tagging', 'ticketing', 'signage'] },
  { id: 'scanning-barcodes', name: 'scanning barcodes', keywords: ['scan', 'barcode', 'handheld'] },
  { id: 'packing-boxes', name: 'packing boxes', keywords: ['pack', 'box', 'carton', 'palletis', 'palletiz'] },
  { id: 'data-entry', name: 'entering information on a computer', keywords: ['data entry', 'typ', 'spreadsheet', 'enter into the computer', 'update the system', 'keying'] },
  { id: 'greeting-customers', name: 'greeting customers', keywords: ['greet', 'welcome customer', 'front desk', 'reception', 'meet and greet'] },
  { id: 'answering-questions', name: 'answering simple questions', keywords: ['answer question', 'give directions', 'help customers find', 'phone enquir', 'phone inquir'] },
  { id: 'cleaning', name: 'cleaning and wiping down', keywords: ['clean', 'wip', 'sanitis', 'sanitiz', 'dust', 'mop', 'sweep', 'trash', 'rubbish'] },
  { id: 'restocking-shelves', name: 'restocking shelves', keywords: ['restock', 'stock shelves', 'shelf', 'shelves', 'facing', 'replenish'] },
  { id: 'display-setup', name: 'setting up displays', keywords: ['display', 'merchandis', 'window', 'planogram', 'end cap', 'endcap'] },
  { id: 'light-lifting', name: 'moving light boxes and carrying', keywords: ['carry', 'unload', 'move boxes', 'lift', 'bring in deliveries'] },
  { id: 'plant-care', name: 'looking after plants', keywords: ['water the plant', 'watering', 'plant', 'garden', 'greenhouse', 'weed', 'potting', 'mulch', 'mow'] },
  { id: 'food-prep', name: 'basic food preparation', keywords: ['food prep', 'prep work', 'chop', 'portion', 'tray up', 'salad', 'sandwich mak'] },
  { id: 'dishwashing', name: 'washing dishes', keywords: ['dish', 'washing up', 'pot wash', 'glassware'] },
  { id: 'laundry', name: 'laundry and folding', keywords: ['laundry', 'linen', 'towel', 'fold'] },
  { id: 'filing', name: 'filing paperwork', keywords: ['filing', 'paperwork', 'scan document', 'archiv', 'records room'] },
  { id: 'mail-handling', name: 'sorting and delivering mail', keywords: ['mail', 'envelope', 'postage', 'post room', 'internal deliver'] },
  { id: 'photographing-items', name: 'photographing items', keywords: ['photo', 'photograph', 'take picture', 'listing image'] },
  { id: 'measuring', name: 'measuring and weighing', keywords: ['measur', 'weigh', 'dimension'] },
  { id: 'cash-handling', name: 'handling cash and the register', keywords: ['cash', 'register', 'till', 'checkout', 'take payment', 'point of sale'] },
  { id: 'equipment-checks', name: 'checking equipment', keywords: ['equipment check', 'machine check', 'calibrat', 'maintenance log', 'safety check', 'temperature log'] },
  { id: 'written-notes', name: 'writing short notes and logs', keywords: ['write up', 'log book', 'logbook', 'keep a log', 'note down'] },
  { id: 'site-route', name: 'following a route around the site', keywords: ['round', 'route', 'walk the floor', 'go round each'] }
];

/* Interest areas. A stated interest is reported as a fact ("they named this"),
 * never added up into a number. */
export const INTERESTS = [
  { id: 'merchandise-and-retail', name: 'merchandise and shops' },
  { id: 'plants-and-outdoors', name: 'plants and being outdoors' },
  { id: 'food-and-kitchen', name: 'food and kitchens' },
  { id: 'computers-and-data', name: 'computers and data' },
  { id: 'books-and-paper', name: 'books, paper and records' },
  { id: 'making-and-building', name: 'making and building things' },
  { id: 'helping-people', name: 'helping people directly' },
  { id: 'animals', name: 'animals' },
  { id: 'vehicles-and-machines', name: 'vehicles and machines' },
  { id: 'tidy-spaces', name: 'tidy, well-kept spaces' }
];

/*
 * Work preferences. Each preference names task traits it sits well with and
 * traits worth a conversation. This produces a NOTE with two possible labels
 * ('fits' / 'worth discussing'). It is never counted, summed, weighted or
 * ordered. A mismatch is a thing for two people to talk about, not a penalty.
 */
export const PREFERENCES = [
  { id: 'routine-work', name: 'routine work that is the same each day', fitsTraits: ['routine'], discussTraits: ['variable'] },
  { id: 'variety', name: 'variety from day to day', fitsTraits: ['variable'], discussTraits: ['routine'] },
  { id: 'seated-work', name: 'work that can be done sitting', fitsTraits: ['seated'], discussTraits: ['standing'] },
  { id: 'moving-around', name: 'being on the move', fitsTraits: ['standing'], discussTraits: ['seated'] },
  { id: 'working-alone', name: 'working on my own', fitsTraits: ['solo'], discussTraits: ['team'] },
  { id: 'working-with-others', name: 'working alongside other people', fitsTraits: ['team'], discussTraits: ['solo'] },
  { id: 'quiet-space', name: 'a quieter space', fitsTraits: ['quiet'], discussTraits: ['busy'] },
  { id: 'customer-contact', name: 'talking with customers', fitsTraits: ['public-facing'], discussTraits: ['no-public'] },
  { id: 'no-customer-contact', name: 'work away from the public', fitsTraits: ['no-public'], discussTraits: ['public-facing'] },
  { id: 'set-schedule', name: 'the same hours every week', fitsTraits: ['set-hours'], discussTraits: ['shifting-hours'] },
  { id: 'part-time', name: 'part-time hours', fitsTraits: ['part-time-ok'], discussTraits: ['full-time-only'] },
  { id: 'demonstrated-instructions', name: 'being shown a task rather than told', fitsTraits: [], discussTraits: [] },
  { id: 'written-instructions', name: 'written steps I can keep', fitsTraits: [], discussTraits: [] },
  { id: 'one-point-of-contact', name: 'one person to ask questions', fitsTraits: [], discussTraits: [] }
];

export const SKILL_BY_ID = new Map(SKILLS.map((s) => [s.id, s]));
export const INTEREST_BY_ID = new Map(INTERESTS.map((i) => [i.id, i]));
export const PREFERENCE_BY_ID = new Map(PREFERENCES.map((p) => [p.id, p]));

/* Every trait a task may declare. Traits describe the WORK, never the worker. */
export const TASK_TRAITS = [
  'routine', 'variable', 'seated', 'standing', 'solo', 'team', 'quiet', 'busy',
  'public-facing', 'no-public', 'set-hours', 'shifting-hours', 'part-time-ok', 'full-time-only'
];
