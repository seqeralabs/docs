# Structural patterns to avoid

LLMs lean on a small set of sentence and paragraph shapes. Once you can see them, they're hard to unsee. The patterns below are the high-frequency ones for technical writing.

A single use of any pattern can be fine. The problem is when the pattern repeats — three binary contrasts in a row, every paragraph ending in a fragment, every list using bold-first bullets. That's the AI signature.

## Binary contrasts (negative parallelism)

The most recognizable AI tell. Manufactures false drama by framing every point as a surprise reframe.

| Pattern                                          | Problem                |
| ------------------------------------------------ | ---------------------- |
| "Not because X. Because Y."                      | Telegraphed reversal   |
| "X isn't the problem. Y is."                     | Formulaic reframe      |
| "The answer isn't X. It's Y."                    | Predictable pivot      |
| "It feels like X. It's actually Y."              | Setup/reveal cliche    |
| "The question isn't X. It's Y."                  | Rhetorical misdirection |
| "Not X. But Y."                                  | Mechanical contrast    |
| "It's not this. It's that."                      | Same formula           |
| "doesn't mean X, but actually Y"                 | Negation-then-assertion |
| "not just X but also Y"                          | Additive hedge         |

**Fix:** State Y directly. "The problem is Y." Skip the negation runway.

## Negative listings

Dramatic countdown through negation.

- "Not a bug. Not a feature. A design flaw."
- "It wasn't slow. It wasn't broken. It was both."
- "Not ten. Not fifty. Five hundred."

**Fix:** Lead with the answer. The reader does not need the windup.

## Dramatic fragmentation

Sentence fragments for emphasis. No real engineer writes first drafts this way.

| Pattern                                    | Problem                  |
| ------------------------------------------ | ------------------------ |
| "X. That's it. That's the [thing]."        | Performative simplicity  |
| "X. And Y. And Z."                         | Staccato drama           |
| "This unlocks something. Big."             | Artificial revelation    |
| "It runs. Reliably. Every time."           | Fragment stacking        |

**Fix:** Use complete sentences. Let the content do the work.

## Self-posed rhetorical questions

The model asks a question nobody was asking, then answers it.

- "The result? Devastating."
- "The worst part? Nobody noticed."
- "What if [reframe]?"
- "Why does this matter?"
- "Think about it:"

**Fix:** Make the point. Don't pose the question first.

## Anaphora abuse

Repeating the same sentence opening in quick succession.

- "It runs fast. It runs reliably. It runs at scale."
- "You can deploy with one command. You can monitor with one dashboard. You can debug with one log stream."
- "We built X. We shipped Y. We documented Z."

**Fix:** Vary the openings. Often the three sentences can be merged into one.

## Tricolon abuse (rule of three)

A single rule-of-three can be elegant. Multiple back-to-back ones are an AI tic.

- "Fast, efficient, and performant."
- "Clean, maintainable, and well-structured."
- "Simple, easy, and intuitive."
- "Identity, payments, compute, distribution." (extended list)

**Fix:** Pick the one most precise word. Cut the synonyms.

## "Despite [challenges]..." formula

LLMs acknowledge a problem only to immediately dismiss it. Same beat every time.

- "Despite these challenges, the system continues to scale."
- "Despite the complexity, the API remains easy to use."

**Fix:** If the challenge is worth mentioning, analyze it. If not, skip it.

## Listicle in a trench coat

Numbered points dressed up as paragraphs. The model writes a list but wraps each item in "The first…", "The second…", "The third…".

- "The first wall is the lack of an API. The second wall is the lack of access control. The third wall is the lack of audit logging."

**Fix:** If it's a list, present it as a list. If it's prose, weave the points together without numbering.

## False agency (inanimate subjects doing human things)

AI loves this because it avoids naming the actor.

| Pattern                              | Fix                                |
| ------------------------------------ | ---------------------------------- |
| "the run decides to fail"            | "the run fails when..."            |
| "the metrics tell us"                | name who reads them and concludes  |
| "the compute environment recognizes that" | "the compute environment checks whether..." |
| "the Launchpad empowers users to"    | "users launch pipelines from the Launchpad" |
| "the decision was made to"           | name who decided                   |

**Fix:** Name the actor — a process, script, user, or team. If no actor fits, use "you" to put the reader in the seat.

## Superficial participle analyses

Tacking an "-ing" phrase onto the end of a sentence to inject shallow analysis.

- "...contributing to the pipeline's reliability"
- "...highlighting the importance of the work directory"
- "...underscoring its role as a critical component"
- "...reflecting broader trends in observability"

**Fix:** Either make a specific claim or delete the participle phrase.

## False ranges

"From X to Y" where X and Y aren't on any real scale.

- "From innovation to implementation"
- "From small teams to large enterprises" (this one's borderline — usable only if the docs actually treat both ends)
- "From the simple to the complex"

**Fix:** If it's a list, list it. If it's a real spectrum, describe it.

## Bold-first bullets

Every bullet starting with **Bolded Keyword**: text. Extremely common in LLM markdown.

```
- **Performance**: Runs start in under 30 seconds on a warm compute environment.
- **Reliability**: Failed tasks retry automatically up to 3 times.
- **Security**: Credentials are encrypted with AES-256.
```

**Fix:** Drop the bold leads when they aren't carrying information. If the bolded words really are categories the reader will scan, keep them — but cut the bold when the bullets are full sentences that read fine without it.

## Em-dash addiction

LLMs use em-dashes as decorative pauses. A human writer might use 2–3 in a piece. AI uses 20+.

- "The run — and this is the part that bites you — fails silently."
- "Set the `resume` flag — yes, this one — to true."

**Fix:** Replace with a comma, a period, or a parenthetical. Keep em-dashes only for genuine interruptions where no other punctuation works.

## Unicode decoration

LLMs love these characters; they don't appear in normal typed prose.

- Arrows: → ⇒
- Curly quotes: " " ' '
- Bullets in prose: •
- Special dashes used as separators: ─

**Fix:** Use straight quotes, `->`/`=>`, and standard ASCII punctuation. The exception: when the document is rendered output (not source) for an audience that expects typography, smart quotes are fine.

## Fractal summaries

"What I'll tell you / what I'm telling you / what I told you" — applied at every level.

- "In this section, we'll cover X. [3 paragraphs.] As discussed in this section, X works as follows..."

**Fix:** Trust the reader. Don't preview, don't recap. State the content once.

## One-point dilution

Restating the same point in many different ways across a doc to feel comprehensive.

**Fix:** State the point once. Support it. Move on. If the same idea is restated more than twice, cut the repetitions.

## The dead metaphor

Latching onto a single metaphor and using it in every paragraph. A human introduces a metaphor and moves on. AI repeats it.

**Fix:** Use a metaphor once, maybe twice. Then drop it.

## Invented concept labels

LLMs invent compound nouns that sound analytical without being grounded — "the supervision paradox", "the observability gap", "the caching tax". They function as rhetorical shorthand: name a thing, skip the argument.

**Fix:** If the concept genuinely needs a name and the doc defines it, fine. Otherwise describe the thing in plain language.

## Historical analogy stacking (common in tech writing)

Rapid-fire listing of companies or shifts to build false authority.

- "Apple didn't build Uber. Facebook didn't build Spotify. Stripe didn't build Shopify."
- "Every major shift — web, mobile, cloud, AI — followed the same pattern."

**Fix:** Pick one example. Examine it. One well-analyzed case beats five name-drops.

## Rhythm tells

| Pattern                                    | Fix                                  |
| ------------------------------------------ | ------------------------------------ |
| Every paragraph ends in a one-line punchline | Vary endings                       |
| Three consecutive sentences are the same length | Break one                       |
| Every section starts with "So" or "Now" or "But" | Cut the opener                  |
| Every list has exactly three items         | Use two or four where natural        |
| Repeated "X. Y. Z." three-item sentences   | Combine into prose                   |

## Lazy extremes

Sweeping claims doing vague work.

- every, always, never, all, none, everyone, nobody
- "every team", "all users", "no developer"

**Fix:** Be specific. "Most teams" with a number if available. "Every user on the free tier" with the tier named.

## Sentence-starter crutches

Avoid leaning on these as openers:

- "What" / "When" / "Where" / "Which" / "Who" / "Why" / "How" as sentence-starting wh- questions
- "So" / "Now" / "But" / "And" as paragraph openers when they're not doing work

**Fix:** Restructure. Lead with the subject or the verb.

## The ", so" connector

Joining two independent clauses with ", so" reads loose and conversational, and it buries a cause-and-effect that's clearer stated on its own.

| Avoid                                                          | Use instead                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| "The token expires after an hour, so refresh it before a run." | "The token expires after an hour. Refresh it before a run."        |
| "Spot instances can be reclaimed, so the run may restart."     | "Because spot instances can be reclaimed, the run may restart."    |
| "The schema is cached, so changes need a restart."             | "Changes need a restart because the schema is cached."             |

**Fix:** Split into two sentences, or lead with the cause ("Because X, Y"). The same applies to the other loose clause-joiners — ", and so", ", which means", ", thus", ", therefore". Keep "so" only for a genuinely short aside, and even then prefer a period.

**This is the easiest rule to break in your own rewrite.** Compressing a slop sentence often produces a fresh ", so" join ("blocks users from launching pipelines, so treat it as an incident"). The rule applies to the prose you write, not only the prose you started with. Re-read every sentence you wrote and split any ", so" / ", which means" you introduced while tightening.

## Semicolons and mid-sentence colons

Documentation reads better as short, separate sentences than as long ones stitched together with punctuation.

- **Semicolons:** don't use them in prose. Split into two sentences, or join with a connector word (and, but, because). "The token expires hourly; refresh it" becomes "The token expires hourly. Refresh it before each run."
- **Mid-sentence colons:** don't use a colon inside a sentence to join clauses or for a dramatic pause ("The result: chaos." / "There's one rule: keep it short."). State it as a plain sentence.

A colon is still correct when it **introduces** a list, numbered steps, a table, a code block, or a short label. These are the skill's standard forms and stay:

- `Prerequisites:` before a list
- `To resolve:` before numbered steps
- `Note:` or `Breaking change:` as a label before the detail

**Fix:** Replace a clause-joining `;` or `:` with a period. Keep the colon only where it introduces a block or labels one.

## Punctuation consistency

Mechanical, but readers notice the inconsistency more than any single rule.

- **Oxford comma:** use it in a series of three or more — "instances, storage, and networking", not "instances, storage and networking".
- **List punctuation is parallel:** either every item ends with a period or none does. If any item is a full sentence (or has more than one), end them all with periods; for short phrases, use none.
- **Headings take no terminal period** and no trailing colon (unless the colon immediately introduces a code block or list).
- **Dashes:** em-dash (`—`) for a parenthetical break (used sparingly — see "Em-dash addiction"); en-dash (`–`) for ranges (`v23.1–v24.1`, `pages 10–14`); hyphen (`-`) for compound modifiers (`tag-based invalidation`).
- **Quotation marks:** in prose, put periods and commas inside the quotes ("...the run." not "...the run".). Put a `?` or `!` inside the quotes only when it's part of the quoted text.
- **Don't quote code.** Use backticks for commands, flags, and identifiers, not quotation marks (see `terminology.md`).
