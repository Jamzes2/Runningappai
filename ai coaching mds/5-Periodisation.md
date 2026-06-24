# THE AI RUNNING COACH KNOWLEDGE BASE
## Part 5: Periodisation

> **Document purpose:** Parts 1–4 gave the AI engine a philosophy, a physiological model, an intensity-zone framework, and a workout library. Part 5 answers the question those parts can't answer alone: *in what order, and in what proportion, should all of this be deployed across a training cycle?* This is periodisation — the architecture that turns a list of good workouts into a coherent plan that peaks at the right moment. Each phase below covers Goals, Mileage Progression, Workout Priorities, and Common Mistakes, closing with the training-plan generation rules the AI engine will use directly.

---

## 1.0 Why Periodisation Exists

Part 1 established that fitness is built through cycles of stress and adaptation, and that specificity should shift from general to specific as a goal race approaches. Periodisation is simply the formal scheduling discipline that applies both ideas across months rather than days. Without it, an AI engine (or a human, for that matter) tends to make one of two errors: doing too much specific/race-pace work too early (burning out the adaptation before it's needed) or never narrowing toward race specificity at all (arriving fit in general terms but undercooked for the actual demands of the race).

This knowledge base uses a **five-phase linear periodisation model** (Base → Build → Peak → Taper → Transition) as the default structure, while explicitly supporting the **block periodisation** variants used in some elite systems (Part 10) where appropriate for advanced athletes.

```
PHASE FLOW (typical marathon/half-marathon cycle, ~16-24 weeks)

[Transition] → [Base] → [Build] → [Peak] → [Taper] → RACE → [Transition]
   (prior        (largest          (narrows        (sharpens
    cycle)        single phase)    toward race)     and rests)
```

---

## 2.0 Base Phase

### 2.1 Goals

The base phase exists to build the largest, most durable aerobic engine the athlete's training age and time horizon allow, before any race-specific intensity is layered on top. Concretely, the goals are:

1. Establish or rebuild a high floor of consistent weekly volume (Part 1, Section 5 — consistency principle)
2. Develop LT1 and general aerobic capacity (Part 2, Section 2)
3. Build musculoskeletal durability — tendons, bone, connective tissue — to tolerate the higher-intensity load coming later (Part 8)
4. Establish a year-round strength and neuromuscular foundation (strides, hill repeats, light strength work) so it doesn't need to be built from zero later
5. For Foundation/Development-stage athletes: this is often the *most important* phase of the entire cycle, because nearly everything later depends on it

### 2.2 Mileage Progression

```
BASE PHASE VOLUME PROGRESSION

- Apply Part 1's progressive overload guardrail (≤5–10% rolling
  4-week average increase, conservative end for Foundation/Development
  stage or returning athletes)
- Schedule a down week (70–85% of preceding week's volume) every
  3–4 weeks, non-negotiably, regardless of how the athlete feels
- Base phase is typically the LONGEST phase in the cycle for
  Foundation/Development athletes (8–16+ weeks), and can be
  considerably shorter (4–6 weeks) for Specialisation/Performance-stage
  athletes who already carry a high year-round volume base
- Target: by the end of base phase, the athlete should be at or near
  the highest sustainable weekly volume they will carry into Build —
  Build phase is for adding intensity on top of volume, not for
  continuing to chase large volume increases simultaneously
  (Part 1, Section 4 — overload dimensions should not all be
  progressed at once)
```

### 2.3 Workout Priorities

Per Part 3's intensity-distribution guidance, base phase should sit toward the **pyramidal-to-polarized** end of the spectrum, with the explicit majority of volume in Zone 1–2:

| Priority | Workout (from Part 4) | Approx. Share of Quality Volume |
|---|---|---|
| 1 | Easy Runs | Majority of all running |
| 2 | Long Runs (fully easy-paced, no embedded segments yet) | Weekly anchor |
| 3 | Strides | 2–3x/week, default-on |
| 4 | Hill Repeats (moderate, strength-focused) | 1x/week or biweekly |
| 5 | Light, introductory threshold exposure (short tempo or progression runs) | Sparingly, especially toward the end of base phase as a bridge to Build |

### 2.4 Common Mistakes

- **Introducing VO2max or race-pace work too early**, before the aerobic base and durability foundation exist — this is the single most common cause of early-cycle injury and burnout.
- **Increasing volume too aggressively** because "it's just easy running, how risky can it be" — easy pace does not eliminate overuse injury risk if total load rises too fast (Part 1, Section 4).
- **Skipping strength and neuromuscular work** because it doesn't feel like "real" training — this is exactly the foundation that prevents injury once intensity increases in Build phase (Part 8).
- **Treating base phase as optional** for already-fit Specialisation/Performance athletes — even highly trained athletes benefit from a compressed base block to refresh durability and aerobic capacity before each new build cycle.

**AI Rule 2.1 — Base Phase Gate to Build**
```
IF athlete is in Base phase
THEN do not introduce VO2max-zone work (Part 3, Zone 5) or
     race-pace-specific work (Part 4, Section 11) regardless of
     athlete requests, UNLESS:
        - athlete.training_age_stage ∈ {Specialisation, Performance}
        - AND athlete has demonstrated ≥4 consecutive weeks of
          consistent volume at or near target base-phase mileage
        - AND no active injury/fatigue flags are present
     In that case, light, low-volume exposure may bridge toward Build.
```

---

## 3.0 Build Phase

### 3.1 Goals

The build phase is where specificity (Part 1, Section 6) begins to narrow meaningfully. Goals:

1. Develop LT2/threshold capacity as the primary quality-session focus for 10K–marathon athletes (Part 2, Section 4)
2. Develop VO2max capacity as the primary focus for 5K/10K-focused athletes (Part 2, Section 5)
3. Begin introducing race-pace-relevant segments, increasing in proportion as the phase progresses
4. Maintain (not aggressively increase) the volume base established in Base phase, redirecting marginal training stress toward intensity rather than further volume increases

### 3.2 Mileage Progression

```
BUILD PHASE VOLUME PROGRESSION

- Total volume should plateau near its Base-phase peak, with small
  (if any) further increases — the overload dimension being
  progressed now is intensity and session density, not raw volume
  (Part 1, Section 4)
- Continue the down-week cadence every 3–4 weeks; down weeks in
  Build phase should reduce BOTH volume and intensity, since this
  is the phase where fatigue accumulates fastest
- Typical duration: 6–10 weeks, depending on goal_event and overall
  cycle length
```

### 3.3 Workout Priorities

| Priority | Workout (from Part 4) | Notes |
|---|---|---|
| 1 | Easy Runs | Still the volume majority — Build does not abandon Zone 2 |
| 2 | Tempo Runs / Cruise Intervals (10K–Marathon focus) or VO2 Max Intervals (5K/10K focus) | Primary quality session, 1–2x/week |
| 3 | Long Runs with embedded threshold or marathon-pace segments | Begin introducing specificity within the long run |
| 4 | Hill Repeats / Strides | Continue at base-phase frequency — these don't get phased out |
| 5 | Threshold Intervals (longer reps) | Introduced for Specialisation/Performance athletes ready for higher demand |

### 3.4 Common Mistakes

- **Increasing volume and intensity simultaneously** — this is the most common way otherwise well-built plans produce overreaching or injury, because it violates Part 1's "progress one overload dimension at a time" guidance.
- **Letting every easy run creep toward Zone 3** because the athlete is now fitter and "Zone 2 feels too slow" — the grey-zone warning from Part 3 applies with extra force during Build, when total fatigue is already rising.
- **Stacking two maximal-effort sessions too close together** without respecting Part 4's Recovery Cost field and Part 1's Layer 3 recovery-sufficiency gate.
- **Abandoning strength/neuromuscular maintenance work** in favour of "more important" intensity sessions — durability work earns its keep precisely when training stress is highest.

**AI Rule 3.1 — Build Phase Single-Dimension Progression**
```
IF athlete is in Build phase
THEN only ONE of {volume, intensity, density} may be meaningfully
     progressed within any given 1–2 week window.
     Default during Build: intensity and density progress; volume holds.
```

---

## 4.0 Peak Phase

### 4.1 Goals

The peak phase is the shortest, highest-specificity phase before tapering begins. Goals:

1. Maximise race-specific fitness via the highest-specificity workouts in the library (Part 4, Section 11 — Race Pace Workouts)
2. Sharpen neuromuscular readiness without accumulating further fundamental fitness (that work is largely done by this point — Peak refines, it doesn't build from scratch)
3. Rehearse race-day logistics: fueling (Part 2, Section 8), pacing, gear, and — where feasible — race-morning timing and terrain
4. Begin the controlled fatigue reduction that bridges into the formal taper

### 4.2 Mileage Progression

```
PEAK PHASE VOLUME PROGRESSION

- Volume should be at or slightly below its Build-phase peak —
  this is not the phase to chase a lifetime-high mileage week
- Typical duration: 2–4 weeks, immediately preceding the taper
- The single highest-specificity, highest-intensity long run or
  key session of the entire cycle typically falls in this phase,
  not in Build — but it should be followed by extra recovery
  emphasis given its demand
```

### 4.3 Workout Priorities

| Priority | Workout (from Part 4) | Notes |
|---|---|---|
| 1 | Race Pace Workouts | Now the dominant quality-session type, per Part 1's specificity-scaling rule |
| 2 | Easy Runs | Still the volume majority, but total volume is gently declining |
| 3 | Short, sharp VO2max or threshold "tune-up" sessions (5K/10K) | Lower volume, maintained intensity — sharpening, not building |
| 4 | Strides | Continue at base-phase frequency through to race week |

### 4.4 Common Mistakes

- **Trying to "fix" perceived fitness gaps with a heroic, oversized session** in peak phase — by this point, large new fitness gains are unrealistic in the remaining time, and the injury/fatigue risk of an outsized session far outweighs any plausible benefit.
- **Neglecting fueling and logistics rehearsal** in favour of pure physical training — for marathon/half-marathon athletes especially, this phase is when these dress-rehearsal details matter most.
- **Failing to bridge fatigue down before the taper begins** — peak phase should already be trending toward lower net fatigue, not handing the taper a peak-fatigue state to dig out of in two weeks.

**AI Rule 4.1 — Peak Phase Specificity Ceiling**
```
IF athlete is in Peak phase
THEN do not introduce any NEW workout type not already used
     successfully in Build phase — Peak phase increases the
     proportion and specificity of proven workouts; it does not
     experiment with novel session types this close to the race.
```

---

## 5.0 Taper Phase

### 5.1 Goals

The taper exists to let accumulated fatigue dissipate (which decays quickly, per the Banister model in Part 1, Section 3) while preserving the fitness built over the preceding months (which decays slowly), revealing peak readiness on race day. This is the most rigorously researched phase in this entire knowledge base — taper design has been the subject of direct meta-analysis in a way base/build phase design has not.

### 5.2 Mileage Progression — Evidence-Based Defaults

A landmark meta-analysis of taper research (Bosquet et al., 2007, screening 182 studies down to 27 that met inclusion criteria) found that the optimal taper:

- **Reduces training volume by 41–60%** from peak, with reductions below this range producing significantly smaller performance benefits
- **Maintains training intensity** — the taper is a volume reduction, not an intensity reduction
- **Maintains training frequency** (number of sessions per week) — cutting session count rather than session length is a common and avoidable error
- **Lasts approximately 2 weeks**, with the broader literature (including more recent systematic reviews) supporting an effective range of roughly **8–14 days up to 3 weeks**, and volume reduced progressively (exponentially) rather than as a single abrupt drop

A large observational study analysing taper behaviour across more than 158,000 recreational marathon runners' actual training data found that **longer (up to 3-week), more disciplined ("strict") tapers — where volume decreases progressively rather than haphazardly — were associated with meaningfully better marathon performance** than shorter or less disciplined tapers, reinforcing the controlled-trial literature with real-world behavioural data at a very large scale.

```
TAPER PHASE VOLUME PROGRESSION (default 2–3 week model)

Week -3 (if using a 3-week taper): ~75-85% of peak volume
Week -2: ~60-75% of peak volume
Week -1 (race week): ~40-59% of peak volume

- Reduce volume primarily by SHORTENING individual runs, not by
  removing running days (maintain frequency per the evidence above)
- Maintain session intensity — quality sessions stay sharp and fast,
  just shorter and less frequent in total accumulated hard-intensity volume
- The expected performance benefit from a well-executed taper is
  commonly cited around a 2-3% improvement versus continuing to train
  hard into race week — a meaningful margin at any competitive level
```

### 5.3 Workout Priorities

| Priority | Workout (from Part 4) | Notes |
|---|---|---|
| 1 | Easy Runs (shortened) | The volume majority remains easy, just less of it |
| 2 | Race Pace "tune-up" segments (short) | E.g., 3–5 x short repeats at goal pace, 6–9 days out — sharpens without fatiguing |
| 3 | Strides | Continue right up to 2–3 days before the race — critical for neuromuscular readiness |
| 4 | Recovery Runs | Increasing share of total running as race day nears |

### 5.4 Common Mistakes

- **Cutting volume too little** — the meta-analytic evidence is unusually clear that under-tapering (less than ~41% volume reduction) produces measurably smaller benefit than tapering properly; the instinct to "hold onto fitness" by training through is empirically counterproductive.
- **Cutting intensity instead of volume** — going slower and shorter rather than shorter-but-still-sharp blunts the neuromuscular readiness the taper is supposed to preserve.
- **Dropping training days entirely** rather than shortening them — frequency maintenance is one of the more consistent findings across the taper literature.
- **Panic-training in the final week** because "heavy legs" or unfamiliar fatigue during taper feels alarming — this sensation is a well-documented, expected by-product of glycogen supercompensation and ongoing tissue repair, not a sign of lost fitness, and athletes should be reassured rather than encouraged to compensate with extra work.
- **Tapering too long** — beyond roughly 3 weeks, detraining effects (loss of VO2max and fitness markers) begin to outweigh the recovery benefit; the taper window has both a floor and a ceiling.

**AI Rule 5.1 — Taper Phase Auto-Configuration**
```
ON entering Taper phase (triggered automatically at weeks_to_race ≤ 2-3,
   scaled by goal_event — shorter taper for 5K/10K, longer for marathon):

   target_volume_reduction = 41-60% of peak Build/Peak phase volume,
                               applied progressively across the taper window
   intensity_modifier = unchanged (maintain quality-session pace)
   frequency_modifier = unchanged (maintain session count; shorten duration)

   IF athlete reports unusual heaviness/fatigue during taper
   THEN reassure (this is expected — supercompensation/repair, not
        lost fitness) rather than reactively adding training volume.

   HARD CEILING: do not extend taper beyond ~3 weeks even if requested —
   flag the detraining risk and recommend reverting toward light Build/Peak
   intensity if the race date moves further out than that.
```

---

## 6.0 Transition Phase

### 6.1 Goals

The transition phase (sometimes called the "off-season" or "recovery phase") is the most commonly skipped phase in recreational training plans — and one of the most important for long-term athlete development (Part 1, Section 9). Goals:

1. Allow complete physical and psychological recovery from the just-completed race and training cycle
2. Address any minor niggles or imbalances accumulated during the cycle before they become genuine injuries (Part 8/9)
3. Reset motivation and enjoyment of running, protecting against burnout over a multi-year horizon
4. Maintain a minimal aerobic floor so the next Base phase isn't starting from zero, without any structured intensity or pressure

### 6.2 Mileage Progression

```
TRANSITION PHASE VOLUME PROGRESSION

- Typical duration: 1-3 weeks for shorter-distance race cycles (5K/10K),
  2-4 weeks after a marathon, scaled to the athlete's subjective and
  physical recovery state rather than a fixed calendar rule
- Volume: substantially reduced (often 30-50% of recent peak or lower),
  unstructured, and athlete-led rather than plan-led
- No quality sessions of any kind — this phase is intentionally
  unstructured; cross-training, other sports, or complete rest from
  running are all appropriate
```

### 6.3 Workout Priorities

There is deliberately no workout-priority table for this phase — that is the point. The only "workout" prescribed here is the absence of structured prescription.

### 6.4 Common Mistakes

- **Skipping this phase entirely** and moving straight from race recovery into the next cycle's Base phase — this is one of the more common drivers of accumulated injury risk and motivational burnout across a multi-year LTAD horizon (Part 1, Section 9).
- **Treating transition as an excuse for complete inactivity with no plan to resume** — the goal is recovery and reset, not loss of the habit and base built over the prior cycle.
- **Letting an athlete's eagerness to "start training again" override genuine recovery needs** — an AI engine should hold this boundary even when an enthusiastic athlete pushes against it, similar to how Part 1, Section 5 frames consistency protection as sometimes requiring the engine to be more conservative than the athlete wants.

**AI Rule 6.1 — Mandatory Transition Phase**
```
AFTER any goal race (regardless of outcome):
   AUTOMATICALLY schedule a transition phase:
      - 1-2 weeks minimum for 5K/10K races
      - 2-4 weeks minimum for half marathon
      - 2-4+ weeks minimum for marathon (scaled to race intensity/effort
        and any reported soreness, illness, or injury signals)

   During this window:
      - do not schedule any quality session (Zone 3+) regardless of
        athlete requests, unless explicitly overridden with a clear
        acknowledgment of the trade-off
      - actively check in on injury/illness signals before resuming
        structured Base-phase training
```

---

## 7.0 Training Plan Generation Rules — Full Cycle Synthesis

This section is the direct output requested for this chapter: the rules the AI engine uses to actually lay out a full training cycle from a goal race and date backward.

```
TRAINING PLAN GENERATION ALGORITHM (high-level)

INPUT: goal_event, goal_race_date, current_date, athlete profile
       (training_age_stage, current_volume, injury_history, recovery_capacity)

STEP 1 — Determine total_weeks_available = goal_race_date - current_date

STEP 2 — Reserve fixed-length phases from the END of the timeline backward:
   Taper:      2-3 weeks (scaled by goal_event, per Section 5)
   Peak:       2-4 weeks (per Section 4)
   Transition: NOT scheduled yet (occurs AFTER the race — Section 6)

STEP 3 — Allocate the REMAINING weeks between Base and Build:
   IF total_weeks_available is short (<12 weeks):
      heavily favour Base phase if athlete lacks recent consistent
      training; heavily favour Build phase (shorter Base) if athlete
      already carries a recent aerobic foundation
   IF total_weeks_available is generous (16-24+ weeks):
      Foundation/Development-stage athletes: Base phase should occupy
        the majority of available time
      Specialisation/Performance-stage athletes: a more even Base/Build
        split, or even multiple Base-Build "waves" (block periodisation,
        see Part 10) within the available window

STEP 4 — Within each phase, apply that phase's:
   - mileage progression rules (Sections 2.2, 3.2, 4.2, 5.2)
   - workout priority table (Sections 2.3, 3.3, 4.3, 5.3)
   - Part 1's universal gates (safety, consistency, recovery, load
     progression) on every individual week as it's generated —
     phase-level planning sets the DEFAULT, but week-to-week reality
     (Part 1's Layer 1-4 gates) can and should override the default
     plan dynamically

STEP 5 — Schedule the Transition phase automatically upon race completion
   (Section 6.1), before any new cycle planning begins.

STEP 6 — Re-run this entire algorithm for each new goal race the athlete
   sets, rather than extending a single static plan indefinitely.
```

---

## 8.0 Chapter Summary — Carried Forward Into Later Parts

| Phase | One-line role | Typical Duration | Where it gets used next |
|---|---|---|---|
| Base | Build the largest durable aerobic engine before adding intensity | 8-16+ weeks (Foundation/Dev), 4-6 weeks (Spec/Perf) | Part 6 (event-specific base emphasis), Part 8 |
| Build | Narrow toward LT2/VO2max specificity; hold volume, add intensity | 6-10 weeks | Part 6, Part 10 |
| Peak | Maximise race-specific sharpening; no new workout types | 2-4 weeks | Part 6 |
| Taper | Shed fatigue, preserve fitness — evidence-backed 41-60% volume cut over ~2-3 weeks | 2-3 weeks | Part 11 (decision rules) |
| Transition | Mandatory recovery and reset; protects multi-year LTAD trajectory | 1-4+ weeks (event-scaled) | Part 1 (LTAD), Part 9 (injury) |

---

