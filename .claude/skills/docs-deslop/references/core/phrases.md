# Phrases to remove or replace

A catalog of phrases and individual words that appear constantly in LLM-generated technical writing and almost never carry their weight. Cut them or replace with the suggested alternative.

This file is the **canonical** source for individual word and phrase swaps. `style-guide.md` restates a few of the highest-frequency lists (marketing adjectives, sales verbs, *allow*/*enable*) in the context of its style rules; when those overlap, edit here first.

The lists below are ordered roughly by how common they are in technical drafts. Start at the top.

## The okay list (do not replace these)

These words are precise and earn their place in technical docs. Do not swap them for a "plainer" alternative — the substitution loses meaning.

- **augment** — keep it. It means "add to" or "supplement", not the same as "extend". Do not replace it.
- **recommended** — "X is recommended" is fine ("This approach is recommended for managing reproducible environments"). It states a recommendation with a real subject. Only the dummy-subject form "it is recommended that..." hides who recommends and should be rewritten.
- **additional** — fine when it genuinely means "more of something already named" ("Set additional environment variables in the next step", "See the additional options below"). Cut it only when it's pure filler that adds nothing ("additional new features" → "new features").

## Throat-clearing openers

These are warm-up reps before the actual point. The sentence that follows them is usually the real content. Cut the opener and start with that.

- "Here's the thing:"
- "Here's what / this / that / why [X]"
- "Here's the kicker"
- "Here's where it gets interesting"
- "Here's what most people miss"
- "Here's the deal"
- "The uncomfortable truth is"
- "It turns out"
- "The real X is"
- "Let me be clear"
- "The truth is,"
- "I'm going to be honest"
- "I'll say it again:"
- "Look,"

Any "Here's what/this/that" construction is throat-clearing. Cut it and state the point directly.

## Hedge phrases and emphasis crutches

These are the single most reliable AI tell in technical prose. They add no information.

- "It's worth noting that"
- "It bears mentioning"
- "It's important to remember"
- "Keep in mind that"
- "One thing to consider"
- "Notably"
- "Interestingly"
- "Importantly"
- "Crucially"
- "Of note"
- "Make no mistake"
- "Let that sink in"
- "Full stop." / "Period."
- "This matters because" (often deletable; if not, state the reason directly)

## Weak confidence words

Hedging modal words make instructions sound unsure. In a how-to, the reader wants to know what to do, not what might work. Cut them or commit to the statement.

| Avoid                               | Use instead                              |
| ----------------------------------- | ---------------------------------------- |
| might / may (when you mean "does")  | the direct statement                     |
| maybe / perhaps / possibly          | (cut)                                    |
| could potentially                   | can                                      |
| you may want to / consider trying   | "Consider X", or just "X"                |
| it's possible that                  | state it directly                        |
| this should work                    | "this works", or name the condition      |

Keep the hedge only when the uncertainty is real and outside the reader's control: "Results may vary depending on data size", "Performance can differ based on network conditions."

## Pedagogical hand-holding

These assume the reader needs a teacher. Technical readers usually do not. Cut them.

- "Let's break this down"
- "Let's unpack this"
- "Let's explore"
- "Let's dive in"
- "Let's delve into"
- "Think of it as..."
- "Think of it like..."
- "Imagine a world where..."
- "Picture this:"

## Self-referential writing

Cut anything that announces what the document is about to do. It slows the reader down without conveying information.

- "This page shows..."
- "This guide explains..."
- "This document covers..."
- "This article walks you through..."
- "In this guide, we'll..."
- "In this section, we'll..."
- "In this post, I'll..."
- "As we'll see..."
- "As we've seen..."
- "Let me walk you through..."
- "I want to explore..."
- "The rest of this essay..."
- "And so we return to where we began."

## Signposted conclusions

A technical reader doesn't need an "in conclusion" section. They can see the document ending.

- "In conclusion"
- "To sum up"
- "To summarize"
- "In summary"
- "As mentioned earlier" (often deletable)
- "As we've discussed"
- "Wrapping up"
- "Bottom line:"

If the closing paragraph is just restating what the document already said, delete it.

## Marketing adjectives that mean nothing

These survive a swap with any other positive adjective. That means they aren't carrying weight.

- powerful
- robust
- seamless / seamlessly
- comprehensive
- cutting-edge
- state-of-the-art
- best-in-class
- industry-leading
- next-generation
- blazing fast / lightning fast
- world-class
- enterprise-grade (use only when comparing to a specific non-enterprise tier)
- battle-tested
- production-ready (only when comparing to non-production)

If you must keep a quality claim, anchor it to the measurable thing ("returns in under 50ms at p99", "handles 10k concurrent connections per node").

## Sales / marketing verbs

These come from sales decks. Most can become "use" or "let" with no loss.

| Avoid                            | Use instead                              |
| -------------------------------- | ---------------------------------------- |
| leverage (verb)                  | use                                      |
| utilize                          | use                                      |
| harness                          | use                                      |
| empower                          | let                                      |
| enable (when it means "let")     | let                                      |
| unlock                           | (often deletable; or use "give access to") |
| drive (results, adoption, etc.)  | cause, increase, lead to                 |
| facilitate                       | help, make easier                        |
| streamline                       | simplify                                 |
| supercharge / turbocharge        | speed up                                 |
| democratize                      | give access to                           |
| accelerate (outside actual speed)| speed up                                 |

## Business jargon

Replace with the plain word.

| Avoid                       | Use instead                       |
| --------------------------- | --------------------------------- |
| navigate (challenges)       | handle, address                   |
| unpack (analysis)           | explain, examine                  |
| lean into                   | accept, commit to                 |
| landscape (context)         | situation, field                  |
| ecosystem                   | system, community                 |
| paradigm                    | model, approach                   |
| synergy                     | combined effect                   |
| game-changer                | important, significant            |
| double down                 | commit, increase                  |
| deep dive                   | analysis, examination             |
| take a step back            | reconsider                        |
| moving forward              | next, from now                    |
| circle back                 | return to                         |
| on the same page            | aligned, agreed                   |
| at the end of the day       | (delete)                          |
| when it comes to            | (delete or "for")                 |
| in today's [X] landscape    | (delete)                          |

## Colloquial / informal verbs

These read as conversational filler in documentation voice. They are not in the lists above, so a catalog-only scan misses them — catch them on a plain read of the prose (including admonition blocks like `:::tip` and `:::note`). Swap for the plain, precise verb.

| Avoid                        | Use instead                          |
| ---------------------------- | ------------------------------------ |
| grab (a token, a command)    | copy, get                            |
| spin up                      | start, create, launch                |
| dig into / dive into         | examine, look at                     |
| hit (an endpoint, a limit)   | call, send a request to; reach       |
| jump to / hop over to        | go to, see                           |
| kick off                     | start, run, trigger                  |
| tweak                        | adjust, change                       |
| wire up                      | connect, configure                   |

These are context-dependent — a single one in tutorial prose can be fine (tutorials run friendlier). The tell is informal register in reference, task, or troubleshooting docs where the reader wants the precise verb.

## The "serves as" dodge

AI replaces simple "is" or "are" with pompous alternatives. Use the simple verb.

| Avoid                         | Use instead |
| ----------------------------- | ----------- |
| serves as                     | is          |
| stands as                     | is          |
| marks (when meaning "is")     | is          |
| represents (when meaning "is")| is          |
| functions as                  | is          |

## AI vocabulary tells

These words became massively overrepresented in LLM output.

- "delve" → examine, look at, explore
- "tapestry" → mix, combination, range
- "certainly" → usually deletable
- "nuanced" → complex, specific (or describe the specific nuance)
- "quietly" (as in "quietly transformed") → describe what actually happened
- "landscape" (when meaning "field") → field, situation, area

## Padding phrases

These add words without information.

| Avoid                          | Use instead                |
| ------------------------------ | -------------------------- |
| in order to                    | to                         |
| due to the fact that           | because                    |
| despite the fact that          | although                   |
| at this point in time          | now                        |
| at the present time            | now                        |
| in the event that              | if                         |
| with regard to / with respect to | about, regarding         |
| for the purpose of             | to, for                    |
| has the ability to             | can                        |
| is able to                     | can                        |
| provides the ability to        | lets                       |
| in spite of                    | despite                    |
| a number of                    | (cut, or give the number)  |
| a variety of                   | (cut, or list the actual variants) |
| various                        | (cut, or list the actual variants) |
| numerous                       | many (or give the number)  |
| multiple                       | (cut, or give the number)  |
| a wide range of                | (cut)                      |
| a number of different          | (cut)                      |
| significantly                  | (cut, or give the number)  |

## Adverbs (mostly cut)

Most adverbs in technical prose are filler. Specific offenders:

- really, just, literally, genuinely, honestly, simply, actually, basically
- deeply, truly, fundamentally, inherently, inevitably
- remarkably, arguably, interestingly, importantly, crucially
- quietly
- effectively (often hides imprecision: "effectively does X" usually means "does something close to X but I don't want to commit")

Specific filler combinations:

- "At its core"
- "In today's X" (cut entirely)
- "At the end of the day"
- "When it comes to" (usually deletable)
- "In a world where"
- "The reality is"

## Vague declaratives

Sentences that announce importance without naming the specific thing. Either name it or cut the sentence.

- "The reasons are structural"
- "The implications are significant"
- "The stakes are high"
- "The consequences are real"
- "This is the deepest problem"
- "This has far-reaching implications"

## Vague attributions

If you cannot name the source, you do not have one.

- "Experts argue that..." → name the experts
- "Industry reports suggest..." → name the report
- "Observers have noted..." → who?
- "Several publications have cited..." → which ones?
- "It is widely believed that..." → by whom?

## Grandiose stakes inflation

LLMs inflate the stakes of every claim. Scale the language to the actual scope.

- "This will fundamentally reshape how we think about [X]"
- "This will define the next era of [X]"
- "Something entirely new"
- "A paradigm shift"
- "Game-changing"
- "Revolutionary"

A bug fix is a bug fix. A new endpoint is a new endpoint. Say so.

## "Allow" and "enable" (the customer-perspective tell)

These put the product in the subject position instead of the user. The style guide calls them out specifically.

| Avoid                                       | Use instead                                |
| ------------------------------------------- | ------------------------------------------ |
| "X allows you to do Y"                      | "Use X to do Y" or "With X, you can do Y" |
| "X enables you to do Y"                     | "Use X to do Y"                            |
| "This feature lets you..."                  | "Use this feature to..." or just "You can..." |
| "The platform gives you the ability to..."  | "You can..."                                |

## Other phrases to cut

- "and so on" — be specific or list the items
- "etc." — same
- "various" — cut or list
- "and more" — cut or list
- "moving forward" — cut
- "going forward" — cut
- "as such" — usually cut
- "in fact" — usually cut
- "indeed" — cut
- "needless to say" — if needless, then don't say it

## Nominalizations

A verb turned into a noun, then propped up with a weak verb ("perform", "carry out", "do"). Use the verb directly.

| Avoid                                | Use instead              |
| ------------------------------------ | ------------------------ |
| perform the configuration of         | configure                |
| do the installation of                | install                  |
| carry out the modification of         | modify, change           |
| make a selection of                   | select                   |
| provide a description of              | describe                 |
| the implementation of this feature    | implementing this feature, or just "this feature" |
| the establishment of a connection     | connecting, the connection |

Tell: a noun ending in `-tion`, `-ment`, `-ance`, or `-ing` paired with "perform/do/make/carry out". Collapse it to the verb.

## Non-inclusive and ableist language

Replace these regardless of intent. They add nothing and exclude readers.

| Avoid                         | Use instead                          |
| ----------------------------- | ------------------------------------ |
| sanity check                  | confidence check, quick check, verify |
| blind spot                    | gap, oversight                       |
| dummy value                   | placeholder, sample value            |
| master (branch)               | main                                 |
| whitelist / blacklist         | allowlist / denylist                 |
| he / she / his / her (generic) | you / your, or "they" if unavoidable |
| manpower                      | workforce, staff                     |
| just / simply / easily        | (cut — see "No marketing language" in `style-guide.md`) |

## Vague link text

Link text should name the destination so it makes sense out of context (and for screen readers).

| Avoid                                   | Use instead                                     |
| --------------------------------------- | ----------------------------------------------- |
| For more information, [click here](#).  | See [Configuration options](#).                 |
| Read [this](#).                         | Read the [installation guide](#).               |
| [Learn more](#).                        | Learn how to [configure logging](#).            |

## A note on context

A single instance of any phrase above might be fine. The problem is when several appear together, or when one is used as a verbal tic across a document. When in doubt, cut.
