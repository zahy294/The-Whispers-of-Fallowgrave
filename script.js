// ========== GAME STATE ==========

const gameState = {
  currentSceneId: "title",
  sanity: 80,
  clues: new Set(),
  inventory: new Set()
};

// Descriptions of clues & items (for HUD)
const CLUE_INFO = {
  blackwood_letter: {
    name: "Dr. Blackwood’s Letter",
    desc: "Desperate plea: 'My daughter is missing. The town is wrong.'"
  },
  innkeeper_reaction: {
    name: "Innkeeper’s Fear",
    desc: "She flinched at Miriam’s name like it was a curse."
  },
  sigil_wall: {
    name: "Alley Sigil",
    desc: "A twisted symbol carved into stone. Miriam drew the same pattern."
  },
  portrait_eh: {
    name: "Defaced Portrait Initials",
    desc: "The Blackwood family portrait once bore the initials 'E.H.' — lightly scratched out."
  },
  journal_man_in_mirror: {
    name: "Man in the Mirror",
    desc: "Miriam wrote about a man wearing her father’s coat… and his face."
  },
  cult_log_eh: {
    name: "Cult Ledger: E.H.",
    desc: "The cult’s attendance log lists 'Presiding: E.H.' in a crisp hand."
  },
  repeated_investigations: {
    name: "Repeated Investigations",
    desc: "Dr. Blackwood hints that you’ve come before — and forgotten."
  },
  sanatorium_truth: {
    name: "Fallowgrave Sanatorium",
    desc: "The town, the estate, the mines — all echoes inside a secure ward."
  }
};



const ITEM_INFO = {
  room_key: {
    name: "Inn Room Key",
    desc: "A dull brass key to a cramped room upstairs."
  },
  lantern: {
    name: "Old Lantern",
    desc: "Rusty, but the flame still holds. Enough to face the dark in the mines."
  }
};


// ========== SCENE DATA ==========
//
// Each scene has:
// id: internal key
// title: scene title
// tag: chapter/label
// backgroundClass: for #background-layer
// text: main narrative HTML/text
// onEnter: optional function(state) for automatic effects
// choices: array of { text, next, sanityChange, addClue, addItem, requireClue, requireItem }

const scenes = {
  coach_arrival: {
    title: "Arrival in Fallowgrave",
    tag: "Act I · The Town That Forgot Itself",
    backgroundClass: "bg-coach_arrival",
    text: `
      <p>The carriage wheels groaned to a halt.</p>
      <p>Fallowgrave did not look like a town so much as a wound that refused to heal. 
      Crooked lamps bled weak orange light into the fog, and somewhere in the distance, a bell tolled—out of rhythm, as if it had forgotten how time worked.</p>
      <p>I stepped down, boots sinking into wet cobblestone, clutching the letter that had dragged me here:</p>
      <p><em>"My daughter is missing. The town is wrong. Please, Mr. Halloway. Before it takes her too."</em><br>— Dr. Elias Blackwood</p>
    `,
    choices: [
      {
        text: "Walk towards the inn that flickers in the fog.",
        next: "inn_exterior"
      },
      {
        text: "Inspect Dr. Blackwood’s letter again.",
        next: "coach_arrival",
        addClue: "blackwood_letter",
        sanityChange: -1
      }
    ]
  },

  inn_exterior: {
    title: "The Last Refuge",
    tag: "Act I · Fallowgrave",
    backgroundClass: "bg-inn_exterior",
    text: `
      <p>The inn hunched over the street like it was ashamed to be seen.</p>
      <p>A sign swung overhead: <em>The Last Refuge</em> — most of the paint long surrendered to the rain. Light pulsed weakly behind the curtains.</p>
      <p>Somewhere behind the glass, I felt the weight of unseen eyes, watching the stranger who didn’t know better than to leave.</p>
    `,
    choices: [
      {
        text: "Enter the inn.",
        next: "inn_lobby"
      },
      {
        text: "Pause in the street and listen.",
        next: "inn_exterior",
        sanityChange: -2
      }
    ]
  },

  inn_lobby: {
    title: "The Innkeeper’s Warning",
    tag: "Act I · The Last Refuge",
    backgroundClass: "bg-inn_lobby",
    text: `
      <p>The air inside was thick with smoke and whispers. The fire in the hearth burned low, more embers than flame.</p>
      <p>The innkeeper looked up, startled, as if I had walked in on something I was not meant to see. Her hands were still for only a heartbeat before they resumed polishing a glass that was already clean.</p>
      <p>"Room?" she asked, without so much as a greeting. Her voice was low, hurried—like she wanted the conversation over before it began.</p>
      <p>"I’m looking into the disappearance of Miriam Blackwood," I said.</p>
      <p>Her jaw tightened. The cloth in her hand stilled.</p>
      <p>"You shouldn’t say that name so loudly," she whispered.</p>
    `,
    choices: [
      {
        text: "Press her for details about Miriam.",
        next: "inn_lobby_pressed",
        sanityChange: -5,
        addClue: "innkeeper_reaction"
      },
      {
        text: "Stay polite. Just ask for a room.",
        next: "inn_room_intro",
        addItem: "room_key"
      },
      {
        text: "Show her Dr. Blackwood’s letter.",
        next: "inn_lobby_letter",
        addClue: "innkeeper_reaction"
      }
    ]
  },

  inn_lobby_pressed: {
    title: "Pushed Too Hard",
    tag: "Act I · The Last Refuge",
    backgroundClass: "bg-inn_lobby",
    text: `
      <p>"You knew her," I said. "Miriam Blackwood. What happened to her?"</p>
      <p>The innkeeper’s gaze darted to the door, then to the hearth, anywhere but my face.</p>
      <p>"Some questions," she murmured, "have answers that don’t like to stay buried."</p>
      <p>She slid a tarnished key across the counter. Her fingers trembled when they withdrew.</p>
      <p>"Up the stairs. End of the hall," she said. "And if something in that room asks you to look in the mirror… don’t."</p>
    `,
    choices: [
      {
        text: "Take the key and go to the room.",
        next: "inn_room_intro",
        addItem: "room_key"
      }
    ]
  },

  inn_lobby_letter: {
    title: "Reluctant Recognition",
    tag: "Act I · The Last Refuge",
    backgroundClass: "bg-inn_lobby",
    text: `
      <p>I unfolded the letter and placed it on the counter.</p>
      <p>The innkeeper read only the first line before pulling her hand back like it had burned her.</p>
      <p>"He wrote to you again," she breathed. "I told him… this wouldn’t help."</p>
      <p>Her eyes finally met mine, shiny with something that might have been pity. Or fear.</p>
      <p>"Room’s ready," she said hoarsely, sliding a key toward me. "Second floor. Last door. You’ll… understand when you see it."</p>
    `,
    choices: [
      {
        text: "Take the key and head to the room.",
        next: "inn_room_intro",
        addItem: "room_key"
      }
    ]
  },

  inn_room_intro: {
    title: "A Room That Remembers",
    tag: "Act I · The Last Refuge",
    backgroundClass: "bg-inn_room",
    text: `
      <p>The room they gave me was barely more than a box—one bed, one desk, one window choked with fog.</p>
      <p>Someone had draped a cloth over the mirror on the far wall. The fabric moved slightly, as though it were breathing.</p>
      <p>The silence felt deliberate. Like the town itself was holding its breath.</p>
    `,
    onEnter: (state) => {
      // small sanity sting on entering this room the first time
      if (!state._seenInnRoom) {
        state.sanity -= 3;
        state._seenInnRoom = true;
      }
    },
    choices: [
      {
        text: "Approach the covered mirror.",
        next: "inn_room_mirror",
        sanityChange: -5
      },
      {
        text: "Inspect the desk and whatever notes were left behind.",
        next: "inn_room_desk"
      },
      {
        text: "Look out the window into the fog-drowned street.",
        next: "inn_room_window",
        sanityChange: -2
      }
    ]
  },

  inn_room_mirror: {
    title: "The Covered Glass",
    tag: "Act I · The Last Refuge",
    backgroundClass: "bg-inn_room",
    text: `
      <p>I reached for the cloth. The air around the mirror felt a few degrees colder, as if the glass drank in warmth.</p>
      <p>The fabric rasped as I pulled it away.</p>
      <p>For a heartbeat, the reflection was wrong.</p>
      <p>Someone stood just behind me in the glass—taller, the outline slightly skewed. When I turned, the room was empty.</p>
      <p>When I looked back, only my face stared out at me. Slightly paler than I remembered.</p>
    `,
    choices: [
      {
        text: "Step back from the mirror and steady yourself.",
        next: "inn_room_intro"
      }
    ]
  },

  inn_room_desk: {
    title: "Ink and Dust",
    tag: "Act I · The Last Refuge",
    backgroundClass: "bg-inn_room",
    text: `
      <p>The desk was scarred with old ink stains and cigarette burns. Someone had left a drawer half-open.</p>
      <p>Inside, a single sheet of paper lay folded in half. No dust on it. Recent.</p>
      <p>It read: <em>"He always starts here."</em></p>
      <p>The rest of the page was blank, as if whatever came next had been erased, or never written at all.</p>
    `,
    choices: [
      {
        text: "Who is 'he'? Step back and take in the room again.",
        next: "inn_room_intro",
        sanityChange: -3
      }
    ]
  },

  inn_room_window: {
    title: "Things Moving in Fog",
    tag: "Act I · The Last Refuge",
    backgroundClass: "bg-inn_room",
    text: `
      <p>I wiped a circle into the condensation on the window.</p>
      <p>The street below was empty, but the fog moved like something alive—curling around the lampposts, recoiling from the inn’s dim light.</p>
      <p>For a moment, shapes formed. A carriage. A figure. A girl looking up at my window.</p>
      <p>I blinked, and there was only fog.</p>
    `,
    choices: [
      {
        text: "Draw the curtains and turn back to the room.",
        next: "inn_room_intro"
      }
    ]
  }
};
// === Title Screen ===
scenes.title = {
  title: "The Whispers of Fallowgrave",
  tag: "A Psychological Horror Detective Story",
  backgroundClass: "bg-title",
  text: `
    <p>You do not remember how many times you’ve told this story.</p>
    <p>Each time, it begins the same way: a letter, a missing girl, a town that feels like a wound.</p>
    <p>This is one of those times.</p>
  `,
  onEnter: (state) => {
    // Clean slate when arriving at title
    state.sanity = 80;
    state.clues = new Set();
    state.inventory = new Set();
    state._seenInnRoom = false;
  },
  choices: [
    {
      text: "Begin the investigation.",
      next: "coach_arrival"
    },
    {
      text: "Remember nothing. Let the story tell itself again.",
      next: "coach_arrival"
    }
  ]
};

// Override inn_room_intro to add route to the Blackwood estate
scenes.inn_room_intro = {
  title: "A Room That Remembers",
  tag: "Act I · The Last Refuge",
  backgroundClass: "bg-inn_room",
  text: `
    <p>The room they gave me was barely more than a box—one bed, one desk, one window choked with fog.</p>
    <p>Someone had draped a cloth over the mirror on the far wall. The fabric moved slightly, as though it were breathing.</p>
    <p>The silence felt deliberate. Like the town itself was holding its breath.</p>
  `,
  onEnter: (state) => {
    if (!state._seenInnRoom) {
      state.sanity -= 3;
      state._seenInnRoom = true;
    }
  },
  choices: [
    {
      text: "Approach the covered mirror.",
      next: "inn_room_mirror",
      sanityChange: -5
    },
    {
      text: "Inspect the desk and whatever notes were left behind.",
      next: "inn_room_desk"
    },
    {
      text: "Look out the window into the fog-drowned street.",
      next: "inn_room_window",
      sanityChange: -2
    },
    {
      text: "Leave the inn and follow the road to the Blackwood estate.",
      next: "street_to_blackwood"
    }
  ]
};
// Override blackwood_foyer to add route to the mines
scenes.blackwood_foyer = {
  title: "The House That Watches",
  tag: "Act II · Blackwood Estate",
  backgroundClass: "bg-blackwood_foyer",
  text: `
    <p>The front hall breathed dust and the faint rot of old flowers.</p>
    <p>A staircase climbed into the shadows. A chandelier sagged overhead, crystal teeth missing. Portraits lined the walls, their subjects watching with the flat patience of the dead.</p>
    <p>Through a warped pane beside the door, I could see the line of the hills—where the old Fallowgrave mines burrowed into the earth like a wound that never healed.</p>
  `,
  choices: [
    {
      text: "Examine the large family portrait at the end of the hall.",
      next: "blackwood_portrait"
    },
    {
      text: "Climb the stairs toward Miriam’s room.",
      next: "miriam_room_intro"
    },
    {
      text: "Try the door to Dr. Blackwood’s locked study.",
      next: "blackwood_study_locked",
      sanityChange: -1
    },
    {
      text: "Leave the estate and follow the path toward the old mines.",
      next: "mines_approach",
      sanityChange: -3
    }
  ]
};
// Override Dr. Blackwood’s study door to enable opening with clues
scenes.blackwood_study_locked = {
  title: "A Door That Remembers",
  tag: "Act IV · Blackwood Estate",
  backgroundClass: "bg-blackwood_foyer",
  text: `
    <p>The study door did not rattle in its frame; it didn’t need to. It was the kind of locked that came with intent, not just hardware.</p>
    <p>I laid my hand on the knob. The metal was warm.</p>
    <p>For a moment, I could have sworn I felt the faint impression of my own grip already etched into it.</p>
    <p>But this time, something felt... ready.</p>
  `,
  choices: [
    {
      text: "Open the door. You’ve come far enough.",
      next: "blackwood_study_confrontation",
      requireClue: "cult_log_eh",
      sanityChange: -2
    },
    {
      text: "Step back into the foyer.",
      next: "blackwood_foyer"
    }
  ]     
};

// === Act II: The Blackwood Estate ===
Object.assign(scenes, {
  street_to_blackwood: {
    title: "The Road to the Estate",
    tag: "Act II · Blackwood",
    backgroundClass: "bg-street_blackwood",
    text: `
      <p>Fallowgrave’s streets twisted like they’d been laid out by a drunk or a madman.</p>
      <p>The houses thinned, giving way to skeletal trees and leaning fences. Above them all, the Blackwood estate rose from the fog, brick by brick, until it seemed to blot out the sky.</p>
      <p>Somewhere behind me, the town exhaled. Ahead, the estate waited.</p>
    `,
    choices: [
      {
        text: "Follow the main road up to the gates.",
        next: "blackwood_gate"
      },
      {
        text: "Slip into a narrow side alley first.",
        next: "alley_symbol",
        sanityChange: -2
      }
    ]
  },

  alley_symbol: {
    title: "The Mark on the Wall",
    tag: "Act II · Fallowgrave",
    backgroundClass: "bg-alley_symbol",
    text: `
      <p>The alley was barely wide enough for my shoulders. The brick pressed in on either side, slick with moss.</p>
      <p>Halfway down, something caught the light—a symbol carved low into the stone. The grooves were fresh, deeper than the age of the wall.</p>
      <p>It was the same twisted pattern Miriam had sketched in the margins of her journal pages in Dr. Blackwood’s letter.</p>
    `,
    choices: [
      {
        text: "Commit the sigil to memory and continue to the estate.",
        next: "blackwood_gate",
        addClue: "sigil_wall"
      }
    ]
  },

  blackwood_gate: {
    title: "The Crest and the Gate",
    tag: "Act II · Blackwood Estate",
    backgroundClass: "bg-blackwood_gate",
    text: `
      <p>The Blackwood gates loomed over the path, iron bars slick with rain and time. A family crest was set into the center—three interlocking shapes, like a puzzle that refused to be understood at a glance.</p>
      <p>No lock showed on the outside. Whatever kept the gate closed was built into the crest itself.</p>
    `,
    choices: [
      {
        text: "Study the crest carefully, recalling the seal on Dr. Blackwood’s letter.",
        next: "blackwood_gate_solved",
        requireClue: "blackwood_letter",
        sanityChange: -2
      },
      {
        text: "Try to force the gate open with your shoulder.",
        next: "blackwood_gate",
        sanityChange: -5
      },
      {
        text: "Step back and stare at the estate, wondering why it feels familiar.",
        next: "blackwood_gate",
        sanityChange: -1
      }
    ]
  },

  blackwood_gate_solved: {
    title: "Hands That Remember",
    tag: "Act II · Blackwood Estate",
    backgroundClass: "bg-blackwood_gate",
    text: `
      <p>Up close, the crest wasn’t symbolic—it was mechanical.</p>
      <p>I traced the lines I’d seen pressed in wax on the bottom of Dr. Blackwood’s letter. My fingers moved almost on their own, turning one segment, then another, then a third.</p>
      <p>A soft click whispered through the iron. The gate shivered, then swung inward with a long, reluctant groan.</p>
      <p>My hands were steady. Too steady. As if they’d done this before.</p>
    `,
    choices: [
      {
        text: "Step through the gate into the Blackwood estate.",
        next: "blackwood_foyer"
      }
    ]
  },

 

  blackwood_portrait: {
    title: "Faces in Oil",
    tag: "Act II · Blackwood Estate",
    backgroundClass: "bg-blackwood_foyer",
    text: `
      <p>The portrait dominated the far wall—Dr. Elias Blackwood, stiff-backed and severe. Beside him, a girl of perhaps seventeen, dark hair gathered with a ribbon: Miriam.</p>
      <p>There was space for a third figure. The paint there had been scraped thin, as if someone had tried to erase a person from the family.</p>
      <p>Below, half-hidden by grime, the faint trace of initials remained: <em>E. H.</em></p>
    `,
    choices: [
      {
        text: "Run your fingers over the scratched initials.",
        next: "blackwood_foyer",
        addClue: "portrait_eh",
        sanityChange: -4
      },
      {
        text: "Turn away and head upstairs toward Miriam’s room.",
        next: "miriam_room_intro"
      }
    ]
  },

  miriam_room_intro: {
    title: "Miriam’s Room",
    tag: "Act II · Blackwood Estate",
    backgroundClass: "bg-miriam_room",
    text: `
      <p>Miriam’s room felt recently abandoned. Not ransacked—just… paused.</p>
      <p>A book lay open on the desk, spine broken from being read too often. A hair ribbon sat on the floor where someone had stepped on it once and never bothered to pick it up.</p>
      <p>The bed was made. That somehow made it worse.</p>
    `,
    choices: [
      {
        text: "Examine the desk and the open book.",
        next: "miriam_room_desk"
      },
      {
        text: "Check under the bed and along the floorboards.",
        next: "miriam_floorboards"
      },
      {
        text: "Go back downstairs to the foyer.",
        next: "blackwood_foyer"
      }
    ]
  },

  miriam_room_desk: {
    title: "The Lockbox",
    tag: "Act II · Miriam’s Room",
    backgroundClass: "bg-miriam_room",
    text: `
      <p>The open book was a journal, its edges frayed from restless fingers. Most entries were mundane—weather, lessons, the quiet suffocation of the estate.</p>
      <p>But the later pages grew frantic. Sketches of a twisted sigil. Repeated phrases: <em>"The man in the mirror"</em>, <em>"three knocks after midnight"</em>.</p>
      <p>In the top drawer, nestled among dried ink and broken quills, sat a small metal lockbox with a three-part mechanism.</p>
    `,
    choices: [
      {
        text: "Study the journal for a pattern that might open the box.",
        next: "miriam_lockbox_puzzle",
        sanityChange: -2
      },
      {
        text: "Leave the box for now and step back.",
        next: "miriam_room_intro"
      }
    ]
  },

  miriam_lockbox_puzzle: {
    title: "Three Knocks",
    tag: "Act II · Miriam’s Room",
    backgroundClass: "bg-miriam_room",
    text: `
      <p>Miriam had circled three dates over and over, the numbers underlined in a trembling hand: 3… 1… 2.</p>
      <p>Elsewhere, she had written: <em>"He always comes on the third knock. The first is a warning. The second is a lie. The third is real."</em></p>
      <p>The lockbox’s three dials waited.</p>
    `,
    choices: [
      {
        text: "Set the sequence to 3–1–2, the order she obsessed over.",
        next: "miriam_lockbox_open",
        sanityChange: -3
      },
      {
        text: "Try random combinations until your fingers ache.",
        next: "miriam_room_desk",
        sanityChange: -6
      }
    ]
  },

  miriam_lockbox_open: {
    title: "The Man in the Mirror",
    tag: "Act II · Miriam’s Room",
    backgroundClass: "bg-miriam_room",
    text: `
      <p>The lock clicked open with an almost disappointed sigh.</p>
      <p>Inside lay folded pages, torn from the back of Miriam’s journal. The ink was darker here, fresher—as if these were the last things she wrote.</p>
      <p><em>"He comes in my sleep. He wears Father’s coat. Sometimes… he wears <strong>his</strong> face."</em></p>
      <p>Below the words, a rough sketch—a man standing behind her in a mirror. The features were smudged, but the outline was disturbingly close to my own.</p>
    `,
    choices: [
      {
        text: "Stare at the sketch a moment longer than is wise.",
        next: "miriam_room_intro",
        addClue: "journal_man_in_mirror",
        sanityChange: -7
      }
    ]
  },

  miriam_floorboards: {
    title: "Under the Floor",
    tag: "Act II · Miriam’s Room",
    backgroundClass: "bg-miriam_room",
    text: `
      <p>The floorboards creaked with a different tone near the side of the bed—a hollow note among solid ones.</p>
      <p>On your knees, you found shallow scratches in the wood, grouped in threes. Not random. Not idle fidgeting.</p>
      <p>Someone had been counting knocks.</p>
    `,
    choices: [
      {
        text: "Memorise the pattern of scratches and return to the room.",
        next: "miriam_room_intro",
        sanityChange: -2
      }
    ]
  }
});
// === Act III: The Mines & The Cult ===
Object.assign(scenes, {
  mines_approach: {
    title: "The Path to the Wound",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_approach",
    text: `
      <p>The path away from the estate narrowed into a scar of packed earth, running between skeletal trees.</p>
      <p>In the distance, the hills yawned open where the mines cut into them—timbers jutting like rotten teeth around a black throat.</p>
      <p>Even from here, the air felt colder. Thinner. As if the ground resented being opened.</p>
    `,
    choices: [
      {
        text: "Continue up the path to the mine entrance.",
        next: "mines_entrance"
      },
      {
        text: "Turn back to the inn to search for supplies.",
        next: "inn_storeroom",
        sanityChange: -1
      },
      {
        text: "Return to the Blackwood estate.",
        next: "blackwood_foyer"
      }
    ]
  },

  inn_storeroom: {
    title: "The Inn’s Forgotten Cellar",
    tag: "Act III · The Last Refuge",
    backgroundClass: "bg-inn_lobby",
    text: `
      <p>The innkeeper pretended not to see me slip past the bar and down the narrow stairs.</p>
      <p>The cellar smelled of damp wood and spilled ale. Crates leaned against each other like exhausted men.</p>
      <p>On a hook by the stairs, an old lantern hung, soot-stained but intact. Beside it, a box of matches wrapped in twine.</p>
    `,
    choices: [
      {
        text: "Take the lantern. You’ll need it where the light dies.",
        next: "mines_approach",
        addItem: "lantern"
      },
      {
        text: "Leave the supplies and go back upstairs.",
        next: "inn_lobby",
        sanityChange: -1
      }
    ]
  },

  mines_entrance: {
    title: "The Mouth of the Earth",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_entrance",
    text: `
      <p>The Fallowgrave mines had been officially condemned years ago. Unofficially, they had never truly closed.</p>
      <p>Wooden supports sagged above the tunnel, carved with older marks—a mix of workers' initials and symbols that did not belong to any language I knew.</p>
      <p>Cold air seeped from the dark, bringing with it the faint smell of metal and something sweeter, rotting, far below.</p>
    `,
    choices: [
      {
        text: "Raise your lantern and step into the tunnel.",
        next: "mines_tunnel",
        requireItem: "lantern",
        sanityChange: -3
      },
      {
        text: "It’s too dark. Go back for a light.",
        next: "inn_storeroom",
        sanityChange: -1
      },
      {
        text: "Retreat to the estate. The house feels almost safer.",
        next: "blackwood_foyer"
      }
    ]
  },

  mines_tunnel: {
    title: "Swallowed by Stone",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_tunnel",
    text: `
      <p>The lantern’s flame pushed the darkness back only a few steps at a time.</p>
      <p>The tunnel narrowed and widened without pattern, walls sweating mineral tears. Old rails ran along the floor, half-buried in gravel.</p>
      <p>Every sound was too loud—the scrape of my boots, the soft crack of cooling rock. Sometimes, between my footsteps, I heard another set that did not belong to me.</p>
    `,
    choices: [
      {
        text: "Follow the rails deeper into the mine.",
        next: "mines_tunnel_deeper",
        sanityChange: -3
      },
      {
        text: "Stop and listen. Count your own breaths.",
        next: "mines_tunnel_listen",
        sanityChange: -2
      },
      {
        text: "Turn back toward the entrance.",
        next: "mines_entrance"
      }
    ]
  },

  mines_tunnel_listen: {
    title: "Echoes That Don’t Belong",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_tunnel",
    text: `
      <p>I stopped, raising the lantern just enough to see the ribs of the tunnel.</p>
      <p>For several heartbeats, there was nothing but my own breath, ragged in the tight air.</p>
      <p>Then, faintly, from somewhere ahead—or behind—came the soft tap of something against stone. Three times. Slow. Measured.</p>
    `,
    choices: [
      {
        text: "Follow the direction of the knocks, deeper into the mine.",
        next: "mines_tunnel_deeper",
        sanityChange: -4
      },
      {
        text: "Pretend you heard nothing and walk on.",
        next: "mines_tunnel_deeper",
        sanityChange: -2
      }
    ]
  },

  mines_tunnel_deeper: {
    title: "The Carved Chamber",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_chamber",
    text: `
      <p>The tunnel opened without warning into a wide chamber someone had carved by hand, long after the miners left.</p>
      <p>The walls were scored with sigils like the one in the alley, multiplied and interlaced until they formed a lattice of wrong geometry.</p>
      <p>At the center of the chamber stood a makeshift altar—a slab of stone darkened by old stains.</p>
    `,
    choices: [
      {
        text: "Approach the altar and study the sigils on the walls.",
        next: "mines_chamber_puzzle",
        sanityChange: -3
      },
      {
        text: "Stay near the tunnel mouth. This place is wrong.",
        next: "mines_tunnel",
        sanityChange: -1
      }
    ]
  },

  mines_chamber_puzzle: {
    title: "Patterns in the Dark",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_chamber",
    text: `
      <p>Up close, the sigils resolved into a pattern—a sequence repeating around the chamber in variations.</p>
      <p>Here and there, someone had scratched numbers beside them: 1, 2, 3. Some were crossed out. Others underlined.</p>
      <p>The twisted symbol from the alley appeared again and again at the start of each sequence.</p>
    `,
    choices: [
      {
        text: "Trace the sequence that begins with the alley sigil.",
        next: "mines_chamber_ledger",
        requireClue: "sigil_wall",
        sanityChange: -4
      },
      {
        text: "Recall Miriam’s frantic drawings and follow her repeated pattern.",
        next: "mines_chamber_ledger",
        requireClue: "journal_man_in_mirror",
        sanityChange: -5
      },
      {
        text: "Touch the symbols at random, hoping they make sense.",
        next: "mines_chamber_backlash",
        sanityChange: -10
      }
    ]
  },

  mines_chamber_backlash: {
    title: "The Wrong Order",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_chamber",
    text: `
      <p>My fingers moved from mark to mark, tracing a path that felt improvised and increasingly desperate.</p>
      <p>For a moment, nothing happened.</p>
      <p>Then all the shapes seemed to shift at once, just a fraction of an inch—enough to make my vision swim.</p>
      <p>The lantern guttered. In the darkness between heartbeats, I knew, with a certainty that felt borrowed, that something in the pattern had turned its attention toward me.</p>
    `,
    choices: [
      {
        text: "Stumble back, steady the lantern, and try to read the pattern properly.",
        next: "mines_chamber_puzzle"
      }
    ]
  },

  mines_chamber_ledger: {
    title: "The Ledger",
    tag: "Act III · Fallowgrave Mines",
    backgroundClass: "bg-mines_chamber",
    text: `
      <p>The sigils you traced glowed—not with light, but with recognition. Lines of dust lifted in the still air, outlining a shape at the base of the altar.</p>
      <p>A compartment slid open with a stone rasp, revealing a leather-bound book, edges stiff with age and damp.</p>
      <p>Inside, names marched down the pages in cramped ink—the faithful of whatever met them in the dark.</p>
      <p>Near the end, a final entry, written more clearly than the rest:</p>
      <p><em>"Presiding: E. H."</em></p>
      <p>The lantern flickered. For a second, my own initials meant nothing to me at all.</p>
    `,
    choices: [
      {
        text: "Close the ledger. Pretend the initials could belong to anyone.",
        next: "mines_tunnel",
        addClue: "cult_log_eh",
        sanityChange: -8
      },
      {
        text: "Keep staring at the letters until they blur.",
        next: "mines_tunnel",
        addClue: "cult_log_eh",
        sanityChange: -12
      }
    ]
  }
});
// === Act IV — Confrontation ===
Object.assign(scenes, {
  blackwood_study_confrontation: {
    title: "Confronting Dr. Blackwood",
    tag: "Act IV · Blackwood Estate",
    backgroundClass: "bg-blackwood_foyer",
    text: `
      <p>Dr. Blackwood stood by the window, his back to me. He did not turn when I entered.</p>
      <p>“You found it,” he said quietly. “The ledger.”</p>
      <p>Silence stretched between us, heavy as the air.</p>
      <p>“How many times,” he asked at last, “will you make me tell you the truth?”</p>
    `,
    choices: [
      {
        text: "Ask him what he means.",
        next: "blackwood_reveal",
        sanityChange: -5
      },
      {
        text: "Leave. You’re not ready for this.",
        next: "blackwood_foyer",
        sanityChange: -1
      }
    ]
  },

  blackwood_reveal: {
    title: "You’ve Been Here Before",
    tag: "Act IV · Blackwood Estate",
    backgroundClass: "bg-blackwood_foyer",
    text: `
      <p>"Every time you arrive, you're certain you're here to save her," Dr. Blackwood said.</p>
      <p>"Every time, you ask the same questions. You find the same clues. And every time, you forget what you've done."</p>
      <p>"Do you know how many times we've had this conversation?"</p>
      <p>The truth pressed in like a hand on my throat.</p>
    `,
    choices: [
      {
        text: "Demand he explain. You’re not insane.",
        next: "mirror_confrontation",
        addClue: "repeated_investigations",
        sanityChange: -10
      },
      {
        text: "Walk away before you understand too much.",
        next: "blackwood_foyer",
        sanityChange: -3
      }
    ]
  }
});
Object.assign(scenes, {
  mirror_confrontation: {
    title: "The Mirror",
    tag: "Act IV · Reflection",
    backgroundClass: "bg-blackwood_foyer",
    text: `
      <p>The mirror hung at the end of the hall. Large. Ornate. Covered in dust and something else — something like hesitation.</p>
      <p>My reflection stared back. But it wasn’t me.</p>
      <p>It smiled first.</p>
      <p><span class="glitch-text" data-text="You’re not the detective.">You’re not the detective.</span></p>
      <p><span class="glitch-text" data-text="You’re the reason she’s gone.">You’re the reason she’s gone.</span></p>
    `,
    onEnter: () => {
    playSound(sfxOminous, { volume: 0.8 });
    },
    choices: [
      {
        text: "Touch the mirror with your bare hand.",
        next: "mirror_truth",
        sanityChange: -15
      },
      {
        text: "Turn away. Run.",
        next: "blackwood_foyer",
        sanityChange: -5
      }
    ]
  },

  mirror_truth: {
    title: "Memory Returns",
    tag: "Act IV · Reflection",
    backgroundClass: "bg-blackwood_foyer",
    text: `
      <p>Cold glass.</p>
      <p>Then a shudder deep beneath the surface, like something waking up.</p>
      <p>A flood of memories tore loose. The mines. Miriam. The altar. Your coat. Your hands.</p>
      <p>Every clue you followed was one you left behind.</p>
      <p><em>You're not chasing a killer.</em></p>
      <p><em>You are remembering the crime.</em></p>
    `,
    choices: [
      {
        text: "The only way out is through the truth.",
        next: "ward_transition",
        sanityChange: -10
      }
    ]
  }
});
Object.assign(scenes, {
  ward_transition: {
    title: "The Walls Change",
    tag: "Act V · Something Else",
    backgroundClass: "bg-blackwood_foyer",
    text: `
      <p>The wallpaper peeled in long strips.</p>
      <p>The air smelled different. Sterile.</p>
      <p>The floorboards became tile. The ceiling grew fluorescent lights.</p>
      <p>Someone screamed — a sound strangled by foam padding and distance.</p>
      <p>You were no longer in the estate.</p>
      <p>But you’d never really left.</p>
    `,
    onEnter: () => {
    playSound(sfxOminous, { volume: 0.6 });
    },
    choices: [
      {
        text: "Open your eyes to where you’ve always been.",
        next: "ward_hallway",
        sanityChange: -5
      }
    ]
  }
});
// === Act V — The Ward & Endings ===
Object.assign(scenes, {
  ward_hallway: {
    title: "The Other Fallowgrave",
    tag: "Act V · Secure Ward",
    backgroundClass: "bg-ward_hallway",
    text: `
      <p>The hallway stretched on, too white, too clean. The wallpaper from the estate was gone, replaced by scuffed paint and buzzing strip lights.</p>
      <p>Doors lined the corridor, each with a small square window, each window covered in wire mesh.</p>
      <p>Names were stenciled under the glass. Most were scratched out. One, near the end, remained legible.</p>
      <p><em>Halloway, Edgar — Room 13</em></p>
    `,
    choices: [
      {
        text: "Walk past the doors, glancing into each window.",
        next: "ward_residents",
        sanityChange: -5
      },
      {
        text: "Examine the noticeboard by the nurses’ station.",
        next: "ward_noticeboard",
        sanityChange: -3
      },
      {
        text: "Go straight to Room 13.",
        next: "final_cell",
        sanityChange: -2
      }
    ]
  },

  ward_residents: {
    title: "Faces You Know",
    tag: "Act V · Secure Ward",
    backgroundClass: "bg-ward_hallway",
    text: `
      <p>Behind each window, a figure.</p>
      <p>In one, a woman who looked like the innkeeper, her hands twisting an invisible cloth.</p>
      <p>In another, a man whose profile matched Dr. Blackwood’s, staring at a blank wall as if it might answer him.</p>
      <p>In more than one, you saw a face that was almost yours, watching you with something between pity and exhaustion.</p>
      <p>On the metal above each door, the same word appeared beneath the names: <em>Observation</em>.</p>
    `,
    choices: [
      {
        text: "Keep walking until you reach the end of the hall.",
        next: "final_cell",
        sanityChange: -4
      },
      {
        text: "Retreat to the start of the hallway.",
        next: "ward_hallway",
        sanityChange: -1
      }
    ]
  },

  ward_noticeboard: {
    title: "Case File",
    tag: "Act V · Secure Ward",
    backgroundClass: "bg-ward_hallway",
    text: `
      <p>The noticeboard was cluttered with schedules, shift rosters, and printed memos.</p>
      <p>One document had been pinned slightly askew—a patient overview.</p>
      <p><em>Fallowgrave Sanatorium – High Security Ward</em></p>
      <p><em>Patient: Halloway, Edgar. Diagnosis: Psychogenic fugue; recurrent violent dissociative episodes. Therapy protocol: iterative narrative reconstruction.</em></p>
      <p>At the bottom, in a different ink: <em>"Subject responds best when cast as a detective."</em></p>
    `,
    choices: [
      {
        text: "Let the words settle. Then go to Room 13.",
        next: "final_cell",
        addClue: "sanatorium_truth",
        sanityChange: -8
      },
      {
        text: "Tear the page down and drop it.",
        next: "ward_hallway",
        sanityChange: -3
      }
    ]
  },

  final_cell: {
    title: "Room 13",
    tag: "Act V · Observation",
    backgroundClass: "bg-ward_cell",
    text: `
      <p>The door to Room 13 was heavier than it looked. The small window showed only darkness.</p>
      <p>Inside, the room was small—one bed bolted to the floor, one desk, one mirror set into the wall.</p>
      <p>The layout was painfully familiar. You had stood in this room before, in different clothes, under different names.</p>
      <p>On the desk lay a thin folder and a notebook. Both had your name on the cover.</p>
    `,
    choices: [
      {
        text: "Look into the mirror.",
        next: "ending_truth",
        sanityChange: -10
      },
      {
        text: "Sit at the desk and open the folder.",
        next: "ending_loop",
        sanityChange: -6
      },
      {
        text: "Refuse both. Stand in the middle of the room and do nothing.",
        next: "ward_hallway",
        sanityChange: -3
      }
    ]
  },

  ending_truth: {
    title: "No More Lies",
    tag: "Ending · Acceptance",
    backgroundClass: "bg-ward_cell",
    text: `
      <p>The mirror showed you as you were now—tired, hollow-eyed, wrapped in institutional cloth instead of a detective’s coat.</p>
      <p>For a moment, the image flickered. You saw yourself at the estate door. In the mines. Over the altar. Miriam’s face—afraid, confused, trusting.</p>
      <p>Every time you wore the same expression: certain you were the hero of the story.</p>
      <p>The glass felt solid under your hand. Real. The only thing that was.</p>
      <p>Somewhere beyond the walls, doctors would write that the session had been <em>partially successful</em>.</p>
      <p>You remembered enough to understand what you had done.</p>
      <p>Whether you could live with it was a different experiment entirely.</p>
    `,
    choices: [
      {
        text: "Close your eyes and let the story end here.",
        next: "loop_reset"
      }
    ]
  },

  ending_loop: {
    title: "Reset",
    tag: "Ending · The Detective Again",
    backgroundClass: "bg-ward_cell",
    text: `
      <p>The folder contained transcripts. Not of the investigation, but of your retellings of it.</p>
      <p>Each one began the same way: a letter, a missing girl, a town called Fallowgrave.</p>
      <p>Each one ended before you fully remembered.</p>
      <p>At the bottom of the latest transcript, a typed note:</p>
      <p><em>"Subject shows increased resistance at the point of self-recognition. Recommend soft reset with reinforced detective framing."</em></p>
      <p>A pen mark below: <em>"He works best when he believes he’s starting fresh."</em></p>
    `,
    choices: [
      {
        text: "Let them reset you. Become the detective again.",
        next: "loop_reset"
      }
    ]
  },

  loop_reset: {
    title: "A Familiar Beginning",
    tag: "Cycle · Again",
    backgroundClass: "bg-coach_arrival",
    text: `
      <p>Wheels groaned. Fog pressed against the glass.</p>
      <p>In your hand, a letter:</p>
      <p><em>"My daughter is missing. The town is wrong. Please, Mr. Halloway. Before it takes her too."</em></p>
      <p>You stepped down from the carriage into the wet cobblestone streets of a town called Fallowgrave, certain—absolutely certain—that you were here to save someone.</p>
      <p>Somewhere far away, behind one-way glass, someone noted the time and wrote: <em>"Scenario restarted."</em></p>
    `,
    onEnter: (state) => {
      // Soft reset of game state to loop the story
      state.sanity = 80;
      state.clues = new Set();
      state.inventory = new Set();
      state._seenInnRoom = false;
    },
    choices: [
      {
        text: "Begin the investigation again.",
        next: "coach_arrival"
      },
      {
        text: "Step out of the story for now.",
        next: "coach_arrival" // or you can send them to a neutral scene if you add one
      }
    ]
  }
});

// ========== RENDERING LOGIC ==========

const backgroundLayer = document.getElementById("background-layer");
const sceneTagEl = document.getElementById("scene-tag");
const sceneTitleEl = document.getElementById("scene-title");
const sceneTextEl = document.getElementById("scene-text");
const choicesEl = document.getElementById("choices");
const sanityFillEl = document.getElementById("sanity-fill");
const sanityValueEl = document.getElementById("sanity-value");
const clueListEl = document.getElementById("clue-list");
const inventoryListEl = document.getElementById("inventory-list");
const restartBtn = document.getElementById("restart-btn");
// Audio elements
const sfxClick = document.getElementById("sfx-click");
const sfxOminous = document.getElementById("sfx-ominous");
const bgAmbience = document.getElementById("bg-ambience");


function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function playSound(audioEl, { volume = 1.0, allowOverlap = false } = {}) {
  if (!audioEl) return;
  try {
    audioEl.volume = volume;
    if (!allowOverlap) {
      audioEl.currentTime = 0;
    }
    audioEl.play().catch(() => {
      // Ignore autoplay / loading errors silently
    });
  } catch (e) {
    // ignore
  }
}

function setAmbienceForScene(sceneId) {
  if (!bgAmbience) return;

  // Simple mapping: different ambience volumes per area
  const quietScenes = new Set(["title", "inn_room_intro", "inn_room_mirror"]);
  const intenseScenes = new Set([
    "mines_tunnel",
    "mines_chamber_puzzle",
    "mines_chamber_ledger",
    "mirror_confrontation",
    "mirror_truth",
    "ward_transition"
  ]);

  if (quietScenes.has(sceneId)) {
    bgAmbience.volume = 0.25;
  } else if (intenseScenes.has(sceneId)) {
    bgAmbience.volume = 0.6;
  } else {
    bgAmbience.volume = 0.4;
  }

  bgAmbience.play().catch(() => {});
}


function updateSanityVisuals() {
  const sanity = clamp(gameState.sanity, 0, 100);
  const pct = sanity + "%";
  sanityFillEl.style.width = pct;
  sanityValueEl.textContent = sanity;

  // low sanity visual effect
  if (sanity <= 40) {
    backgroundLayer.classList.add("low-sanity");
  } else {
    backgroundLayer.classList.remove("low-sanity");
  }
}

function renderHUD() {
  // Clues
  clueListEl.innerHTML = "";
  gameState.clues.forEach(clueId => {
    const info = CLUE_INFO[clueId];
    const li = document.createElement("li");
    li.textContent = info ? info.name : clueId;
    clueListEl.appendChild(li);
  });

  // Inventory
  inventoryListEl.innerHTML = "";
  gameState.inventory.forEach(itemId => {
    const info = ITEM_INFO[itemId];
    const li = document.createElement("li");
    li.textContent = info ? info.name : itemId;
    inventoryListEl.appendChild(li);
  });
}

function renderScene() {
  const scene = scenes[gameState.currentSceneId];
  if (!scene) {
    sceneTitleEl.textContent = "Scene Not Found";
    sceneTextEl.innerHTML = `<p>Something went wrong in the script.</p>`;
    choicesEl.innerHTML = "";
    return;
  }

  // Apply onEnter logic if any
  if (typeof scene.onEnter === "function") {
    scene.onEnter(gameState);
  }

  // Background
  if (scene.backgroundClass) {
    backgroundLayer.className = scene.backgroundClass;
  } else {
    backgroundLayer.className = "";
  }
  // Text
  sceneTagEl.textContent = scene.tag || "";
  sceneTitleEl.textContent = scene.title || "";
  sceneTextEl.innerHTML = scene.text || "";
  // If sanity low, inject glitch styling
    if (gameState.sanity <= 40) {
        sceneTextEl.innerHTML = sceneTextEl.innerHTML.replace(
             />([^<]+)</g,
            (match, p1) => `><span class="glitch-text" data-text="${p1.trim()}">${p1.trim()}</span><`
        );
    }

  // Choices
  choicesEl.innerHTML = "";
  (scene.choices || []).forEach(choice => {
    // Check requirements (clue/item)
    let disabled = false;
    if (choice.requireClue && !gameState.clues.has(choice.requireClue)) {
      disabled = true;
    }
    if (choice.requireItem && !gameState.inventory.has(choice.requireItem)) {
      disabled = true;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = choice.text;

    if (disabled) {
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => handleChoice(choice));
    }

    choicesEl.appendChild(btn);
  });

  updateSanityVisuals();
  renderHUD();
  setAmbienceForScene(gameState.currentSceneId);
}

function handleChoice(choice) {
  // Play click SFX
  playSound(sfxClick, { volume: 0.5 });
  // Apply sanity change
  if (typeof choice.sanityChange === "number") {
    gameState.sanity = clamp(gameState.sanity + choice.sanityChange, 0, 100);
  }

  // Add clue
  if (choice.addClue) {
    gameState.clues.add(choice.addClue);
  }

  // Add item
  if (choice.addItem) {
    gameState.inventory.add(choice.addItem);
  }

  // Move to next scene
  if (choice.next && scenes[choice.next]) {
    gameState.currentSceneId = choice.next;
  }

  renderScene();
}

function resetGame() {
  playSound(sfxClick, { volume: 0.5 });
  gameState.currentSceneId = "title";
  gameState.sanity = 80;
  gameState.clues = new Set();
  gameState.inventory = new Set();
  gameState._seenInnRoom = false;
  renderScene();
}

// ========== INIT ==========

restartBtn.addEventListener("click", resetGame);

// Start game
renderScene();
