# THE AI RUNNING COACH KNOWLEDGE BASE
## Part 6: Race-Specific Training

> **Continuity note:** This part assumes the principles established in Part 1 (Coaching Philosophy & Training Theory) — particularly the Five-Lever framework (Section 2.1) and the Specificity Principle (Section 6) and its general-to-specific continuum. Each event chapter below explains *why* its training looks different, not just *what* it looks like, so the AI engine can generalise correctly to athletes who don't fit a textbook profile. Periodisation mechanics (base/build/peak/taper) are referenced generically here and will be fully detailed in Part 5; this part focuses on what content fills those phases for each event.

---

## 0.0 Why Race-Specific Training Is Its Own Chapter

The Specificity Principle (Part 1, Section 6) established that the body adapts to the *precise* demands placed on it. Nowhere does this matter more than in choosing what an athlete should actually be training for. A 5000m runner and a marathoner can have identical lactate threshold paces and still need almost entirely different training programs, because **the percentage contribution of each energy system, the durability demands, the pacing/psychological skill required, and the optimal weekly structure are fundamentally different across race distances.**

The table below is the foundation the rest of this chapter builds on:

| Demand | 5K | 10K | Half Marathon | Marathon |
|---|---|---|---|---|
| Approx. race duration (sub-elite/recreational) | 18–28 min | 38–58 min | 1:25–2:10 | 3:00–4:30+ |
| Aerobic energy contribution | ~85–90% | ~95% | ~98–99% | ~99%+ |
| Anaerobic/VO2max contribution | Meaningful (10–15%) | Small but present | Minimal | Negligible |
| Primary limiter | VO2 max ceiling, speed, economy | Lactate threshold, VO2 max | Lactate threshold, durability | Glycogen/fuel, durability, aerobic volume |
| Glycogen depletion risk | Low | Low–moderate | Moderate | High (the defining limiter) |
| Musculoskeletal durability demand | Moderate (speed-related) | Moderate | High | Very high (cumulative eccentric load) |
| Pacing error tolerance | Low (race is short, errors compound fast) | Low–moderate | Moderate | Very low (errors are catastrophic — "the wall") |
| Typical weekly structure | 2 hard sessions + volume | 2 hard sessions + volume | 1–2 hard sessions + long run + volume | 1 hard session + 1 long run + volume |

This table is the basis for **AI Rule 0.1**, which should be checked before any other event-specific logic runs:

```
AI Rule 0.1 — Event Profile Lookup (master switch)
IF goal_race_distance is set
THEN load the corresponding energy-system weighting, primary limiter,
     and durability demand profile from the table above
     BEFORE generating or adjusting any training plan.

This profile determines which workout categories (Part 4) and which
periodisation emphasis (Part 5) the engine should prioritise — it is
the first branching decision in the entire system, upstream of zones,
workouts, and weekly structure.
```

---

## 1.0 5K Training

### 1.1 The Physiological Profile

The 5000m is the shortest distance in this knowledge base's scope and the one with the highest *relative* contribution from VO2 max and anaerobic capacity — typically cited at roughly 85–90% aerobic and 10–15% anaerobic for a well-trained athlete, compared to the marathon's near-100% aerobic profile. This single fact explains almost every difference between 5K training and marathon training: **5K runners need a true VO2 max ceiling and the speed reserve to close races hard, on top of an aerobic engine that is still the dominant overall contributor.**

Critically, *the aerobic engine is still the dominant overall contributor even in the 5K* — this is a common misconception worth correcting explicitly for an AI engine and for athletes themselves: 5K training is not "speed training with a bit of endurance," it is **endurance training with a meaningful, deliberately developed VO2 max and speed layer on top.** This is precisely the model used by the current generation of world-class 5000m runners.

### 1.2 What the Best in the World Actually Do

The contemporary elite 5K landscape (Jakob Ingebrigtsen, Grant Fisher, Josh Kerr, and peers) is unusually well-documented publicly, and three distinct but overlapping approaches are visible:

- **The Norwegian/double-threshold approach (Ingebrigtsen):** enormous low-intensity volume (commonly reported in the 110–120 mile/week range during base phase) built around frequent, precisely lactate-controlled threshold sessions — sometimes twice in a single day — with VO2 max and speed work layered in during the competitive phase. The model prioritises an extremely large, well-controlled aerobic/threshold base, with sharpening saved for close to racing.
- **The lower-volume, higher-individualisation approach (Grant Fisher under coach Mike Scannell):** publicly reported training volume for Fisher has been described as dramatically lower than typical elite mileage for his event (one account put it around 45 miles/week at the time of his indoor world records, though other reporting suggests notably higher peak mileage at different points in his career — the discrepancy itself is instructive). The common thread across reporting is that Fisher describes his training as "very data-driven," built on years of individually calibrated lactate and wearable data rather than a generic mileage target. The lesson for this knowledge base is explicit: **the exact mileage number matters far less than the degree of individual calibration behind it** — a theme that directly reinforces Part 1's Individualisation Principle.
- **The British middle-distance-leaning approach (Josh Kerr):** built more around moderate weekly volume (publicly reported around 65–70 miles per week during a regular season), six running days plus two strength sessions, without double sessions or lactate testing — and a heavier emphasis on short, sharp speed work (e.g., very short, fast repetitions with full recovery) reflecting his strength as a closer with a 1500m/mile background. This illustrates that **5K success can be approached from a "speed-down" direction (mile/1500m background sharpened with aerobic volume) just as validly as an "endurance-up" direction** — the AI engine should be able to recognise and support both archetypes rather than forcing every 5K-focused athlete into one mould.

**The unifying coaching principle across all three models:** regardless of mileage philosophy, the 5K is never trained as "all speed." Threshold and aerobic volume remain the structural foundation; what varies between elite approaches is volume, double-session use, and exactly how speed/VO2 work is layered on top — not whether an aerobic base is needed at all.

### 1.3 Training Characteristics for Recreational and Sub-Elite 5K Athletes

| Characteristic | Detail |
|---|---|
| **High threshold volume** | Threshold running (Part 3) builds the lactate-clearing capacity that lets a runner sustain near-VO2max efforts later in the race without blowing up; typically 1–2 threshold-type sessions per week through base/build. |
| **VO2 max emphasis (build/peak phases)** | Sessions in the 3–5 min interval range at ~95–100% of current 5K-effort pace become the signature 5K workout type as the race approaches; see Part 4 for specific VO2 interval prescriptions. |
| **Economy work** | Strides, short hill sprints, and light plyometric/strength work improve neuromuscular efficiency — disproportionately valuable for 5K because race pace sits close to an athlete's economy ceiling. |
| **Speed reserve** | A meaningful gap between mile-pace speed and 5K race pace gives a runner the ability to change gears and close a race; needs occasional true speed work even though the race itself is aerobically dominant. |
| **Moderate long run** | Still important for aerobic base, but the 5K long run does not need marathon-scale duration — typically 60–90 minutes is sufficient at this distance, with quality elsewhere doing more of the work. |

### 1.4 Common Mistakes (5K)

1. **Skipping the aerobic base** in favour of constant track intervals — produces fast but fragile fitness that plateaus or breaks down (overuse injury, burnout) within a season.
2. **Doing VO2 max work too early** in a training cycle, before threshold and aerobic base are established — high-intensity stimulus without a base to support it has poor adaptation-to-fatigue ratio (see Part 1, Section 3).
3. **Under-resting before VO2 max sessions** — because the 5K's anaerobic contribution is real but modest, VO2 max sessions still depend on adequate prior recovery to be run at the correct intensity; running them fatigued trains the wrong system.
4. **Racing too often** during build phase, treating every tune-up race as "just another workout" without managing the fatigue cost.

### 1.5 5K-Specific AI Coaching Rules

```
AI Rule 1.1 — 5K Phase Emphasis
IF goal_distance = 5K
THEN:
   base_phase    → aerobic volume + general strength + light strides
   build_phase   → threshold sessions (1–2/wk) + introduce VO2 intervals
   peak_phase    → VO2 max sessions at/near race pace + speed reserve work
   taper_phase   → sharp, short, low-volume speed touches; protect freshness

AI Rule 1.2 — Speed Reserve Check
IF athlete.mile_pace − athlete.5K_race_pace < threshold_gap (individualised)
THEN flag insufficient speed reserve; recommend periodic short speed
     sessions (e.g. 150–300m at faster-than-5K pace, full recovery)
     even outside of dedicated speed-focused blocks.
```

---

## 2.0 10K Training

### 2.1 The Physiological Profile

The 10000m sits almost entirely in aerobic territory (~95%+ aerobic contribution) but still rewards a strong VO2 max and a genuine lactate threshold ceiling, making it arguably **the most "balanced" distance in this knowledge base** — it punishes athletes who are purely aerobic-volume specialists (insufficient top-end speed to respond to race tactics) just as much as it punishes athletes who are purely speed specialists (insufficient aerobic durability to hold pace for 25–60+ minutes).

### 2.2 Training Characteristics

| Characteristic | Detail |
|---|---|
| **Threshold focus** | The single most important session category for 10K improvement; longer threshold intervals and longer continuous tempo efforts than a 5K-focused athlete would use, reflecting the longer sustained effort the race itself demands. |
| **Long aerobic development** | A bigger contribution from sustained aerobic volume than 5K training — long runs and overall weekly mileage matter more, because the race itself is a longer aerobic test even though pace is still fast. |
| **VO2 max, but lower priority than 5K** | Still present in build/peak phases (the closing speed and ability to respond to a pace change in the last 1–2km depend on it) but receives proportionally less total volume than in 5K-specific training. |
| **Race-pace-specific work** | Cruise intervals and race-pace tempo segments (Part 4) at actual 10K race effort become increasingly central as the race approaches — this is the clearest expression of the general-to-specific continuum (Part 1, Section 6.2) for this event. |

### 2.3 Common Mistakes (10K)

1. **Training it like a 5K** — over-prioritising short VO2 max intervals at the expense of the threshold and aerobic volume that actually decide 10K outcomes.
2. **Training it like a half marathon** — over-prioritising slow, very long runs at the expense of the genuine speed and threshold sharpness the 10K still rewards.
3. **Underestimating pacing discipline** — a 10K is long enough that early pacing errors compound badly, but short enough that the temptation to start too fast (chasing 5K-like adrenaline) is high. This is a coaching/psychological coaching point as much as a physiological one.

### 2.4 10K-Specific AI Coaching Rules

```
AI Rule 2.1 — 10K Phase Emphasis
IF goal_distance = 10K
THEN:
   base_phase    → aerobic volume build, larger than 5K-equivalent athlete
   build_phase   → threshold sessions (2/wk where tolerated) + long cruise intervals
   peak_phase    → race-pace tempo segments + reduced-volume VO2 touches
   taper_phase   → maintain frequency, sharply cut volume; 1 short race-pace touch

AI Rule 2.2 — Threshold:VO2 Ratio Check
IF athlete.goal_distance = 10K
   AND VO2_session_minutes_last_4wks > threshold_session_minutes_last_4wks
THEN flag imbalance — 10K training should be threshold-dominant,
     not VO2max-dominant, outside of a short late-peak sharpening window.
```

---

## 3.0 Half Marathon Training

### 3.1 The Physiological Profile

The half marathon marks the point in this knowledge base where VO2 max becomes almost irrelevant as a *trainable focus* (though it remains a ceiling set earlier in an athlete's development) and lactate threshold becomes the dominant determinant of performance, alongside a real but secondary fuel/glycogen consideration and a substantial durability demand from sustained time on feet at a hard, but not maximal, effort.

### 3.2 Training Characteristics

| Characteristic | Detail |
|---|---|
| **Threshold-heavy training** | The half marathon is frequently described by coaches as "the longest race you can still train predominantly at or near threshold for" — threshold sessions, often longer and more continuous than 10K-equivalent sessions, are the structural core of the build phase. |
| **Long run development** | Long runs grow meaningfully in both duration and the proportion run at faster-than-easy pace (e.g., progression long runs, or long runs with race-pace segments embedded) — this is where durability and race-specific fuelling/pacing are rehearsed. |
| **Reduced VO2 max emphasis** | VO2 max work becomes a minor, maintenance-level component rather than a central focus — typically a small amount retained through base/build mainly to preserve top-end speed and economy, not to drive race-day performance directly. |
| **Race-pace specificity** | As the race approaches, long runs and tempo sessions increasingly incorporate sustained blocks at actual goal half-marathon pace, rehearsing the precise muscular and metabolic demand of the race itself. |

### 3.3 Common Mistakes (Half Marathon)

1. **Treating it as "a long 10K"** — under-investing in the long run and durability work that the half marathon's extra distance specifically demands.
2. **Treating it as "a short marathon"** — over-investing in very long, slow runs and high overall volume at the expense of the threshold sharpness that actually drives half-marathon time more than marathon time.
3. **Going out too fast** — because half-marathon goal pace often feels deceptively comfortable in the first 5–8km, pacing discipline failures here are extremely common and are a leading cause of late-race blow-ups even in well-trained athletes.
4. **Neglecting fuelling practice** — at 1:15–2:00+ duration, in-race fuelling becomes relevant for many recreational athletes and is too often left untested until race day.

### 3.4 Half-Marathon-Specific AI Coaching Rules

```
AI Rule 3.1 — Half Marathon Phase Emphasis
IF goal_distance = Half Marathon
THEN:
   base_phase    → aerobic volume + long run duration build
   build_phase   → threshold sessions (longer/more continuous than 10K
                    equivalent) + progression long runs
   peak_phase    → race-pace blocks within long runs + tempo at goal pace
   taper_phase   → cut volume, retain 1 short race-pace touch, no new long runs

AI Rule 3.2 — Fuelling Rehearsal Trigger
IF goal_race_duration_estimate > 75 minutes
   AND weeks_to_race ≤ 6
THEN ensure at least 2 long runs include race-day fuelling rehearsal
     (carbohydrate intake matching the planned race strategy) before race day.
```

---

## 4.0 Marathon Training

### 4.1 The Physiological Profile

The marathon is the most aerobically dominant event in this knowledge base (commonly cited around 99%+ aerobic contribution) and the only one in which the primary limiter is frequently *not* cardiovascular fitness at all, but **glycogen availability and musculoskeletal durability** — "the wall" is, in the large majority of cases, a fuel-depletion and/or muscular-damage event, not a cardiovascular one. This reframes the entire training priority list relative to shorter events.

### 4.2 Training Characteristics

| Characteristic | Detail |
|---|---|
| **Aerobic volume as the foundation** | Overall weekly mileage matters more for marathon performance than for any shorter event in this knowledge base — it is the single best-supported predictor of marathon outcome among trainable variables, because it directly builds the fat-oxidation capacity, capillarisation, and glycogen-storage adaptations the race specifically demands. |
| **Long runs as the centrepiece** | The marathon long run is not just "more of the same" — it is a distinct training stimulus that teaches glycogen sparing, fat utilisation, and musculoskeletal durability under prolonged eccentric load in a way no other session can replicate. Long run duration/distance progression is the single most important periodisation variable for this event (fully detailed in Part 5). |
| **Marathon-pace specificity** | As the race approaches, training increasingly inserts sustained blocks at actual goal marathon pace — both within long runs (e.g., a long run finishing with a substantial marathon-pace segment) and as dedicated marathon-pace tempo sessions — rehearsing the exact metabolic and biomechanical demand of race day. |
| **De-emphasised VO2 max work** | VO2 max training contributes the least direct race-day value of any event in this knowledge base; it is typically retained at a low, maintenance level (general fitness, economy, injury-prevention variety) rather than developed as a race-deciding focus. |
| **Durability over speed** | Strength training, hill running, and downhill running tolerance work matter more for marathon outcomes than for any shorter event, because the cumulative eccentric loading of 26.2 miles is itself a primary determinant of whether an athlete can hold pace in the final 10km. |

### 4.3 What the Best in the World Actually Do

The dominant modern marathon training model (associated with the East African training groups that have produced the current generation of world-record-level marathoners, including Eliud Kipchoge's training environment) is built on a small number of structural pillars that generalise well to recreational athletes even though the absolute numbers do not:

- **Very high total weekly volume**, accumulated almost entirely at genuinely easy effort — the polarisation between "easy" and "hard" days is extreme, with easy days run conservatively enough to permit the volume, not as a watered-down version of moderate effort.
- **One clearly defined key session per week** (rather than several moderately hard days), most commonly either a long run with race-pace components or a dedicated marathon-pace/tempo session, surrounded by recovery.
- **Long runs that frequently include sustained marathon-pace or faster segments**, rather than being run as a single uniform easy effort — this is the clearest practical expression of race-pace specificity for this event.
- **A relatively narrow intensity distribution overall** — very little time spent at "moderate-hard" efforts that are neither truly easy nor genuinely race-specific, a pattern broadly consistent with the polarised/pyramidal training-distribution research discussed further in Part 3.

The generalisable lesson for recreational marathoners is not "run 120 miles per week" — it is: **maximise consistent, genuinely easy volume; concentrate hard training into one or two clearly purposeful key sessions per week; and make those key sessions explicitly marathon-pace-specific as the race approaches**, rather than spreading moderate-intensity effort across many days, which both blunts recovery and fails to be specific to any one of the five levers.

### 4.4 Common Mistakes (Marathon)

1. **Running easy days too hard** — the single most common error among recreational marathoners, directly undermining the volume-without-excess-fatigue strategy the entire training model depends on (see Part 1, Section 8.2).
2. **Insufficient long run distance/duration progression**, or progressing it too fast — the long run must be built conservatively (see Part 1's progressive overload guardrails) because its injury cost is higher than any other single session type at this distance.
3. **Never rehearsing marathon pace before race day** — leads to pacing miscalibration that is far more catastrophic in the marathon than in any shorter event, because there is no recovering from going out too fast once glycogen reserves are compromised.
4. **Neglecting strength/durability training**, treating the marathon as a purely aerobic-volume problem when musculoskeletal resilience is frequently the actual limiter for recreational athletes with 3:30+ marathon times.
5. **Under-fuelling in training and racing** — both chronic underfuelling relative to training load, and inadequate in-race carbohydrate intake relative to current sports-nutrition guidance (commonly 60–90g of carbohydrate per hour for races of marathon duration, individually tolerance-tested well before race day).

### 4.5 Marathon-Specific AI Coaching Rules

```
AI Rule 4.1 — Marathon Phase Emphasis
IF goal_distance = Marathon
THEN:
   base_phase    → maximise sustainable easy-volume growth (Part 1, Rule 4.1)
                    + begin strength/durability work early
   build_phase   → long run distance progression + 1 key session/week
                    (long run with race-pace segment, OR marathon-pace tempo)
   peak_phase    → longest race-pace-inclusive long run(s) completed;
                    marathon-pace tempo volume peaks
   taper_phase   → sharp volume reduction (Part 5), retain short race-pace
                    touches, no long runs beyond ~10–12 days from race day

AI Rule 4.2 — Easy Day Intensity Guard (marathon-specific weighting)
IF goal_distance = Marathon
   AND easy_run_avg_HR > athlete.easy_HR_ceiling for 2+ consecutive sessions
THEN flag with HIGHER priority than for shorter-event athletes —
     marathon training volume depends on easy-day discipline more than
     any other event in this knowledge base; intervene early.

AI Rule 4.3 — Long Run Progression Guardrail
new_long_run_distance ≤ prior_long_run_distance × 1.10
   AND new_long_run_distance ≤ 30–35% of that week's total volume
        (individualised ceiling; lower for training_age_stage = Foundation
         or Development — see Part 1, Section 9)

AI Rule 4.4 — Fuelling Rehearsal Trigger (marathon-specific, mandatory)
IF weeks_to_race ≤ 8
THEN at least 3 long runs ≥ 90 minutes MUST include race-day fuelling
     rehearsal at the athlete's planned in-race carbohydrate intake rate;
     flag as a required (not optional) milestone, not a suggestion —
     unlike Rule 3.2 for half marathon, where it is recommended but
     less universally race-deciding.
```

---

## 5.0 Cross-Event Synthesis: The Event-Specific Coaching Engine

The four chapters above can be compressed into a single decision structure that the AI engine should run whenever a goal race is set or changed. This is the practical "engine" this Part promised in its brief.

### 5.1 The Master Emphasis Matrix

| Phase → Event ↓ | Base | Build | Peak | Taper |
|---|---|---|---|---|
| **5K** | Aerobic volume, strength, light strides | Threshold + introduce VO2 | VO2 max + speed reserve | Short sharp speed touches |
| **10K** | Aerobic volume (larger than 5K) | Threshold-dominant + long cruise intervals | Race-pace tempo + reduced VO2 | 1 short race-pace touch |
| **Half Marathon** | Aerobic volume + long run build | Threshold (longer/continuous) + progression long runs | Race-pace blocks in long runs | 1 short race-pace touch, no new long runs |
| **Marathon** | Maximise easy volume + early strength work | Long run progression + 1 key session/wk | Race-pace long runs peak | Sharp volume cut, no long runs <10–12 days out |

### 5.2 The Master AI Rule for This Entire Part

```
AI Rule 5.1 — Event-Specific Override Priority
WHEN generating or adjusting a training plan:
   1. Identify goal_distance (5K, 10K, Half Marathon, Marathon)
   2. Load that event's energy-system weighting (Section 0.0 table)
   3. Load that event's current-phase emphasis (Section 5.1 matrix)
   4. Select workout categories from Part 4 that satisfy BOTH the
      event's primary limiter (Section 0.0) AND the current phase's
      emphasis (Section 5.1) — never one without the other.
   5. Apply event-specific guardrails (Sections 1.5, 2.4, 3.4, 4.5)
      as hard constraints, not suggestions.

This rule sits inside Layer 5 (Specificity Selection) of the master
decision hierarchy established in Part 1, Section 11, and should be
treated as that layer's primary implementation for any athlete with
a defined goal race.
```

### 5.3 Handling Athletes Without a Single Clear Goal Distance

Many recreational athletes train without a fixed goal race, or maintain fitness across multiple distances simultaneously. The AI engine should not force an artificial event-specific profile onto these athletes; instead:

```
AI Rule 5.2 — No-Goal-Race Default
IF athlete.goal_distance is unset OR athlete is in an off-season/maintenance period
THEN default to a 10K-equivalent balanced profile (Section 2) —
     it is the most physiologically "neutral" of the four event
     profiles and provides the broadest general fitness base from
     which any future goal race can be specialised toward, consistent
     with the general-to-specific continuum in Part 1, Section 6.2.
```

---

## 6.0 Chapter Summary — Carried Forward Into Later Parts

| Event | Primary limiter | Structural core | Where it connects forward |
|---|---|---|---|
| 5K | VO2 max ceiling + economy | Threshold base + VO2 max/speed layer | Part 3 (zones), Part 4 (VO2 interval library) |
| 10K | Threshold + balanced VO2 | Threshold-dominant, race-pace cruise intervals | Part 3, Part 4 |
| Half Marathon | Threshold + durability | Long, continuous threshold + progression long runs | Part 4, Part 5 (periodisation) |
| Marathon | Glycogen/fuel + durability | Easy volume + 1 key session/week + race-pace long runs | Part 5 (periodisation), Part 8/9 (injury & durability) |

---

