# THE AI RUNNING COACH KNOWLEDGE BASE
## Part 4: Workout Library

> **Document purpose:** Parts 1–3 built the philosophy, physiology, and zone model. Part 4 is where that theory becomes prescribable: a named, structured catalogue of every workout type the AI engine is allowed to select from. Every entry uses the same template so the engine can query the library programmatically rather than relying on free-text matching. Section 13 compiles the entire library into a single lookup table (the "AI workout database") for direct implementation.

---

## 1.0 How This Library Is Structured

Each workout entry below follows the exact template requested:

```
Workout Name:
Purpose:
Physiology:
Suitable Athletes:
When To Use:
When Not To Use:
Progressions:
Regressions:
Recovery Cost:
```

A few notes on how to read these fields, since they carry specific meaning for the AI engine:

- **Recovery Cost** is rated on a simple 1–5 scale (1 = negligible, can be followed by another quality session the next day; 5 = maximal, requires 48–72h+ before another hard stimulus). This field feeds directly into Part 1's Layer 3 (Recovery Sufficiency Gate).
- **Progressions** describe how to make the *same workout category* harder for a more advanced or better-adapted athlete — not a different workout entirely.
- **Regressions** describe how to make the workout safer/easier without abandoning its training purpose — this is the field the engine should reach for when Part 1's gates require downgrading a session rather than cancelling it outright.
- **Suitable Athletes** references training_age_stage and goal_event from earlier parts, not just "beginner/advanced" labels.

---

## 2.0 Easy Runs

```
Workout Name: Easy Run
Purpose: Accumulate aerobic volume — the single largest-impact session
         type in the entire training plan (see Part 3, Zone 2).
Physiology: Drives mitochondrial density, capillarisation, LT1
            development, and fat oxidation capacity (Part 2, Sections
            2 and 7). Low absolute intensity means the stimulus comes
            from time/volume, not effort.
Suitable Athletes: All training_age_stages, all goal_events. The single
            most universally prescribed session in the library.
When To Use: As the default session on the majority of training days,
            year-round, in every phase of periodisation (Part 5).
When Not To Use: Rarely contraindicated — the main risk is running it
            too hard (drifting into Zone 3; see Part 3, Section 4),
            not running it at all. Exception: during acute injury
            flags, substitute with cross-training or rest.
Progressions:
   - Increase duration before increasing pace
   - Add strides at the end (see Section 12) once consistent for 4+ weeks
   - Introduce easy "doubles" (a second short easy run later the same
     day) for higher-volume, higher-training-age athletes
Regressions:
   - Shorten duration, not necessarily intensity
   - Convert to a walk-run structure for returning/deconditioned athletes
   - Move to softer terrain or non-impact cross-training if durability
     is a current limiter (Part 8/9)
Recovery Cost: 1
```

---

## 3.0 Recovery Runs

```
Workout Name: Recovery Run
Purpose: Promote active recovery between harder sessions without adding
         meaningful new training stress (Part 3, Zone 1).
Physiology: Maintains blood flow and gentle aerobic stimulus while
            allowing glycogen restoration, muscle repair, and
            neuromuscular recovery from a prior hard session
            (Part 1, Section 3 — supercompensation window).
Suitable Athletes: All training_age_stages, all goal_events — though
            higher-volume/higher-training-age athletes use this
            category more frequently as a distinct session type rather
            than folding it into general easy running.
When To Use: The day immediately following a threshold, VO2max, long
            run, or race effort; during the early days of a taper;
            during return-to-running protocols (Part 9).
When Not To Use: As a substitute for a true rest day when the athlete
            needs complete rest, not just lower intensity; as the
            *only* aerobic stimulus across an entire week (it is not
            sufficient volume/intensity to drive ongoing adaptation
            on its own).
Progressions:
   - Extend slightly in duration once the athlete's general recovery
     capacity improves (a sign of rising training age, not a goal
     to chase deliberately)
   - This workout category is intentionally NOT meant to be
     progressed aggressively — its value is in staying easy
Regressions:
   - Replace with a rest day or low-impact cross-training
   - Shorten further, or break into a short walk-jog structure
Recovery Cost: 1
```

---

## 4.0 Long Runs

```
Workout Name: Long Run
Purpose: Build the durability, glycogen storage capacity, fat
         oxidation, and psychological tolerance needed to sustain
         extended efforts (Part 2, Sections 7–8) — the single most
         important session for half marathon and marathon athletes.
Physiology: Drives the largest single-session glycogen depletion and
            repletion cycle of the week; trains "economy durability"
            (Part 2, Section 6) as fatigue accumulates late in the run;
            builds tendon/bone/connective-tissue tolerance to sustained
            load (Part 8).
Suitable Athletes: All training_age_stages and goal_events, scaled
            heavily by event and experience — a 5K-focused Foundation
            athlete's "long run" looks very different from a
            Performance-stage marathoner's.
When To Use: Weekly, as the anchor session of the week, for nearly
            every training phase except the final taper days
            immediately before a race.
When Not To Use: When weekly volume hasn't been built up enough to
            support it safely (Part 1, Section 4 progressive overload
            guardrails); in the final 5–7 days before a goal race
            (replace with a much shorter shakeout-style run).
Progressions:
   - Increase duration first (within the 5–10% rolling guardrail)
   - Then introduce embedded segments: marathon-pace finishes,
     threshold segments, or progression-style pace increases
     (see Section 5 and Section 7)
   - For marathon athletes approaching race specificity: add in-race
     fueling rehearsal (Part 2, Section 8) to every long run from
     roughly 8 weeks out
Regressions:
   - Shorten duration
   - Remove any embedded faster segments, reverting to fully easy pace
   - Split into two shorter runs the same day for athletes who
     structurally cannot tolerate one long continuous bout yet
     (common in early Foundation stage or post-injury return)
Recovery Cost: 3 (4 for marathon-specific long runs with embedded
            race-pace segments; 2 for shorter, fully easy long runs)
```

---

## 5.0 Progression Runs

```
Workout Name: Progression Run
Purpose: Train pacing discipline, fatigue-resistant running economy,
         and a controlled transition from aerobic to threshold-adjacent
         intensity within a single continuous effort.
Physiology: Begins in Zone 1–2, finishes in Zone 3–4; trains the
            athlete's ability to maintain form and economy
            ("economy durability," Part 2, Section 6) as both fatigue
            and intensity rise simultaneously — a closer simulation of
            race-day fatigue accumulation than a flat-pace tempo run.
Suitable Athletes: Development stage and above; particularly valuable
            for half-marathon and marathon athletes as a lower-impact
            alternative to structured interval sessions.
When To Use: Mid-week or as a long-run variant, particularly in base
            and early build phases (Part 5); as a lower-recovery-cost
            substitute when an athlete needs a quality stimulus but
            is not fully recovered enough for a full threshold/VO2max
            session.
When Not To Use: In the final week before a goal race (too close to
            threshold-adjacent fatigue cost for taper week); for
            Foundation-stage athletes who haven't yet developed
            reliable pacing sense — they tend to either undertrain
            the back half or start it dangerously fast.
Progressions:
   - Steepen the pace progression curve (faster final segment)
   - Extend the proportion of the run spent in the faster final segment
   - Combine with long-run duration progressions for marathon athletes
Regressions:
   - Flatten the progression (smaller pace change start-to-finish)
   - Shorten the faster final segment
   - Revert to a fully even-paced easy run if the athlete shows poor
     pacing control or excessive fatigue
Recovery Cost: 2–3 (depending on how aggressive the final segment is)
```

---

## 6.0 Tempo Runs

```
Workout Name: Tempo Run (Continuous Threshold)
Purpose: Directly train LT2 (Part 2, Section 4; Part 3, Zone 4) via
         a single sustained effort at or near maximal lactate
         steady state.
Physiology: Improves lactate clearance/buffering capacity and shifts
            the lactate curve rightward; the continuous (non-interval)
            structure provides strong specificity for half-marathon
            and marathon racing, where sustained, uninterrupted effort
            is the actual race demand.
Suitable Athletes: Development stage and above; primary quality
            session for 10K, half marathon, and marathon-focused
            athletes; useful but secondary for 5K-focused athletes.
When To Use: Weekly or every-other-week as a primary quality session,
            especially in build and peak phases (Part 5); as a
            building block before introducing more demanding cruise
            interval or threshold interval sessions.
When Not To Use: Before an adequate aerobic base exists (Part 1,
            Section 9 — Foundation-stage athletes should not start
            here); in the 5–7 days immediately before a goal race.
Progressions:
   - Extend total continuous duration (e.g., 20 min → 30 min → 40 min)
   - Increase pace slightly as threshold fitness improves (re-test
     zones per Part 3, Section 1.1 — do not guess)
   - Embed within a long run rather than as a standalone session
     for advanced marathon-specific training
Regressions:
   - Shorten total duration
   - Break into two shorter continuous efforts with a brief jog
     recovery between (a stepping-stone toward cruise intervals,
     Section 7)
   - Reduce target pace slightly toward the bottom of the threshold
     zone band rather than the top
Recovery Cost: 3–4
```

---

## 7.0 Cruise Intervals

```
Workout Name: Cruise Intervals
Purpose: Accumulate a larger total volume of time at LT2 than a single
         continuous tempo effort would allow, by breaking the work
         into repeated intervals with short, incomplete recovery.
Physiology: Same target zone as the continuous tempo run (Part 3,
            Zone 4), but the brief recovery jogs allow slightly higher
            total threshold-zone volume per session with a somewhat
            lower psychological and pacing-error risk than one long
            continuous effort — a key reason this format is favoured
            in high-volume systems (Part 10).
Suitable Athletes: Development stage and above; especially valuable
            for athletes building toward continuous tempo capacity,
            and for higher-volume Specialisation/Performance-stage
            athletes wanting to maximise threshold-zone time without
            excessive single-effort fatigue.
When To Use: As an alternative or progression from continuous tempo
            runs; in base-to-build phase transitions; for athletes
            who handle interval structure better than sustained
            continuous effort psychologically.
When Not To Use: In place of race-specific continuous tempo work in
            the final weeks before a half-marathon/marathon, where
            uninterrupted-effort specificity matters more (Part 1,
            Section 6); for athletes who tend to start intervals too
            fast because the "rest" ahead invites overreach.
Progressions:
   - Increase the number of repetitions
   - Increase individual repetition length (e.g., 1 mile → 1.5 miles)
   - Shorten recovery jogs between repetitions
Regressions:
   - Reduce repetition count
   - Lengthen recovery jogs between repetitions
   - Shorten individual repetition distance
Recovery Cost: 3–4
```

---

## 8.0 Threshold Intervals

```
Workout Name: Threshold Intervals (Longer Reps)
Purpose: Train LT2 via longer, fewer repetitions than cruise intervals
         — closer to continuous tempo in physiological demand but with
         the option to hold a slightly faster pace per repetition due
         to the brief recovery breaks.
Physiology: Same underlying adaptation target as Sections 6–7 (LT2,
            lactate clearance/buffering); the longer rep length (often
            8–15+ minutes per repetition) provides more continuous-effort
            specificity than cruise intervals while still offering brief
            recovery to sustain a slightly higher quality pace.
Suitable Athletes: Specialisation and Performance stage primarily;
            half-marathon and marathon-focused athletes especially,
            including as the building block for "double threshold"
            structures (Part 10).
When To Use: Build and peak phases; when an athlete has demonstrated
            solid continuous-tempo capacity and is ready for a slightly
            more demanding threshold stimulus.
When Not To Use: Foundation-stage athletes; when recovery indicators
            suggest the athlete hasn't absorbed recent load (Part 1,
            Section 8) — this session sits at the higher end of
            threshold-zone recovery cost.
Progressions:
   - Increase individual repetition length
   - Add a repetition (e.g., 2 x 12 min → 3 x 12 min)
   - Reduce recovery duration between repetitions
   - Advance toward double-threshold structure (two threshold sessions
     in one day) only for well-established, high-volume athletes
     (Part 10)
Regressions:
   - Shorten individual repetition length
   - Reduce repetition count
   - Lengthen recovery between repetitions
   - Revert to cruise intervals (Section 7) or continuous tempo
     (Section 6) if this session proves too demanding
Recovery Cost: 4
```

---

## 9.0 Hill Repeats

```
Workout Name: Hill Repeats
Purpose: Develop muscular power, neuromuscular recruitment, and
         running-specific strength under high force with comparatively
         low impact/overuse risk relative to flat-ground sprinting,
         while also providing a meaningful cardiovascular stimulus.
Physiology: Uphill running recruits a higher proportion of fast-twitch
            fibres (Part 2, Section 9) at a given perceived effort than
            flat running, while the incline reduces braking/impact
            forces compared to flat-ground sprinting at the same
            intensity — a favourable strength-to-injury-risk trade-off.
            Builds running economy and power that transfers to flat
            racing form.
Suitable Athletes: All training_age_stages (with intensity/duration
            scaled down for Foundation-stage athletes); valuable across
            all goal_events, including marathon athletes, for whom
            hill repeats double as a low-volume strength-training
            substitute.
When To Use: Year-round in small, consistent doses, similar to strides
            (Section 12); as a structured strength-building block in
            base and early build phases; as race-specific preparation
            for runners whose goal race includes significant elevation
            change.
When Not To Use: On consecutive days without recovery; for athletes
            with an active Achilles, calf, or knee injury flag without
            clearance (Part 9) — the eccentric loading on the descent
            and concentric power demand on the ascent both carry
            meaningful injury-risk considerations.
Progressions:
   - Increase hill length/duration per repetition
   - Increase repetition count
   - Increase incline steepness (carefully, and gradually)
   - Reduce recovery (jog or walk back down) between repetitions
Regressions:
   - Shorten each repetition
   - Reduce repetition count
   - Use a gentler incline
   - Walk (rather than jog) the recovery between repetitions
Recovery Cost: 3 (short hill sprints) to 4 (longer, higher-volume
            hill repeat sessions)
```

---

## 10.0 VO2 Intervals

```
Workout Name: VO2 Max Intervals
Purpose: Directly train the aerobic ceiling (Part 2, Section 5; Part 3,
         Zone 5) via repeated efforts at or near the velocity associated
         with VO2max.
Physiology: Drives peak cardiovascular adaptation (stroke volume,
            cardiac output) and recruits a high proportion of available
            muscle fibre, including meaningful Type IIa contribution
            (Part 2, Section 9); produces the largest single-session
            VO2max stimulus of any workout in this library, but also
            among the highest fatigue/injury-risk costs.
Suitable Athletes: Development stage and above; primary quality session
            for 5K/10K-focused Specialisation/Performance athletes;
            a smaller maintenance dose for half-marathon/marathon
            athletes, especially in earlier build phases.
When To Use: 1–2x per week maximum (Part 3, Rule 6.1), in base-to-build
            and build-to-peak phases for short-distance specialists;
            sparingly and tapered down for marathon athletes as race
            specificity narrows (Part 1, Section 6).
When Not To Use: Foundation-stage athletes before an aerobic base and
            threshold exposure exist; in the final 10–14 days before
            a goal race for marathon athletes specifically (low
            specificity value, high fatigue cost at the wrong time);
            when recovery indicators suggest insufficient recovery
            from the prior hard session.
Progressions:
   - Increase individual repetition duration (e.g., 2 min → 3 min → 5 min)
   - Increase total accumulated time at VO2max intensity per session
     (toward the 15–25 minute range, Part 2 Section 5.3)
   - Reduce recovery ratio between repetitions (toward 1:1)
   - Increase pace slightly as fitness improves (re-test, don't guess)
Regressions:
   - Shorten individual repetition duration
   - Reduce total repetition count
   - Lengthen recovery between repetitions (toward 2:1 or more)
   - Substitute with threshold intervals (Section 8) if the athlete
     isn't ready for full VO2max-zone demand
Recovery Cost: 5
```

---

## 11.0 Race Pace Workouts

```
Workout Name: Race Pace Workout
Purpose: Rehearse the exact intensity, and where possible the exact
         fueling/terrain/timing conditions, of the goal race itself —
         the purest expression of the specificity principle (Part 1,
         Section 6).
Physiology: Targets whichever physiological zone the goal race itself
            sits in — Zone 3–4 for marathon, Zone 4 for half marathon,
            Zone 4–5 for 10K, Zone 5 for 5K (Part 3) — making this
            workout's physiological target athlete- and event-specific
            rather than fixed.
Suitable Athletes: Development stage and above; becomes increasingly
            central to the training plan for all athletes as
            weeks_to_race decreases (Part 1, Rule 6.1).
When To Use: With increasing frequency as a goal race approaches —
            minimal early in a training cycle, central in the final
            6–8 weeks; always embedded within or alongside a long run
            for half-marathon/marathon specificity; standalone interval
            format acceptable for 5K/10K race-pace work.
When Not To Use: Far from a goal race, when general aerobic/threshold/
            VO2max development should take priority over narrow
            specificity (Part 1, Section 6); in the final 5–7 days
            before the race itself (replace with short, sharp
            race-pace "tune-up" strides instead — see Section 12).
Progressions:
   - Increase the proportion of the session run at race pace
   - For marathon athletes: extend race-pace long-run segments
     toward (but not all the way to) full race distance
   - Add race-specific fueling and, where possible, race-day timing
     and terrain rehearsal (Part 2, Section 8)
Regressions:
   - Reduce the proportion of the session run at race pace
   - Shorten race-pace segments while keeping the rest of the session
     easy
   - Move race-pace work earlier in a long run (when freshness is
     higher) rather than at the fatigued end, if pacing control is
     a current limiter
Recovery Cost: 3 (5K/10K race-pace intervals) to 4 (half/marathon
            race-pace long-run segments)
```

---

## 12.0 Strides

```
Workout Name: Strides
Purpose: Maintain neuromuscular sharpness, top-end speed, and running
         economy via a small, low-fatigue-cost dose of near-maximal
         effort (Part 2, Section 9; Part 3, Zone 6).
Physiology: Recruits Type II muscle fibres that are rarely reached
            during steady-state aerobic/threshold running; reinforces
            efficient stride mechanics and ground-contact patterns at
            high velocity, with documented carryover to submaximal
            running economy; the short duration (15–20 seconds) keeps
            glycogen and connective-tissue cost minimal despite the
            near-maximal intensity.
Suitable Athletes: All training_age_stages and goal_events — the most
            universally "default-on" quality session in this library
            alongside the easy run itself (Part 3, Rule 7.1).
When To Use: 2–3x per week, tacked onto the end of an easy run (after
            a thorough warm-up via the easy running itself), year-round,
            in every phase except the final 2–3 days before a goal race
            (where short, race-pace-specific strides may still be used
            as a neuromuscular "tune-up," but volume should be minimal).
When Not To Use: When an acute injury flag is active; for athletes with
            fewer than ~4 weeks of consistent easy running behind them
            (build a base of easy volume first); immediately before a
            hard quality session on the same day where the warm-up
            already serves this purpose.
Progressions:
   - Increase repetition count (e.g., 4 → 6 → 8)
   - Slightly increase per-repetition duration (toward 20–25 seconds,
     rarely beyond — strides are not meant to become a sprint-interval
     session)
   - Use a very slight downhill or flat, ideally firm surface for the
     best mechanical quality
Regressions:
   - Reduce repetition count
   - Reduce per-repetition duration (toward 10–15 seconds)
   - Use a less aggressive effort (95% rather than ~100% of max
     comfortable speed) for athletes new to this category
Recovery Cost: 1 (when dosed correctly — this is a defining feature
            of the workout, not an approximation)
```

---

## 13.0 The AI Workout Database — Compiled Lookup Table

This table compresses Sections 2–12 into the format the AI engine queries directly when Part 3's workout-selection logic (Part 3, Section 9) hands off a target zone and purpose.

| Workout | Primary Zone(s) | Recovery Cost | Min. Training Age Stage | Primary Events | Default Weekly Frequency |
|---|---|---|---|---|---|
| Easy Run | 1–2 | 1 | Foundation | All | Daily (default session) |
| Recovery Run | 1 | 1 | Foundation | All | 1–3x, situational |
| Long Run | 2 (+3–4 segments later-cycle) | 3–4 | Foundation | All | 1x weekly |
| Progression Run | 1–2 → 3–4 | 2–3 | Development | Half/Marathon | 0–1x weekly |
| Tempo Run (Continuous) | 4 | 3–4 | Development | 10K/Half/Marathon | 0–1x weekly |
| Cruise Intervals | 4 | 3–4 | Development | 10K/Half/Marathon | 0–1x weekly |
| Threshold Intervals (Longer) | 4 | 4 | Specialisation | Half/Marathon | 0–1x weekly |
| Hill Repeats | 5–6 | 3–4 | Foundation | All | 0–1x weekly |
| VO2 Max Intervals | 5 | 5 | Development | 5K/10K | 0–2x weekly (cap) |
| Race Pace Workout | Event-dependent (3–5) | 3–4 | Development | All (increasing near race) | 0–1x weekly, rising near race |
| Strides | 6 | 1 | Foundation | All | 2–3x weekly (default on) |

**AI Rule 13.1 — Database Query Pattern**
```
GIVEN: target_zone, weeks_to_race, training_age_stage, goal_event,
       recent_recovery_state

RETURN: the highest-specificity workout from Section 13's table that:
   1. matches target_zone
   2. has Min. Training Age Stage ≤ athlete's actual stage
   3. lists goal_event under Primary Events (or "All")
   4. has a Recovery Cost compatible with recent_recovery_state
      (per Part 1, Layer 3 gate)

IF no exact match exists, select the nearest lower-recovery-cost
workout in the same zone family and apply a Regression (per that
workout's "Regressions" field) rather than skipping the session type
entirely.
```

---

## 14.0 Chapter Summary — Carried Forward Into Later Parts

This library is the vocabulary that every remaining part of this knowledge base will speak in:

- **Part 5 (Periodisation)** will define which workouts dominate each phase (base, build, peak, taper, transition) and in what proportion.
- **Part 6 (Race-Specific Training)** will specify which workout variants and progressions are prioritised for 5K, 10K, half marathon, and marathon athletes specifically.
- **Part 7 (Biomechanics/Metrics)** will use Garmin running-dynamics data to sanity-check whether a prescribed workout is being executed at appropriate form/effort.
- **Part 8 and 9 (Injury Prevention/Management)** will reference each workout's Recovery Cost and Regressions fields directly when adjusting a plan around injury risk or active injury.
- **Part 11 (AI Coaching Decision Rules)** will tie this entire library together with the Part 1 decision hierarchy into the engine's final, numerically-specified rule set.

---


