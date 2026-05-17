/* US state data for /serving/[state] local-SEO landing pages.
   Each entry has the slug (kebab-case), full name, two-letter code,
   and a brief regional descriptor used in the hero copy. Numbers are
   intentionally generic ("thousands of small businesses") — no fabricated
   per-state revenue or employee figures. */

export interface StateData {
  slug:        string;
  name:        string;
  abbr:        string;
  region:      'Northeast' | 'Midwest' | 'South' | 'West';
  blurb:       string;  // one-line context about local business landscape
}

export const STATES: StateData[] = [
  { slug: 'alabama',         name: 'Alabama',         abbr: 'AL', region: 'South',     blurb: 'From Birmingham to Mobile, Alabama small businesses are increasingly searched online before a customer ever picks up the phone.' },
  { slug: 'alaska',          name: 'Alaska',          abbr: 'AK', region: 'West',      blurb: 'Alaska service businesses face long-distance customer flow — a fast, search-ranked site is often the only way new clients find you.' },
  { slug: 'arizona',         name: 'Arizona',         abbr: 'AZ', region: 'West',      blurb: 'Phoenix, Tucson, and the growing exurbs run on local-search traffic. We build sites for AZ trades, restaurants, and pro services.' },
  { slug: 'arkansas',        name: 'Arkansas',        abbr: 'AR', region: 'South',     blurb: 'From Little Rock to Bentonville, Arkansas small operators rely on Google searches to fill the calendar.' },
  { slug: 'california',      name: 'California',      abbr: 'CA', region: 'West',      blurb: 'California is the most competitive local-search market in the US. Ranking takes a real site — not a template.' },
  { slug: 'colorado',        name: 'Colorado',        abbr: 'CO', region: 'West',      blurb: 'Denver to Grand Junction, Colorado small businesses are growing fast and need lead engines that scale with them.' },
  { slug: 'connecticut',     name: 'Connecticut',     abbr: 'CT', region: 'Northeast', blurb: 'Connecticut homeowners research contractors and service pros online — your site needs to show up first.' },
  { slug: 'delaware',        name: 'Delaware',        abbr: 'DE', region: 'Northeast', blurb: 'Small state, dense local-search competition. We build conversion-focused sites for DE service businesses.' },
  { slug: 'florida',         name: 'Florida',         abbr: 'FL', region: 'South',     blurb: 'Storm season, hurricane prep, year-round tourism — Florida businesses need a site that captures every lead, every season.' },
  { slug: 'georgia',         name: 'Georgia',         abbr: 'GA', region: 'South',     blurb: 'Atlanta to Savannah, Georgia local-service searches dominate buyer intent. Your site is where they decide.' },
  { slug: 'hawaii',          name: 'Hawaii',          abbr: 'HI', region: 'West',      blurb: 'Hawaii service businesses compete on trust and reviews. A clean, fast site signals professionalism instantly.' },
  { slug: 'idaho',           name: 'Idaho',           abbr: 'ID', region: 'West',      blurb: 'Boise and the surrounding metros are growing fast. Idaho businesses need to claim their search territory now.' },
  { slug: 'illinois',        name: 'Illinois',        abbr: 'IL', region: 'Midwest',   blurb: 'Chicago and downstate Illinois both run on local-search lead flow. We build sites that win both markets.' },
  { slug: 'indiana',         name: 'Indiana',         abbr: 'IN', region: 'Midwest',   blurb: 'Indianapolis to Fort Wayne, Indiana service businesses convert best with a site that loads fast on mobile.' },
  { slug: 'iowa',            name: 'Iowa',            abbr: 'IA', region: 'Midwest',   blurb: 'Iowa local service businesses get most leads from Google searches — a clean ranking site beats word-of-mouth alone.' },
  { slug: 'kansas',          name: 'Kansas',          abbr: 'KS', region: 'Midwest',   blurb: 'Kansas trades and pro services rely on local search. Your site needs to be ready when customers search.' },
  { slug: 'kentucky',        name: 'Kentucky',        abbr: 'KY', region: 'South',     blurb: 'Louisville to Lexington, Kentucky business owners need lead engines that handle storm-season call spikes.' },
  { slug: 'louisiana',       name: 'Louisiana',       abbr: 'LA', region: 'South',     blurb: 'New Orleans, Baton Rouge, and beyond — Louisiana service pros book most jobs through search.' },
  { slug: 'maine',           name: 'Maine',           abbr: 'ME', region: 'Northeast', blurb: 'Maine’s seasonal economy means your site has to convert every visit. We build for high-intent local search.' },
  { slug: 'maryland',        name: 'Maryland',        abbr: 'MD', region: 'Northeast', blurb: 'Baltimore to the DC suburbs, Maryland customers expect a polished site before they call. We deliver it.' },
  { slug: 'massachusetts',   name: 'Massachusetts',   abbr: 'MA', region: 'Northeast', blurb: 'Massachusetts homeowners and decision-makers research thoroughly. Your site is the trust threshold.' },
  { slug: 'michigan',        name: 'Michigan',        abbr: 'MI', region: 'Midwest',   blurb: 'Detroit, Grand Rapids, and the Up — Michigan small businesses win or lose on Google local search.' },
  { slug: 'minnesota',       name: 'Minnesota',       abbr: 'MN', region: 'Midwest',   blurb: 'Twin Cities and the Iron Range — Minnesota businesses convert better with a site that loads instantly on mobile.' },
  { slug: 'mississippi',     name: 'Mississippi',     abbr: 'MS', region: 'South',     blurb: 'From Jackson to the Gulf Coast, Mississippi service pros need a site that ranks before competitors do.' },
  { slug: 'missouri',        name: 'Missouri',        abbr: 'MO', region: 'Midwest',   blurb: 'St. Louis, KC, Springfield — Missouri local search volume is high. A ranking site captures it.' },
  { slug: 'montana',         name: 'Montana',         abbr: 'MT', region: 'West',      blurb: 'Montana service businesses cover huge geographic areas. Local SEO compounds the further you stretch.' },
  { slug: 'nebraska',        name: 'Nebraska',        abbr: 'NE', region: 'Midwest',   blurb: 'Omaha, Lincoln, and rural Nebraska all rely on local Google search for lead flow.' },
  { slug: 'nevada',          name: 'Nevada',          abbr: 'NV', region: 'West',      blurb: 'Vegas to Reno, Nevada customers research online first. Your site needs to convert on mobile.' },
  { slug: 'new-hampshire',   name: 'New Hampshire',   abbr: 'NH', region: 'Northeast', blurb: 'New Hampshire homeowners read reviews before they call. Your site needs to back that up.' },
  { slug: 'new-jersey',      name: 'New Jersey',      abbr: 'NJ', region: 'Northeast', blurb: 'Dense local market with high search volume. NJ businesses compete hard for SERP real estate.' },
  { slug: 'new-mexico',      name: 'New Mexico',      abbr: 'NM', region: 'West',      blurb: 'Albuquerque to Santa Fe — NM small businesses need local-search visibility to fill the calendar.' },
  { slug: 'new-york',        name: 'New York',        abbr: 'NY', region: 'Northeast', blurb: 'NYC to the North Country, New York is one of the toughest local-search markets in the US. Win it with a real site.' },
  { slug: 'north-carolina',  name: 'North Carolina',  abbr: 'NC', region: 'South',     blurb: 'Charlotte, Raleigh, the Triangle — NC small businesses grow on local-search lead flow.' },
  { slug: 'north-dakota',    name: 'North Dakota',    abbr: 'ND', region: 'Midwest',   blurb: 'North Dakota service pros cover wide territory. Local SEO matters more in low-density markets.' },
  { slug: 'ohio',            name: 'Ohio',            abbr: 'OH', region: 'Midwest',   blurb: 'Cleveland, Columbus, Cincinnati — three metro markets, all dominated by local search.' },
  { slug: 'oklahoma',        name: 'Oklahoma',        abbr: 'OK', region: 'South',     blurb: 'OKC to Tulsa to Lawton — Oklahoma is our home state. We know what works in OK local search.' },
  { slug: 'oregon',          name: 'Oregon',          abbr: 'OR', region: 'West',      blurb: 'Portland and the I-5 corridor — Oregon customers research deeply before they call.' },
  { slug: 'pennsylvania',    name: 'Pennsylvania',    abbr: 'PA', region: 'Northeast', blurb: 'Philly, Pittsburgh, and the in-between — PA is a high-volume local-search market across the state.' },
  { slug: 'rhode-island',    name: 'Rhode Island',    abbr: 'RI', region: 'Northeast', blurb: 'Small state, tight competition. Rhode Island service businesses need a site that signals trust instantly.' },
  { slug: 'south-carolina',  name: 'South Carolina',  abbr: 'SC', region: 'South',     blurb: 'Charleston, Columbia, Greenville — SC customers Google their service pros before calling.' },
  { slug: 'south-dakota',    name: 'South Dakota',    abbr: 'SD', region: 'Midwest',   blurb: 'Sioux Falls to Rapid City, South Dakota service pros win with strong local-search visibility.' },
  { slug: 'tennessee',       name: 'Tennessee',       abbr: 'TN', region: 'South',     blurb: 'Nashville, Knoxville, Memphis — Tennessee’s metros are local-search heavy markets.' },
  { slug: 'texas',           name: 'Texas',           abbr: 'TX', region: 'South',     blurb: 'Houston, Dallas, Austin, San Antonio — Texas is the largest local-services market in the US.' },
  { slug: 'utah',            name: 'Utah',            abbr: 'UT', region: 'West',      blurb: 'Salt Lake City and the Wasatch Front grow fast. Utah businesses need conversion-focused sites that keep up.' },
  { slug: 'vermont',         name: 'Vermont',         abbr: 'VT', region: 'Northeast', blurb: 'Small-state economy, high-trust buyers. Your Vermont site has to feel as solid as your work.' },
  { slug: 'virginia',        name: 'Virginia',        abbr: 'VA', region: 'South',     blurb: 'NoVA to Richmond to Hampton Roads — Virginia is a high-intent local-search market.' },
  { slug: 'washington',      name: 'Washington',      abbr: 'WA', region: 'West',      blurb: 'Seattle, Spokane, and the Puget Sound — WA customers expect a fast, modern site.' },
  { slug: 'west-virginia',   name: 'West Virginia',   abbr: 'WV', region: 'South',     blurb: 'West Virginia service pros cover wide territory. A search-ranking site is your statewide salesperson.' },
  { slug: 'wisconsin',       name: 'Wisconsin',       abbr: 'WI', region: 'Midwest',   blurb: 'Milwaukee, Madison, and the rest — Wisconsin businesses run on local-search lead flow.' },
  { slug: 'wyoming',         name: 'Wyoming',         abbr: 'WY', region: 'West',      blurb: 'Wyoming service pros operate across vast distances. Local SEO does the cold-call work for you.' },
];

export function findState(slug: string): StateData | undefined {
  return STATES.find(s => s.slug === slug);
}
