// Master list of NSE-listed companies.
// aliases: all name variants used to match against RSS article titles/descriptions.
const COMPANIES = [
  // ── Nifty 50 / Large Cap ──
  { name: "Reliance Industries",        ticker: "RELIANCE.NS",    aliases: ["Reliance Industries", "Reliance", "RIL"] },
  { name: "Tata Consultancy Services",  ticker: "TCS.NS",         aliases: ["Tata Consultancy Services", "TCS"] },
  { name: "HDFC Bank",                  ticker: "HDFCBANK.NS",    aliases: ["HDFC Bank", "HDFC"] },
  { name: "Infosys",                    ticker: "INFY.NS",        aliases: ["Infosys"] },
  { name: "ICICI Bank",                 ticker: "ICICIBANK.NS",   aliases: ["ICICI Bank", "ICICI"] },
  { name: "Hindustan Unilever",         ticker: "HINDUNILVR.NS",  aliases: ["Hindustan Unilever", "HUL"] },
  { name: "ITC",                        ticker: "ITC.NS",         aliases: ["ITC"] },
  { name: "State Bank of India",        ticker: "SBIN.NS",        aliases: ["State Bank of India", "SBI"] },
  { name: "Bajaj Finance",              ticker: "BAJFINANCE.NS",  aliases: ["Bajaj Finance"] },
  { name: "Bharti Airtel",              ticker: "BHARTIARTL.NS",  aliases: ["Bharti Airtel", "Airtel"] },
  { name: "Kotak Mahindra Bank",        ticker: "KOTAKBANK.NS",   aliases: ["Kotak Mahindra Bank", "Kotak Bank", "Kotak"] },
  { name: "Larsen & Toubro",            ticker: "LT.NS",          aliases: ["Larsen & Toubro", "L&T", "Larsen and Toubro"] },
  { name: "Asian Paints",               ticker: "ASIANPAINT.NS",  aliases: ["Asian Paints"] },
  { name: "Axis Bank",                  ticker: "AXISBANK.NS",    aliases: ["Axis Bank"] },
  { name: "Maruti Suzuki",              ticker: "MARUTI.NS",      aliases: ["Maruti Suzuki", "Maruti"] },
  { name: "Sun Pharmaceutical",         ticker: "SUNPHARMA.NS",   aliases: ["Sun Pharmaceutical", "Sun Pharma"] },
  { name: "Wipro",                      ticker: "WIPRO.NS",       aliases: ["Wipro"] },
  { name: "UltraTech Cement",           ticker: "ULTRACEMCO.NS",  aliases: ["UltraTech Cement", "UltraTech"] },
  { name: "Titan Company",              ticker: "TITAN.NS",       aliases: ["Titan Company", "Titan"] },
  { name: "Nestle India",               ticker: "NESTLEIND.NS",   aliases: ["Nestle India", "Nestlé India", "Nestle"] },
  { name: "HCL Technologies",           ticker: "HCLTECH.NS",     aliases: ["HCL Technologies", "HCL Tech", "HCL"] },
  { name: "Tech Mahindra",              ticker: "TECHM.NS",       aliases: ["Tech Mahindra"] },
  { name: "Mahindra & Mahindra",        ticker: "M&M.NS",         aliases: ["Mahindra & Mahindra", "Mahindra and Mahindra", "M&M", "Mahindra"] },
  { name: "Bajaj Finserv",              ticker: "BAJAJFINSV.NS",  aliases: ["Bajaj Finserv"] },
  { name: "Power Grid Corporation",     ticker: "POWERGRID.NS",   aliases: ["Power Grid Corporation", "Power Grid"] },
  { name: "NTPC",                       ticker: "NTPC.NS",        aliases: ["NTPC"] },
  { name: "Tata Motors",                ticker: "TMCV.NS",        aliases: ["Tata Motors"] },
  { name: "Tata Steel",                 ticker: "TATASTEEL.NS",   aliases: ["Tata Steel"] },
  { name: "JSW Steel",                  ticker: "JSWSTEEL.NS",    aliases: ["JSW Steel"] },
  { name: "Hindalco Industries",        ticker: "HINDALCO.NS",    aliases: ["Hindalco Industries", "Hindalco"] },
  { name: "IndusInd Bank",              ticker: "INDUSINDBK.NS",  aliases: ["IndusInd Bank", "IndusInd"] },
  { name: "Dr. Reddy's Laboratories",  ticker: "DRREDDY.NS",     aliases: ["Dr. Reddy's Laboratories", "Dr Reddys", "Dr. Reddy's"] },
  { name: "Cipla",                      ticker: "CIPLA.NS",       aliases: ["Cipla"] },
  { name: "Divis Laboratories",         ticker: "DIVISLAB.NS",    aliases: ["Divis Laboratories", "Divi's Laboratories", "Divis Labs"] },
  { name: "Eicher Motors",              ticker: "EICHERMOT.NS",   aliases: ["Eicher Motors", "Royal Enfield"] },
  { name: "Hero MotoCorp",              ticker: "HEROMOTOCO.NS",  aliases: ["Hero MotoCorp", "Hero Motocorp"] },
  { name: "Bajaj Auto",                 ticker: "BAJAJ-AUTO.NS",  aliases: ["Bajaj Auto"] },
  { name: "Grasim Industries",          ticker: "GRASIM.NS",      aliases: ["Grasim Industries", "Grasim"] },
  { name: "ONGC",                       ticker: "ONGC.NS",        aliases: ["ONGC", "Oil and Natural Gas"] },
  { name: "Coal India",                 ticker: "COALINDIA.NS",   aliases: ["Coal India"] },

  // ── Adani Group ──
  { name: "Adani Enterprises",          ticker: "ADANIENT.NS",    aliases: ["Adani Enterprises", "Adani"] },
  { name: "Adani Ports",                ticker: "ADANIPORTS.NS",  aliases: ["Adani Ports", "APSEZ"] },
  { name: "Adani Green Energy",         ticker: "ADANIGREEN.NS",  aliases: ["Adani Green Energy", "Adani Green"] },
  { name: "Adani Total Gas",            ticker: "ATGL.NS",        aliases: ["Adani Total Gas"] },
  { name: "Adani Power",                ticker: "ADANIPOWER.NS",  aliases: ["Adani Power"] },
  { name: "Adani Wilmar",               ticker: "AWL.NS",         aliases: ["Adani Wilmar", "Fortune Foods"] },

  // ── New Age Tech ──
  { name: "Zomato",                     ticker: "ZOMATO.NS",      aliases: ["Zomato"] },
  { name: "Paytm",                      ticker: "PAYTM.NS",       aliases: ["Paytm", "One97 Communications"] },
  { name: "Nykaa",                      ticker: "NYKAA.NS",       aliases: ["Nykaa", "FSN E-Commerce"] },
  { name: "Delhivery",                  ticker: "DELHIVERY.NS",   aliases: ["Delhivery"] },
  { name: "Policybazaar",               ticker: "POLICYBZR.NS",   aliases: ["Policybazaar", "PB Fintech"] },
  { name: "Swiggy",                     ticker: "SWIGGY.NS",      aliases: ["Swiggy", "Bundl Technologies"] },

  // ── Energy / Oil ──
  { name: "Vedanta",                    ticker: "VEDL.NS",        aliases: ["Vedanta"] },
  { name: "Bharat Petroleum",           ticker: "BPCL.NS",        aliases: ["Bharat Petroleum", "BPCL"] },
  { name: "Indian Oil Corporation",     ticker: "IOC.NS",         aliases: ["Indian Oil Corporation", "Indian Oil", "IOC"] },
  { name: "GAIL India",                 ticker: "GAIL.NS",        aliases: ["GAIL India", "GAIL"] },

  // ── Consumer / FMCG ──
  { name: "Pidilite Industries",        ticker: "PIDILITIND.NS",  aliases: ["Pidilite Industries", "Pidilite", "Fevicol"] },
  { name: "Havells India",              ticker: "HAVELLS.NS",     aliases: ["Havells India", "Havells"] },
  { name: "Voltas",                     ticker: "VOLTAS.NS",      aliases: ["Voltas"] },
  { name: "Jubilant FoodWorks",         ticker: "JUBLFOOD.NS",    aliases: ["Jubilant FoodWorks", "Dominos India", "Jubilant Food"] },
  { name: "Avenue Supermarts (DMart)",  ticker: "DMART.NS",       aliases: ["Avenue Supermarts", "DMart", "D-Mart"] },
  { name: "Trent",                      ticker: "TRENT.NS",       aliases: ["Trent", "Westside", "Zudio"] },
  { name: "Dabur India",                ticker: "DABUR.NS",       aliases: ["Dabur India", "Dabur"] },
  { name: "Marico",                     ticker: "MARICO.NS",      aliases: ["Marico", "Parachute"] },
  { name: "Godrej Consumer Products",   ticker: "GODREJCP.NS",    aliases: ["Godrej Consumer Products", "Godrej Consumer", "GCPL"] },
  { name: "Emami",                      ticker: "EMAMILTD.NS",    aliases: ["Emami"] },
  { name: "Colgate-Palmolive India",    ticker: "COLPAL.NS",      aliases: ["Colgate-Palmolive", "Colgate Palmolive India", "Colgate"] },
  { name: "Britannia Industries",       ticker: "BRITANNIA.NS",   aliases: ["Britannia Industries", "Britannia"] },
  { name: "United Spirits",             ticker: "UNITDSPR.NS",    aliases: ["United Spirits", "Diageo India"] },
  { name: "United Breweries",           ticker: "UBL.NS",         aliases: ["United Breweries", "Kingfisher"] },
  { name: "Varun Beverages",            ticker: "VBL.NS",         aliases: ["Varun Beverages", "Pepsi India"] },
  { name: "P&G Hygiene",               ticker: "PGHH.NS",        aliases: ["P&G Hygiene", "Procter & Gamble Hygiene"] },

  // ── Real Estate ──
  { name: "Godrej Properties",          ticker: "GODREJPROP.NS",  aliases: ["Godrej Properties"] },
  { name: "DLF",                        ticker: "DLF.NS",         aliases: ["DLF"] },
  { name: "Oberoi Realty",              ticker: "OBEROIRLTY.NS",  aliases: ["Oberoi Realty"] },
  { name: "Macrotech Developers",       ticker: "LODHA.NS",       aliases: ["Macrotech Developers", "Lodha", "Lodha Group"] },
  { name: "Phoenix Mills",              ticker: "PHOENIXLTD.NS",  aliases: ["Phoenix Mills"] },
  { name: "Prestige Estates",           ticker: "PRESTIGE.NS",    aliases: ["Prestige Estates", "Prestige Group"] },

  // ── Internet / Media / Info ──
  { name: "Info Edge (Naukri)",         ticker: "NAUKRI.NS",      aliases: ["Info Edge", "Naukri", "99acres"] },
  { name: "Zee Entertainment",          ticker: "ZEEL.NS",        aliases: ["Zee Entertainment", "Zee TV", "ZEEL"] },
  { name: "PVR INOX",                   ticker: "PVRINOX.NS",     aliases: ["PVR INOX", "PVR", "INOX Leisure"] },
  { name: "Sun TV Network",             ticker: "SUNTV.NS",       aliases: ["Sun TV Network", "Sun TV"] },

  // ── Aviation ──
  { name: "IndiGo (InterGlobe Aviation)", ticker: "INDIGO.NS",   aliases: ["IndiGo", "Indigo Airlines", "InterGlobe Aviation"] },
  { name: "SpiceJet",                   ticker: "SPICEJET.NS",    aliases: ["SpiceJet", "Spice Jet"] },

  // ── Cement ──
  { name: "Shree Cement",               ticker: "SHREECEM.NS",    aliases: ["Shree Cement"] },
  { name: "ACC",                        ticker: "ACC.NS",          aliases: ["ACC", "ACC Cement"] },
  { name: "Ambuja Cements",             ticker: "AMBUJACEM.NS",   aliases: ["Ambuja Cements", "Ambuja"] },
  { name: "Dalmia Bharat",              ticker: "DALBHARAT.NS",   aliases: ["Dalmia Bharat"] },
  { name: "JK Cement",                  ticker: "JKCEMENT.NS",    aliases: ["JK Cement"] },

  // ── NBFC / Insurance / Finance ──
  { name: "Muthoot Finance",            ticker: "MUTHOOTFIN.NS",  aliases: ["Muthoot Finance", "Muthoot"] },
  { name: "Cholamandalam Investment",   ticker: "CHOLAFIN.NS",    aliases: ["Cholamandalam Investment", "Chola Finance", "Cholamandalam"] },
  { name: "SBI Life Insurance",         ticker: "SBILIFE.NS",     aliases: ["SBI Life Insurance", "SBI Life"] },
  { name: "HDFC Life Insurance",        ticker: "HDFCLIFE.NS",    aliases: ["HDFC Life Insurance", "HDFC Life"] },
  { name: "LIC",                        ticker: "LICI.NS",        aliases: ["LIC", "Life Insurance Corporation"] },
  { name: "ICICI Prudential Life",      ticker: "ICICIPRULI.NS",  aliases: ["ICICI Prudential Life", "ICICI Prudential"] },
  { name: "ICICI Lombard",              ticker: "ICICIGI.NS",     aliases: ["ICICI Lombard"] },
  { name: "Star Health Insurance",      ticker: "STARHEALTH.NS",  aliases: ["Star Health Insurance", "Star Health"] },
  { name: "Max Financial Services",     ticker: "MFSL.NS",        aliases: ["Max Financial Services", "Max Life Insurance"] },
  { name: "Shriram Finance",            ticker: "SHRIRAMFIN.NS",  aliases: ["Shriram Finance", "Shriram Transport"] },
  { name: "Bajaj Holdings",             ticker: "BAJAJHLDNG.NS",  aliases: ["Bajaj Holdings"] },

  // ── PSU Banks ──
  { name: "Bank of Baroda",             ticker: "BANKBARODA.NS",  aliases: ["Bank of Baroda", "BOB Bank"] },
  { name: "Punjab National Bank",       ticker: "PNB.NS",         aliases: ["Punjab National Bank", "PNB"] },
  { name: "Canara Bank",                ticker: "CANBK.NS",       aliases: ["Canara Bank"] },
  { name: "Union Bank of India",        ticker: "UNIONBANK.NS",   aliases: ["Union Bank of India", "Union Bank"] },

  // ── Private Banks / Small Finance ──
  { name: "Federal Bank",               ticker: "FEDERALBNK.NS",  aliases: ["Federal Bank"] },
  { name: "Yes Bank",                   ticker: "YESBANK.NS",     aliases: ["Yes Bank"] },
  { name: "RBL Bank",                   ticker: "RBLBANK.NS",     aliases: ["RBL Bank"] },
  { name: "IDFC First Bank",            ticker: "IDFCFIRSTB.NS",  aliases: ["IDFC First Bank", "IDFC Bank"] },
  { name: "Bandhan Bank",               ticker: "BANDHANBNK.NS",  aliases: ["Bandhan Bank"] },
  { name: "AU Small Finance Bank",      ticker: "AUBANK.NS",      aliases: ["AU Small Finance Bank", "AU Bank"] },
  { name: "City Union Bank",            ticker: "CUB.NS",         aliases: ["City Union Bank"] },
  { name: "Karnataka Bank",             ticker: "KTKBANK.NS",     aliases: ["Karnataka Bank"] },

  // ── Power / Energy ──
  { name: "Tata Power",                 ticker: "TATAPOWER.NS",   aliases: ["Tata Power"] },
  { name: "JSW Energy",                 ticker: "JSWENERGY.NS",   aliases: ["JSW Energy"] },
  { name: "Torrent Power",              ticker: "TORNTPOWER.NS",  aliases: ["Torrent Power"] },
  { name: "CESC",                       ticker: "CESC.NS",        aliases: ["CESC"] },
  { name: "NHPC",                       ticker: "NHPC.NS",        aliases: ["NHPC"] },
  { name: "SJVN",                       ticker: "SJVN.NS",        aliases: ["SJVN"] },
  { name: "Adani Energy Solutions",     ticker: "ADANIENSOL.NS",  aliases: ["Adani Energy Solutions", "Adani Transmission"] },

  // ── Pharma ──
  { name: "Torrent Pharmaceuticals",    ticker: "TORNTPHARM.NS",  aliases: ["Torrent Pharmaceuticals", "Torrent Pharma"] },
  { name: "Lupin",                      ticker: "LUPIN.NS",       aliases: ["Lupin"] },
  { name: "Biocon",                     ticker: "BIOCON.NS",      aliases: ["Biocon"] },
  { name: "Alkem Laboratories",         ticker: "ALKEM.NS",       aliases: ["Alkem Laboratories", "Alkem Labs"] },
  { name: "Abbott India",               ticker: "ABBOTINDIA.NS",  aliases: ["Abbott India"] },
  { name: "Aurobindo Pharma",           ticker: "AUROPHARMA.NS",  aliases: ["Aurobindo Pharma", "Aurobindo"] },
  { name: "Zydus Lifesciences",         ticker: "ZYDUSLIFE.NS",   aliases: ["Zydus Lifesciences", "Zydus Cadila", "Cadila Healthcare"] },
  { name: "Glenmark Pharmaceuticals",   ticker: "GLENMARK.NS",    aliases: ["Glenmark Pharmaceuticals", "Glenmark"] },
  { name: "IPCA Laboratories",          ticker: "IPCALAB.NS",     aliases: ["IPCA Laboratories", "IPCA Labs"] },
  { name: "JB Chemicals",               ticker: "JBCHEPHARM.NS",  aliases: ["JB Chemicals", "JB Pharma"] },
  { name: "Pfizer India",               ticker: "PFIZER.NS",      aliases: ["Pfizer India", "Pfizer"] },
  { name: "Sanofi India",               ticker: "SANOFI.NS",      aliases: ["Sanofi India", "Sanofi"] },
  { name: "Mankind Pharma",             ticker: "MANKIND.NS",     aliases: ["Mankind Pharma"] },

  // ── IT / Software ──
  { name: "Mphasis",                    ticker: "MPHASIS.NS",     aliases: ["Mphasis"] },
  { name: "Persistent Systems",         ticker: "PERSISTENT.NS",  aliases: ["Persistent Systems"] },
  { name: "LTIMindtree",               ticker: "LTIM.NS",        aliases: ["LTIMindtree", "LTI Mindtree"] },
  { name: "Coforge",                    ticker: "COFORGE.NS",     aliases: ["Coforge"] },
  { name: "Oracle Financial Services",  ticker: "OFSS.NS",        aliases: ["Oracle Financial Services", "OFSS"] },
  { name: "KPIT Technologies",          ticker: "KPITTECH.NS",    aliases: ["KPIT Technologies", "KPIT"] },
  { name: "Tata Elxsi",                ticker: "TATAELXSI.NS",   aliases: ["Tata Elxsi"] },
  { name: "Zensar Technologies",        ticker: "ZENSARTECH.NS",  aliases: ["Zensar Technologies", "Zensar"] },
  { name: "Cyient",                     ticker: "CYIENT.NS",      aliases: ["Cyient"] },
  { name: "Mastek",                     ticker: "MASTECH.NS",     aliases: ["Mastek"] },

  // ── Auto / Auto Ancillary ──
  { name: "Bosch India",               ticker: "BOSCHLTD.NS",    aliases: ["Bosch India", "Bosch"] },
  { name: "TVS Motor Company",          ticker: "TVSMOTOR.NS",    aliases: ["TVS Motor Company", "TVS Motor"] },
  { name: "Ashok Leyland",              ticker: "ASHOKLEY.NS",    aliases: ["Ashok Leyland"] },
  { name: "Motherson Sumi Wiring",      ticker: "MSUMI.NS",       aliases: ["Motherson Sumi", "Samvardhana Motherson"] },
  { name: "Balkrishna Industries",      ticker: "BALKRISIND.NS",  aliases: ["Balkrishna Industries", "BKT Tyres"] },
  { name: "Minda Industries",           ticker: "MINDAIND.NS",    aliases: ["Minda Industries"] },
  { name: "Bharat Forge",               ticker: "BHARATFORG.NS",  aliases: ["Bharat Forge"] },
  { name: "Escorts Kubota",             ticker: "ESCORTS.NS",     aliases: ["Escorts Kubota", "Escorts"] },
  { name: "MRF",                        ticker: "MRF.NS",         aliases: ["MRF", "MRF Tyres"] },
  { name: "Apollo Tyres",               ticker: "APOLLOTYRE.NS",  aliases: ["Apollo Tyres"] },
  { name: "CEAT",                       ticker: "CEATLTD.NS",     aliases: ["CEAT", "CEAT Tyres"] },
  { name: "Uno Minda",                  ticker: "UNOMINDA.NS",    aliases: ["Uno Minda", "Minda Corporation"] },
  { name: "Sona BLW Precision",         ticker: "SONACOMS.NS",    aliases: ["Sona BLW Precision", "Sona Comstar"] },
  { name: "Ola Electric",               ticker: "OLAELEC.NS",     aliases: ["Ola Electric"] },

  // ── Chemicals ──
  { name: "UPL",                        ticker: "UPL.NS",         aliases: ["UPL", "United Phosphorus"] },
  { name: "PI Industries",              ticker: "PIIND.NS",       aliases: ["PI Industries"] },
  { name: "SRF",                        ticker: "SRF.NS",         aliases: ["SRF"] },
  { name: "Deepak Nitrite",             ticker: "DEEPAKNTR.NS",   aliases: ["Deepak Nitrite"] },
  { name: "Aarti Industries",           ticker: "AARTIIND.NS",    aliases: ["Aarti Industries"] },
  { name: "Navin Fluorine",             ticker: "NAVINFLUOR.NS",  aliases: ["Navin Fluorine"] },
  { name: "Tata Chemicals",             ticker: "TATACHEM.NS",    aliases: ["Tata Chemicals"] },
  { name: "Vinati Organics",            ticker: "VINATIORGA.NS",  aliases: ["Vinati Organics"] },
  { name: "Linde India",                ticker: "LINDEINDIA.NS",  aliases: ["Linde India"] },

  // ── Metals / Mining ──
  { name: "NMDC",                       ticker: "NMDC.NS",        aliases: ["NMDC"] },
  { name: "Steel Authority of India",   ticker: "SAIL.NS",        aliases: ["Steel Authority of India", "SAIL"] },
  { name: "Jindal Steel & Power",       ticker: "JINDALSTEL.NS",  aliases: ["Jindal Steel & Power", "Jindal Steel"] },
  { name: "National Aluminium",         ticker: "NATIONALUM.NS",  aliases: ["National Aluminium", "NALCO"] },
  { name: "Ratnamani Metals",           ticker: "RATNAMANI.NS",   aliases: ["Ratnamani Metals"] },
  { name: "APL Apollo Tubes",           ticker: "APLAPOLLO.NS",   aliases: ["APL Apollo Tubes", "APL Apollo"] },

  // ── Capital Goods / Industrials ──
  { name: "Siemens India",              ticker: "SIEMENS.NS",     aliases: ["Siemens India", "Siemens"] },
  { name: "ABB India",                  ticker: "ABB.NS",         aliases: ["ABB India", "ABB"] },
  { name: "Thermax",                    ticker: "THERMAX.NS",     aliases: ["Thermax"] },
  { name: "Bharat Electronics",         ticker: "BEL.NS",         aliases: ["Bharat Electronics", "BEL"] },
  { name: "BHEL",                       ticker: "BHEL.NS",        aliases: ["BHEL", "Bharat Heavy Electricals"] },
  { name: "Cummins India",              ticker: "CUMMINSIND.NS",  aliases: ["Cummins India", "Cummins"] },
  { name: "KEC International",          ticker: "KEC.NS",         aliases: ["KEC International", "KEC"] },
  { name: "Kalpataru Projects",         ticker: "KPIL.NS",        aliases: ["Kalpataru Projects", "Kalpataru"] },
  { name: "Honeywell Automation",       ticker: "HONAUT.NS",      aliases: ["Honeywell Automation India", "Honeywell"] },
  { name: "Grindwell Norton",           ticker: "GRINDWELL.NS",   aliases: ["Grindwell Norton"] },
  { name: "Timken India",               ticker: "TIMKEN.NS",      aliases: ["Timken India", "Timken"] },

  // ── Defence ──
  { name: "HAL",                        ticker: "HAL.NS",         aliases: ["HAL", "Hindustan Aeronautics"] },
  { name: "Cochin Shipyard",            ticker: "COCHINSHIP.NS",  aliases: ["Cochin Shipyard"] },
  { name: "Mazagon Dock",               ticker: "MAZDOCK.NS",     aliases: ["Mazagon Dock", "Mazagon Dock Shipbuilders"] },
  { name: "Garden Reach Shipbuilders",  ticker: "GRSE.NS",        aliases: ["Garden Reach Shipbuilders", "GRSE"] },
  { name: "Data Patterns India",        ticker: "DATAPATTNS.NS",  aliases: ["Data Patterns India", "Data Patterns"] },
  { name: "Paras Defence",              ticker: "PARAS.NS",       aliases: ["Paras Defence"] },
  { name: "Bharat Dynamics",            ticker: "BDL.NS",         aliases: ["Bharat Dynamics", "BDL"] },
  { name: "MTAR Technologies",          ticker: "MTARTECH.NS",    aliases: ["MTAR Technologies"] },

  // ── Hospitality / Travel ──
  { name: "Indian Hotels (Taj)",        ticker: "INDHOTEL.NS",    aliases: ["Indian Hotels", "Taj Hotels", "IHCL"] },
  { name: "Lemon Tree Hotels",          ticker: "LEMONTREE.NS",   aliases: ["Lemon Tree Hotels"] },
  { name: "EIH (Oberoi Hotels)",        ticker: "EIHOTEL.NS",     aliases: ["EIH", "Oberoi Hotels"] },
  { name: "Thomas Cook India",          ticker: "THOMASCOOK.NS",  aliases: ["Thomas Cook India", "Thomas Cook"] },

  // ── Logistics / Ports ──
  { name: "Blue Dart Express",          ticker: "BLUEDART.NS",    aliases: ["Blue Dart Express", "Blue Dart"] },
  { name: "TCI Express",                ticker: "TCIEXP.NS",      aliases: ["TCI Express"] },
  { name: "Mahindra Logistics",         ticker: "MAHLOG.NS",      aliases: ["Mahindra Logistics"] },
  { name: "Container Corporation",      ticker: "CONCOR.NS",      aliases: ["Container Corporation", "CONCOR", "Concor"] },
  { name: "Gujarat Pipavav Port",       ticker: "GPPL.NS",        aliases: ["Gujarat Pipavav Port", "Pipavav Port"] },

  // ── Infrastructure ──
  { name: "IRB Infrastructure",         ticker: "IRB.NS",         aliases: ["IRB Infrastructure", "IRB"] },
  { name: "KNR Constructions",          ticker: "KNRCON.NS",      aliases: ["KNR Constructions"] },
  { name: "NCC",                        ticker: "NCC.NS",         aliases: ["NCC", "Nagarjuna Construction"] },
  { name: "Ahluwalia Contracts",        ticker: "AHLUCONT.NS",    aliases: ["Ahluwalia Contracts"] },
  { name: "PNC Infratech",              ticker: "PNCINFRA.NS",    aliases: ["PNC Infratech"] },

  // ── Financial Market Infrastructure ──
  { name: "BSE",                        ticker: "BSE.NS",         aliases: ["BSE", "Bombay Stock Exchange"] },
  { name: "MCX",                        ticker: "MCX.NS",         aliases: ["MCX", "Multi Commodity Exchange"] },
  { name: "CDSL",                       ticker: "CDSL.NS",        aliases: ["CDSL", "Central Depository Services"] },
  { name: "CAMS",                       ticker: "CAMS.NS",        aliases: ["CAMS", "Computer Age Management"] },

  // ── Consumer Electronics ──
  { name: "Dixon Technologies",         ticker: "DIXON.NS",       aliases: ["Dixon Technologies"] },
  { name: "Amber Enterprises",          ticker: "AMBER.NS",       aliases: ["Amber Enterprises"] },
  { name: "Blue Star",                  ticker: "BLUESTARCO.NS",  aliases: ["Blue Star"] },
  { name: "Whirlpool India",            ticker: "WHIRLPOOL.NS",   aliases: ["Whirlpool India", "Whirlpool"] },

  // ── Retail / Fashion ──
  { name: "Shoppers Stop",              ticker: "SHOPERSTOP.NS",  aliases: ["Shoppers Stop"] },
  { name: "Aditya Birla Fashion",       ticker: "ABFRL.NS",       aliases: ["Aditya Birla Fashion", "ABFRL", "Pantaloons"] },
  { name: "Vedant Fashions (Manyavar)", ticker: "MANYAVAR.NS",    aliases: ["Vedant Fashions", "Manyavar"] },
  { name: "Bata India",                 ticker: "BATAINDIA.NS",   aliases: ["Bata India", "Bata"] },
  { name: "Relaxo Footwears",           ticker: "RELAXO.NS",      aliases: ["Relaxo Footwears", "Relaxo"] },

  // ── Telecom ──
  { name: "Vodafone Idea",              ticker: "IDEA.NS",        aliases: ["Vodafone Idea", "Vi", "Idea Cellular"] },
  { name: "HFCL",                       ticker: "HFCL.NS",        aliases: ["HFCL"] },
  { name: "Sterlite Technologies",      ticker: "STLTECH.NS",     aliases: ["Sterlite Technologies", "Sterlite Tech"] },

  // ── Healthcare / Diagnostics ──
  { name: "Apollo Hospitals",           ticker: "APOLLOHOSP.NS",  aliases: ["Apollo Hospitals"] },
  { name: "Fortis Healthcare",          ticker: "FORTIS.NS",      aliases: ["Fortis Healthcare", "Fortis"] },
  { name: "Max Healthcare",             ticker: "MAXHEALTH.NS",   aliases: ["Max Healthcare"] },
  { name: "Narayana Hrudayalaya",       ticker: "NH.NS",          aliases: ["Narayana Hrudayalaya", "NH Hospitals"] },
  { name: "Dr Lal PathLabs",           ticker: "LALPATHLAB.NS",  aliases: ["Dr Lal PathLabs", "Lal PathLabs"] },
  { name: "Metropolis Healthcare",      ticker: "METROPOLIS.NS",  aliases: ["Metropolis Healthcare", "Metropolis"] },

  // ── Agri / Fertilisers ──
  { name: "Coromandel International",   ticker: "COROMANDEL.NS",  aliases: ["Coromandel International"] },
  { name: "Chambal Fertilisers",        ticker: "CHAMBLFERT.NS",  aliases: ["Chambal Fertilisers"] },
  { name: "Rallis India",               ticker: "RALLIS.NS",      aliases: ["Rallis India", "Rallis"] },

  // ── Paints / Building Materials ──
  { name: "Berger Paints",              ticker: "BERGEPAINT.NS",  aliases: ["Berger Paints"] },
  { name: "Kansai Nerolac",             ticker: "KANSAINER.NS",   aliases: ["Kansai Nerolac", "Nerolac"] },
  { name: "Astral",                     ticker: "ASTRAL.NS",      aliases: ["Astral", "Astral Poly Technik"] },
  { name: "Supreme Industries",         ticker: "SUPREMEIND.NS",  aliases: ["Supreme Industries"] },
  { name: "Prince Pipes",               ticker: "PRINCEPIPE.NS",  aliases: ["Prince Pipes"] },

  // ── Commonly featured in Moneycontrol Trading Guide ──
  { name: "Tejas Networks",             ticker: "TEJASNET.NS",    aliases: ["Tejas Networks", "Tejas Network"] },
  { name: "Waaree Energies",            ticker: "WAAREEENER.NS",  aliases: ["Waaree Energies", "Waaree"] },
  { name: "Kalyan Jewellers",           ticker: "KALYANKJIL.NS",  aliases: ["Kalyan Jewellers", "Kalyan Jewels"] },
  { name: "Jio Financial Services",     ticker: "JIOFIN.NS",      aliases: ["Jio Financial Services", "Jio Financial"] },
  { name: "Zinka Logistics",            ticker: "ZINKA.NS",       aliases: ["Zinka Logistics", "BlackBuck"] },
  { name: "Kaynes Technology",          ticker: "KAYNES.NS",      aliases: ["Kaynes Technology"] },
  { name: "Ideaforge Technology",       ticker: "IDEAFORGE.NS",   aliases: ["Ideaforge Technology", "ideaForge"] },
  { name: "RITES",                      ticker: "RITES.NS",       aliases: ["RITES"] },
  { name: "IRFC",                       ticker: "IRFC.NS",        aliases: ["IRFC", "Indian Railway Finance"] },
  { name: "IRCTC",                      ticker: "IRCTC.NS",       aliases: ["IRCTC", "Indian Railway Catering"] },
  { name: "Rail Vikas Nigam",           ticker: "RVNL.NS",        aliases: ["Rail Vikas Nigam", "RVNL"] },
  { name: "NBCC India",                 ticker: "NBCC.NS",        aliases: ["NBCC India", "NBCC"] },
  { name: "Hudco",                      ticker: "HUDCO.NS",       aliases: ["Hudco", "Housing Urban Development"] },
  { name: "PFC",                        ticker: "PFC.NS",         aliases: ["PFC", "Power Finance Corporation"] },
  { name: "REC Limited",               ticker: "RECLTD.NS",      aliases: ["REC Limited", "REC Ltd", "Rural Electrification"] },
  { name: "Indian Bank",                ticker: "INDIANB.NS",     aliases: ["Indian Bank"] },
  { name: "Bank of India",             ticker: "BANKINDIA.NS",   aliases: ["Bank of India"] },
  { name: "UCO Bank",                   ticker: "UCOBANK.NS",     aliases: ["UCO Bank"] },
  { name: "Central Bank of India",      ticker: "CENTRALBK.NS",  aliases: ["Central Bank of India", "Central Bank"] },
  { name: "Sapphire Foods",             ticker: "SAPPHIRE.NS",    aliases: ["Sapphire Foods", "KFC India", "Pizza Hut India"] },
  { name: "Devyani International",      ticker: "DEVYANI.NS",     aliases: ["Devyani International"] },
  { name: "Campus Activewear",          ticker: "CAMPUS.NS",      aliases: ["Campus Activewear", "Campus Shoes"] },
  { name: "Global Health (Medanta)",    ticker: "MEDANTA.NS",     aliases: ["Global Health", "Medanta"] },
  { name: "Yatharth Hospital",          ticker: "YATHARTH.NS",   aliases: ["Yatharth Hospital"] },
  { name: "Updater Services",           ticker: "UDS.NS",         aliases: ["Updater Services", "UDS"] },
  { name: "Jupiter Wagons",             ticker: "JWL.NS",         aliases: ["Jupiter Wagons"] },
  { name: "Titagarh Rail Systems",      ticker: "TITAGARH.NS",   aliases: ["Titagarh Rail Systems", "Titagarh Wagons"] },
  { name: "Texmaco Rail",               ticker: "TEXRAIL.NS",     aliases: ["Texmaco Rail", "Texmaco"] },
  { name: "Easy Trip Planners",         ticker: "EASEMYTRIP.NS",  aliases: ["Easy Trip Planners", "EaseMyTrip"] },
  { name: "Nazara Technologies",        ticker: "NAZARA.NS",      aliases: ["Nazara Technologies", "Nazara"] },
  { name: "Zaggle Prepaid",             ticker: "ZAGGLE.NS",      aliases: ["Zaggle Prepaid", "Zaggle"] },
  { name: "Netweb Technologies",        ticker: "NETWEB.NS",      aliases: ["Netweb Technologies"] },
  { name: "Avalon Technologies",        ticker: "AVALON.NS",      aliases: ["Avalon Technologies"] },
  { name: "Signature Global",           ticker: "SIGNATURE.NS",   aliases: ["Signature Global"] },
  { name: "Suraj Estate Developers",    ticker: "SURAJEST.NS",    aliases: ["Suraj Estate"] },
  { name: "Credo Brands (Mufti)",       ticker: "CREDO.NS",       aliases: ["Credo Brands", "Mufti"] },
];

export default COMPANIES;
