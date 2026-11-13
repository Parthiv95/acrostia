/* Acrostia poem engine, extracted from the original site and made DOM-free.
   Exposes window.Acrostia. No network, no storage, no DOM. */
(function () {
  var ACCENTS = { '\u00d8':'O','\u00f8':'o','\u00c6':'AE','\u00e6':'ae','\u00df':'ss','\u0141':'L','\u0142':'l','\u0110':'D','\u0111':'d','\u00de':'Th','\u00fe':'th' };
  function deaccent(str) {
    return String(str == null ? '' : str)
      .replace(/[\u00d8\u00f8\u00c6\u00e6\u00df\u0141\u0142\u0110\u0111\u00de\u00fe]/g, function (c) { return ACCENTS[c] || c; })
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
const OCCASIONS = {
  birthday: {
    label: "Birthday", emoji: "🎂", orn: ["🎈","🎂","✨"],
    c1: "#FFF1D6", c2: "#FFD9E8", ink: "#4A2458", shadow: "rgba(205,110,140,.45)",
    chipBg: "#FFE9F0",
    verses: [
      "{N}, today is all for you,\nWith cake and candles, laughter too,\nMay every wish you make tonight\nBloom into a year of light.",
      "Another trip around the sun,\nAnother year of days well won,\nDear {N}, whatever this year brings,\nMay your heart stay light, and sing."
    ]
  },
  wedding: {
    label: "Wedding", emoji: "💍", orn: ["🌸","💍","🤍"],
    c1: "#FDE8F0", c2: "#E8E4FA", ink: "#4A3363", shadow: "rgba(140,110,180,.4)",
    chipBg: "#F6E8FB",
    verses: [
      "Dear {N}, today the bells ring true,\nTwo lives now woven, old made new,\nMay every morning that you share\nBe wrapped in warmth and gentle care.",
      "{N}, the flowers, the vows, the song,\nA love that's worth the wait so long,\nMay your home be full, your cups run over,\nLove like yours will live forever."
    ]
  },
  anniversary: {
    label: "Anniversary", emoji: "🥂", orn: ["❤️","🥂","🌹"],
    c1: "#FFE4E1", c2: "#FFD1DC", ink: "#63243B", shadow: "rgba(200,90,120,.4)",
    chipBg: "#FFE6EC",
    verses: [
      "{N}, the years have come and gone,\nYet like a well-loved song, linger on,\nHere's to the love you still grow,\nSteady, deep, and warm as glow.",
      "Anniversaries mark the days,\nBut yours is written subtler ways,\nDear {N}, in every look you share\nLives a love beyond compare."
    ]
  },
  baby: {
    label: "Baby", emoji: "🍼", orn: ["🍼","🌟","🧸"],
    c1: "#E3F2FD", c2: "#FCE4EC", ink: "#2C4A6E", shadow: "rgba(110,150,200,.4)",
    chipBg: "#E4F0FB",
    verses: [
      "A little star has landed soft,\nTen tiny toes held up aloft,\nDear {N}, welcome, small and sweet,\nThe world is brighter at your feet.",
      "{N}, so small, so brand new,\nThe whole wide world is waiting for you,\nMay your days be warm and slow,\nWith love in every dream you grow."
    ]
  },
  graduation: {
    label: "Graduation", emoji: "🎓", orn: ["🎓","📜","🌟"],
    c1: "#E8F5E9", c2: "#FFF9C4", ink: "#33691E", shadow: "rgba(140,170,90,.45)",
    chipBg: "#EAF4E2",
    verses: [
      "{N}, the tassel turns, the cheers ring out,\nYou've earned this day, beyond all doubt,\nMay every door you choose to try\nOpen wide against the sky.",
      "The books are closed, the caps are thrown,\nThe seeds of all your work are sown,\nDear {N}, go forth, be bold and true,\nThe world is lucky to have you."
    ]
  },
  retirement: {
    label: "Retirement", emoji: "🌅", orn: ["🌅","🏆","🌿"],
    c1: "#FFF3E0", c2: "#FFE0B2", ink: "#6D4C1E", shadow: "rgba(210,160,90,.45)",
    chipBg: "#FBEEDB",
    verses: [
      "{N}, the desk is cleared, the watch is done,\nNow mornings belong to tea and sun,\nYou've given years of your very best,\nNow the world hands you back its rest.",
      "No alarms to answer, no races to run,\nDear {N}, your second life's begun,\nMay every day be slow and kind,\nWith good health, good books, and peace of mind."
    ]
  },
  farewell: {
    label: "Farewell", emoji: "✈️", orn: ["🕊️","✈️","🍀"],
    c1: "#E0F7FA", c2: "#E1F5FE", ink: "#1E4A5A", shadow: "rgba(90,150,180,.4)",
    chipBg: "#E0F2F7",
    verses: [
      "Goodbye is hard, dear {N}, it's true,\nBut better days are calling you,\nMay every road you take from here\nBe lined with luck and folks who cheer.",
      "{N}, we'll miss your smiling face,\nNo one else can take your place,\nGo shine wherever you may be,\nYou'll always have a home with me."
    ]
  },
  friendship: {
    label: "Friendship", emoji: "🌻", orn: ["🌻","🤝","💫"],
    c1: "#FFF9C4", c2: "#FFECB3", ink: "#6D5A10", shadow: "rgba(215,185,80,.45)",
    chipBg: "#FBF3CE",
    verses: [
      "{N}, some folks come and go,\nBut friends like you are rare to know,\nDear {N}, you're the friend who stays,\nThrough all of life's winding ways.",
      "No ribbon, card, or grand parade\nCould thank you for the difference made,\nDear {N}, you're the kind of friend\nWho stays until the very end."
    ]
  },
  thanks: {
    label: "Thank You", emoji: "🙏", orn: ["🙏","💐","💛"],
    c1: "#E8EAF6", c2: "#F3E5F5", ink: "#3A3A6E", shadow: "rgba(130,130,200,.4)",
    chipBg: "#E9E8F9",
    verses: [
      "{N}, these simple words are true:\nThank you for all you do,\nFor showing up, for thoughtful ways,\nYou deserve a thousand days of praise.",
      "Some kindness can't be repaid,\nOnly remembered, gently displayed,\nDear {N}, please know it's so:\nThe warmest thanks to you we owe."
    ]
  },
  getwell: {
    label: "Get Well Soon", emoji: "🌷", orn: ["🌷","💛","☀️"],
    c1: "#E8F5E9", c2: "#E0F2F1", ink: "#2E5D50", shadow: "rgba(110,170,150,.4)",
    chipBg: "#E2F1EA",
    verses: [
      "{N}, rest now, take it slow,\nHealing has its own tempo,\nWe're saving your seat, your cup, your place,\nUntil we see your smiling face.",
      "Get well soon, dear {N}, please do,\nThe world's not half as bright without you,\nMay every day bring strength your way,\nAnd better news by close of day."
    ]
  },
  christmas: {
    label: "Christmas", emoji: "🎄", orn: ["🎄","⭐","🔔"],
    c1: "#E8F5E9", c2: "#FFEBEE", ink: "#3E2723", shadow: "rgba(160,90,90,.4)",
    chipBg: "#FDE7EA",
    verses: [
      "{N}, the lights are on the tree,\nAnd a gift beneath it carries your name, you see,\nMay your season sparkle, may it sing,\nMerry Christmas, and everything.",
      "The fire is lit, the night is deep,\nAnd all the house is wrapped in sleep,\nDear {N}, wherever you may be,\nMay Christmas bring you peace and glee."
    ]
  },
  diwali: {
    label: "Diwali", emoji: "🪔", orn: ["🪔","✨","🎆"],
    c1: "#FFF8E1", c2: "#FFE0B2", ink: "#5D4037", shadow: "rgba(220,160,80,.5)",
    chipBg: "#FBEFD8",
    verses: [
      "{N}, may the lamps burn bright,\nAnd every darkness yield to light,\nMay wealth and wellness find your door,\nAnd peace stay with you evermore.",
      "A row of lamps, a sky of gold,\nA festival a thousand years old,\nDear {N}, may this Diwali bring\nSweetness in every little thing."
    ]
  },
  eid: {
    label: "Eid", emoji: "🌙", orn: ["🌙","🕌","⭐"],
    c1: "#E0F2F1", c2: "#F3E5F5", ink: "#37474F", shadow: "rgba(120,150,180,.4)",
    chipBg: "#E3F0F5",
    verses: [
      "{N}, the crescent moon is here,\nEid Mubarak, a day so dear,\nMay blessings fill your home and heart,\nAnd joy that never will depart.",
      "New clothes, old songs, a table spread,\nWith every soul you love well-fed,\nDear {N}, may this Eid be sweet,\nAnd every year your joys complete."
    ]
  },
  easter: {
    label: "Easter", emoji: "🐣", orn: ["🐣","🌷","🥚"],
    c1: "#E6F4E4", c2: "#FFF6C9", ink: "#44672E", shadow: "rgba(140,180,110,.45)",
    chipBg: "#EAF3E2",
    closers: ["some-bunny amazing", "the sweetest egg in the hunt", "spring's brightest smile", "fresh as a spring morning", "egg-stra special", "the sunniest part of spring", "hopping with happiness", "blooming marvelous"],
    verses: [
      "{N}, the spring is waking, all is new,\nThe tulips lift their faces to the blue,\nMay this season bring you hope and cheer,\nAnd happy days throughout the year.",
      "Chocolate eggs and daffodils,\nSunshine dancing over hills,\nDear {N}, may your heart be light,\nAnd all your days be warm and bright."
    ]
  },
  thanksgiving: {
    label: "Thanksgiving", emoji: "🦃", orn: ["🦃","🍂","🍁"],
    c1: "#FFE9D0", c2: "#FCE4EC", ink: "#8A4B26", shadow: "rgba(200,140,80,.45)",
    chipBg: "#F8EBDA",
    closers: ["the gratitude list starts with", "thankful, grateful, wonderful", "the sweetest reason to gather", "the centerpiece of the table", "warm as fresh pie", "the season's finest blessing", "gathered close and loved the most", "thankful for, every single year"],
    verses: [
      "The table's set, the leaves turn gold,\nDear {N}, warm your hands and hold,\nMay thanks and laughter fill your day,\nIn every kind and simple way.",
      "Around the table, hands entwined,\nWith family close and hearts aligned,\nDear {N}, may blessings find your door,\nThis day and evermore."
    ]
  },
  hanukkah: {
    label: "Hanukkah", emoji: "🕎", orn: ["🕯️","✡️","⭐"],
    c1: "#E3F2FD", c2: "#E8EAF6", ink: "#283593", shadow: "rgba(90,110,190,.45)",
    chipBg: "#E5EBF7",
    closers: ["a light that keeps on giving", "brighter than eight nights combined", "the miracle of the season", "spinning through the season in style", "the flame of the family", "latke royalty", "glowing, night after night", "the blessing of the holiday"],
    verses: [
      "Eight little candles, one by one,\nLighting the sky like a second sun,\nDear {N}, may your days be bright,\nWith love and laughter, warm and light.",
      "The candles glow, the dreidels spin,\nMay joy come knocking, enter in,\nDear {N}, may every night renew\nThe warmest blessings known to you."
    ]
  },
  lunarnewyear: {
    label: "Lunar New Year", emoji: "🧧", orn: ["🧧","🏮","🐲"],
    c1: "#FFE2D6", c2: "#FFF0CC", ink: "#A33220", shadow: "rgba(220,110,80,.45)",
    chipBg: "#FAE4DA",
    closers: ["fortune's favorite", "the luckiest name of the year", "destined for a golden year", "a firecracker of a person", "the dragon's own", "prosperity in human form", "red envelope royalty", "blessed with luck and laughter"],
    verses: [
      "Lanterns rising, red and gold,\nA brand new year, a story told,\nDear {N}, may luck walk by your side,\nWith every blessing, far and wide.",
      "The firecrackers light the night,\nDear {N}, may your year shine bright,\nMay fortune find you where you are,\nAnd lift you like a rising star."
    ]
  },
  engagement: {
    label: "Engagement", emoji: "💫", orn: ["💖","💫","🥂"],
    c1: "#FDE8F0", c2: "#FFF1D6", ink: "#6B2D4E", shadow: "rgba(210,120,160,.45)",
    chipBg: "#FCE9F4",
    closers: ["engaged, and glowing","halfway to forever", "a forever kind of love", "the start of always", "the sparkle on the ring finger", "the rumor of forever, confirmed", "today's sweetest yes", "the promise before the promise"],
    verses: [
      "{N}, the question's asked, the answer's yes,\nA ring, a dream, a happiness,\nMay the road from here to 'I do'\nBe lined with sweet surprises too.",
      "{N}, today love got its seal,\nA promise made, a future real,\nMay your engagement season gleam\nWith every wish and every dream."
    ]
  },
  newjob: {
    label: "New Job", emoji: "💼", orn: ["💼","🎯","🌟"],
    c1: "#E3F2FD", c2: "#E8EAF6", ink: "#28395C", shadow: "rgba(100,130,190,.4)",
    chipBg: "#E2ECFA",
    closers: ["a self-motivated individual, new chapter unlocked","ready to conquer the corner office", "promotion loading", "born for this role", "the hire of the year", "a workplace about to level up", "new badge, same brilliance", "destined for the corner office"],
    verses: [
      "{N}, the offer's here, the door is wide,\nWith talent, grit and hope inside,\nMay every day bring something new\nTo show the world the best of you.",
      "A fresh desk, a brand-new start,\nDear {N}, go show them your heart,\nMay success come fast and stay,\nIn everything you do each day."
    ]
  },
  newhome: {
    label: "New Home", emoji: "🏠", orn: ["🏠","🔑","🌿"],
    c1: "#E8F5E9", c2: "#FFF3E0", ink: "#3E5641", shadow: "rgba(130,170,120,.45)",
    chipBg: "#E7F2E4",
    closers: ["a homeowner with heart","turning four walls into a home", "home sweet home, finally", "new keys, new memories", "the host with the most, from day one", "home is wherever you unpack", "walls waiting for your warmth", "keys to a thousand memories"],
    verses: [
      "{N}, the keys are yours at last,\nA present, past, and future cast,\nMay every room hold warmth and cheer,\nAnd joy live year after year.",
      "Four walls, a roof, a brand-new door,\nDear {N}, may this home hold more,\nMore laughter, love, and quiet peace,\nThan walls can hold or hearts can crease."
    ]
  },
  congrats: {
    label: "Congratulations", emoji: "🎉", orn: ["🎉","🏆","✨"],
    c1: "#FFF9C4", c2: "#FFE0B2", ink: "#6D4A10", shadow: "rgba(220,170,70,.5)",
    chipBg: "#FBF2D0",
    closers: ["a champion, proved and true","proof that hard work wins", "take a bow, champ", "well earned, well deserved", "the trophy of the day", "applause in human form", "the win was always yours", "slow clap turned standing ovation"],
    verses: [
      "{N}, you did it, take a bow,\nThe moment's yours, the time is now,\nMay this win be just the start\nOf victories straight from the heart.",
      "Some wins are loud and some are small,\nBut yours today outshines them all,\nDear {N}, congratulations, well done,\nEnjoy the applause you've truly won."
    ]
  },
  goodluck: {
    label: "Good Luck", emoji: "🍀", orn: ["🍀","⭐","🌈"],
    c1: "#E0F2F1", c2: "#F3E5F5", ink: "#2E5650", shadow: "rgba(110,160,160,.4)",
    chipBg: "#E1F1EC",
    closers: ["every door opens for you","luck's favorite person", "luck is on your side", "go shine like you always do", "we're all betting on you", "destiny's favorite right now", "the sure thing in a world of chance", "go show them how it's done"],
    verses: [
      "{N}, the hour's near, you're set, you're ready,\nKeep your breath and pace both steady,\nMay luck walk in and stand by you\nIn everything you're about to do.",
      "A four-leaf clover, just for you,\nDear {N}, here's luck in all you do,\nGo get them, shine, be brave, be bold,\nYour story's waiting to be told."
    ]
  },
  mothersday: {
    label: "Mother's Day", emoji: "🌸", orn: ["🌸","💗","🌷"],
    c1: "#FCE4EC", c2: "#FFF1D6", ink: "#7A3B55", shadow: "rgba(220,140,170,.45)",
    chipBg: "#FAE4EE",
    closers: ["the heart of the home","loved more than words can hold", "the best mom in the world", "our gratitude, our love, our all", "the hands that rock the world", "the strongest soft person we know", "the family's north star", "the best mom, certified by us"],
    verses: [
      "{N}, your love's the first we know,\nThe root from which our whole lives grow,\nToday we pause to say with cheer:\nThe world is sweeter with you here.",
      "Supermom without a cape,\nDear {N}, there's no escape\nFrom our love and gratitude,\nHappy Mother's Day to you!"
    ]
  },
  fathersday: {
    label: "Father's Day", emoji: "👔", orn: ["👔","💙","🛠️"],
    c1: "#E3F2FD", c2: "#E0F7FA", ink: "#2A4A66", shadow: "rgba(100,150,190,.4)",
    chipBg: "#E2EEF9",
    closers: ["the family's quiet hero","our anchor, always", "hero without a cape", "our guiding star", "the quiet hero of every day", "shoulders we all stand on", "strength with a soft heart", "the legend of the living room"],
    verses: [
      "{N}, your quiet strength has been our ground,\nIn you our safest place is found,\nToday we celebrate you true,\nThe hero's always been you.",
      "Fix-it king, advice on call,\nDear {N}, you've given us your all,\nHappy Father's Day, today we say\nWe love you more than words can say."
    ]
  },
  teachersday: {
    label: "Teacher's Day", emoji: "🍎", orn: ["🍎","📚","✏️"],
    c1: "#FFF8E1", c2: "#FFECB3", ink: "#5D4A1E", shadow: "rgba(215,175,90,.45)",
    chipBg: "#FAEFD3",
    closers: ["shaping futures, one lesson at a time","the teacher we'll never forget", "molding minds, touching hearts", "thank you for everything", "the lesson that lasts forever", "a mind-shaper, a heart-mender", "the reason students smile", "education's brightest flame"],
    verses: [
      "Dear {N}, with patience, chalk and care,\nYou opened windows everywhere,\nNo gift can match what you have done,\nA hundred thanks, and then some.",
      "The books you gave, the faith you showed,\nThe paths you lit, the seeds you sowed,\nDear {N}, we grow, and in that way\nWe thank you more than words can say."
    ]
  },
  newyear: {
    label: "New Year", emoji: "🎆", orn: ["🎆","🗓️","✨"],
    c1: "#E8EAF6", c2: "#FFF3E0", ink: "#3A3E6E", shadow: "rgba(140,140,200,.45)",
    chipBg: "#E8E9F8",
    closers: ["a self-motivated individual, year ready","twelve months of possibility ahead", "365 new chances start with you", "the party starts with you", "the resolution everyone believes in", "confetti's favorite person", "fresh start, familiar wonderfulness", "the spark of the new year"],
    verses: [
      "{N}, the clock strikes twelve, the old is gone,\nA clean new page to write upon,\nMay this year be kind and new,\nAnd every dream of yours come true.",
      "Fireworks up, the glasses raise,\nDear {N}, here's to brighter days,\nMay January's hopeful song\nPlay happy in your heart all year long."
    ]
  },
  holi: {
    label: "Holi", emoji: "🎨", orn: ["🎨","💛","💦"],
    c1: "#FCE4EC", c2: "#E1F5FE", ink: "#5C3A5E", shadow: "rgba(190,140,200,.45)",
    chipBg: "#F6E3F6",
    closers: ["a splash of every color","the brightest smile in the crowd", "color us lucky to know you", "the life of every holi", "a rainbow in human form", "the splash of the season", "joy in every color", "the brightest color of all"],
    verses: [
      "{N}, the colors fly, the drums beat loud,\nYour smile's the brightest in the crowd,\nMay every color find your face\nAnd paint your life with joy and grace.",
      "Pink and green and gold and blue,\nDear {N}, may this Holi too\nSplash your days with laughter's sound,\nAnd happiness all year around."
    ]
  },
  rakhi: {
    label: "Rakhi", emoji: "🎀", orn: ["🎀","💛","✨"],
    c1: "#FFF3E0", c2: "#FCE4EC", ink: "#6E4430", shadow: "rgba(220,160,110,.45)",
    chipBg: "#FAEADA",
    closers: ["tied to love, always","the sibling everyone wishes for", "the best sibling by far", "a bond beyond distance", "the thread's favorite sibling", "a bond beyond time", "protection and love, personified", "the sibling bond's MVP"],
    verses: [
      "{N}, a thread of gold, a promise tied,\nOf love and protection side by side,\nMay this Rakhi bind your year\nWith laughter, luck and loved ones near.",
      "A thread, a sweet, a memory,\nDear {N}, of family,\nMay the bond this Rakhi shows\nGrow deeper as the lifetime grows."
    ]
  },
  navratri: {
    label: "Navratri", emoji: "🌺", orn: ["🌺","🪔","💃"],
    c1: "#FFE0B2", c2: "#F8BBD0", ink: "#6D3049", shadow: "rgba(220,120,150,.5)",
    chipBg: "#F9E2DC",
    closers: ["blessed with strength and grace","dancing through every challenge", "divine grace in a smile", "the star of the garba", "the garba floor's heartbeat", "divine in every step", "grace in motion", "the dandiya star"],
    verses: [
      "Nine bright nights, the dandiya's sound,\nDear {N}, may strength and grace surround,\nMay every night of celebration\nLift your heart and your dedication.",
      "Nine nights of garba, lamps aglow,\nDear {N}, may blessings flow,\nMay Maa's grace light up your way,\nThrough every night and every day."
    ]
  },
  valentine: {
    label: "Valentine's Day", emoji: "💝", orn: ["💝","🌹","💕"],
    c1: "#FFEBEE", c2: "#FCE4EC", ink: "#8E2C48", shadow: "rgba(220,110,140,.5)",
    chipBg: "#FBE3E9",
    closers: ["loved, today and always","the valentine everyone hopes for", "today's sweetest valentine", "cupid's finest work", "the name written in hearts", "valentine's day's headliner", "love's favorite answer", "sweeter than any heart-shaped box"],
    verses: [
      "{N}, the roses out, the hearts aglow,\nSome feelings only lovers know,\nMay your day be soft and sweet,\nWith love in every heartbeat.",
      "A card, a rose, a whispered vow,\nDear {N}, it's all about you now,\nMay love find you where'er you are\nAnd stay as constant as a star."
    ]
  },
  halloween: {
    label: "Halloween", emoji: "🎃", orn: ["🎃","👻","🕸️"],
    c1: "#FFE0B2", c2: "#E1BEE7", ink: "#4A2C5E", shadow: "rgba(170,110,190,.45)",
    chipBg: "#F5E4F2",
    closers: ["sweetest treat in town","spookily wonderful", "cutest creature of the night", "spooky season's star", "the treat we all came for", "the boo-tiful star of the night", "cutest pumpkin in the patch", "magic in the moonlight"],
    verses: [
      "{N}, the pumpkins glow, the spooky's out,\nThere's candy, costumes, fun about,\nMay your treats be sweet, your scares be few,\nAnd every ghost be friendlier than you.",
      "Bats and black cats, moonlight bright,\nDear {N}, may your night delight,\nMay magic hover where you stand,\nNo spooky fright, just fun well-planned."
    ]
  },
  pet: {
    label: "Pet", emoji: "🐾", orn: ["🐾","🦴","💛"],
    c1: "#FFF3E0", c2: "#FFF9C4", ink: "#5D4A1E", shadow: "rgba(215,175,90,.45)",
    chipBg: "#F9F0D8",
    closers: ["the goodest one there is","pawsitively loved", "pawsitively perfect", "the best of the bunch, fur real", "the boss of the household, obviously", "paws that hold our hearts", "the walk-time champion", "unconditionally loved, always"],
    verses: [
      "{N}, four little paws, a heart so true,\nThe world is bright because of you,\nMay your days be treats and naps and play,\nYou're the best in every way.",
      "A furry friend, a faithful heart,\nDear {N}, you're loved from the start,\nMay your bowl be full, your naps be long,\nAnd your humans sing your song."
    ]
  },
  boyfriend: {
    label: "Boyfriend", emoji: "❤️", orn: ["❤️","💫","🎧"],
    c1: "#FFEBEE", c2: "#E3F2FD", ink: "#6E2C3E", shadow: "rgba(210,120,140,.45)",
    chipBg: "#FBE5EA",
    closers: ["the best boyfriend around","loved more than you know", "my favorite person to annoy", "boyfriend of the year, every year", "the blueprint, honestly", "my favorite forever date", "the heart behind my smile", "better than any love song"],
    verses: [
      "{N}, your smile's my favorite view,\nOf all the people, I'd pick you,\nMay my hand stay tucked in yours\nThrough all the years, forevermore.",
      "From inside jokes to late-night calls,\nDear {N}, you're the best of all,\nMay us two keep laughing on,\nFrom every dusk to every dawn."
    ]
  },
  girlfriend: {
    label: "Girlfriend", emoji: "💕", orn: ["💕","🌸","✨"],
    c1: "#FCE4EC", c2: "#FFF1D6", ink: "#7A3B55", shadow: "rgba(220,140,170,.45)",
    chipBg: "#FAE4EE",
    closers: ["the most wonderful girlfriend ever","beautiful, inside and out", "my favorite hello", "girlfriend of my dreams, literally", "the muse behind every poem", "my sunshine on demand", "the girl of every dream, and mine came true", "love's finest masterpiece"],
    verses: [
      "{N}, you make the ordinary glow,\nMore than you will ever know,\nMay my love find you each hour,\nGentle, steady, like a flower.",
      "Dear {N}, the stars up above\nHave nothing on the one I love,\nMay your days be soft and sweet,\nMy favorite person, my heartbeat."
    ]
  },
  bestfriend: {
    label: "Best Friend", emoji: "🌟", orn: ["🌟","🤝","💫"],
    c1: "#FFF9C4", c2: "#E1F5FE", ink: "#5E5518", shadow: "rgba(200,180,90,.45)",
    chipBg: "#F7F2CE",
    closers: ["a best friend for life","the family I chose", "the yin to my yang", "friendship goals, honestly", "my emergency contact, literally", "the peanut butter to my jelly", "the friend who became family", "my partner, my person"],
    verses: [
      "{N}, you know my worst and stay,\nYou light my darkest, dullest day,\nNo diamond and no lucky charm\nBeats a best friend's loyal arm.",
      "From silly talks to secrets shared,\nDear {N}, you've always cared,\nFriends like you are far and few,\nThe world got lucky making you."
    ]
  },
  couple: {
    label: "Couple", emoji: "💑", orn: ["💑","💐","🥂"],
    c1: "#FDE8F0", c2: "#E8E4FA", ink: "#4A3363", shadow: "rgba(140,110,180,.4)",
    chipBg: "#F3E6FA",
    closers: ["better together, always","a perfect pair", "relationship goals, unlocked", "match made in heaven, certified", "the couple others copy", "two names, one heartbeat", "written in the stars, verified by us", "the duo that outshines all"],
    verses: [
      "{N}, two souls, one beautiful team,\nLiving the love that others dream,\nMay your bond grow deep and true,\nEvery year, renewed in you.",
      "Hand in hand through every weather,\nDear {N}, you two just fit together,\nMay your laughter never part,\nTwo lives, one story, one shared heart."
    ]
  },
  mother: {
    label: "Mother", emoji: "🌷", orn: ["🌷","💗","🏡"],
    c1: "#FCE4EC", c2: "#E8F5E9", ink: "#7A3B55", shadow: "rgba(220,140,170,.4)",
    chipBg: "#F6E9EE",
    closers: ["the heart of our family","loved beyond all words", "supermom, no cape needed", "the family's beating heart", "the one who made us who we are", "a heart that never runs out", "our forever soft place", "love's first and finest teacher"],
    verses: [
      "{N}, first love, first friend, first light,\nYou made our world warm and bright,\nMay every blessing you have given\nCome back to you from earth and heaven.",
      "The meals, the prayers, the sleepless nights,\nThe quiet, unseen little fights,\nDear {N}, we owe it all to you,\nA mother's love so pure and true."
    ]
  },
  father: {
    label: "Father", emoji: "💙", orn: ["💙","🏔️","🌟"],
    c1: "#E3F2FD", c2: "#E8EAF6", ink: "#2A3E66", shadow: "rgba(100,140,190,.4)",
    chipBg: "#E3EDF9",
    closers: ["our rock, our guide","the strength behind us all", "the man, the legend", "our safe place since day one", "our first hero, our forever friend", "the bar every dad is measured by", "strong arms, stronger heart", "our compass in every storm"],
    verses: [
      "{N}, you taught us how to stand,\nWith patient heart and steady hand,\nMay the love you've sown for years\nReturn to you as joy and cheer.",
      "Quiet strength and wisdom deep,\nDear {N}, the promises you keep,\nNo words could ever quite convey\nThe love we feel for you today."
    ]
  },
  sister: {
    label: "Sister", emoji: "💛", orn: ["💛","👯","🎀"],
    c1: "#FFF3E0", c2: "#FCE4EC", ink: "#6E4430", shadow: "rgba(220,160,110,.45)",
    chipBg: "#F9EDE2",
    closers: ["the best sister ever","built-in best friend, forever", "forever my first friend", "the sister everyone envies", "the sister of everyone's dreams", "my lifelong co-conspirator", "queen of the family group chat", "love, loud and forever"],
    verses: [
      "No distance and no busy day\nCan take my {N}-ness away,\nYou're my secret-keeper, partner in crime,\nMy sister, my friend, for all time.",
      "Fights today and friends tomorrow,\nShared our joy and shared our sorrow,\nDear {N}, life would miss its hue\nIf I didn't have a sister like you."
    ]
  },
  brother: {
    label: "Brother", emoji: "💪", orn: ["💪","😂","🤝"],
    c1: "#E3F2FD", c2: "#FFF3E0", ink: "#37474F", shadow: "rgba(120,150,170,.45)",
    chipBg: "#E7EDF3",
    closers: ["the best brother ever","built-in best friend since day one","my first rival, my forever friend","family's own superhero", "the brother of the year, every year", "keeper of the family remote", "strong arm, stronger heart", "my toughest critic, biggest fan"],
    verses: [
      "{N}, partner in crime since day one,\nThrough scraped knees, fights and fun,\nNo matter where life takes our ways,\nYou're my brother for always.",
      "From wrestling matches to heartfelt talks,\nDear {N}, you always walk the walk,\nMay your days be bold and bright,\nMy brother, my friend, my delight."
    ]
  },
  son: {
    label: "Son", emoji: "💙", orn: ["💙","⚽","🌟"],
    c1: "#E3F2FD", c2: "#E8F5E9", ink: "#2A4A66", shadow: "rgba(110,150,190,.4)",
    chipBg: "#E4EEF7",
    closers: ["our pride and joy","a son any parent would dream of","our greatest adventure","loved then, now and always", "the best thing we ever did", "our tomorrow, looking bright", "a heart we're proud to have raised", "the son of our dreams, literally"],
    verses: [
      "{N}, our son, our source of pride,\nWith you always at our side,\nMay your dreams be big and true,\nThere's nothing that you cannot do.",
      "From little steps to giant strides,\nDear {N}, you've been our pride,\nMay your future warmly glow,\nWe loved you first, we love you so."
    ]
  },
  daughter: {
    label: "Daughter", emoji: "💗", orn: ["💗","🌸","🦋"],
    c1: "#FCE4EC", c2: "#E1F5FE", ink: "#7A3B55", shadow: "rgba(210,140,180,.45)",
    chipBg: "#F9E7F0",
    closers: ["our heart outside our body","the princess of the house","loved beyond the moon","our sweetest blessing", "our little girl, forever and always", "grace, grit and giggles", "the daughter of our dreams", "love that outgrows every hug"],
    verses: [
      "{N}, our precious, shining star,\nWe love you just the way you are,\nMay your dreams take flight and soar,\nOur hearts are yours forevermore.",
      "From tiny shoes to graceful stride,\nDear {N}, you're our joy and pride,\nMay your life be sweet and true,\nThere's no one quite as dear as you."
    ]
  },
  wife: {
    label: "Wife", emoji: "💖", orn: ["💖","🏡","☕"],
    c1: "#FDE8F0", c2: "#FFF1D6", ink: "#7A2E4E", shadow: "rgba(215,120,160,.45)",
    chipBg: "#FBE7F1",
    closers: ["my always and forever","the queen of our home","my best decision ever","loved this morning and every morning", "my favorite reason to rush home", "beautiful in every way that counts", "the heart of our little world", "my today and all my tomorrows"],
    verses: [
      "{N}, my love, my life, my home,\nBeside you I'm never alone,\nMay my hand stay in yours always,\nThrough every ordinary day.",
      "Thank you for the love you give,\nFor the beautiful life we live,\nDear {N}, of this I'm sure:\nMy whole heart, always, is yours."
    ]
  },
  husband: {
    label: "Husband", emoji: "🤵", orn: ["🤵","💙","🏠"],
    c1: "#E8EAF6", c2: "#E3F2FD", ink: "#333F66", shadow: "rgba(120,130,190,.4)",
    chipBg: "#E7E9F7",
    closers: ["my one and only","the king of our home","my calm in every storm","loved more every single day", "my partner in everything", "the best hug in the house", "loved beyond measure, daily", "the man of the house, in every good sense"],
    verses: [
      "{N}, my steady rock and cheer,\nSo thankful that you're always near,\nMay our love keep growing strong,\nWith you is where I belong.",
      "Through every season, every year,\nDear {N}, I want you near,\nMy partner, my love, my closest friend,\nRight beside you to the end."
    ]
  },
  grandma: {
    label: "Grandma", emoji: "🧶", orn: ["🧶","🍪","💗"],
    c1: "#FFF3E0", c2: "#FCE4EC", ink: "#6E4430", shadow: "rgba(215,165,120,.45)",
    chipBg: "#F9ECE0",
    closers: ["heart of gold, hugs of warmth","the family's sweetest treasure","love baked into every cookie","our softest place to fall", "the hands that raised us all", "the grandma everyone wishes was theirs", "love at its softest", "our home's sweetest lullaby"],
    verses: [
      "{N}, your kitchen smells like love,\nYour blessings fit us like a glove,\nMay your days be slow and sweet,\nWith family always at your feet.",
      "Warmest hugs and gentle ways,\nDear {N}, you deserve long days\nOf rest and love and joy untold,\nOur precious grandma, heart of gold."
    ]
  },
  grandpa: {
    label: "Grandpa", emoji: "👓", orn: ["👓","📜","💙"],
    c1: "#FFF8E1", c2: "#E3F2FD", ink: "#4E4426", shadow: "rgba(170,160,110,.45)",
    chipBg: "#F4EEDC",
    closers: ["wisdom with the warmest smile","the family's gentle giant","our storyteller, our hero","old school cool", "the man with a story for everything", "the grandpa of the century", "strong hands, soft heart", "our favorite armchair companion"],
    verses: [
      "{N}, your tales of days gone by\nAre treasures money cannot buy,\nMay your days be calm and long,\nOur family's rock, wise and strong.",
      "A hand to hold, a laugh to share,\nDear {N}, you're always there,\nOur grandpa, strong and kind and true,\nNo one's quite as dear as you."
    ]
  },
  cousin: {
    label: "Cousin", emoji: "🤗", orn: ["🤗","✨","🎈"],
    c1: "#E1F5FE", c2: "#FFF9C4", ink: "#2E5650", shadow: "rgba(110,170,190,.4)",
    chipBg: "#E6F2F5",
    closers: ["family and friend in one","partner in every family adventure","first friend, forever friend","the fun one, always", "in on every family joke", "the family's own comedy show", "the friend who's family, twice over", "always up to something wonderful"],
    verses: [
      "{N}, family and friend in one,\nTwice the love and double the fun,\nMay your days be bright and long,\nWith cousins' bonds staying strong.",
      "From weddings, games and secrets shared,\nDear {N}, you've always cared,\nA cousin like you's rare to find,\nLoving, loyal, true and kind."
    ]
  },
  aunt: {
    label: "Aunt", emoji: "🌺", orn: ["🌺","🎁","💛"],
    c1: "#FCE4EC", c2: "#FFF3E0", ink: "#7A3B55", shadow: "rgba(215,140,160,.4)",
    chipBg: "#F8E9E4",
    closers: ["the cool aunt, certified","second mom, first friend","warmth in human form","the aunt everyone wishes for", "spoiler-in-chief of the family", "our stylish shoulder to lean on", "the aunt of the year, every year", "fun, love and warmth in one visit"],
    verses: [
      "{N}, like a mom but twice as fun,\nSunshine for everyone,\nMay your days be warm and sweet,\nHaving you as our aunt's a treat.",
      "Your advice, your laugh, your care,\nDear {N}, you're always there,\nAn aunt as wonderful as you\nDeserves a year of dreams come true."
    ]
  },
  uncle: {
    label: "Uncle", emoji: "🎣", orn: ["🎣","😄","💙"],
    c1: "#E0F2F1", c2: "#E3F2FD", ink: "#2E5650", shadow: "rgba(100,160,160,.4)",
    chipBg: "#E4F0EF",
    closers: ["the coolest uncle around","fun delivered since day one","our stand-up comedian","a legend in his own time", "the uncle everyone invites first", "wisdom disguised as fun", "always there when it matters", "the uncle of our favorite memories"],
    verses: [
      "{N}, the coolest, calm and fun,\nJokes for me and everyone,\nMay your days be light and bright,\nOur dear uncle, pure delight.",
      "With stories, jokes and wisdom too,\nDear {N}, there's none like you,\nMay good fortune find your door,\nOur uncle, loved forevermore."
    ]
  },
  niece: {
    label: "Niece", emoji: "🌼", orn: ["🌼","🎀","💫"],
    c1: "#FFF9C4", c2: "#FCE4EC", ink: "#6E5A18", shadow: "rgba(210,185,90,.45)",
    chipBg: "#F7F0D6",
    closers: ["our little sunshine","the family's brightest sparkle","sweet as can be","loved to the moon and back", "the reason family chats stay alive", "growing lovelier every single day", "a delight in every little way", "our favorite little visitor"],
    verses: [
      "{N}, a bundle of joy and grace,\nSunshine in your smiling face,\nMay your days be magic, fun and new,\nOur darling niece, we all love you.",
      "Growing up so fast it seems,\nDear {N}, you fill our dreams,\nMay your sparkle never dim,\nOur love for you fills to the brim."
    ]
  },
  nephew: {
    label: "Nephew", emoji: "🚀", orn: ["🚀","⭐","💙"],
    c1: "#E3F2FD", c2: "#FFF9C4", ink: "#2A3E66", shadow: "rgba(110,140,200,.4)",
    chipBg: "#E7EFF8",
    closers: ["our little champion","energy, mischief and joy","the family's future superstar","brave, bright and beloved", "the joy of every family photo", "growing braver every single day", "our little legend in training", "the future of the family, already shining"],
    verses: [
      "{N}, our little star so bright,\nFull of wonder, full of might,\nMay you grow up strong and true,\nThe world is lucky to have you.",
      "Full of energy, mischief and cheer,\nDear {N}, we love having you near,\nMay your adventures never end,\nOur nephew and our special friend."
    ]
  },
  "teacher-appreciation": {
    label: "Teacher Appreciation", emoji: "🍎", orn: ["🍎","✏️","⭐"],
    c1: "#FDECEA", c2: "#FFF3D6", ink: "#5C2320", shadow: "rgba(190,80,60,.4)",
    chipBg: "#FBE9E7",
    closers: ["the lesson everyone remembers", "apple of the whole school", "teacher of the year, every year", "the reason someone loves school", "grading papers, raising futures", "the calm in the classroom storm", "chalk dust and pure gold", "shaping the future daily"],
    verses: [
      "{N}, you make the hard things clear,\nAnd turn our doubt to cheering cheer,\nWhat you have built in us will stay\nLong after we have walked away.",
      "For every quiet hour you gave,\nFor every young mind you helped save,\nDear {N}, we say it plain and true:\nThe brightest one in class is you."
    ]
  },
  "grandparents-day": {
    label: "Grandparents Day", emoji: "💞", orn: ["💞","🌻","🫖"],
    c1: "#F3EEFA", c2: "#EAF4EA", ink: "#4A3B63", shadow: "rgba(120,100,170,.4)",
    chipBg: "#F0EAF9",
    closers: ["the family's favorite storyteller", "warm cookies and warmer hugs", "the hug the whole family queues for", "wisdom with a wink", "the family tree's deep roots", "love that skips a generation, joyfully", "grandkid certified favorite", "the heart of every family photo"],
    verses: [
      "{N}, your stories hold us near,\nYour kitchen is our favorite year,\nThe love you hand down, warm and true,\nFinds its way right back to you.",
      "Grandparents like {N} are rare,\nTime turns to sugar in your care,\nMay your days be long, soft, and bright,\nOur home's most gentle, warmest light."
    ]
  },
  "bar-mitzvah": {
    label: "Bar/Bat Mitzvah", emoji: "🕯️", orn: ["🕯️","⭐","🎉"],
    c1: "#E8F0FE", c2: "#FFF3D6", ink: "#1F3A6E", shadow: "rgba(40,80,160,.4)",
    chipBg: "#E7EFFC",
    closers: ["today a name, tomorrow a legend", "the candle-lighting star", "grown in the eyes we love", "a blessing come to life", "thirteen going on remarkable", "the toast of the congregation", "mazel tov in human form", "new chapter, same wonderful you"],
    verses: [
      "{N}, today you stand up tall,\nThe Torah calls, you heed the call,\nMay this new chapter, bright and blessed,\nBring you joy above the rest.",
      "A name read loud, a candle's flame,\nThe whole room rises at your name,\nDear {N}, may wisdom light your way,\nAnd blessing greet you every day."
    ]
  },
  quinceanera: {
    label: "Quinceañera", emoji: "👑", orn: ["👑","✨","💃"],
    c1: "#FDE7F4", c2: "#EDE4FA", ink: "#5C2A66", shadow: "rgba(170,80,160,.4)",
    chipBg: "#F9E5F7",
    closers: ["quince royalty", "fifteen and flawless", "the sparkle of the sala", "today's quinceañera queen", "a waltz the family will remember", "born to wear the crown", "the moment everyone came for", "blossoming right on time"],
    verses: [
      "{N}, fifteen and shining bright,\nThe room turns gold when you're in sight,\nMay every wish you whisper true\nFind its way this year to you.",
      "A crown, a dance, a glowing night,\nDear {N}, the stars are out tonight,\nMay your path be paved with grace,\nAnd joy arrive in every place."
    ]
  },
  "sweet-16": {
    label: "Sweet 16", emoji: "🎀", orn: ["🎀","🧁","💖"],
    c1: "#FFE4F1", c2: "#DFF6F5", ink: "#7A2B56", shadow: "rgba(220,90,150,.4)",
    chipBg: "#FEE8F2",
    closers: ["sixteen and sensational", "the sweetest sixteen of them all", "certified sweet sixteen royalty", "old enough to know better, young enough to shine", "the party of the year", "sweetness with a license", "sixteen candles, one bright star", "the moment the year was waiting for"],
    verses: [
      "{N}, sixteen candles glowing,\nA brand new year, a brand new showing,\nMay every wish you whisper low\nGrow taller than you'll ever know.",
      "Sweet sixteen, keys to the door,\nThe world is yours to explore,\nDear {N}, may this birthday year\nBe the sweetest one yet, dear."
    ]
  },
  "naming-ceremony": {
    label: "Naming Ceremony", emoji: "🌱", orn: ["🌱","🕊️","💛"],
    c1: "#FFF2E2", c2: "#E8F5E9", ink: "#6B4A2A", shadow: "rgba(200,140,70,.4)",
    chipBg: "#FFF0DE",
    closers: ["the newest name we love", "small name, giant blessing", "welcome to the world, little one", "a name worth every cheer", "the family's freshest chapter", "tiny star, bright future", "named today, loved forever", "the guest of honor, brand new"],
    verses: [
      "Little {N}, your name is blessed,\nThe room has gathered, hearts at rest,\nMay this name you carry far\nBe your compass, be your star.",
      "A name's the first gift, that is true,\nAnd none was made more just for you,\nDear {N}, grow gentle, strong, and kind,\nWith love wrapped close and joy behind."
    ]
  },
  "baby-shower": {
    label: "Baby Shower", emoji: "🍼", orn: ["🍼","🎈","🧸"],
    c1: "#FCE4EC", c2: "#E3F2FD", ink: "#5C3A5E", shadow: "rgba(180,120,190,.4)",
    chipBg: "#F9E4F2",
    closers: ["the guest of honor, soon to arrive", "glowing, and rightly so", "nappies, bottles, endless love", "the sweetest countdown begins", "almost here, already adored", "a bundle is on the way", "showered with love, literally", "the calm before the cuddles"],
    verses: [
      "{N}, the tiny socks are neat,\nThe little bed looks oh so sweet,\nWe cannot wait to hear you soon,\nThe family's newest, sweetest tune.",
      "The bump is big, the hearts are bigger,\n{N}, the joy keeps rushing quicker,\nMay the little one you greet\nHave your smile and your heartbeat."
    ]
  },
  prom: {
    label: "Prom", emoji: "🌹", orn: ["🌹","🕺","🕺"],
    c1: "#EAE6F9", c2: "#FDE8F0", ink: "#3A2E6E", shadow: "rgba(110,90,190,.4)",
    chipBg: "#ECE7FA",
    closers: ["prom night royalty", "best dressed, best danced, best night", "the one the crowd parts for", "a dance card classic", "the night's brightest photo", "dancing like the floor owes them", "crown optional, star certain", "the proposal was just the start"],
    verses: [
      "{N}, the music's starting slow,\nThe floor is lit, the lights are low,\nOne name, one night, one dance to share,\nAnd I will meet you there.",
      "The lights are dim, the songs are sweet,\n{N}, you make the night complete,\nMay this dance and every after\nRing with music, joy, and laughter."
    ]
  },
  "karwa-chauth": {
    label: "Karwa Chauth", emoji: "🌙", orn: ["🌙","🪔","❤️"],
    c1: "#FDEBE6", c2: "#FFF3D6", ink: "#7A2E1E", shadow: "rgba(200,70,50,.4)",
    chipBg: "#FBE8E0",
    closers: ["the moon's favorite devotee", "love measured in moonlight", "a fast, a prayer, a forever", "glowing till moonrise and beyond", "the love story of the year", "dedication with a smile", "bound by moonlight and love", "the evening's brightest sari"],
    verses: [
      "{N}, the moon will rise tonight,\nYour love keeps step with its soft light,\nMay every fast and every prayer\nKeep you both a golden pair.",
      "Through the fasting day you glow,\n{N}, more radiant than we know,\nMay the moon hear every vow\nAnd bless the love you're keeping now."
    ]
  },
  "silver-anniversary": {
    label: "Silver Anniversary", emoji: "🥈", orn: ["🥈","🤍","✨"],
    c1: "#EFF3F6", c2: "#E4ECF2", ink: "#3E4A56", shadow: "rgba(110,130,150,.4)",
    chipBg: "#EAF0F5",
    closers: ["twenty-five years, still smitten", "silver outside, gold inside", "the couple other couples study", "proof that forever exists", "a love with a quarter-century warranty", "still each other's favorite person", "anniversary royalty", "the silver standard of love"],
    verses: [
      "{N}, twenty-five and counting still,\nA love that time could never kill,\nMay the silver in your years\nShine on, and turn to gold with cheers.",
      "A quarter century, hand in hand,\nDear {N}, a love the years made grand,\nMay silver shine and softly say\nThe best is still on its way."
    ]
  }
};

const GROUPS = [
  ["Celebrate", ["birthday","engagement","wedding","anniversary","graduation","newjob","newhome","retirement","congrats","bar-mitzvah","quinceanera","sweet-16","prom","silver-anniversary"]],
  ["Festivals & Holidays", ["christmas","newyear","lunarnewyear","easter","thanksgiving","hanukkah","valentine","halloween","eid","diwali","holi","rakhi","navratri","karwa-chauth"]],
  ["Everyday", ["thanks","getwell","goodluck","farewell","teachersday","teacher-appreciation"]],
  ["Love", ["boyfriend","girlfriend","couple","wife","husband"]],
  ["Family", ["mother","father","sister","brother","son","daughter","baby","mothersday","fathersday","grandma","grandpa","cousin","aunt","uncle","niece","nephew","grandparents-day","baby-shower","naming-ceremony"]],
  ["Friends & Pets", ["bestfriend","friendship","pet"]]
];

const LETTER_TRAITS = {
  A: [["Able","potential to achieve big"], ["Admirable","admired by everyone around"], ["Affectionate","warm to all who know you"], ["Ambitious","always aiming higher"], ["Amazing","wonderfully, unmistakably you"], ["Authentic","never a copy"], ["Adventurous","first to say yes to anything"], ["Awesome","in the old, true sense of the word"], ["Attentive","notices what others miss"], ["Animated","never a dull moment"], ["Adept","good at whatever matters most"], ["Altruistic","gives without keeping score"]],
  B: [["Brave","facing every challenge head-on"], ["Bright","lighting up every room"], ["Beloved","cherished by family and friends"], ["Bubbly","full of life and bubbles","f"], ["Big-hearted","room for everyone in it"], ["Brilliant","a shine that needs no switch"], ["Bold","steps forward first"], ["Balanced","steady when it counts"], ["Blissful","finds joy in the small things"], ["Bountiful","generous all year round"], ["Breezy","easy to be around"], ["Buoyant","lifts every mood in the room"]],
  C: [["Creative","full of fresh ideas"], ["Confident","sure of every step"], ["Caring","always there for others"], ["Cheerful","with a smile that spreads"], ["Compassionate","kindness in action"], ["Curious","always asking, always learning"], ["Charming","wins the room softly"], ["Capable","hands that get it done"], ["Calm","the steady heartbeat of the family"], ["Clever","sees the shortcut"], ["Classic","never goes out of style"]],
  D: [["Determined","never giving up"], ["Dependable","relied on in every storm"], ["Delightful","a joy to be around","f"], ["Diligent","careful in all you do"], ["Dynamic","energy that moves rooms"], ["Devoted","all in, on everything"], ["Daring","tries what others only whisper about"], ["Dazzling","hard to look away from"], ["Deep","thinks in oceans"]],
  E: [["Energetic","full of life and spirit"], ["Excellent","excelling in all you do"], ["Empathetic","feeling what others feel"], ["Enthusiastic","excited by every opportunity"], ["Encouraging","the voice that says keep going"], ["Enchanting","hard to forget"], ["Elegant","grace without even trying"], ["Earnest","means every word"], ["Electric","sparks up a plain day"], ["Enduring","only better with time"], ["Easygoing","bends, never breaks"]],
  F: [["Friendly","a friend to everyone"], ["Fearless","unafraid of any challenge"], ["Faithful","true in word and deed"], ["Fun-loving","finding joy everywhere"], ["Focused","eyes on the prize"], ["Fun","turns errands into stories"], ["Fabulous","a whole occasion in one person"], ["Fresh","new eyes on old things"], ["Festive","carries a celebration along"]],
  G: [["Generous","sharing without counting"], ["Graceful","graceful in every way","f"], ["Good-hearted","kind to the core"], ["Genuine","real through and through"], ["Gracious","class in every move"], ["Gifted","born with it"], ["Glowing","lit from the inside"], ["Grounded","solid as they come"], ["Gleeful","laughs with the whole self"], ["Giving","hands always open"], ["Golden","worth their weight"]],
  H: [["Honored","respected by all"], ["Honest","true in every word"], ["Hardworking","giving your best always"], ["Happy","spreading cheer all around"], ["Humble","great without the noise"], ["Heartfelt","everything you do, you mean"], ["Hopeful","believes the best first"], ["Heartwarming","leaves you warmer than found"], ["Hardy","built for all seasons"], ["High-spirited","joy at full volume"]],
  I: [["Inspiring","pushing others to dream"], ["Intelligent","sharp of mind and thought"], ["Ideal","the example others follow"], ["Imaginative","dreaming up wonders"], ["Independent","stands fully on their own"], ["Insightful","sees what others miss"], ["Intuitive","knows before being told"], ["Invincible","a spirit nothing dents"], ["Illuminating","makes everything clearer"], ["Idealistic","keeps the high standards"], ["Inviting","everyone feels welcome"], ["Incisive","cuts straight to the heart"]],
  J: [["Joyful","spreading happiness wherever you go"], ["Jovial","with laughter always near"], ["Judicious","wise in every choice"], ["Just","fair in all dealings"], ["Jolly","laughter follows them around"], ["Jaunty","a spring in every step"], ["Jewel","a one of a kind treasure"]],
  K: [["Kind","gentle in word and deed"], ["Keen","eager for every opportunity"], ["Knowledgeable","a wealth of wisdom"], ["Kindhearted","soft of heart, strong of spirit"], ["Kindred","easy to feel at home with"], ["Kismet","lucky to have met"]],
  L: [["Loyal","standing by people always"], ["Loving","with a heart that gives"], ["Leader","born to guide the way"], ["Lively","buzzing with energy"], ["Light","rooms brighten when they enter"], ["Laughter","the sound everyone waits for"], ["Light-hearted","carries joy easily"], ["Laughing","the sound of a good day"], ["Limitless","no ceiling in sight"], ["Level-headed","calm in the swirl"]],
  M: [["Motivated","driven from within"], ["Marvelous","wonderful in every way"], ["Modest","humble despite it all"], ["Magnetic","drawing people in"], ["Merry","cheer that never quits"], ["Mindful","present in every moment"], ["Mighty","small frame, big force"], ["Magical","makes days feel enchanted"]],
  N: [["Noble","in thought and in action"], ["Nice","pleasant to all you meet"], ["Notable","worth remembering"], ["Nurturing","helping others grow"], ["Natural","effortless at being themselves"], ["Neighborly","first to lend a hand"], ["Novel","a fresh take, always"], ["Nimble","quick of mind and step"]],
  O: [["Optimistic","seeing the bright side always"], ["Outstanding","standing out from the crowd"], ["Open-minded","accepting every opinion"], ["Original","one of a true kind"], ["Open-hearted","welcoming everyone in"], ["Observant","sees every detail"], ["Outgoing","a friend to every stranger"]],
  P: [["Passionate","burning with purpose"], ["Patient","calm through every storm"], ["Positive","spreading optimism around"], ["Principled","standing by what is right"], ["Playful","fun is a serious habit"], ["Peacemaker","calm in every argument"], ["Peaceful","a calm you can visit"], ["Persistent","finishes what it starts"], ["Precious","held close by all"], ["Prized","treasured company"]],
  Q: [["Quick-witted","ready with a smile and a line"], ["Quick-thinking","calm when it matters most"], ["Qualified","ready for anything life brings"], ["Quintessential","the very best of the type"], ["Quirky","wonderfully their own"], ["Quick","fast to help, faster to laugh"], ["Quotable","says things worth repeating"], ["Questing","always chasing the next horizon"]],
  R: [["Receptive","accepting every opinion"], ["Refined","in taste, manners and gait","f"], ["Reliable","a promise kept"], ["Radiant","glowing from within","f"], ["Respectful","courtesy that never slips"], ["Resourceful","solves it, whatever it is"], ["Remarkable","worth retelling"], ["Rosy","sees the bright side"], ["Resilient","bends and rises"], ["Rare","one in a thousand"]],
  S: [["Self-motivated","driven by your own fire"], ["Sincere","honest at heart"], ["Strong","through every high and low"], ["Smart","quick to learn and adapt"], ["Supportive","in your corner, always"], ["Spirited","full of spark"], ["Sunny","bright by default"], ["Steadfast","an anchor in any storm"], ["Sweet","kindness in small acts"], ["Stellar","a star among stars"], ["Selfless","thinks of you first"]],
  T: [["Talented","gifted in many ways"], ["Trustworthy","trusted by everyone"], ["Thoughtful","thinking of others first"], ["Tenacious","holding on till it's done"], ["True-blue","loyal to the last"], ["Tireless","keeps going after others stop"], ["Tender","gentle with hearts"], ["Thriving","grows wherever planted"], ["Triumphant","makes wins of small days"], ["Thankful","counts blessings out loud"]],
  U: [["Unstoppable","nothing stands in your way"], ["Unique","one of a kind"], ["Upstanding","honorable in all things"], ["Understanding","seeing every side"], ["Uplifting","everyone rises around them"], ["Unfazed","nothing rattles them"], ["Unforgettable","stays in the story"], ["Unflagging","energy that holds"], ["Unusual","wonderfully different"], ["Unassuming","great without the fuss"]],
  V: [["Valiant","brave of heart"], ["Versatile","good at everything you try"], ["Visionary","dreaming of tomorrow"], ["Vivacious","lively and full of spirit","f"], ["Valued","missed the moment they leave"], ["Vibrant","color in every room"], ["Venturesome","loves a new road"], ["Victorious","finds the win"], ["Vivid","memorable in an instant"]],
  W: [["Wise","beyond your years"], ["Warm","with a smile for everyone"], ["Wonderful","in countless ways"], ["Willing","first to lend a hand"], ["Wholesome","good for the soul"], ["Witty","quick with the perfect line"], ["Wholehearted","nothing done by halves"], ["Worthy","of every good thing"], ["Winsome","charms without trying"]],
  X: [["X-factor","that special spark you carry"], ["XOXO","hugs and kisses to spare"], ["Xceptional","beyond the ordinary"], ["X-citing","never a dull moment"], ["Xenial","warm to every guest"], ["Xenophile","at home everywhere in the world"]],
  Y: [["Young-at-heart","with smiling eyes"], ["Yearning","always reaching higher"], ["Youthful","full of energy and cheer"], ["Yare","quick and ready for anything"], ["Yours","everyone's favorite person"], ["Yearlong","reliable all 365 days"]],
  Z: [["Zealous","enthusiastic in all you do"], ["Zestful","with a taste for life"], ["Zen","calm in every storm"], ["Zippy","quick in step and thought"], ["Zesty","full of flavor and zip"]],
};

/* ---------------- gender-aware trait selection ---------------- */
const FEMALE_NAMES = new Set("AISHA ANANYA ANITA ANJALI AMRITA ADITI AVANI BHAVNA DEEPA DIVYA DIYA ESHA FATIMA GAURI GEETA HEMA ISHITA JYOTI KAVYA KAJOL LAKSHMI LATA LEELA MEERA MITALI NISHA NEHA NANDINI PADMA POOJA PRIYA PRIYANKA PALAK RANI RADHA RITU RIA SARA SNEHA SHRUTI SIMRAN SONAL SWARA TARA TRISHA USHA VAISHALI VIDYA YAMINI ZARA ALICE AMANDA ANNA AVA CHARLOTTE CLAIRE ELIZABETH EMILY EMMA EVA FIONA GRACE HANNAH ISABELLA JANE JENNIFER JULIA KATE LAURA LILY LINDA LUCY MARIA MARY MEGAN MIA MICHELLE NATALIE NICOLE OLIVIA RACHEL REBECCA ROSE SAMANTHA SARAH SOPHIA STELLA SUSAN VICTORIA VIOLET WENDY".split(" "));
const MALE_NAMES = new Set("AARAV ADITYA AKASH AMAN ANIL ANISH ANURAG ARJUN ARNAV ASHOK BALAJI BHARAT CHETAN DEEPAK DEV DHRUV FARHAN GAURAV HARISH HARSH HEMANT IMRAN ISHAAN JAI JAYESH KABIR KARAN KARTIK KRISH LALIT MAHESH MANISH MOHIT NIKHIL NITIN OM PARESH PRANAV RAHUL RAJESH RAKESH RAVI REHAN ROHIT SAMIR SANJAY SHREYAS SIDDHARTH SUMIT SURAJ TUSHAR UDAY VARUN VIKAS VIKRAM VISHAL YASH ZAIN ADAM ANDREW ANTHONY BENJAMIN BRANDON CHARLES CHRISTIAN CHRISTOPHER DANIEL DAVID DYLAN EDWARD ETHAN FELIX GABRIEL GEORGE HARRY HENRY ISAAC JACK JACOB JAMES JASON JOHN JOSEPH JULIAN KEVIN LEO LIAM LOGAN LOUIS LUKE MARK MARTIN MATTHEW MICHAEL NATHAN NICHOLAS NOAH OLIVER OSCAR OWEN PATRICK PETER RICHARD ROBERT RYAN SAMUEL SEAN THEODORE THOMAS TIMOTHY VICTOR WILLIAM XAVIER ZACHARY".split(" "));

function genderOf(name) {
  if (!name) return "";
  const first = name.trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, "").toUpperCase();
  if (!first) return "";
  if (FEMALE_NAMES.has(first)) return "f";
  if (MALE_NAMES.has(first)) return "m";
  return "";
}

const EXTRA_LETTER_TRAITS = {
  A: [["Adaptable","easy to fit any plan"], ["Appreciative","never misses a kindness"], ["Artistic","sees beauty before the rest"], ["Approachable","easy to confide in"], ["Assertive","says what needs saying"], ["Astute","reads a room in seconds"], ["Amiable","a pleasure to be near"], ["Ardent","whole-hearted in everything"], ["Accomplished","good at whatever you set down"], ["Alert","awake to every detail"]],
  B: [["Beaming","a smile you can feel"], ["Benevolent","wishes people well and acts on it"], ["Blessed","a lucky star overhead"], ["Brisk","quick and full of purpose"], ["Brainy","sharp in a quiet way"], ["Bright-eyed","curious about everything"], ["Bounteous","generous beyond need"], ["Believing","keeps faith in people"], ["Blithe","light of heart"], ["Bold-hearted","brave where it counts"]],
  C: [["Considerate","remembers what you need"], ["Courageous","does the brave thing quietly"], ["Candid","honest without the sting"], ["Charismatic","draws people without trying"], ["Conscientious","does it properly or not at all"], ["Cheery","a lift in every greeting"], ["Cultured","at home in many worlds"], ["Clear-headed","steady under pressure"], ["Courteous","manners that never slip"], ["Champion","stands up for whoever needs it"]],
  D: [["Diplomatic","finds the way through"], ["Decisive","chooses and moves"], ["Dutiful","does what must be done"], ["Dreamy","half in a better world"], ["Droll","funny without warning"], ["Dapper","always put together"], ["Distinguished","carries a good name well"], ["Driven","a fire that never idles"], ["Discerning","taste you can trust"], ["Down-to-earth","no airs about it"]],
  E: [["Expressive","says it with the whole face"], ["Eager","first to begin"], ["Eloquent","turns a sentence well"], ["Emphatic","means it loudly when needed"], ["Entertaining","the evening improves on arrival"], ["Esteemed","held high by many"], ["Evergreen","stays good all year"], ["Exuberant","joy with the volume up"], ["Exact","precise where it matters"], ["Exceptional","a cut above"]],
  F: [["Forgiving","lets the small things go"], ["Flexible","bends without breaking"], ["Frank","the honest answer"], ["Free-spirited","follows their own wind"], ["Farsighted","plans past the horizon"], ["Flourishing","growing in every season"], ["Fond","keeps the warm regard"], ["Formidable","not to be underestimated"], ["Fervent","feels things deeply"], ["Fair","gives everyone their due"]],
  G: [["Gregarious","collects friends like stories"], ["Gentle","soft hands, steady heart"], ["Gallant","chivalry without the fuss"], ["Gutsy","brave on the quiet days"], ["Guiding","shows the way by walking it"], ["Grateful","counts what is good"], ["Gleaming","polished by hard days"], ["Good-humored","laughs first"], ["Grand","larger than the room"], ["Genial","warmth that costs nothing"]],
  H: [["Helpful","hands already there"], ["Humorous","finds the joke in the fog"], ["Hospitable","the door is always open"], ["Heroic","brave in the ordinary"], ["Hearty","full of good cheer"], ["Harmonious","makes the pieces fit"], ["Handy","fixes what others give up on"], ["High-achieving","sets the bar and clears it"], ["Honorable","the right thing, always"], ["Hale","sturdy in body and spirit"]],
  I: [["Industrious","works without the noise"], ["Inventive","makes a way where none was"], ["Inquisitive","asks the second question"], ["Infectious","joy that spreads"], ["Immaculate","nothing out of place"], ["Impressive","quietly so"], ["Incomparable","no one else fits the space"], ["Invaluable","worth more than counted"], ["Irrepressible","cannot be kept down"], ["Instructive","teaches by example"]],
  J: [["Joyous","glad in the morning"], ["Jazzy","a style all their own"], ["Jubilant","celebrates with the whole body"], ["Jocular","quick with the good line"], ["Just-hearted","fair even when tired"]],
  K: [["Kindly","gentle by default"], ["Kinetic","always in motion"], ["Knightly","noble in small things"], ["Keen-eyed","spots what others miss"]],
  L: [["Lovable","easy to love"], ["Lucid","clear as morning"], ["Laudable","worth praising aloud"], ["Luminous","gives light without trying"], ["Lofty","aims high and means it"]],
  M: [["Meticulous","nothing left to chance"], ["Mellow","calm water"], ["Mirthful","laughter just behind the eyes"], ["Mature","steady beyond the years"], ["Methodical","step by careful step"], ["Musical","hears what others miss"], ["Merciful","soft where it matters"]],
  N: [["Neat","order follows them"], ["Nifty","clever with the small stuff"], ["Noble-minded","thinks above the noise"], ["Nimble-fingered","makes hard things look easy"]],
  O: [["Orderly","a place for everything"], ["Open","no locked doors"], ["Obliging","glad to be of use"], ["Organized","calm because prepared"], ["Outspoken","says the true thing"], ["Open-handed","gives what is needed"]],
  P: [["Purposeful","every step means something"], ["Polite","courtesy as habit"], ["Proactive","ahead of the problem"], ["Perceptive","reads between the lines"], ["Plucky","brave at any size"], ["Protective","stands in front when needed"], ["Prolific","makes more than most"], ["Persuasive","wins with reason"], ["Practical","the useful answer"], ["Prepared","ready before the bell"]],
  Q: [["Quiet","strength without volume"], ["Quizzical","curious with a raised brow"], ["Quick-footed","first to the fun"], ["Quicksilver","impossible to pin down"], ["Queenly","grace that commands"]],
  R: [["Rational","cool in a hot moment"], ["Robust","built to last"], ["Reverent","holds things sacred"], ["Ready","always the first yes"], ["Rollicking","fun at full tilt"], ["Rousing","lifts a whole room"], ["Respectable","a name held well"], ["Relentless","does not stop at no"]],
  S: [["Serene","calm as deep water"], ["Sociable","at ease with anyone"], ["Steady","the same in every weather"], ["Sensible","the sound answer"], ["Skilled","hands that know the work"], ["Sparkling","light in every corner"], ["Sage","worth listening to"], ["Straightforward","says it plain"]],
  T: [["Tactful","truth with a soft edge"], ["Tidy","order without fuss"], ["Tolerant","room for everyone"], ["Trailblazing","goes where no one has"], ["Tranquil","quiet inside"], ["Trusting","gives people their chance"], ["Truthful","no varnish"], ["Tuned-in","hears what is not said"]],
  U: [["Unbowed","still standing, still smiling"], ["Uncommon","not made in multiples"], ["Unfailing","there every time"], ["United","brings people together"], ["Unshakable","calm under fire"], ["Upbeat","the mood lifts with them"], ["Useful","the one you call"], ["Unstinting","gives without measure"]],
  V: [["Vivacious","alive in every room"], ["Venerable","respected for good reason"], ["Vigilant","watches over the rest"], ["Venturesome","tries the untried"], ["Victorious","wins the long game"]],
  W: [["Warm","the welcome you remember"], ["Wise","knows what to keep quiet"], ["Witty","quick and kind with it"], ["Wonderful","in the plain sense"], ["Welcoming","everyone gets a seat"], ["Worthwhile","time well spent"], ["Wholesome","good to the core"]],
  X: [["Xenial","a gracious host"]],
  Y: [["Youthful","young at heart"], ["Yearning","always reaching"], ["Yes-saying","open to the world"]],
  Z: [["Zealous","all in on what matters"], ["Zesty","a bite to the day"], ["Zen","unbothered by the storm"], ["Zippy","quick and cheerful"]]
};

/* The extra banks are merged rather than pasted into the original literal, and
   duplicates are dropped by word, so running this twice cannot double a letter. */
(function () {
  Object.keys(EXTRA_LETTER_TRAITS).forEach(function (L) {
    var bank = LETTER_TRAITS[L] || (LETTER_TRAITS[L] = []);
    var seen = {};
    bank.forEach(function (t) { seen[t[0]] = 1; });
    EXTRA_LETTER_TRAITS[L].forEach(function (t) {
      if (!seen[t[0]]) { bank.push(t); seen[t[0]] = 1; }
    });
  });
})();

const EXTRA_TRAITS_2 = {
  A: [["Accurate","gets it right first time"], ["Active","always in the middle of it"], ["Adored","loved without conditions"], ["Affable","easy company"], ["Agile","quick in body and mind"], ["All-star","the pick of any team"], ["Amusing","the good kind of trouble"], ["Anchoring","keeps everyone steady"]],
  B: [["Beacon","the light others steer by"], ["Beguiling","charming without trying"], ["Big-thinking","plans beyond the room"], ["Blossoming","opening into themselves"], ["Bonny","bright and bonny"], ["Boundless","no edges found yet"]],
  C: [["Captivating","hard to look away from"], ["Carefree","carries no weight"], ["Centered","knows where they stand"], ["Cerebral","thinks three moves ahead"], ["Committed","all the way in"], ["Companionable","good company for a long road"], ["Consistent","the same every time"], ["Convivial","makes a table a party"]],
  D: [["Dandy","sharp in every detail"], ["Dashing","arrives with style"], ["Dauntless","fear does not steer"], ["Dear","held close by many"], ["Deep-thinking","goes past the surface"], ["Deft","neat with their hands"], ["Deliberate","nothing accidental"], ["Deserving","earns what comes"]],
  E: [["Earthy","grounded and real"], ["Effervescent","bubbles over with ideas"], ["Elated","joy comes easily"], ["Empowering","makes others braver"], ["Enlivening","wakes the room up"], ["Equanimous","even in the storm"], ["Exemplary","sets the example"], ["Expansive","room for everyone"]],
  F: [["Faith-filled","believes and keeps believing"], ["Famed","known for the right reasons"], ["Fastidious","exact in the details"], ["Fine","fine in the old sense"], ["Fitting","always the right fit"], ["Freehearted","gives love without a ledger"]],
  G: [["Genteel","old-fashioned good manners"], ["Gladsome","gladness comes naturally"], ["Golden-hearted","the best kind of gold"], ["Good-natured","never a sharp edge"], ["Grace-filled","grace in every step"], ["Grower","makes things grow"]],
  H: [["Handsome","easy on the eyes"], ["Happy-go-lucky","takes the day as it comes"], ["Heart-strong","brave in the softest way"], ["Heavenly","a gift to be near"], ["High-minded","aims at the better thing"], ["Homespun","warm and unvarnished"]],
  I: [["Idolized","looked up to by many"], ["Illumined","lights what they touch"], ["Impassioned","feels it and says it"], ["Improvising","makes it up beautifully"], ["Incandescent","glows under pressure"], ["Indefatigable","cannot be worn down"]],
  J: [["Joy-bringer","brings the good mood"], ["Jubilance","celebration in a person"]],
  K: [["Keeper","the one who stays"], ["Kindling","starts the fire in others"], ["Keen-minded","sharp and interested"]],
  L: [["Laid-back","unhurried and easy"], ["Large-hearted","room for every story"], ["Leading","out front by choice"], ["Learned","deep in the books"], ["Legendary","already a story"], ["Light-footed","moves without noise"], ["Likable","wins people quickly"], ["Lucky","good things find them"]],
  M: [["Majestic","takes up the room well"], ["Mannered","grace in the small things"], ["Masterful","makes it look simple"], ["Memorable","hard to forget, easy to like"], ["Merry-hearted","laughs before the joke"], ["Moxie","nerve and charm together"], ["Multi-talented","good at more than one thing"]],
  N: [["Nimble-minded","quick to the clever answer"], ["Noble-hearted","generous in the bones"], ["Noteworthy","worth writing down"], ["Nourishing","feeds people well"]],
  O: [["Open-souled","hides nothing"], ["Onward-looking","eyes on what is next"], ["Original-minded","thinks their own thoughts"]],
  P: [["Persevering","keeps at it"], ["Pioneering","first through the door"], ["Pitch-perfect","hits the note every time"], ["Poised","calm with an audience"], ["Polished","finished to the edges"], ["Praise-worthy","deserves the good word"], ["Proficient","skilled and sure"], ["Prudent","wise before the fact"]],
  Q: [["Quick-minded","fast on the uptake"], ["Quietly-strong","power without noise"], ["Quest-driven","always after something"]],
  R: [["Reassuring","the voice that steadies"], ["Refreshing","new air in a stale room"], ["Regal","carries the crown lightly"], ["Rejoicing","celebrates what is good"], ["Resolute","decided and unmoved"], ["Restful","peace follows them"], ["Revered","held in high regard"], ["Right-minded","thinks the right way"]],
  S: [["Sensational","stops the room"], ["Sharp","quick to the point"], ["Shrewd","sees the angle first"], ["Solid","dependable through anything"], ["Soulful","feels things in full color"], ["Splendid","worth the occasion"], ["Spry","light on their feet"], ["Stalwart","unmoved by weather"], ["Star","the one they come to see"], ["Sturdy","holds under weight"], ["Sure-footed","never loses the path"], ["Sunlit","brings the light in"]],
  T: [["Tasteful","never overdone"], ["Teachable","still learning, always"], ["Thorough","leaves nothing half done"], ["Thrilling","makes the ordinary loud"], ["Timeless","never out of date"], ["Tops","first among the rest"], ["Tough-minded","clear under pressure"], ["Trailblazer","goes first and looks back"]],
  U: [["Unafraid","steps in first"], ["Unbreakable","nothing has broken them yet"], ["Undaunted","keeps the line"], ["Unifying","makes a team of strangers"], ["Unrivaled","no one close"], ["Uplifted","rises and lifts"]],
  V: [["Valiant","brave with a good heart"], ["Veracious","tells it true"], ["Versed","knows the ground"], ["Vivifying","makes things come alive"], ["Vivid","impossible to ignore"]],
  W: [["Warm-hearted","warmth before words"], ["Watchful","notices the quiet ones"], ["Well-loved","loved in many places"], ["Winsome","wins without a contest"], ["Wise-hearted","wisdom with a soft edge"]],
  Y: [["Young-spirited","young where it counts"], ["Year-round","there in every season"], ["Yes-minded","open before asked"]],
  Z: [["Zestful","full of appetite for life"], ["Zingy","a spark in the room"], ["Zeal-filled","nothing half-hearted"]]
};

/* second pass: merged the same way, deduped by word, safe to re-run */
(function () {
  Object.keys(EXTRA_TRAITS_2).forEach(function (L) {
    var bank = LETTER_TRAITS[L] || (LETTER_TRAITS[L] = []);
    var seen = {};
    bank.forEach(function (t) { seen[t[0]] = 1; });
    EXTRA_TRAITS_2[L].forEach(function (t) {
      if (!seen[t[0]]) { bank.push(t); seen[t[0]] = 1; }
    });
  });
})();

const GENDER_TRAITS = {
  f: {
    A: [["Angel-hearted","kindness that shows"]],
    B: [["Blossoming","more wonderful every year"]],
    C: [["Charming","grace in every gesture"]],
    D: [["Divine","in a way words miss"]],
    E: [["Elegant","poise in every step"]],
    F: [["Fabulous","effortlessly wonderful"]],
    G: [["Glowing","a light all your own"]],
    H: [["Heart-mender","the one who makes it better"]],
    I: [["Iconic","impossible to forget"]],
    J: [["Jewel","precious beyond measure"]],
    K: [["Kindest","the softest heart around"]],
    L: [["Luminous","lighting every room you enter"]],
    M: [["Mesmerizing","a presence people remember"]],
    P: [["Picture-perfect","lovely inside and out"]],
    R: [["Regal","grace that needs no crown"]],
    S: [["Shimmering","bright with possibility"]],
    T: [["Tender-hearted","gentle with everyone"]],
    V: [["Vibrant","color in every room"]],
    W: [["Winsome","charm that draws people close"]]
  },
  m: {
    A: [["Astute","sharp in every situation"]],
    B: [["Bold","never one to step back"]],
    C: [["Charismatic","a presence rooms remember"]],
    D: [["Daring","first to take the leap"]],
    E: [["Esteemed","respected wherever you go"]],
    F: [["Fierce","all heart, all effort"]],
    G: [["Gallant","a gentleman through and through"]],
    H: [["Heroic","the one people count on"]],
    I: [["Incisive","straight to the heart of it"]],
    J: [["Juggernaut","unstoppable when it counts"]],
    K: [["Knight","first to show up, last to leave"]],
    L: [["Legendary","the stories are all true"]],
    M: [["Masterful","command of every craft"]],
    O: [["Outspoken","says what needs saying"]],
    P: [["Protector","a shield for the people you love"]],
    R: [["Rock-solid","steady when everything shakes"]],
    S: [["Stalwart","standing firm every time"]],
    T: [["Trailblazer","first through every door"]],
    U: [["Unshakeable","calm under any pressure"]],
    V: [["Valorous","courage where it matters"]],
    W: [["Worthy","earned, every bit of it"]]
  }
};

/* ---------------- occasion-aware word banks ---------------- */
/* Each occasion maps to a theme; theme banks are merged into the letter pools. */
const OCC_THEMES = {
  birthday: "birthday",
  wedding: "love", engagement: "love", anniversary: "love", valentine: "love",
  couple: "love", boyfriend: "love", girlfriend: "love", husband: "love", wife: "love",
  baby: "family", mother: "family", father: "family", sister: "family", brother: "family",
  son: "family", daughter: "family", grandma: "family", grandpa: "family", cousin: "family",
  aunt: "family", uncle: "family", niece: "family", nephew: "family",
  mothersday: "family", fathersday: "family", rakhi: "family",
  friendship: "friends", bestfriend: "friends", farewell: "friends",
  christmas: "festival", diwali: "festival", eid: "festival", easter: "festival",
  hanukkah: "festival", lunarnewyear: "festival", holi: "festival", navratri: "festival",
  thanksgiving: "festival", newyear: "festival",
  graduation: "milestone", newjob: "milestone", newhome: "milestone", retirement: "milestone", congrats: "milestone", goodluck: "milestone",
  teachersday: "school", thanks: "thanks", getwell: "heal", halloween: "spooky", pet: "pet",
  "teacher-appreciation": "school", "bar-mitzvah": "milestone", quinceanera: "milestone",
  "sweet-16": "birthday", prom: "friends", "silver-anniversary": "love",
  "karwa-chauth": "love", "grandparents-day": "family", "baby-shower": "family", "naming-ceremony": "family"
};

const OCC_TRAITS = {
  birthday: {
    B: [["Birthday-star","the person of the hour"],["Balloons","the whole party rises with them"]],
    C: [["Candles","one wish per flame"],["Cake","the sweetest slice is theirs"]],
    G: [["Gifts","though the best one is them"],["Glow","brighter than every candle lit"]],
    W: [["Wish-maker","eyes closed, thinking big"],["Winner","another year, another win"]],
    P: [["Party","the celebration follows them"],["Present","the one everyone came for"]],
    S: [["Surprise","the party's best-kept secret"],["Sparkler","held up on every chorus"]],
    H: [["High-fives","a full hand for every year"]],
    F: [["Fireworks","the year starts with a bang"]],
    T: [["Treat-bringer","the good bag, always shared"]]
  },
  love: {
    L: [["Love","the kind poems are written for"],["Lasting","in it for the long run"]],
    V: [["Vows","promises kept for life"],["Valentine","the name written in hearts"]],
    H: [["Heart-keeper","holding yours safely"],["Home","wherever they are is home"]],
    R: [["Romantic","still writing love notes"],["Real-deal","the love others point at"]],
    S: [["Soulmate","the other half, found"],["Sweetheart","the name on every heart"]],
    D: [["Devoted","all in, every day"]],
    T: [["Together","better side by side"]],
    C: [["Cherished","held close without trying"]],
    B: [["Better-half","the piece that completes the whole"]],
    M: [["Match","fate's finest pairing"]],
    K: [["Kiss-stealer","and still not sorry"]],
    A: [["Always","through every season of it"]],
    W: [["Whole-heart","given without hesitation"]],
    E: [["Eternal","the promise, kept"]]
  },
  family: {
    F: [["Family","the one everyone gathers around"],["First-call","the person you phone with news"]],
    H: [["Home","the place everyone returns to"]],
    R: [["Roots","the reason we all stand tall"]],
    B: [["Bond","unbroken by distance or years"]],
    G: [["Guide","the one everyone looks up to"],["Guardian","watching over us all"]],
    S: [["Shoulder","the one everyone leans on"],["Storyteller","keeper of every family tale"]],
    T: [["Teacher","first lessons, best lessons"]],
    M: [["Memory-keeper","holding every family story"]],
    P: [["Pride","the family's quiet pride"]],
    D: [["Dear-one","loved without condition"]],
    L: [["Legacy","the best of what we carry forward"]],
    C: [["Comfort","home has their voice on it"]]
  },
  friends: {
    F: [["Friend","the kind you keep forever"],["Fun","every joke lands with them"]],
    B: [["Best-friend","no contest, it's them"],["Backup","always in your corner"]],
    L: [["Laughter","the sound of every hangout"]],
    P: [["Partner-in-crime","schemes are better with them"]],
    S: [["Secret-keeper","vault-level security"],["Sidekick","never, because equals forever"]],
    M: [["Memories","a thousand and still counting"]],
    T: [["Trouble","the good kind, always"],["Together-through-it","no exception yet"]],
    J: [["Joke-sharer","even the bad ones are funny"]],
    C: [["Corner-keeper","your spot in their circle, permanent"]]
  },
  festival: {
    L: [["Light","the brightest lamp in the row"],["Lights","the season glows brighter with them"]],
    J: [["Joy","arriving with the season itself"],["Jubilee","the celebration walks in with them"]],
    G: [["Glow","warmer than every lamp lit"],["Gathering","the one everyone waits for"]],
    S: [["Sparkle","the festival's brightest"],["Sweets","and sweeter than all of them"]],
    B: [["Blessing","counted among the best"],["Bash","the heart of every celebration"]],
    W: [["Warmth","the season's real gift"],["Wishes","every one of them is theirs"]],
    C: [["Celebration","the reason for the season"],["Cheer","spreading it by default"]],
    F: [["Feast","the table's brightest presence"],["Festive","wearing the season itself"]],
    T: [["Toast","raised in their name"],["Tradition","the one everyone loves most"]],
    H: [["Holiday","made better by them"],["Happiness","passed around by the handful"]],
    R: [["Reunion","the moment everyone waits for"]],
    E: [["Ever-bright","through every season"]],
    P: [["Prayers","answered, in the form of them"]],
    D: [["Diya-light","a flame that never dims"]],
    K: [["Kindling","the warmth starts with them"]]
  },
  milestone: {
    G: [["Graduate","the cap, the gown, the future"],["Go-getter","doors open when they knock"]],
    N: [["New-chapter","the best pages are ahead"],["Next-level","already there"]],
    F: [["Future","bright, and clearly theirs"],["First","in line for everything great"]],
    T: [["Top-of-the-class","and it shows"],["Triumph","earned, and then some"]],
    A: [["Achiever","the proof is framed on the wall"]],
    S: [["Success","earned, not given"],["Scholar","now certified"]],
    R: [["Rising","and still climbing"],["Record","the one they just broke"]],
    C: [["Champion","today belongs to them"],["Commencement","not an ending, a launch"]],
    P: [["Promotion","well earned"],["Pioneer","first through every door"]],
    W: [["World-ready","and then some"]],
    H: [["Hard-won","and worth every hour"],["High-flyer","clearance unlimited"]],
    M: [["Milestone","they are the milestone"]],
    D: [["Destiny","clearly at work here"]]
  },
  school: {
    T: [["Teacher","the lesson that lasts a lifetime"],["Torch","lighting the way for many"]],
    M: [["Mentor","guidance that sticks"],["Molder-of-minds","gently, every day"]],
    P: [["Patience","endless, and deeply appreciated"]],
    L: [["Lessons","the kind you keep forever"]],
    E: [["Educator","in the truest sense"],["Encourager","the first to believe in us"]],
    G: [["Guide","to a whole classroom at once"]],
    S: [["Sage","chalk-dust and wisdom"],["Star","of every roll call"]],
    K: [["Kindling","the love of learning"]],
    I: [["Inspiring","the reason students aim higher"]]
  },
  thanks: {
    T: [["Thank-you","not nearly enough"],["Treasure","the kind you cannot buy"]],
    G: [["Grateful","doesn't even cover it"],["Giver","without ever keeping score"]],
    K: [["Kindness","returned a thousand times over"]],
    H: [["Help","the kind that just shows up"],["Heart","gold, through and through"]],
    B: [["Blessing","the kind you count twice"]],
    S: [["Selfless","in every small way"],["Sunshine","on the heaviest of days"]],
    A: [["Appreciated","more than words can hold"]]
  },
  heal: {
    S: [["Stronger","every single day"],["Sunshine","already coming back"]],
    H: [["Healing","well on the way"],["Heart","the fight in it is winning"]],
    R: [["Rest","well earned"],["Recovery","already underway"]],
    B: [["Brave","through every appointment"],["Better","better every day"]],
    W: [["Warrior","and clearly winning"]],
    F: [["Fighter","the gentlest kind"]],
    G: [["Getting-there","and getting there fast"]],
    T: [["Tough","the quiet, gentle kind"]]
  },
  spooky: {
    S: [["Spook-tacular","the star of the night"],["Sweetest-treat","in the whole bag"]],
    B: [["Boo-tiful","glowing in the dark"],["Batty","in the most charming way"]],
    M: [["Magical","under the full moon"],["Moonlit","and mysterious"]],
    C: [["Candy-connoisseur","discriminating taste"],["Costume","the one everyone copies"]],
    G: [["Ghostly","in the friendliest way"],["Gourd-geous","the pick of the patch"]],
    T: [["Treat","the reason the trick-or-treaters came"]],
    F: [["Fang-tastic","all smiles tonight"]],
    P: [["Pumpkin","the cutest in the patch"]]
  },
  pet: {
    P: [["Pawsome","obviously"],["Playful","zoomies at all hours"]],
    F: [["Fur-ever","family, permanently"],["Fluff","certified"]],
    G: [["Goodest","there is none better"],["Greeter","at the door, every single time"]],
    B: [["Beloved","tail wags included"]],
    L: [["Loyal","since the day you met"]],
    T: [["Tail-wagger","self-trained professional"]],
    C: [["Cuddle-expert","advanced certification"]],
    S: [["Snuggles","available on demand"]]
  }
};

function traitsFor(L, g, occ) {
  let bank = (LETTER_TRAITS[L] || []).slice();
  if (g && GENDER_TRAITS[g] && GENDER_TRAITS[g][L]) bank = bank.concat(GENDER_TRAITS[g][L]);
  if (occ && OCC_TRAITS[occ] && OCC_TRAITS[occ][L]) bank = bank.concat(OCC_TRAITS[occ][L]);
  if (g === "m") bank = bank.filter((t) => t[2] !== "f");
  if (g === "f") bank = bank.filter((t) => t[2] !== "m");
  return bank.length ? bank : [[L + "-cellent", "one of a kind"]];
}

/* Picks a trait, leaning toward occasion words at least once per poem. */
function pickTrait(L, g, occ, used, occUsed, first) {
  const occBank = occ && OCC_TRAITS[occ] && OCC_TRAITS[occ][L] ? OCC_TRAITS[occ][L] : [];
  const full = traitsFor(L, g, occ);
  const useOcc = occBank.length > 0 && (first === true || Math.random() < 0.3);
  let pool = useOcc ? occBank : full;
  let trait = pick(pool);
  let guard = 0;
  while ((used.has(trait[0]) || avoidWords.has(trait[0])) && guard < 12) { trait = pick(pool); guard++; }
  if ((used.has(trait[0]) || avoidWords.has(trait[0])) && pool === occBank) { pool = full; guard = 0; trait = pick(pool); while ((used.has(trait[0]) || avoidWords.has(trait[0])) && guard < 12) { trait = pick(pool); guard++; } }
  used.add(trait[0]);
  if (occBank.some((t) => t[0] === trait[0])) occUsed.n++;
  return trait;
}

const CLOSERS = {
  birthday: ["a self-motivated individual, one year wiser","one of a kind, today and always", "born to be celebrated", "the gift is having you", "a year older, a year more wonderful", "the candle that outshines the cake", "aging like the finest things do", "the birthday star, as always"],
  wedding: ["beginning a beautiful new chapter","ready for forever", "today's beautiful beginning", "love's favorite person", "today's happily ever after begins", "love's favorite leading role", "wearing forever well", "the wedding everyone will remember"],
  anniversary: ["still writing a beautiful story","proof that true love lasts", "the better half of a great whole", "still everyone's favorite love story", "still the sweetest pair we know", "like fine wine, better every year", "the anniversary that never gets old", "the love the years can't touch"],
  baby: ["our little miracle, just arrived","brand new and already so loved", "the newest little wonder", "small but already so loved", "tiny hands, giant blessing", "the newest star of the family", "cute enough to end arguments", "our little miracle in progress"],
  graduation: ["a self-motivated individual, ready for the world","destined for great things", "the future's brightest name", "a graduate going places", "caps off to you", "the degree is just the beginning", "top of the class of life", "smart cookie, brighter future"],
  retirement: ["a legend signing off in style","ready for life's next adventure", "a master of the art of living", "the guest of honor, always", "clocking out of work, into joy", "the promotion to permanent relaxation", "a career worth celebrating", "free at last, and loving it"],
  farewell: ["a self-motivated individual, headed for brighter roads","missed already, cheered always", "hard to leave, harder to forget", "the one who made every place better", "not goodbye, just see you later", "the place won't be the same", "off to better beginnings", "our favorite farewell ever"],
  friendship: ["a friend for life","the one everyone is lucky to know", "loyalty in human form", "sunshine in human form", "a ten out of ten friend", "friendship's finest example", "the friend others measure against", "loyal to the last"],
  thanks: ["a selfless soul we are grateful for","kindness in person", "gratitude's favorite person", "one in a million, truly", "the reason we're saying thanks", "kindness deserves this spotlight", "our thanks, multiplied by infinity", "the helper we all hope for"],
  getwell: ["strong, and getting stronger every day","resting now, back on your feet soon", "stronger than yesterday", "our favorite fighter", "healing already looks good on you", "rest now, shine soon", "your seat here is saved", "better every single day"],
  christmas: ["the spirit of the season in person","someone worth celebrating this Christmas", "the season's brightest star", "Christmas magic in person", "the best gift under our tree", "Christmas comes alive with you", "santa's favorite human", "the carol of our hearts"],
  diwali: ["a light that brightens every room","the sparkle of every celebration", "the light of every gathering", "glowing brighter than fireworks", "the brightest diya in the row", "as radiant as a thousand lamps", "the sweetness in every box of mithai", "guest of honor this festival of lights"],
  eid: ["blessed, and a blessing to others","the joy of every gathering", "the heart of every celebration", "wrapped in love and blessings", "the crescent's favorite person", "the joy of every Eid morning", "sweet as sheer khurma", "a walking Eid blessing"]
};

/* ---------------- writing voices ---------------- */

const P_ADJ = { heartfelt: "", playful: "playful", grand: "grand", gentle: "gentle" };
const P_SUF = {
  playful: ["obviously", "and everyone knows it", "no contest", "ask anyone", "as the confetti confirms", "certified", "and proudly so", "on the record"],
  grand: ["as legends tell", "and history agrees", "as befits the name", "and the world takes notice", "as the portrait proves", "fit for a plaque"]
};
const P_CLOSERS = {
  playful: ["the star of the party, obviously", "a ten out of ten, no debate", "the reason the playlist slaps", "certified fun, live in person", "the joke that always lands", "the main character, no audition needed", "the guest of honor, self-evidently", "zero chill, all charm"],
  grand: ["a name the day will long remember", "a legend in comfortable shoes", "the title role of this story", "a name worthy of a portrait", "history's favorite guest tonight", "the headline act, as ever", "a name spoken with admiration", "the standard others are measured by"],
  gentle: ["quietly wonderful, always", "soft-hearted and steady", "a calm place in a loud world", "kind in ways that stay", "gentle, and strong for it", "a warm light left on", "the quiet heart of the day", "loved more than words manage"]
};
const R_CODA = {
  heartfelt: [
    "And may you know, in all you do,\nhow much of this world leans on you.",
    "So take this wish and keep it near,\na little light for every year.",
    "Whatever comes and whatever goes,\nyou are loved more than you know."
  ],
  gentle: [
    "And may the year be soft with you,\nin everything you say and do.",
    "So here is one wish, small and true:\nthe gentlest light, and that is all.",
    "May quiet joy find where you are,\nand never have to travel far."
  ],
  playful: [
    "So raise a glass, or three, or four,\nand someone ends up on the floor.",
    "And if the day goes slightly wrong,\nat least you get this silly song.",
    "May luck show up and overstay,\nand bring its loudest friends to play."
  ],
  grand: [
    "So let the bells and banners say\nthe name that carries off the day.",
    "And let the record show it plain:\nthe world is better for your name.",
    "Let trumpets do what trumpets do,\nand make a little noise for you."
  ]
};
const avoidWords = new Set();

let VOICE = "heartfelt";
function maybeSuf() {
  const bank = P_SUF[VOICE] || [];
  return bank && bank.length && Math.random() < 0.45 ? pick(bank) : "";
}

function pickCloser(occ) {
  const p = VOICE;
  if (p !== "heartfelt" && P_CLOSERS[p] && Math.random() < 0.75) return pick(P_CLOSERS[p]);
  return pick(OCCASIONS[occ].closers || CLOSERS[occ]);
}

/* ---------------- state & helpers ---------------- */



const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function buildAcrostic(name, occ) {
  const letters = deaccent(name).replace(/[^a-zA-Z]/g, "").toUpperCase().split("");
  const used = new Set();
  const occUsed = { n: 0 };
  const g = genderOf(name);
  return letters.map((L, i) => {
    const trait = pickTrait(L, g, occ, used, occUsed, i === 0);
    return { letter: L, word: trait[0], desc: trait[1], suf: maybeSuf() };
  });
}

function buildAcrosticPair(n1, n2, occ) {
  const l1 = deaccent(n1).replace(/[^a-zA-Z]/g, "").toUpperCase().split("");
  const l2 = deaccent(n2).replace(/[^a-zA-Z]/g, "").toUpperCase().split("");
  const inter = [];
  const maxL = Math.max(l1.length, l2.length);
  for (let i = 0; i < maxL; i++) {
    if (i < l1.length) inter.push({ letter: l1[i], who: n1 });
    if (i < l2.length) inter.push({ letter: l2[i], who: n2 });
  }
  const used = new Set();
  const occUsed = { n: 0 };
  return inter.map((x, i) => {
    const trait = pickTrait(x.letter, genderOf(x.who), occ, used, occUsed, i === 0);
    return { letter: x.letter, word: trait[0], desc: trait[1], suf: maybeSuf(), who: x.who };
  });
}

function acrosticLine(l) {
  return l.letter + " is for " + l.word + ", " + l.desc + (l.suf ? ", " + l.suf : "") + (l.who ? " (" + l.who + ")" : "");
}



function buildRhyme(name, name2, vi, occ) {
  const theme = OCCASIONS[occ] || OCCASIONS.birthday;
  const shown = name2 ? name + " and " + name2 : name;
  const pretty = shown.charAt(0).toUpperCase() + shown.slice(1);
  const verses = theme.verses || [];
  const vIdx = { gentle: 0, playful: 1, heartfelt: 2, grand: 3 }[VOICE] || 2;
  const t = verses[(vi + vIdx) % (verses.length || 1)] || verses[0] || "Dear {N}, today is all about you.";
  const body = t.split("{N}").join(pretty);
  // the voice had no reach into rhyming cards: every voice returned the same
  // stanza. The closing couplet is where a voice can be heard on any occasion.
  const bank = R_CODA[VOICE] || R_CODA.heartfelt;
  const coda = bank[(vi + pretty.length) % bank.length];
  return body + "\n" + coda;
}


  window.Acrostia = {
    occasions: function () { return Object.keys(OCCASIONS); },
    label: function (o) { return (OCCASIONS[o] || OCCASIONS.birthday).label; },
    genderOf: genderOf,
    acrostic: function (name, occ) { return buildAcrostic(name, occ); },
    pair: function (a, b, occ) { return buildAcrosticPair(a, b, occ); },
    line: function (l) { return acrosticLine(l); },
    rhyme: function (a, b, vi, occ) { return buildRhyme(a, b, vi, occ); },
    verseCount: function (occ) { return ((OCCASIONS[occ] || OCCASIONS.birthday).verses || []).length; },
    closer: function (occ) { return pickCloser(occ); },
    voice: function (v) { VOICE = v || "heartfelt"; },
    canAcrostic: function (n) { return /[A-Za-z]/.test(deaccent(n)); },
    reroll: function (L, occ, exclude) {
      var pool = traitsFor(L, "", occ).filter(function (t) { return t[0] !== exclude; });
      var t = pool.length ? pick(pool) : traitsFor(L, "", occ)[0];
      return { letter: L, word: t[0], desc: t[1], suf: maybeSuf() };
    }
  };
})();
