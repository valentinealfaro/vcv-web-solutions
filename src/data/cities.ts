/* Top US metros for local-services SEO landing pages.
   Each entry gets its own /cities/[slug] route + sitemap entry.
   Selected for high population × high local-services search volume. */

export interface City {
  slug:    string;   // URL slug
  name:    string;   // Display name
  state:   string;   // Full state name
  abbr:    string;   // State 2-letter abbreviation
  region:  'Northeast' | 'Midwest' | 'South' | 'West';
  /* Two facts that ground the page in the actual market — used in the
     hero paragraph and meta description. Keep these specific. */
  pop:     string;   // approximate metro population, e.g. "1.4M"
  blurb:   string;   // 1-sentence local-context line
  /* Hot industries we frequently build for in this metro. Mostly
     used for the "Top builds in {city}" callout. */
  topIndustries: string[];
}

export const CITIES: City[] = [
  /* Texas */
  { slug:'houston',         name:'Houston',         state:'Texas',          abbr:'TX', region:'South',     pop:'2.3M', blurb:'Sprawling, hot, and built on small businesses — service-area sites that load fast on mobile dominate here.', topIndustries:['HVAC','Roofers','Plumbers'] },
  { slug:'dallas',          name:'Dallas',          state:'Texas',          abbr:'TX', region:'South',     pop:'1.3M', blurb:'Dense local-services market with high search competition — the Map Pack matters more than ever.', topIndustries:['Roofers','Med Spas','Real Estate'] },
  { slug:'austin',          name:'Austin',          state:'Texas',          abbr:'TX', region:'South',     pop:'970k', blurb:'Fast-growing population means new homeowners and new service-business demand every month.', topIndustries:['Landscapers','Contractors','Dentists'] },
  { slug:'san-antonio',     name:'San Antonio',     state:'Texas',          abbr:'TX', region:'South',     pop:'1.5M', blurb:'Family-owned service businesses are the backbone of the local economy here.', topIndustries:['Auto Repair','HVAC','Pest Control'] },

  /* Florida */
  { slug:'miami',           name:'Miami',           state:'Florida',        abbr:'FL', region:'South',     pop:'440k', blurb:'Storm season every year means roofers, electricians, and HVAC pros are in constant demand.', topIndustries:['Roofers','Med Spas','Restaurants'] },
  { slug:'tampa',           name:'Tampa',           state:'Florida',        abbr:'FL', region:'South',     pop:'400k', blurb:'High homeowner turnover plus humidity means recurring service work for the businesses that show up first on Google.', topIndustries:['HVAC','Plumbers','Pool Services'] },
  { slug:'orlando',         name:'Orlando',         state:'Florida',        abbr:'FL', region:'South',     pop:'310k', blurb:'A tourism economy with surrounding suburbs that need every kind of local service.', topIndustries:['Cleaning','Landscapers','Auto Repair'] },
  { slug:'jacksonville',    name:'Jacksonville',    state:'Florida',        abbr:'FL', region:'South',     pop:'970k', blurb:'Largest city by area in the lower 48 — service-area pages with proper city targeting win the suburbs.', topIndustries:['Roofers','Electricians','Lawyers'] },

  /* California */
  { slug:'los-angeles',     name:'Los Angeles',     state:'California',     abbr:'CA', region:'West',      pop:'3.9M', blurb:'Massive market with brutal local-search competition — only the cleanest, fastest sites rank.', topIndustries:['Med Spas','Salons','Dentists'] },
  { slug:'san-diego',       name:'San Diego',       state:'California',     abbr:'CA', region:'West',      pop:'1.4M', blurb:'Affluent homeowners + year-round weather = steady demand for home services and wellness pros.', topIndustries:['Landscapers','Med Spas','Pool Services'] },
  { slug:'san-francisco',   name:'San Francisco',   state:'California',     abbr:'CA', region:'West',      pop:'810k', blurb:'High-income market where customers research thoroughly — your website is the deciding factor.', topIndustries:['Dentists','Chiropractors','Lawyers'] },
  { slug:'sacramento',      name:'Sacramento',      state:'California',     abbr:'CA', region:'West',      pop:'525k', blurb:'Underrated middle market with steady population growth and reasonable ad-cost-per-lead.', topIndustries:['Roofers','Auto Repair','HVAC'] },

  /* New York */
  { slug:'new-york',        name:'New York',        state:'New York',       abbr:'NY', region:'Northeast', pop:'8.3M', blurb:'Highest local-search competition in the country — the difference between page 1 and page 2 is millions in revenue.', topIndustries:['Lawyers','Dentists','Real Estate'] },
  { slug:'buffalo',         name:'Buffalo',         state:'New York',       abbr:'NY', region:'Northeast', pop:'275k', blurb:'Snow belt = consistent home-services demand from late fall through spring.', topIndustries:['Roofers','Plumbers','HVAC'] },

  /* Illinois */
  { slug:'chicago',         name:'Chicago',         state:'Illinois',       abbr:'IL', region:'Midwest',   pop:'2.7M', blurb:'Largest Midwest market — top-3 Google rankings for service searches generate dozens of leads per week.', topIndustries:['HVAC','Roofers','Plumbers'] },

  /* Arizona */
  { slug:'phoenix',         name:'Phoenix',         state:'Arizona',        abbr:'AZ', region:'West',      pop:'1.6M', blurb:'Triple-digit summers make HVAC and pool services essential — emergency searches peak from June through September.', topIndustries:['HVAC','Pool Services','Landscapers'] },
  { slug:'tucson',          name:'Tucson',          state:'Arizona',        abbr:'AZ', region:'West',      pop:'545k', blurb:'College town plus retirees creates a stable demand for service businesses across price points.', topIndustries:['Roofers','HVAC','Med Spas'] },

  /* Nevada */
  { slug:'las-vegas',       name:'Las Vegas',       state:'Nevada',         abbr:'NV', region:'West',      pop:'660k', blurb:'24-hour city with explosive suburban growth — service businesses that rank locally are stacking back-to-back jobs.', topIndustries:['Pool Services','HVAC','Auto Repair'] },

  /* Washington */
  { slug:'seattle',         name:'Seattle',         state:'Washington',     abbr:'WA', region:'West',      pop:'750k', blurb:'Rainy season runs October through April — roofing and gutter searches stay hot for 7 months a year.', topIndustries:['Roofers','Plumbers','Landscapers'] },

  /* Colorado */
  { slug:'denver',          name:'Denver',          state:'Colorado',       abbr:'CO', region:'West',      pop:'715k', blurb:'High homeowner ratio + altitude + hail = a roofing and home-services market that never slows down.', topIndustries:['Roofers','HVAC','Real Estate'] },

  /* Georgia */
  { slug:'atlanta',         name:'Atlanta',         state:'Georgia',        abbr:'GA', region:'South',     pop:'500k', blurb:'Sprawling metro that rewards service-area pages — 28 counties of suburbs need service businesses on Google.', topIndustries:['Roofers','HVAC','Real Estate'] },

  /* Massachusetts */
  { slug:'boston',          name:'Boston',          state:'Massachusetts',  abbr:'MA', region:'Northeast', pop:'675k', blurb:'Older housing stock + harsh winters = recurring demand for plumbers, electricians, and roofers.', topIndustries:['Plumbers','Electricians','Roofers'] },

  /* Pennsylvania */
  { slug:'philadelphia',    name:'Philadelphia',    state:'Pennsylvania',   abbr:'PA', region:'Northeast', pop:'1.6M', blurb:'Historic homes need specialized contractors — and search visibility separates the booked-up businesses from the dry months.', topIndustries:['Contractors','Plumbers','Roofers'] },
  { slug:'pittsburgh',      name:'Pittsburgh',      state:'Pennsylvania',   abbr:'PA', region:'Northeast', pop:'300k', blurb:'Family-owned trades dominate — the ones with modern websites and proper Google profiles are taking share.', topIndustries:['Plumbers','HVAC','Auto Repair'] },

  /* Ohio */
  { slug:'cleveland',       name:'Cleveland',       state:'Ohio',           abbr:'OH', region:'Midwest',   pop:'370k', blurb:'Snow belt + older homes = year-round service-business demand. Top-ranking sites field 30+ calls a month.', topIndustries:['Roofers','Plumbers','HVAC'] },
  { slug:'columbus',        name:'Columbus',        state:'Ohio',           abbr:'OH', region:'Midwest',   pop:'905k', blurb:'Fastest-growing major Midwest city — new homeowners arriving monthly need every kind of service pro.', topIndustries:['HVAC','Landscapers','Cleaning'] },

  /* North Carolina */
  { slug:'charlotte',       name:'Charlotte',       state:'North Carolina', abbr:'NC', region:'South',     pop:'875k', blurb:'Population is exploding — service-business demand has outpaced supply for 5+ years running.', topIndustries:['Roofers','HVAC','Real Estate'] },
  { slug:'raleigh',         name:'Raleigh',         state:'North Carolina', abbr:'NC', region:'South',     pop:'470k', blurb:'Research Triangle growth means high-income homeowners who research providers carefully — your website is the proof.', topIndustries:['Dentists','Landscapers','Med Spas'] },

  /* Tennessee */
  { slug:'nashville',       name:'Nashville',       state:'Tennessee',      abbr:'TN', region:'South',     pop:'690k', blurb:'Music-city growth + tourism + new builds = a roofing, HVAC, and landscaping market with constant demand.', topIndustries:['Roofers','Landscapers','Real Estate'] },

  /* Missouri */
  { slug:'st-louis',        name:'St. Louis',       state:'Missouri',       abbr:'MO', region:'Midwest',   pop:'300k', blurb:'Heritage market with older homes — plumbers, roofers, and electricians have steady recurring work.', topIndustries:['Plumbers','Roofers','Electricians'] },

  /* Minnesota */
  { slug:'minneapolis',     name:'Minneapolis',     state:'Minnesota',      abbr:'MN', region:'Midwest',   pop:'430k', blurb:'Brutal winters drive emergency-service demand from November through March — fast-loading sites win the panic searches.', topIndustries:['HVAC','Plumbers','Roofers'] },

  /* Oregon */
  { slug:'portland',        name:'Portland',        state:'Oregon',         abbr:'OR', region:'West',      pop:'650k', blurb:'Rainy 8 months a year — roofing and gutter searches stay strong year-round.', topIndustries:['Roofers','Landscapers','Plumbers'] },

  /* Oklahoma — VCV\'s home state */
  { slug:'oklahoma-city',   name:'Oklahoma City',   state:'Oklahoma',       abbr:'OK', region:'South',     pop:'690k', blurb:'Storm season produces roofing and contracting demand on a scale few other markets match.', topIndustries:['Roofers','HVAC','Contractors'] },
  { slug:'tulsa',           name:'Tulsa',           state:'Oklahoma',       abbr:'OK', region:'South',     pop:'415k', blurb:'VCV\'s home market — we\'ve launched dozens of sites here and the patterns work across the state.', topIndustries:['Roofers','Plumbers','Dentists'] },
];

export function findCity(slug: string): City | undefined {
  return CITIES.find(c => c.slug === slug);
}
