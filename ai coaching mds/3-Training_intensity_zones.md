# THE AI RUNNING COACH KNOWLEDGE BASE
## Part 3: Training Intensity Zones

> **Document purpose:** Part 2 established the eight physiological systems training acts on. Part 3 turns those systems into a practical, six-zone intensity model the AI engine can actually assign to a workout, a watch reading, or a pace recommendation. Each zone below follows the same template requested: Purpose, Benefits, When to Use, When Not to Use, Typical Workouts, Elite Examples, and Scientific Evidence — closing with the workout-selection logic that Part 4's full workout library will plug directly into.

---

## 1.0 The Zone Model Used in This Knowledge Base

There is no single universally agreed zone-numbering system in running (Daniels, Coggan/power-based cycling-derived models, British Triathlon's 5-zone model, and lactate-anchored 3-zone research models all number things slightly differently). To keep this knowledge base internally consistent and directly usable by an AI engine reading Garmin/Strava-style data, we use **six practical zones**, each anchored to the LT1/LT2 physiology from Part 2 rather than to arbitrary percentages of max heart rate alone:

| # | Zone Name | Physiological Anchor | Approx. %HRmax* | Approx. RPE (1–10) | Talk Test |
|---|---|---|---|---|---|
| 1 | **Recovery** | Well below LT1 | <70% | 1–2 | Full sentences, easy |
| 2 | **Easy / Aerobic** | At or just below LT1 | 70–80% | 3–4 | Full conversation |
| 3 | **Moderate / "Grey Zone"** | Between LT1 and LT2 | 80–87% | 5–6 | Broken sentences only |
| 4 | **Threshold** | At/near LT2 (MLSS) | 87–92% | 7 | A few words at a time |
| 5 | **VO2 Max** | 95–100%+ of VO2max velocity | 92–100% | 8–9 | Cannot speak |
| 6 | **Sprint / Neuromuscular** | Anaerobic, near-maximal speed | N/A (too short for HR to respond) | 9–10 | Cannot speak |

*%HRmax figures are population-level heuristics, not precise individual targets — see the caution in Section 1.1.

### 1.1 A Critical Caution for the AI Engine

Heart-rate-based zone formulas (220-minus-age, Karvonen, etc.) are **heuristics, not measurements**. The genuinely well-supported physiology is the *existence* of LT1 and LT2 as real, individually-located landmarks; the %HRmax numbers used to approximate them are a reasonable default for a new user with no test data, but should be **superseded by individual data the moment it's available** — lactate testing if accessible, but far more practically for a consumer app: the runner's own recent race performances, sustained effort heart-rate/pace relationships, and (where available) ventilatory-threshold-correlated wearable metrics.

**AI Rule 1.1 — Zone Personalisation Hierarchy**
```
PREFERRED ZONE-ANCHORING METHOD (use highest available):
   1. Recent race result at a known distance (most reliable — derive
      threshold pace via established race-time-to-threshold-pace
      relationships, e.g. Daniels-style VDOT tables)
   2. Sustained recent training data showing a clear pace/HR
      relationship at consistent effort
   3. Wearable-estimated lactate threshold HR/pace (if device provides it)
   4. Age-predicted %HRmax heuristic (last resort, new-user default only)

Re-calculate zone boundaries every 4–6 weeks as fitness changes —
never leave a runner training against stale zones from onboarding.
```

---

## 2.0 Zone 1 — Recovery

**Purpose:** Promote blood flow and active recovery between harder sessions without adding meaningful additional training stress.

**Benefits:** Speeds the clearance of metabolic by-products and muscle stiffness from prior hard sessions; maintains movement habit and aerobic stimulus on days the body needs rest more than load; lowest injury/illness risk of any zone, useful as a "floor" during heavy life-stress periods.

**When to use:** The day after a hard session (threshold, VO2max, or long run); during a taper; during return-to-running after illness or minor niggle; for very new runners building tolerance.

**When not to use:** As a primary fitness-building tool — Zone 1 alone, run exclusively, will not meaningfully raise aerobic capacity in an already-developed runner because the stimulus is too low to drive adaptation (Part 1, Section 4). Also avoid prescribing it as a "punishment" or compensatory response to a missed hard session — it serves a distinct physiological purpose, not a consolation role.

**Typical workouts:** 20–40 minute recovery jogs; recovery shakeout runs the day before a race; walk-run recovery sessions for returning/rehabbing athletes.

**Elite examples:** Elite distance runners commonly run true recovery jogs at paces that look astonishingly slow relative to their race pace (sometimes 2–3+ minutes/km slower than marathon pace) — a deliberate, disciplined choice, not a sign of low fitness. This pace discipline is itself one of the most consistently observed behaviours separating elite training logs from amateur ones.

**Scientific evidence:** The case for Zone 1 rests less on direct adaptation evidence and more on its role within intensity-distribution research (Section 8 below): every major training-distribution study of elite and well-trained endurance athletes finds the large majority of total volume sits at low intensity, with recovery-zone running forming part of that base.

---

## 3.0 Zone 2 — Easy / Aerobic

**Purpose:** Build the core aerobic engine described in Part 2, Section 2 — the single highest-volume, highest-total-impact zone in the entire training plan.

**Benefits:** Drives mitochondrial density and capillarisation gains; raises LT1; improves fat oxidation capacity (Part 2, Section 7); builds durability and tendon/bone tolerance gradually; the lowest injury-risk zone capable of producing real fitness gains, making it the safest place to absorb large training volume.

**When to use:** As the base of every single training week, for every event distance and every training-age stage, year-round — not just in "base phase." Long runs, the majority of daily mileage, and easy double-run additions all live here.

**When not to use:** When the athlete is specifically rehearsing race-pace specificity close to a goal race (Part 1, Section 6) — at that point, some Zone 2 volume should convert to race-pace-relevant work. Also avoid letting Zone 2 "drift" upward into Zone 3 (see Section 4's "grey zone" warning) — this is the single most common pacing error in recreational running.

**Typical workouts:** Daily easy runs; long runs (for most athletes, run entirely or almost entirely in Zone 2); easy doubles; recovery-to-easy progression runs.

**Elite examples:** Modern training-distribution research on elite distance runners — including a published case study of a 2021 Olympic long-distance runner — has found low-intensity volume (Zone 1–2 combined) commonly accounting for roughly **80–90%+ of total weekly training time**, even in athletes running 140+ km per week, with hard intensity concentrated into just one or two sessions.

**Scientific evidence:** This is the best-evidenced zone in the entire model. The foundational research programme on **polarized training intensity distribution**, led by physiologist Stephen Seiler and replicated across multiple endurance sports, consistently finds that elite athletes naturally gravitate toward an "80/20" pattern — roughly 80% low intensity, ~20% high intensity, with deliberately minimal time in the moderate "grey zone." A controlled trial in recreational runners directly comparing a polarized distribution (77% Zone 1 / 3% Zone 2 / 20% Zone 3) against a more moderate-heavy distribution found the polarized group produced larger improvements despite equal total training load — supporting the idea that *where* volume is spent matters as much as *how much* there is.

**AI Rule 3.1 — Zone 2 Volume Floor**
```
FOR ALL athletes, regardless of event or phase:
   easy-zone running (Zone 1 + Zone 2 combined) should represent
   ≥75–80% of total weekly training time, year-round.

IF athlete.training_age_stage = Foundation
   OR athlete.weekly_volume is in early development
THEN bias toward a pyramidal (not fully polarized) distribution —
     more Zone 3/threshold-adjacent volume relative to Zone 5 —
     since polarized extremes work best with an established base
     and 70+ km/week of volume; lower-volume/newer athletes generally
     respond better to a pyramidal shape (see Section 9).
```

---

## 4.0 Zone 3 — Moderate / "Grey Zone"

**Purpose:** This zone has the most unusual purpose of all six: **its primary value, for most runners most of the time, is to be deliberately avoided.** It sits between LT1 and LT2 — hard enough to accumulate real fatigue, but not hard enough to drive the threshold- or VO2max-specific adaptations that justify that fatigue cost.

**Benefits:** When used *intentionally and sparingly* — rather than as accidental pace drift — moderate-intensity work has a role in tempo-style sessions and marathon-pace-specific work for well-trained marathoners (where race pace itself often sits near the top of this zone), and in pyramidal training models for lower-volume or less experienced athletes who don't yet have the base to support a fully polarized 80/20 split.

**When to use:** Marathon-pace specific segments for marathon-focused athletes in the late build/peak phase (Part 5/6); tempo runs for athletes whose event-specific race pace genuinely sits in this intensity range; deliberately, as a *minority* component of a pyramidal intensity distribution for developing runners.

**When not to use:** As the default pace for "easy" runs — this is, by a wide margin, the most common and most damaging pacing error in recreational running, sometimes called "junk miles" or training in "no-man's land." Running easy days too hard accumulates real fatigue cost without the proportional adaptation benefit of true threshold or VO2max work, and it actively blunts recovery, degrading the quality of the *next* hard session (Part 1, Section 8).

**Typical workouts:** Marathon-pace long-run segments; broad "tempo" efforts for lower-volume runners; some forms of progression-run finishes.

**Elite examples:** Training-distribution studies of elite distance runners typically find Zone 3-equivalent ("moderate") training making up a strikingly *small* share of total volume — often single digits as a percentage of weekly time — precisely because elite athletes and their coaches are highly disciplined about avoiding accidental grey-zone drift on easy days.

**Scientific evidence:** The same body of polarized-training research described in Section 3 above is, from the opposite angle, the direct evidence base for *avoiding* Zone 3 as a default. The "grey zone" is sometimes explicitly named as such in the literature and coaching commentary precisely because it produces a worse fatigue-to-adaptation ratio than either of its neighbouring zones.

**AI Rule 4.1 — Grey Zone Detection and Correction**
```
IF an athlete's "easy run" pace/HR data consistently lands in Zone 3
   rather than Zone 1–2 (a very common watch-data pattern)
THEN flag this explicitly to the athlete and actively recommend
     slowing down — this is one of the highest-value, lowest-risk
     corrective interventions the AI engine can make, and should be
     surfaced proactively rather than waiting for the athlete to ask.
```

---

## 5.0 Zone 4 — Threshold

**Purpose:** Directly train LT2 (Part 2, Section 4) — raising the pace the athlete can sustain at maximal lactate steady state, which is the single highest-leverage system for 10K-through-marathon performance.

**Benefits:** Improves lactate clearance/buffering capacity; shifts the lactate curve rightward (faster pace at the same relative fatigue cost); directly trains the intensity zone that half-marathon and marathon racing actually occurs in or near; comparatively low injury risk relative to VO2max/sprint work because the intensity, while hard, doesn't involve maximal forces or velocities.

**When to use:** As the primary quality-session intensity for 10K, half marathon, and marathon-focused athletes, for the large majority of a training cycle; for 5K-focused athletes as a complementary (not primary) intensity.

**When not to use:** Early Foundation-stage training before an aerobic base exists (Part 1, Section 9); on consecutive days without adequate recovery spacing — threshold sessions, while lower-risk than VO2max work, still require real recovery and should not be stacked carelessly (see the double-threshold exception in Part 10).

**Typical workouts:** Continuous tempo runs (20–40+ minutes near LT2); cruise intervals (e.g., 4–6 x 1 mile at threshold pace with short jogged recovery); longer threshold intervals (e.g., 3 x 10–15 minutes); threshold segments embedded within long runs.

**Elite examples:** The modern Norwegian system built around Jakob Ingebrigtsen and the broader Scandinavian middle-distance group is built almost entirely around precisely lactate-controlled threshold work, frequently performed **twice in a single day** ("double threshold") to accumulate large volumes of time at this exact intensity while keeping each individual session's fatigue cost low — a structure made possible specifically because threshold intensity (unlike VO2max or sprint intensity) is low-risk enough to repeat within the same day.

**Scientific evidence:** A review of lactate-threshold concepts found LT1 and LT2 to be genuinely distinct landmarks, with training at intensities near but below LT2 producing dramatically less fatigue cost than training at or above it — the precise physiological basis for why threshold-zone training can be accumulated in higher volumes than VO2max training without compounding fatigue at the same rate. A 2022 systematic review of periodisation and intensity distribution in highly trained and elite distance runners across multiple training models (polarized, pyramidal, and threshold-emphasised) confirmed threshold-zone work as a consistent, evidence-supported component of elite programming, regardless of which broader distribution philosophy a coach favours.

**AI Rule 5.1 — Threshold Session Spacing**
```
DEFAULT: space threshold sessions ≥48h apart for most athletes.

EXCEPTION — Double Threshold:
IF athlete.training_age_stage ∈ {Specialisation, Performance}
   AND athlete.weekly_volume supports it (very high, established base)
   AND athlete has demonstrated strong recovery capacity historically
THEN same-day double-threshold sessions may be considered (Part 10),
     but only as an advanced, carefully monitored option — never a
     default recommendation for Foundation/Development-stage athletes.
```

---

## 6.0 Zone 5 — VO2 Max

**Purpose:** Directly train the ceiling of the aerobic system (Part 2, Section 5) via efforts at or near the velocity associated with VO2max.

**Benefits:** Raises the aerobic ceiling itself; improves the cardiovascular system's peak oxygen delivery capacity; carries strong carryover to 5K/10K race-specific fitness, where racing intensity sits close to this zone; provides a useful, time-efficient stimulus even for marathoners as a smaller maintenance dose.

**When to use:** As a primary quality-session intensity for 5K/10K-focused Specialisation/Performance-stage athletes; as a smaller, secondary stimulus for half-marathon/marathon athletes, particularly in earlier build phases; sparingly even for less experienced runners, once an aerobic base and some threshold exposure exist.

**When not to use:** For Foundation-stage athletes before an aerobic base is established; in high volume/frequency for marathon-focused athletes in peak/taper phase, where specificity should have shifted toward marathon pace (Part 1, Section 6; Part 6); when recovery indicators (Part 1, Section 8) suggest the athlete hasn't absorbed recent training load — VO2max work is the highest-risk "moderate-injury-risk" zone before sprint work itself.

**Typical workouts:** Classic VO2max intervals (e.g., 5–6 x 3 minutes hard with equal jog recovery; 4–5 x 1000m at current 5K-equivalent pace); shorter, faster reps accumulating 15–25 total minutes near VO2max intensity per session.

**Elite examples:** Case-study data on elite distance runners shows VO2max-zone (and above) work concentrated into roughly **one to two sessions per week** even at very high training volumes, often structured as intervals at or above ~90% of velocity at VO2max, deliberately kept to a small fraction of total weekly time despite its outsized training effect.

**Scientific evidence:** VO2max responds reliably to training at or near vVO2max intensity, but the broader polarized-training evidence base (Section 3/8) consistently shows this zone working best as a *small, concentrated* component (commonly the "20%" half of an 80/20 split, shared with other high-intensity work) rather than a high-volume staple — over-prescribing this zone is one of the more common ways well-meaning amateur plans produce stagnation or injury.

**AI Rule 6.1 — VO2 Max Session Frequency Cap**
```
DEFAULT CAP: no more than 1–2 VO2max-zone sessions per week,
             regardless of training_age_stage or event.

IF goal_event = Marathon AND weeks_to_race ≤ 6
THEN reduce VO2max frequency further in favour of marathon-pace
     specificity (Part 1, Section 6; Part 6) — this zone has the
     lowest specificity-relevance of any zone for marathon racing.
```

---

## 7.0 Zone 6 — Sprint / Neuromuscular

**Purpose:** Develop and maintain anaerobic power, neuromuscular coordination, and top-end speed (Part 2, Sections 3 and 9) — a small, protective, economy-supporting dose for every runner, and a directly performance-relevant one for shorter-distance specialists.

**Benefits:** Preserves Type II muscle fibre force capacity; improves running economy and finishing-kick capability; develops stride mechanics and ground-contact efficiency at high velocity, with some carryover to submaximal running form; very short duration per repetition keeps total metabolic/glycogen cost low even though intensity is maximal.

**When to use:** Year-round, in small doses, for every athlete regardless of event distance (strides, hill sprints); as a directly race-relevant, larger-dose stimulus for 1500m/mile-and-under specialists (outside the primary scope of this knowledge base but retained for completeness).

**When not to use:** When the athlete is fatigued, undertrained in general aerobic conditioning, or has an active lower-limb injury risk flag — maximal-velocity work carries the highest acute musculoskeletal injury risk of any zone in this model, specifically because of the high forces and high rates of force development involved, and should never be prescribed to an athlete who hasn't earned a basic strength/durability foundation (Part 8/9).

**Typical workouts:** Strides (4–8 x 15–20 seconds near-maximal, full recovery, after an easy run); hill sprints (6–10 x 8–12 seconds maximal effort uphill, full recovery); short, sharp neuromuscular "tune-up" sessions before racing.

**Elite examples:** Strides are a near-universal feature of elite distance-running training logs across eras and nationalities — typically appearing 2–4 times per week, usually tacked onto the end of an easy run, regardless of whether the athlete's primary event is 1500m or marathon — precisely because the dose required to capture the economy/neuromuscular benefit is small enough to be added without meaningfully increasing overall fatigue.

**Scientific evidence:** The case for strides and short sprint work rests primarily on the running-economy and fibre-recruitment evidence discussed in Part 2 (Sections 6 and 9) rather than on a distinct, separate research literature — it is best understood as a low-cost, low-risk way to access "muscle fibre and economy" benefits that pure aerobic and threshold training does not fully provide on its own.

**AI Rule 7.1 — Sprint/Neuromuscular Year-Round Inclusion**
```
FOR ALL athletes, ALL training_age_stages, ALL phases except taper week
   immediately pre-race and acute-injury periods:
   include strides (4–8 x 15–20s) 2–3x/week as a low-cost addition
   to existing easy runs — default ON, not something that needs to
   be specifically requested.

NEVER schedule sprint/neuromuscular work when:
   - an acute injury flag is active
   - the athlete reports significant general fatigue
   - the athlete has < 4 weeks of consistent easy running behind them
```

---

## 8.0 Intensity Distribution Models — Choosing the Right Shape

Section 1 introduced six zones; this section addresses the question an AI engine must answer every week: **what overall shape should the week's intensity take?** The research literature describes three recurring shapes:

| Model | Shape | Best Suited For | Evidence Summary |
|---|---|---|---|
| **Polarized** | ~80% Zone 1–2, minimal Zone 3, ~15–20% Zone 4–6 | High-volume (70+ km/week), experienced (2+ years structured training) athletes with strong recovery capacity | Strongest evidence base; consistently outperforms threshold-heavy models in controlled comparisons among trained/elite athletes |
| **Pyramidal** | Decreasing volume from Zone 1 → 2 → 3, with Zone 3/4 exceeding Zone 5–6 | Lower-volume, Foundation/Development-stage athletes; many marathon-focused build phases | Common in elite marathon training; appropriate where total volume or recovery capacity can't yet support a fully polarized split |
| **Threshold-heavy** | A large minority of volume concentrated at/near LT2, less at VO2max | Specific blocks within Norwegian-style systems (Part 10), particularly for half-marathon/marathon specificity | Evidence supports it as a legitimate, athlete-specific choice — not inferior to polarized, but more demanding to recover from and requiring a very high aerobic base first |

**AI Rule 8.1 — Distribution Model Selection**
```
DEFAULT MODEL by training_age_stage and volume:

IF weekly_volume < ~50km/week OR training_age_stage ∈ {Foundation, Development}
THEN use Pyramidal distribution

IF weekly_volume ≥ ~70km/week AND training_age_stage ∈ {Specialisation, Performance}
   AND recovery_capacity (Part 1, Section 7) is rated high
THEN Polarized or Threshold-heavy distribution both become viable —
     select based on goal_event (Threshold-heavy bias for Half/Marathon,
     Polarized bias for 5K/10K) and athlete preference/response history

ALWAYS: regardless of model chosen, Zone 3 ("grey zone") should remain
        a small minority of total volume — this constraint holds
        across all three models and is treated as non-negotiable
        (see Section 4).
```

---

## 9.0 Workout Selection Logic — Bridging to Part 4

This section is the direct hand-off to Part 4's workout library: given a target zone and a training purpose, which session *type* should the engine reach for first.

```
WORKOUT SELECTION LOGIC (used by Part 4's library lookup)

INPUT: target_zone, training_purpose, weeks_to_race, training_age_stage,
       recent_fatigue_state, goal_event

STEP 1 — Zone → Candidate Session Types
   Zone 1        → recovery jog, shakeout run
   Zone 2        → easy run, long run, easy double
   Zone 3        → marathon-pace segment, pyramidal tempo (only if
                    distribution model and event justify it — Section 8)
   Zone 4        → continuous tempo, cruise intervals, threshold intervals,
                    threshold segment within long run
   Zone 5        → VO2max intervals (short/long rep variants)
   Zone 6        → strides, hill sprints

STEP 2 — Filter by Layer 1–4 gates from Part 1's Decision Hierarchy
   (safety, consistency, recovery sufficiency, load progression)

STEP 3 — Filter by Specificity (Part 1, Section 6; Part 6 event chapters)
   Prefer session variants whose duration/structure most closely
   mirrors goal_event demands as weeks_to_race decreases.

STEP 4 — Select from Part 4's Workout Library
   Choose the specific named workout (e.g., "cruise intervals" vs.
   "continuous tempo" for a Zone 4 session) using the Part 4 entry's
   "Suitable Athletes," "When to Use," and "Progressions/Regressions"
   fields, matched against training_age_stage and recent training history.
```

---

## 10.0 Chapter Summary — Carried Forward Into Later Parts

| Zone | One-line role | Default weekly share | Where it gets used next |
|---|---|---|---|
| 1 — Recovery | Active recovery, never a fitness tool alone | Small, situational | Part 5 (taper), Part 9 (return-to-run) |
| 2 — Easy/Aerobic | The engine of the entire plan | ~70–85% combined w/ Zone 1 | Part 4 (easy/long runs), Part 5 (base phase) |
| 3 — Grey Zone | Mostly to be avoided; intentional only in pyramidal/marathon-pace contexts | Small minority always | Part 4 (marathon-pace segments), Part 6 |
| 4 — Threshold | Highest-leverage zone for 10K–Marathon | ~10–15% (more in threshold-heavy models) | Part 4 (tempo/cruise/threshold intervals), Part 10 (Norwegian method) |
| 5 — VO2 Max | Highest-leverage zone for 5K/10K; capped frequency | ~5–10% | Part 4 (VO2max intervals), Part 6 |
| 6 — Sprint | Small, protective, year-round | Minimal but constant | Part 4 (strides/hill sprints), Part 8 (injury prevention) |

---

