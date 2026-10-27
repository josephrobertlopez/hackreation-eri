/*
 * Industries and the recurring tasks employers in them actually name.
 * Synthetic: no real employer, no real job description.
 *
 * These are a STARTING LIST the employer edits. ERI's §6 step 2 asks the
 * employer for three to five needs in their own words; the template exists so
 * a hiring manager with ten minutes has somewhere to start, not so the tool
 * can decide for them. A task carries:
 *
 *   skills  - the plain skill ids the work calls for (vocabulary.js)
 *   traits  - facts about the WORK (routine, standing, no-public ...).
 *             Never about a worker.
 *   area    - interest area ids, for reporting a candidate's stated interest
 */

export const INDUSTRIES = [
  {
    id: 'retail',
    name: 'Retail store',
    blurb: 'A shop with a sales floor, a stockroom and deliveries.',
    areas: ['merchandise-and-retail', 'tidy-spaces'],
    recurringTasks: [
      { id: 'retail-inventory', label: 'Counting inventory and checking stock levels each week', skills: ['counting-stock', 'attention-to-detail', 'scanning-barcodes'], traits: ['routine', 'standing', 'no-public', 'solo', 'part-time-ok'], area: ['merchandise-and-retail'] },
      { id: 'retail-restock', label: 'Restocking shelves and facing product before opening', skills: ['restocking-shelves', 'organizing', 'light-lifting'], traits: ['routine', 'standing', 'no-public', 'set-hours', 'part-time-ok'], area: ['merchandise-and-retail', 'tidy-spaces'] },
      { id: 'retail-displays', label: 'Setting up and maintaining product displays', skills: ['display-setup', 'organizing', 'attention-to-detail'], traits: ['variable', 'standing', 'team', 'part-time-ok'], area: ['merchandise-and-retail', 'making-and-building'] },
      { id: 'retail-price', label: 'Labelling and pricing new stock in the back room', skills: ['labelling', 'careful-repetition', 'attention-to-detail'], traits: ['routine', 'seated', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['merchandise-and-retail'] },
      { id: 'retail-deliveries', label: 'Breaking down deliveries and sorting stock into the right bays', skills: ['sorting', 'light-lifting', 'packing-boxes'], traits: ['routine', 'standing', 'no-public', 'team'], area: ['merchandise-and-retail'] },
      { id: 'retail-floor', label: 'Greeting customers and helping them find things', skills: ['greeting-customers', 'answering-questions'], traits: ['variable', 'standing', 'busy', 'public-facing', 'team'], area: ['helping-people', 'merchandise-and-retail'] },
      { id: 'retail-tills', label: 'Running the register at busy times', skills: ['cash-handling', 'greeting-customers'], traits: ['busy', 'standing', 'public-facing', 'shifting-hours'], area: ['helping-people'] }
    ]
  },
  {
    id: 'grocery',
    name: 'Grocery or convenience store',
    blurb: 'Food retail with chilled stock, date checks and heavy delivery days.',
    areas: ['food-and-kitchen', 'merchandise-and-retail'],
    recurringTasks: [
      { id: 'grocery-dates', label: 'Date-checking chilled stock and pulling anything short-dated', skills: ['attention-to-detail', 'following-checklists', 'sorting'], traits: ['routine', 'standing', 'no-public', 'solo', 'part-time-ok'], area: ['food-and-kitchen'] },
      { id: 'grocery-shelves', label: 'Filling the aisles overnight and facing shelves', skills: ['restocking-shelves', 'light-lifting', 'organizing'], traits: ['routine', 'standing', 'quiet', 'no-public', 'set-hours'], area: ['merchandise-and-retail', 'tidy-spaces'] },
      { id: 'grocery-temps', label: 'Taking fridge and freezer temperatures and writing them in the log', skills: ['equipment-checks', 'written-notes', 'following-checklists'], traits: ['routine', 'standing', 'no-public', 'solo', 'set-hours', 'part-time-ok'], area: ['food-and-kitchen'] },
      { id: 'grocery-trolleys', label: 'Collecting trolleys and keeping the entrance tidy', skills: ['cleaning', 'site-route', 'organizing'], traits: ['routine', 'standing', 'solo', 'part-time-ok'], area: ['tidy-spaces'] },
      { id: 'grocery-produce', label: 'Trimming and refreshing the produce display', skills: ['food-prep', 'display-setup', 'attention-to-detail'], traits: ['routine', 'standing', 'no-public', 'part-time-ok'], area: ['food-and-kitchen', 'plants-and-outdoors'] },
      { id: 'grocery-recycling', label: 'Flattening cartons and running the recycling bay', skills: ['packing-boxes', 'cleaning', 'light-lifting'], traits: ['routine', 'standing', 'quiet', 'no-public', 'solo'], area: ['tidy-spaces'] }
    ]
  },
  {
    id: 'warehouse',
    name: 'Warehouse or distribution',
    blurb: 'Goods in, goods out, pick-and-pack, and a lot of counting.',
    areas: ['making-and-building', 'vehicles-and-machines'],
    recurringTasks: [
      { id: 'wh-pick', label: 'Picking orders from a printed pick list', skills: ['following-checklists', 'scanning-barcodes', 'site-route'], traits: ['routine', 'standing', 'solo', 'no-public', 'set-hours', 'part-time-ok'], area: ['making-and-building'] },
      { id: 'wh-pack', label: 'Packing and labelling outbound boxes', skills: ['packing-boxes', 'labelling', 'careful-repetition'], traits: ['routine', 'seated', 'quiet', 'no-public', 'part-time-ok'], area: ['making-and-building'] },
      { id: 'wh-count', label: 'Cycle-counting bin locations and reporting the variance', skills: ['counting-stock', 'attention-to-detail', 'data-entry'], traits: ['routine', 'standing', 'solo', 'no-public'], area: ['computers-and-data'] },
      { id: 'wh-returns', label: 'Sorting returns into resale, repair and scrap', skills: ['sorting', 'attention-to-detail', 'organizing'], traits: ['routine', 'seated', 'quiet', 'no-public', 'solo'], area: ['making-and-building'] },
      { id: 'wh-goodsin', label: 'Checking deliveries against the paperwork', skills: ['counting-stock', 'measuring', 'written-notes'], traits: ['variable', 'standing', 'team', 'no-public'], area: ['computers-and-data'] },
      { id: 'wh-housekeeping', label: 'Keeping aisles clear and running the housekeeping checklist', skills: ['cleaning', 'following-checklists', 'site-route'], traits: ['routine', 'standing', 'solo', 'part-time-ok'], area: ['tidy-spaces'] }
    ]
  },
  {
    id: 'food-service',
    name: 'Restaurant, cafe or catering',
    blurb: 'A kitchen with prep lists, a wash-up and a front of house.',
    areas: ['food-and-kitchen', 'helping-people'],
    recurringTasks: [
      { id: 'fs-prep', label: 'Morning prep: chopping, portioning and traying up', skills: ['food-prep', 'measuring', 'following-checklists'], traits: ['routine', 'standing', 'team', 'set-hours', 'no-public'], area: ['food-and-kitchen'] },
      { id: 'fs-wash', label: 'Running the dish area through service', skills: ['dishwashing', 'careful-repetition', 'cleaning'], traits: ['routine', 'standing', 'busy', 'no-public', 'solo'], area: ['food-and-kitchen'] },
      { id: 'fs-stock', label: 'Checking the dry store and writing the order list', skills: ['counting-stock', 'written-notes', 'organizing'], traits: ['routine', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['food-and-kitchen'] },
      { id: 'fs-clean', label: 'Closing-down clean against the checklist', skills: ['cleaning', 'following-checklists'], traits: ['routine', 'standing', 'no-public', 'set-hours'], area: ['tidy-spaces'] },
      { id: 'fs-temps', label: 'Food-safety temperature checks and the log book', skills: ['equipment-checks', 'written-notes', 'attention-to-detail'], traits: ['routine', 'standing', 'no-public', 'part-time-ok'], area: ['food-and-kitchen'] },
      { id: 'fs-front', label: 'Welcoming guests and seating them', skills: ['greeting-customers', 'answering-questions'], traits: ['variable', 'standing', 'busy', 'public-facing', 'shifting-hours'], area: ['helping-people'] }
    ]
  },
  {
    id: 'office',
    name: 'Office or professional services',
    blurb: 'An administrative back office with records, post and data.',
    areas: ['computers-and-data', 'books-and-paper'],
    recurringTasks: [
      { id: 'off-entry', label: 'Entering last week’s forms into the system', skills: ['data-entry', 'attention-to-detail', 'careful-repetition'], traits: ['routine', 'seated', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['computers-and-data'] },
      { id: 'off-scan', label: 'Scanning and filing paper records', skills: ['filing', 'scanning-barcodes', 'organizing'], traits: ['routine', 'seated', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['books-and-paper'] },
      { id: 'off-post', label: 'Sorting the post and the internal delivery round', skills: ['mail-handling', 'sorting', 'site-route'], traits: ['routine', 'standing', 'set-hours', 'part-time-ok'], area: ['books-and-paper'] },
      { id: 'off-supplies', label: 'Keeping the stationery cupboard stocked and tidy', skills: ['counting-stock', 'organizing', 'restocking-shelves'], traits: ['routine', 'standing', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['tidy-spaces'] },
      { id: 'off-checks', label: 'Checking data for errors before it goes out', skills: ['attention-to-detail', 'following-checklists', 'written-notes'], traits: ['routine', 'seated', 'quiet', 'solo'], area: ['computers-and-data'] },
      { id: 'off-reception', label: 'Covering reception and answering simple enquiries', skills: ['greeting-customers', 'answering-questions', 'data-entry'], traits: ['variable', 'seated', 'public-facing', 'set-hours'], area: ['helping-people'] }
    ]
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse, nursery or landscaping',
    blurb: 'Growing stock, watering rounds and seasonal planting.',
    areas: ['plants-and-outdoors', 'tidy-spaces'],
    recurringTasks: [
      { id: 'gh-water', label: 'The daily watering round through the glasshouses', skills: ['plant-care', 'site-route', 'following-checklists'], traits: ['routine', 'standing', 'solo', 'quiet', 'no-public', 'set-hours', 'part-time-ok'], area: ['plants-and-outdoors'] },
      { id: 'gh-pot', label: 'Potting on seedlings into larger pots', skills: ['plant-care', 'careful-repetition', 'measuring'], traits: ['routine', 'seated', 'quiet', 'no-public', 'part-time-ok'], area: ['plants-and-outdoors', 'making-and-building'] },
      { id: 'gh-label', label: 'Labelling and pricing plant stock for sale', skills: ['labelling', 'attention-to-detail', 'careful-repetition'], traits: ['routine', 'seated', 'quiet', 'no-public', 'solo'], area: ['plants-and-outdoors', 'merchandise-and-retail'] },
      { id: 'gh-benches', label: 'Tidying benches and clearing dead stock', skills: ['cleaning', 'sorting', 'organizing'], traits: ['routine', 'standing', 'solo', 'part-time-ok'], area: ['tidy-spaces'] },
      { id: 'gh-loads', label: 'Loading plant orders onto trolleys for collection', skills: ['light-lifting', 'counting-stock', 'packing-boxes'], traits: ['variable', 'standing', 'team', 'shifting-hours'], area: ['plants-and-outdoors'] },
      { id: 'gh-photos', label: 'Photographing stock for the online listings', skills: ['photographing-items', 'attention-to-detail', 'data-entry'], traits: ['routine', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['computers-and-data', 'plants-and-outdoors'] }
    ]
  },
  {
    id: 'hospitality',
    name: 'Hotel or hospitality',
    blurb: 'Rooms, linen, public areas and an arrivals desk.',
    areas: ['tidy-spaces', 'helping-people'],
    recurringTasks: [
      { id: 'hp-linen', label: 'Laundry: sorting, folding and restocking linen carts', skills: ['laundry', 'sorting', 'careful-repetition'], traits: ['routine', 'standing', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['tidy-spaces'] },
      { id: 'hp-public', label: 'Hourly tidy of the public areas against a checklist', skills: ['cleaning', 'following-checklists', 'site-route'], traits: ['routine', 'standing', 'public-facing', 'set-hours', 'part-time-ok'], area: ['tidy-spaces'] },
      { id: 'hp-stock', label: 'Counting housekeeping supplies and refilling the trolleys', skills: ['counting-stock', 'restocking-shelves', 'organizing'], traits: ['routine', 'standing', 'no-public', 'solo', 'part-time-ok'], area: ['tidy-spaces'] },
      { id: 'hp-breakfast', label: 'Setting up and clearing the breakfast buffet', skills: ['food-prep', 'cleaning', 'display-setup'], traits: ['routine', 'standing', 'busy', 'set-hours'], area: ['food-and-kitchen'] },
      { id: 'hp-maint', label: 'Walking the maintenance safety checks and logging them', skills: ['equipment-checks', 'written-notes', 'site-route'], traits: ['routine', 'standing', 'solo', 'no-public'], area: ['vehicles-and-machines'] },
      { id: 'hp-desk', label: 'Welcoming arrivals at the desk', skills: ['greeting-customers', 'answering-questions', 'data-entry'], traits: ['variable', 'standing', 'busy', 'public-facing', 'shifting-hours'], area: ['helping-people'] }
    ]
  },
  {
    id: 'light-assembly',
    name: 'Light manufacturing or assembly',
    blurb: 'Benches, kits, quality checks and a shipping bay.',
    areas: ['making-and-building', 'vehicles-and-machines'],
    recurringTasks: [
      { id: 'la-kits', label: 'Making up component kits to a bench card', skills: ['careful-repetition', 'following-checklists', 'counting-stock'], traits: ['routine', 'seated', 'quiet', 'no-public', 'solo', 'part-time-ok'], area: ['making-and-building'] },
      { id: 'la-qc', label: 'Visual quality check on finished units', skills: ['attention-to-detail', 'measuring', 'written-notes'], traits: ['routine', 'seated', 'quiet', 'no-public'], area: ['making-and-building'] },
      { id: 'la-pack', label: 'Boxing, labelling and palletising finished goods', skills: ['packing-boxes', 'labelling', 'light-lifting'], traits: ['routine', 'standing', 'team', 'set-hours'], area: ['making-and-building'] },
      { id: 'la-tools', label: 'Daily tool and machine checks with the maintenance log', skills: ['equipment-checks', 'following-checklists', 'written-notes'], traits: ['routine', 'standing', 'solo', 'no-public', 'set-hours'], area: ['vehicles-and-machines'] },
      { id: 'la-scrap', label: 'Sorting offcuts and scrap for recycling', skills: ['sorting', 'cleaning', 'light-lifting'], traits: ['routine', 'standing', 'quiet', 'solo', 'part-time-ok'], area: ['tidy-spaces'] },
      { id: 'la-stores', label: 'Keeping the stores area organized and stock counted', skills: ['organizing', 'counting-stock', 'restocking-shelves'], traits: ['routine', 'standing', 'quiet', 'no-public', 'solo'], area: ['making-and-building'] }
    ]
  }
];

export const INDUSTRY_BY_ID = new Map(INDUSTRIES.map((i) => [i.id, i]));

export function findTask(taskId) {
  for (const industry of INDUSTRIES) {
    const task = industry.recurringTasks.find((t) => t.id === taskId);
    if (task) return { industry, task };
  }
  return null;
}
