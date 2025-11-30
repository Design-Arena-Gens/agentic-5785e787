'use client';

import { useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import {
  BookOpen,
  Brain,
  Globe,
  Lightbulb,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";

type LessonForm = {
  grade: string;
  subject: string;
  topic: string;
  board: string;
  language: string;
  vibe: string;
};

type LessonPlan = {
  title: string;
  greeting: string;
  hook: string;
  boardFocus: string;
  vibe: string;
  learningGoals: string[];
  lessonFlow: { title: string; description: string }[];
  vocabulary: string[];
  materials: string[];
  assessment: string;
  closure: string;
  extension: string;
  sdgConnection: string;
  languageTip: string;
};

type StoryForm = {
  theme: string;
  value: string;
  pace: string;
  language: string;
};

type VisualStory = {
  title: string;
  inspiration: string;
  slides: { title: string; prompt: string; mood: string }[];
  storytellerNote: string;
};

type EbookForm = {
  grade: string;
  theme: string;
  language: string;
  length: string;
};

type Ebook = {
  title: string;
  subtitle: string;
  readingTip: string;
  chapters: { title: string; focus: string; text: string }[];
  activities: string[];
  moral: string;
  extension: string;
};

const gradeOptions = ["1", "2", "3", "4", "5"];
const subjectOptions = ["English", "Mathematics", "EVS", "Hindi", "Art & Craft"];
const boardOptions = ["CBSE", "ICSE", "State Board"];
const vibeOptions = ["Joyful", "Exploratory", "Mindful", "Festive", "Nature"];
const languageOptions = ["English", "Hindi", "Marathi", "Tamil", "Telugu"];

const boardSpotlights: Record<string, string> = {
  CBSE: "Aligns with NEP 2020 competency-based learning and experiential pedagogy.",
  ICSE: "Encourages creative expression and holistic evaluation through projects.",
  "State Board": "Integrates local culture, community stories, and mother tongue richness.",
};

const languageFlavour: Record<
  string,
  { greeting: string; closing: string; connectors: string[]; affirmation: string }
> = {
  English: {
    greeting: "Hello Teachers!",
    closing: "Happy teaching!",
    connectors: ["therefore", "as a next step", "because"],
    affirmation: "You've got this.",
  },
  Hindi: {
    greeting: "नमस्ते शिक्षकों!",
    closing: "साथ मिलकर सीखें और खिलें!",
    connectors: ["इसीलिए", "अगला कदम", "क्योंकि"],
    affirmation: "आप कर सकते हैं।",
  },
  Marathi: {
    greeting: "नमस्कार गुरुजनहो!",
    closing: "शिकत रहा, प्रेरित करत रहा!",
    connectors: ["म्हणून", "पुढचा टप्पा", "कारण"],
    affirmation: "तुम्ही नक्की जमवाल.",
  },
  Tamil: {
    greeting: "வணக்கம் ஆசிரியர்களே!",
    closing: "மகிழ்ச்சியான கற்றலை தொடருங்கள்!",
    connectors: ["ஆகவே", "அடுத்து", "ஏனெனில்"],
    affirmation: "நீங்கள் முடியும்.",
  },
  Telugu: {
    greeting: "నమస్తే గురువులారా!",
    closing: "సంతోషకరమైన బోధన సాగాలని!",
    connectors: ["అందువల్ల", "తర్వాతి దశ", "ఎందుకంటే"],
    affirmation: "మీరు సాధించగలరు.",
  },
};

const lessonGoals = [
  "Develops curiosity through guided discovery",
  "Builds vocabulary with movement-based recall",
  "Strengthens collaborative learning routines",
  "Allows expression through art, music, and storytelling",
  "Connects classroom ideas to real India examples",
  "Encourages multilingual support and peer teaching",
];

const sensoryInvites = [
  "Play a calming tanpura drone to set the rhythm",
  "Use tactile learning mats created with rangoli powder",
  "Show a quick puppet animation handmade from old newspapers",
  "Invite learners to mimic actions using mudras",
  "Let children build the concept with math manipulatives and clay diyas",
];

const subjectSpecificFlows: Record<string, string[]> = {
  English: [
    "Listen-read-act: read a short poem and turn it into a group tableau.",
    "Word weaving: children sit in circles and add story bits using new vocabulary.",
    "Picture walk: decode meaning from classroom murals and local posters.",
  ],
  Mathematics: [
    "Street market math: role-play a weekly bazaar with unit conversions.",
    "Rhythm counts: clap traditional beats to explore fractions.",
    "Pattern hunt: use kolam designs to decode symmetry and sequencing.",
  ],
  EVS: [
    "Community circle: map people who help us in the neighbourhood.",
    "Sensory garden: smell, touch, and sketch leaves collected from home.",
    "Water detectives: track how water reaches school and where it goes.",
  ],
  Hindi: [
    "Chitrakatha: craft story strips inspired by Amar Chitra Katha frames.",
    "Doha dramatics: recite and act Kabir dohas with gestures.",
    "Bhajan beats: decode meaning of a short folk song stanza.",
  ],
  "Art & Craft": [
    "Color moodboards: mix natural dyes using turmeric, beetroot, and indigo.",
    "Folk patterns: recreate Warli stories using chalk on black chart.",
    "Recycled troupe: design puppets from cartons and fabrics.",
  ],
};

const vocabularyPool: Record<string, string[]> = {
  English: ["imagery", "rhythm", "sequence", "climax", "dialogue", "metaphor"],
  Mathematics: ["manipulatives", "fraction", "pattern", "estimate", "geometry", "timeline"],
  EVS: ["ecosystem", "habitat", "cycle", "resource", "community", "sustainable"],
  Hindi: ["अनुभूति", "स्वर", "ताल", "कथा", "अनुच्छेद", "पंक्ति"],
  "Art & Craft": ["texture", "palette", "contrast", "composition", "motif", "collage"],
};

const assessmentPrompts = [
  "Learners create a two-minute voice note explaining the concept in their home language.",
  "Pairs design a quick exit ticket doodle summarising the main idea.",
  "Group builds a thinking ladder: 'what we saw', 'what we guessed', 'what we now know'.",
  "Learners vote with learning stones to self-assess confidence levels.",
];

const closureMoments = [
  "End with a circle chant blending English and mother tongue keywords.",
  "Host a gratitude clap for the community helpers mentioned today.",
  "Invite children to write a postcard to future grade mates about what they learned.",
  "Create a mini gallery walk with students narrating their takeaways.",
];

const extensionIdeas = [
  "Send families a curiosity postcard suggesting a kitchen science mini challenge.",
  "Record a collaborative story on the class WhatsApp group.",
  "Map a local hero connected to the concept and share a short interview.",
  "Curate a weekend nature walk checklist tied to the lesson theme.",
];

const sdgConnections = [
  "SDG 4: Quality Education through joyful, inclusive pedagogy.",
  "SDG 10: Reduced Inequalities by inviting every language voice.",
  "SDG 11: Sustainable Cities by linking concepts to neighbourhood action.",
  "SDG 3: Good Health through mindful breathing and movement breaks.",
];

const storyThemes = [
  "Magical monsoon adventures",
  "STEM in the school playground",
  "Festivals of courage and kindness",
  "Planet guardians on a field trip",
  "Sports spirit and teamwork tales",
  "Mystery of the classroom library",
];

const storyValues = [
  "empathy",
  "resilience",
  "curiosity",
  "responsibility",
  "creativity",
  "community care",
];

const storyMoods = [
  "pastel sunrise with gentle folk rhythms",
  "vibrant kite festival splashes",
  "cool moonlit night with jazzed lullabies",
  "earthy terracotta shades with tabla beats",
  "mint freshness with bamboo flute hums",
];

const storyProgressions = [
  "Spark",
  "Challenge",
  "Discovery",
  "Celebration",
];

const ebookThemes = [
  "Eco Warriors of the School",
  "The Secret Maths Garden",
  "Moonlight Library Adventures",
  "The Science of Sweets",
  "Festival of Colours Quest",
];

const activityStarters = [
  "Design a comic strip summarising the chapter.",
  "Create a movement sequence for the main events.",
  "Build a DIY theatre box and retell the scene.",
  "Record a short news bulletin about the hero.",
  "Compose a class anthem using chapter keywords.",
];

const pick = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const pickMany = <T,>(items: T[], count: number): T[] =>
  [...items].sort(() => Math.random() - 0.5).slice(0, count);

const generateLessonPlan = (form: LessonForm): LessonPlan => {
  const language = languageFlavour[form.language] ?? languageFlavour.English;
  const subjectFlow = subjectSpecificFlows[form.subject] ?? [];
  const goals = pickMany(lessonGoals, 2);
  const vocab = pickMany(vocabularyPool[form.subject] ?? [], 4);
  const materials = pickMany(
    [
      "story cards",
      "local artefacts",
      "flash puppets",
      "chart paper",
      "digital projector",
      "floor mats",
      "musical instruments",
    ],
    4,
  );

  const flow = [
    {
      title: "Warm-Up Pulse",
      description: `${pick(sensoryInvites)} ${language.connectors[0]} invite learners to share a quick ${form.topic} memory from home.`,
    },
    {
      title: "Core Exploration",
      description:
        pick(subjectFlow) ??
        "Host a circle time conversation that blends storytelling and quick sketches.",
    },
    {
      title: "Peer Labs",
      description: `Facilitate mixed-language buddy groups to create a ${form.topic.toLowerCase()} showcase using classroom corners.`,
    },
  ];

  return {
    title: `${form.topic} - Grade ${form.grade} ${form.subject} Studio`,
    greeting: `${language.greeting} ${language.affirmation}`,
    hook: `Start with a ${form.vibe.toLowerCase()} hook: ${pick(sensoryInvites)}.`,
    boardFocus: boardSpotlights[form.board] ?? "",
    vibe: form.vibe,
    learningGoals: goals,
    lessonFlow: flow,
    vocabulary: vocab,
    materials,
    assessment: pick(assessmentPrompts),
    closure: pick(closureMoments),
    extension: pick(extensionIdeas),
    sdgConnection: pick(sdgConnections),
    languageTip: `Blend instructions using ${form.language} keywords like "${pick(language.connectors)}" to scaffold meaning.`,
  };
};

const generateVisualStory = (form: StoryForm): VisualStory => {
  const theme = form.theme || pick(storyThemes);
  const value = form.value || pick(storyValues);
  const paceMood =
    form.pace === "Relaxed"
      ? storyMoods[0]
      : form.pace === "Energetic"
        ? storyMoods[1]
        : pick(storyMoods);

  const slides = storyProgressions.map((stage) => ({
    title: stage,
    prompt: `Illustrate ${stage.toLowerCase()} where ${value} shines through ${theme.toLowerCase()}.`,
    mood: paceMood,
  }));

  const language = languageFlavour[form.language] ?? languageFlavour.English;

  return {
    title: `${theme} • A ${value.toUpperCase()} journey`,
    inspiration: `Set the pace as ${form.pace.toLowerCase()} with colours inspired by ${paceMood}.`,
    slides,
    storytellerNote: `${language.connectors[1]} add quick call-and-response phrases so learners echo the story beats.`,
  };
};

const generateEbook = (form: EbookForm): Ebook => {
  const theme = form.theme || pick(ebookThemes);
  const language = languageFlavour[form.language] ?? languageFlavour.English;
  const chaptersCount = form.length === "Bite-sized" ? 2 : 3;

  const chapterSeeds = [
    {
      title: "Chapter 1 · Spark",
      focus: "Introduce the hero and their everyday world.",
      text: `Our young hero spots a surprising clue about ${theme.toLowerCase()} on the way to school.`,
    },
    {
      title: "Chapter 2 · Twist",
      focus: "Raise a challenge and invite teamwork.",
      text: `Friends brainstorm ${language.connectors[2]} discover a playful way to solve the problem.`,
    },
    {
      title: "Chapter 3 · Celebration",
      focus: "Resolve with joy and gratitude.",
      text: `The class shares their learning with the community during a vibrant assembly.`,
    },
  ];

  return {
    title: `${theme} for Grade ${form.grade}`,
    subtitle: `A ${form.length.toLowerCase()} read-aloud in ${form.language}`,
    readingTip: `${language.greeting} Encourage students to echo keywords after you ${language.connectors[0]}.`,
    chapters: chapterSeeds.slice(0, chaptersCount).map((chapter) => ({
      ...chapter,
      text: `${chapter.text} Invite quick sketches or dance poses to capture the moment.`,
    })),
    activities: pickMany(activityStarters, 2),
    moral: `Core value: ${pick(storyValues)}. ${language.closing}`,
    extension: `Share the ebook as an audio tale on the school WhatsApp broadcast. ${language.affirmation}`,
  };
};

const initialLessonForm: LessonForm = {
  grade: "3",
  subject: "English",
  topic: "Seasons of India",
  board: "CBSE",
  language: "English",
  vibe: "Joyful",
};

const initialStoryForm: StoryForm = {
  theme: "Festivals of courage and kindness",
  value: "empathy",
  pace: "Balanced",
  language: "English",
};

const initialEbookForm: EbookForm = {
  grade: "4",
  theme: "Moonlight Library Adventures",
  language: "English",
  length: "Standard",
};

const ControlLabel = ({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-semibold text-slate-700 tracking-wide"
  >
    {children}
  </label>
);

const InputWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`space-y-2 ${className ?? ""}`}>{children}</div>
);

const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-3xl border border-white/40 bg-[color:var(--card-surface)] backdrop-blur-xl shadow-2xl shadow-indigo-100/40 ${className ?? ""}`}
  >
    {children}
  </div>
);

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: ElementType;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-start gap-3">
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-inner shadow-indigo-200">
      <Icon className="h-6 w-6" />
    </span>
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

export default function Home() {
  const [lessonForm, setLessonForm] = useState<LessonForm>(initialLessonForm);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>(
    () => generateLessonPlan(initialLessonForm),
  );

  const [storyForm, setStoryForm] = useState<StoryForm>(initialStoryForm);
  const [visualStory, setVisualStory] = useState<VisualStory>(
    () => generateVisualStory(initialStoryForm),
  );

  const [ebookForm, setEbookForm] = useState<EbookForm>(initialEbookForm);
  const [ebook, setEbook] = useState<Ebook>(() =>
    generateEbook(initialEbookForm),
  );

  const heroTheme = useMemo(
    () => ({
      accent: pick(["#6366f1", "#f97316", "#0ea5e9"]),
      highlight: pick(["Learning Labs", "Story Studio", "Joyful Toolkit"]),
    }),
    [],
  );

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-1)] opacity-80 blur-3xl" />
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 pb-24 pt-12 lg:px-12">
        <section className="grid gap-10 rounded-[2.5rem] border border-white/60 bg-white/80 p-10 shadow-[0_40px_120px_-60px_rgba(79,70,229,0.45)] backdrop-blur-3xl md:grid-cols-[1.4fr,1fr]">
          <div className="space-y-6">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600"
              style={{
                boxShadow: "0 10px 30px -15px rgba(79,70,229,0.45)",
              }}
            >
              GuruMitra • Primary Classroom Companion
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Craft imaginative lessons,{" "}
              <span
                className="rounded-3xl px-2 py-1"
                style={{
                  background: `${heroTheme.accent}12`,
                  color: heroTheme.accent,
                }}
              >
                {heroTheme.highlight}
              </span>{" "}
              and bilingual ebooks in minutes.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Designed for primary teachers across India, GuruMitra blends local
              culture, multilingual cues, and SDG-aligned teaching ideas to keep
              young minds curious and joyful.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Lesson sparks", "Visual storyboards", "Kids ebook studio"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-indigo-200/80 bg-white/90 px-4 py-2 text-sm text-indigo-600 shadow-sm"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
          <Card className="space-y-6 p-8">
            <SectionHeader
              icon={Sparkles}
              title="Quick Start Ritual"
              subtitle="Three steps to energise tomorrow's class"
            />
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-4 w-4 text-amber-500" />
                <span>
                  Pick your grade, subject, and the big idea you want students
                  to feel.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Palette className="mt-0.5 h-4 w-4 text-pink-500" />
                <span>
                  Generate a visual story draft with ready-to-sketch slide
                  prompts.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 text-indigo-500" />
                <span>
                  Wrap it up as a kids ebook with read-aloud tips for families.
                </span>
              </li>
            </ul>
          </Card>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
          <Card className="p-8">
            <div className="flex items-center justify-between">
              <SectionHeader
                icon={Lightbulb}
                title="Lesson Design Spark"
                subtitle="Culturally alive, competency-based lesson structures"
              />
              <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase text-emerald-600">
                NEP Ready
              </span>
            </div>
            <form
              className="mt-6 grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                setLessonPlan(generateLessonPlan(lessonForm));
              }}
            >
              <InputWrapper>
                <ControlLabel htmlFor="lesson-grade">Grade</ControlLabel>
                <select
                  id="lesson-grade"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={lessonForm.grade}
                  onChange={(event) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      grade: event.target.value,
                    }))
                  }
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade}>{grade}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="lesson-subject">Subject</ControlLabel>
                <select
                  id="lesson-subject"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={lessonForm.subject}
                  onChange={(event) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      subject: event.target.value,
                    }))
                  }
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="lesson-board">Board</ControlLabel>
                <select
                  id="lesson-board"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={lessonForm.board}
                  onChange={(event) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      board: event.target.value,
                    }))
                  }
                >
                  {boardOptions.map((board) => (
                    <option key={board}>{board}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="lesson-language">Language</ControlLabel>
                <select
                  id="lesson-language"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={lessonForm.language}
                  onChange={(event) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      language: event.target.value,
                    }))
                  }
                >
                  {languageOptions.map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="lesson-topic">Topic / Big Idea</ControlLabel>
                <input
                  id="lesson-topic"
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={lessonForm.topic}
                  onChange={(event) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      topic: event.target.value,
                    }))
                  }
                  placeholder="e.g. Community Helpers"
                />
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="lesson-vibe">Classroom vibe</ControlLabel>
                <select
                  id="lesson-vibe"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={lessonForm.vibe}
                  onChange={(event) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      vibe: event.target.value,
                    }))
                  }
                >
                  {vibeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </InputWrapper>

              <button
                type="submit"
                className="col-span-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-600"
              >
                <Sparkles className="h-4 w-4" />
                Generate lesson plan
              </button>
            </form>

            <article className="mt-8 space-y-6 rounded-3xl border border-indigo-100 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {lessonPlan.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {lessonPlan.boardFocus}
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase text-indigo-600">
                  {lessonPlan.vibe}
                </span>
              </div>
              <p className="rounded-2xl bg-indigo-50/60 p-4 text-sm text-indigo-700">
                {lessonPlan.greeting} {lessonPlan.hook}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Learning Goals
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {lessonPlan.learningGoals.map((goal) => (
                      <li key={goal} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Tools & Materials
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                    {lessonPlan.materials.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-100 px-3 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                {lessonPlan.lessonFlow.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-inner"
                  >
                    <h4 className="text-sm font-semibold text-slate-700">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Vocabulary Focus
                  </h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {lessonPlan.vocabulary.join(" · ")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4">
                  <h4 className="text-sm font-semibold text-slate-700">
                    SDG Connection
                  </h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {lessonPlan.sdgConnection}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600">
                <p>
                  <strong>Assessment:</strong> {lessonPlan.assessment}
                </p>
                <p className="mt-2">
                  <strong>Closure:</strong> {lessonPlan.closure}
                </p>
                <p className="mt-2">
                  <strong>Home Extension:</strong> {lessonPlan.extension}
                </p>
              </div>
              <p className="text-sm italic text-slate-500">
                Language tip: {lessonPlan.languageTip}
              </p>
            </article>
          </Card>

          <Card className="flex flex-col gap-6 p-8">
            <SectionHeader
              icon={Palette}
              title="Visual Story Studio"
              subtitle="Generate frames, moods, and narration cues"
            />
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                setVisualStory(generateVisualStory(storyForm));
              }}
            >
              <InputWrapper>
                <ControlLabel htmlFor="story-theme">Theme</ControlLabel>
                <input
                  id="story-theme"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={storyForm.theme}
                  onChange={(event) =>
                    setStoryForm((prev) => ({
                      ...prev,
                      theme: event.target.value,
                    }))
                  }
                  placeholder="e.g. Festival Harmony"
                />
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="story-value">Core value</ControlLabel>
                <select
                  id="story-value"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={storyForm.value}
                  onChange={(event) =>
                    setStoryForm((prev) => ({
                      ...prev,
                      value: event.target.value,
                    }))
                  }
                >
                  {storyValues.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="story-pace">Pace</ControlLabel>
                <select
                  id="story-pace"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={storyForm.pace}
                  onChange={(event) =>
                    setStoryForm((prev) => ({
                      ...prev,
                      pace: event.target.value,
                    }))
                  }
                >
                  {["Balanced", "Relaxed", "Energetic"].map((pace) => (
                    <option key={pace}>{pace}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="story-language">Language</ControlLabel>
                <select
                  id="story-language"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={storyForm.language}
                  onChange={(event) =>
                    setStoryForm((prev) => ({
                      ...prev,
                      language: event.target.value,
                    }))
                  }
                >
                  {languageOptions.map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </InputWrapper>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-600"
              >
                <Wand2 className="h-4 w-4" />
                Refresh story frames
              </button>
            </form>

            <article className="space-y-5 rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-900">
                  {visualStory.title}
                </h3>
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase text-pink-600">
                  Storyboard
                </span>
              </div>
              <p className="rounded-2xl bg-pink-50/70 p-4 text-sm text-pink-700">
                {visualStory.inspiration}
              </p>
              <div className="space-y-4">
                {visualStory.slides.map((slide) => (
                  <div
                    key={slide.title}
                    className="rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-inner"
                  >
                    <h4 className="text-sm font-semibold text-pink-600">
                      {slide.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600">
                      {slide.prompt}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-pink-500">
                      Mood palette: {slide.mood}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm italic text-slate-500">
                {visualStory.storytellerNote}
              </p>
            </article>
          </Card>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1fr,1fr]">
          <Card className="p-8">
            <SectionHeader
              icon={BookOpen}
              title="Kids Ebook Studio"
              subtitle="Generate read-aloud ready mini books"
            />
            <form
              className="mt-6 grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                setEbook(generateEbook(ebookForm));
              }}
            >
              <InputWrapper>
                <ControlLabel htmlFor="ebook-grade">Grade</ControlLabel>
                <select
                  id="ebook-grade"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={ebookForm.grade}
                  onChange={(event) =>
                    setEbookForm((prev) => ({
                      ...prev,
                      grade: event.target.value,
                    }))
                  }
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade}>{grade}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="ebook-language">Language</ControlLabel>
                <select
                  id="ebook-language"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={ebookForm.language}
                  onChange={(event) =>
                    setEbookForm((prev) => ({
                      ...prev,
                      language: event.target.value,
                    }))
                  }
                >
                  {languageOptions.map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper className="md:col-span-2">
                <ControlLabel htmlFor="ebook-theme">Theme</ControlLabel>
                <input
                  id="ebook-theme"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={ebookForm.theme}
                  onChange={(event) =>
                    setEbookForm((prev) => ({
                      ...prev,
                      theme: event.target.value,
                    }))
                  }
                  placeholder="e.g. The Curious Kite Club"
                />
              </InputWrapper>

              <InputWrapper>
                <ControlLabel htmlFor="ebook-length">Length</ControlLabel>
                <select
                  id="ebook-length"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  value={ebookForm.length}
                  onChange={(event) =>
                    setEbookForm((prev) => ({
                      ...prev,
                      length: event.target.value,
                    }))
                  }
                >
                  {["Bite-sized", "Standard"].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </InputWrapper>

              <button
                type="submit"
                className="col-span-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
              >
                <Brain className="h-4 w-4" />
                Create ebook draft
              </button>
            </form>

            <article className="mt-8 space-y-6 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
              <header className="space-y-2">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {ebook.title}
                </h3>
                <p className="text-sm text-slate-500">{ebook.subtitle}</p>
              </header>
              <p className="rounded-2xl bg-emerald-50/70 p-4 text-sm text-emerald-700">
                {ebook.readingTip}
              </p>
              <div className="space-y-4">
                {ebook.chapters.map((chapter) => (
                  <div
                    key={chapter.title}
                    className="rounded-2xl border border-emerald-100 bg-white/70 p-4 shadow-inner"
                  >
                    <h4 className="text-sm font-semibold text-emerald-600">
                      {chapter.title}
                    </h4>
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-500">
                      {chapter.focus}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{chapter.text}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-slate-50/80 p-4">
                <h4 className="text-sm font-semibold text-slate-700">
                  Classroom Activities
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {ebook.activities.map((activity) => (
                    <li key={activity} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-600">
                <strong>Moral:</strong> {ebook.moral}
              </p>
              <p className="text-sm italic text-slate-500">{ebook.extension}</p>
            </article>
          </Card>

          <Card className="flex flex-col justify-between gap-6 p-8">
            <SectionHeader
              icon={Globe}
              title="Community Toolbox"
              subtitle="Keep parents, peers, and mentors looped in"
            />
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-inner">
                <h4 className="text-sm font-semibold text-slate-700">
                  Family Voice Note
                </h4>
                <p className="mt-2">
                  Share a 60-second audio summary in local language using your
                  phone, inviting families to echo the key value at home.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-inner">
                <h4 className="text-sm font-semibold text-slate-700">
                  Peer Collaboration
                </h4>
                <p className="mt-2">
                  Pair up with another teacher to exchange visual storyboards
                  and co-create a festival assembly performance.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-inner">
                <h4 className="text-sm font-semibold text-slate-700">
                  Reflective Journal Prompt
                </h4>
                <p className="mt-2">
                  From today&apos;s lesson, what surprised the learners most?
                  Note down their quotes in your reflective journal.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-sm text-indigo-700">
              <p className="font-semibold uppercase tracking-[0.22em] text-indigo-500">
                Daily affirmation
              </p>
              <p className="mt-2">
                You are nurturing curious hearts. Celebrate every smile, every
                question, every handwritten doodle.
              </p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
