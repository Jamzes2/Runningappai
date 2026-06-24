# THE AI RUNNING COACH KNOWLEDGE BASE
## Part 7: Running Economy and Biomechanics

> **Continuity note:** This part operationalises the "running economy" lever from Part 1's Five-Lever framework (Section 2.1) and gives the AI engine a concrete way to interpret the running-dynamics data that Garmin and most modern running watches already collect: cadence, ground contact time (GCT), vertical oscillation (VO), stride length, and running power. This is one of the highest-leverage chapters in the entire knowledge base for your app specifically, because this data is already sitting in every synced activity file — the gap is interpretation, not collection.

---

## 0.0 The First and Most Important Rule of This Entire Chapter

Before any metric-specific guidance below, one principle must govern everything else: **biomechanical metrics are diagnostic signals, not targets.** No runner has ever run faster purely by lowering a vertical oscillation number on a screen. These metrics are useful exactly to the extent that they reveal an underlying mechanical pattern — usually overstriding, poor fatigue resistance, or asymmetry — that is worth addressing for its own sake. An AI engine that tells a runner to "increase cadence to 180" without understanding why is committing the single most common error in this entire space: **optimising the proxy instead of the underlying mechanism.**

```
AI Rule 0.1 — Metric-as-Proxy Guardrail (applies to every rule in this Part)
NEVER prescribe a target number for cadence, GCT, vertical oscillation,
stride length, or power in isolation.
ALWAYS frame guidance around the underlying mechanical pattern
(e.g. overstriding, fatigue-driven form breakdown, asymmetry)
that the metric is evidence for.
IF an athlete's metrics fall outside typical ranges but they are
   uninjured, improving, and have normal economy trends
THEN do not intervene — see Section 6 (When Not to Intervene).
```

A second foundational caveat applies to every range given below: **every one of these metrics is heavily pace-dependent.** Cadence rises, ground contact time shortens, and vertical oscillation typically falls as pace increases. Comparing an athlete's easy-run metric to a "race pace" benchmark number is a category error the AI engine must never make — all comparisons must be pace-matched or effort-matched, ideally using the athlete's own historical data at a similar pace as the primary baseline, with population ranges used only as a secondary sanity check.

---

## 1.0 Cadence (Step Rate)

### 1.1 What It Means

Cadence is the number of steps taken per minute (some devices report strides per minute — one stride equals two steps, so always confirm units before applying any rule). It is mechanically linked to stride length for a given pace: `pace = cadence × stride length` (in equivalent units), meaning a runner can hit the same pace with a high-cadence/short-stride combination or a low-cadence/long-stride combination — but these two strategies have very different injury and economy implications.

### 1.2 Typical and Elite Ranges

| Population | Typical cadence (steps/min) | Notes |
|---|---|---|
| Recreational runners, easy pace | ~150–170 | Wide individual variation; height and leg length matter |
| Recreational runners, faster paces | ~165–180 | Rises naturally with pace for most runners |
| Elite distance runners, race pace | Often cited around 180+ | Research shows a *trend* toward higher elite cadence at matched paces, though results across studies are mixed |

The often-repeated "180 steps per minute" target popularised in running media is **not a validated universal optimum** — it originated from informal observation of elite track athletes, not a controlled study establishing it as ideal for all runners at all paces. The AI engine should never apply 180 as a fixed target.

### 1.3 What the Research Actually Shows

The most actionable, well-supported finding in this entire area comes from cadence-manipulation injury research: increasing a runner's *self-selected* cadence by roughly 5–10% reduces impact loading at the hip and knee and is associated with reduced injury-relevant biomechanical loading, without requiring the runner to hit any specific absolute number. Increases beyond about 10% of self-selected cadence are not well-supported by the evidence and may increase metabolic cost (i.e., make the runner less efficient) by pushing them away from their natural, economy-optimised rhythm.

### 1.4 When to Intervene

- Athlete has a history of overuse injury (especially patellofemoral pain, tibial stress injury) **and** shows a *low* cadence relative to their own pace-matched history, suggesting overstriding.
- Athlete or coach has directly observed overstriding (foot landing well ahead of the centre of mass) — cadence work is one of the most evidence-supported corrective tools for this specific pattern.
- Cadence drops sharply and progressively within a single long run or hard session (a fatigue signal — see Section 5).

### 1.5 When Not to Intervene

- Athlete sits outside "typical" ranges but is uninjured, improving, and shows no overstriding pattern — cadence has large individual variation tied to leg length, limb proportions, and natural rhythm, and is not inherently a problem.
- Athlete is early in a training cycle or recovering from injury — introducing a cadence change is itself a novel biomechanical and metabolic stimulus, and should not be layered on top of other significant training changes (see Part 1, Section 4.2 on overload dimensions).

### 1.6 AI Rules — Cadence

```
AI Rule 1.1 — Cadence Change Magnitude Guardrail
IF prescribing a cadence adjustment
THEN target_cadence = current_self_selected_cadence × 1.05 to 1.10
     (never prescribe an absolute fixed number divorced from the
      athlete's own baseline; never exceed +10%)

AI Rule 1.2 — Overstriding Inference
IF pace-matched cadence is in the bottom quartile of the athlete's
   own historical distribution
   AND GCT is elevated relative to pace-matched history (Section 2)
   AND injury_history includes overuse patterns consistent with
      overstriding (patellofemoral, tibial stress — see Part 9)
THEN flag probable overstriding and recommend a gradual cadence
     increase using short-duration cues (e.g. metronome strides
     during warm-up) rather than a sustained whole-run change.
```

---

## 2.0 Ground Contact Time (GCT)

### 2.1 What It Means

GCT is the duration, in milliseconds, that a foot remains in contact with the ground during each stance phase. Shorter GCT generally reflects a stiffer, more elastic, more efficient push-off; longer GCT is associated with more time spent absorbing and redirecting force, which is metabolically more costly. GCT is mechanically entangled with cadence (higher cadence almost always means shorter GCT) and with vertical oscillation — these three metrics should always be read together, never in isolation.

### 2.2 Typical and Elite Ranges

| Population | Typical GCT | Notes |
|---|---|---|
| Recreational runners, easy pace | ~250–300 ms | Some sources report up to 300+ ms for slower/larger runners |
| Recreational runners, faster pace | ~220–260 ms | GCT shortens reliably as pace increases for nearly all runners |
| Elite distance runners, race pace | ~160–200 ms | Consistently reported across multiple sources and research studies |

A peer-reviewed study of elite distance runners (Chapman et al., 2012, *Medicine & Science in Sports & Exercise*) found a mean GCT of approximately 155 ms at a comfortably fast pace among elite-level athletes, and identified GCT as a meaningful indicator of metabolic cost — runners with shorter GCT at a given pace tended to be more metabolically economical, though the relationship is a general trend rather than a strict rule applicable to every individual.

### 2.3 What the Research Actually Shows

Findings on GCT and running efficiency are genuinely mixed at the individual level — some studies find shorter GCT correlates with better economy, others do not find a consistent relationship — which means GCT is best treated as a **population-level economy signal with individual-level noise.** The single most reliable, well-supported finding involving GCT is that **it increases with fatigue.** This makes GCT one of the most useful *within-session* fatigue-monitoring tools available from consumer wearable data, even though it is a weaker *between-runner* economy ranking tool.

### 2.4 When to Intervene

- GCT rises progressively and substantially within a single session (especially a long run) at constant or near-constant pace — a fatigue-driven mechanical breakdown signal.
- GCT shows persistent left/right imbalance (GCT balance, also reported by Garmin) beyond a small natural asymmetry — may indicate compensation for an underlying issue, asymmetric strength, or early injury.

### 2.5 When Not to Intervene

- Single-session GCT sits above "typical" ranges but is stable across the session and consistent with the athlete's own pace-matched history — most likely reflects the runner's natural mechanics rather than a fixable inefficiency.
- Athlete is not reporting any economy plateau, injury, or performance concern — chasing a shorter GCT for its own sake without a clear problem to solve risks the proxy-optimisation error from Section 0.0.

### 2.6 AI Rules — GCT

```
AI Rule 2.1 — Within-Session Fatigue Detection via GCT
IF GCT increases by >8–10% from first-third to final-third of a
   long run or sustained effort, at stable or only mildly slower pace
THEN flag a fatigue-driven mechanical breakdown signal — this is
     evidence for durability/fatigue-resistance limitations (Part 1,
     Section 2's "durability" lever), not necessarily a cardiovascular
     limitation, and should inform Part 9 (injury) risk scoring.

AI Rule 2.2 — GCT Balance Check
IF GCT_balance deviates from ~50/50 by more than a small,
   individually-established threshold, AND the deviation is new
   or worsening relative to the athlete's own trend
THEN flag for possible compensation pattern; recommend monitoring
     rather than immediate alarm, and cross-reference with any
     reported pain or asymmetric injury history (Part 9).
```

---

## 3.0 Vertical Oscillation (VO)

### 3.1 What It Means

Vertical oscillation measures the vertical "bounce" of the runner's centre of mass (typically measured at the torso/hip via a chest strap or watch accelerometer) during each stride, usually in centimetres. Since forward motion is the only displacement that contributes to race performance, energy spent moving vertically is, by definition, energy not contributing directly to speed — though a runner cannot and should not eliminate vertical oscillation entirely, since some vertical displacement is a normal and necessary part of an elastic, efficient running stride.

### 3.2 Typical and Elite Ranges

| Population | Typical VO | Notes |
|---|---|---|
| General recreational range | ~6–15 cm | Wide range reflects pace and individual variation |
| Moderate training pace, most runners | ~6–9 cm | A commonly cited target band for typical training paces |
| Elite runners, race pace | ~4–6 cm | Decreases further as pace increases |

Garmin and several third-party analyses also report a derived **vertical ratio** (vertical oscillation divided by stride length, expressed as a percentage), commonly cited with a healthy range around 6–10% — this ratio is generally a more useful efficiency signal than raw VO alone, because it accounts for the fact that a runner covering more ground per stride can "afford" slightly more absolute vertical displacement without being less efficient.

### 3.3 What the Research Actually Shows

There is a real, evidence-supported trend that elite runners oscillate less than non-elite runners at matched paces, but the relationship is not perfectly linear, and *attempting to consciously suppress vertical oscillation directly* is rarely the most effective intervention. In practice, vertical oscillation is best understood as **a downstream consequence of cadence and push-off mechanics, not an independently trainable variable.** Most coaches and the available evidence agree that the more productive intervention point is cadence and general strength/power development (Section 1, plus strength training covered in Part 8), which tend to reduce vertical oscillation as a side effect, rather than cueing a runner to "bounce less" directly, which can produce awkward, overly flexed mechanics that cost more energy than they save.

### 3.4 When to Intervene

- Vertical ratio is elevated *and* trending upward over weeks/months at matched paces, alongside a stalled or worsening running-economy trend (e.g., requiring higher heart rate or perceived effort to hold the same pace).
- Combined with low cadence and high GCT in the same session — together these three metrics paint a consistent "low elastic efficiency" picture worth addressing through cadence and strength work rather than VO in isolation.

### 3.5 When Not to Intervene

- VO sits at the higher end of typical ranges but vertical ratio is reasonable (the athlete has a longer stride to match) and economy/performance trends are stable or improving.
- As a stand-alone target for direct correction — see Section 3.3; cueing vertical oscillation directly is the least evidence-supported intervention point in this entire chapter.

### 3.6 AI Rules — Vertical Oscillation

```
AI Rule 3.1 — Vertical Ratio Preference
ALWAYS prefer vertical_ratio (VO ÷ stride_length) over raw VO
when assessing economy, since it normalises for stride length
differences across runners and paces.

AI Rule 3.2 — Never Prescribe Direct VO Suppression
IF an intervention is warranted (per Section 3.4)
THEN route the intervention through cadence (Rule 1.1) and/or
     general strength training (Part 8), NOT through direct
     "reduce your bounce" cueing — the evidence base supports
     the indirect route far more strongly than the direct one.
```

---

## 4.0 Stride Length

### 4.1 What It Means

Stride length is the distance covered per stride (or per step, depending on device convention — confirm units). It is the second half of the pace equation alongside cadence (`pace = cadence × stride length`) and increases naturally with pace for virtually all runners, primarily through greater hip extension and push-off power rather than active forward reaching of the lead leg.

### 4.2 Typical and Elite Ranges

Stride length is the least useful metric in this chapter to benchmark against population norms, because it scales directly with both pace and leg length/height — a 150 cm runner and a 195 cm runner running the same pace will have legitimately different "normal" stride lengths, and neither number is more "correct." This metric should be used almost exclusively in an **intra-individual** way: tracked over time at matched paces for the same athlete, not compared across athletes or against any universal benchmark.

### 4.3 What the Research Actually Shows

The biomechanically important distinction is not stride length itself but **where the foot lands relative to the centre of mass** — overstriding (landing well ahead of the centre of mass, typically with a straighter leg and a braking-force spike) is the mechanically costly pattern, not "having a long stride" per se. A runner with naturally long legs and a long, but well-positioned, stride is not overstriding; a runner with a short stride who reaches the lead foot too far forward can still be overstriding. This is precisely why the same fix recommended for low cadence (Section 1.4) is also the standard fix for overstriding generally — increasing cadence shortens stride length somewhat as a side effect, which tends to bring the landing point back under the centre of mass without the runner needing to think about foot placement directly.

### 4.4 When to Intervene

- Stride length increases sharply within a session at the same effort/pace, *combined with* increasing GCT and decreasing cadence — together this pattern often indicates the athlete is reaching/overstriding as a (counterproductive) compensation for fatigue.
- Persistent left/right stride length asymmetry alongside other asymmetry signals (Section 2.4) — possible compensation pattern worth flagging.

### 4.5 When Not to Intervene

- As a cross-athlete comparison metric — never benchmark one runner's stride length against another's or against a population "ideal," given the height/leg-length confound described above.
- In isolation, without GCT and cadence data alongside it — stride length alone cannot distinguish "long stride from genuine power" from "long stride from overstriding."

### 4.6 AI Rules — Stride Length

```
AI Rule 4.1 — Intra-Individual Comparison Only
NEVER compare an athlete's stride length to population benchmarks
or to other athletes. ONLY compare to the athlete's own pace-matched
historical data.

AI Rule 4.2 — Overstriding Composite Signal
IF (stride_length increasing) AND (cadence decreasing)
   AND (GCT increasing) within the same session at stable pace
THEN flag a composite overstriding/fatigue-compensation pattern —
     this three-metric combination is more diagnostically reliable
     than any single metric alone.
```

---

## 5.0 Running Power

### 5.1 What It Means

Running power (available via Garmin Running Power, Stryd, and similar systems) estimates the total mechanical/metabolic power output of the runner, typically combining pace, vertical oscillation, wind resistance, and gradient into a single watts-based number. Unlike pace, power responds immediately to gradient changes (uphill and downhill), making it a genuinely useful *real-time effort* metric in terrain where pace alone is misleading — this is directly relevant to hill-based workouts (Part 4) and trail/hilly race terrain.

### 5.2 Typical and Elite Ranges

Power is one of the least standardised metrics across device manufacturers — different algorithms (Garmin's native running power, Stryd's proprietary model, etc.) produce different absolute numbers for the same runner, meaning **there is no meaningful universal "normal range" for running power**, unlike cadence, GCT, or vertical oscillation. Power should be treated as a device- and athlete-specific number, useful only in a relative, intra-individual, intra-device sense.

### 5.3 What the Research Actually Shows

Running power's primary validated use case is as a more gradient-stable effort metric than pace, particularly useful for hill workouts and trail running where pace swings dramatically with terrain but underlying physiological effort may be more stable. It has not displaced heart rate or pace as the primary training-zone metric in mainstream coaching practice (see Part 3 for the full zone-setting discussion), and should be treated as a *supplementary* signal, particularly valuable in exactly the terrain conditions where pace and even heart rate (due to cardiac lag) are least reliable.

### 5.4 When to Intervene / When It's Most Useful

- Hill repeat sessions and trail running, where power can flag an athlete pushing meaningfully harder or easier than intended despite pace looking "right" for the gradient.
- Downhill running, where pace can be artificially fast without reflecting genuine aerobic effort — power (and heart rate) are more reliable effort indicators than pace on descents.

### 5.5 When Not to Intervene / Where It's Weakest

- As a cross-device or cross-athlete comparison metric (Section 5.2).
- As a replacement for heart rate or pace on flat, steady terrain, where pace and HR remain perfectly adequate and more universally understood by the athlete.

### 5.6 AI Rules — Running Power

```
AI Rule 5.1 — Device-Specific Power Baseline
NEVER compare running power values across different athletes or
across different watch/device brands. Establish a device-specific,
athlete-specific power baseline before using power for any
intra-individual comparison.

AI Rule 5.2 — Preferred Effort Metric by Terrain
IF terrain_gradient is significantly non-flat (hill repeats, trail,
   sustained downhill)
THEN prefer power (if available) or heart rate over pace as the
     primary real-time effort-control metric for that session.
IF terrain is flat/steady
THEN pace and heart rate remain the primary metrics (see Part 3);
     power is supplementary, not primary.
```

---

## 6.0 The AI Metric Interpretation Engine

This section is the deliverable promised at the start of this Part: a single, integrated framework for turning the five metrics above into coherent coaching signal, rather than five disconnected numbers.

### 6.1 The Three Composite Patterns Worth Detecting

Rather than evaluating each metric independently, the engine should look for three recurring **composite patterns**, each of which is more diagnostically reliable than any single metric:

| Composite Pattern | Signature | Likely Meaning | Where It Connects |
|---|---|---|---|
| **Overstriding pattern** | Low cadence + high GCT + reaching stride length, relative to athlete's own baseline | Mechanically costly landing position, modestly elevated injury-relevant loading | Section 1.4, Part 9 (injury) |
| **Within-session fatigue breakdown** | GCT rising + cadence falling + stride length increasing, progressively within one session at stable pace | Durability/fatigue-resistance limiter (Part 1, Five-Lever framework) rather than a cardiovascular one | Part 9 (injury), Part 8 (durability training) |
| **Asymmetry/compensation pattern** | Persistent GCT balance or stride asymmetry, worsening over time | Possible early-stage injury compensation or strength imbalance | Part 9 (injury management) |

### 6.2 The Master Interpretation Rule

```
AI Rule 6.1 — Composite-Pattern-First Interpretation
WHEN analysing a completed activity's running dynamics data:
   1. Normalise every metric for pace (never compare raw numbers
      across different paces — Section 0.0)
   2. Compare against the athlete's OWN historical pace-matched
      baseline first; population ranges (Sections 1.2, 2.2, 3.2)
      are a secondary sanity check only, never the primary reference
   3. Check for the three composite patterns (Section 6.1) before
      flagging any single metric in isolation
   4. IF no composite pattern is present AND athlete is uninjured,
      consistent, and trending well on performance/economy
      THEN do not generate a biomechanical flag at all — silence
      is the correct output far more often than a recommendation
      (this directly implements Section 0.0's core guardrail)
   5. IF a composite pattern is present
      THEN route the flag to the relevant downstream system:
         overstriding → cadence-cueing recommendation (Rule 1.1)
         fatigue breakdown → Part 9 injury-risk scoring input
         asymmetry → Part 9 injury-risk scoring input + monitor trend
```

### 6.3 Why "Doing Nothing" Is a Valid and Frequent Output

This chapter closes on the same note it opened with, because it is the most commonly violated principle in consumer running-tech products: most runners, most of the time, should receive **no biomechanical feedback at all**, because their metrics — whatever the absolute numbers are — are stable, consistent with their own history, and not associated with any performance plateau or injury signal. An AI coaching engine that generates a "form tip" every single run, regardless of whether anything meaningful has changed, will rapidly train its users to ignore its feedback entirely. The credibility of every *true* flag this system raises depends on the system staying silent the rest of the time.

---

## 7.0 Chapter Summary — Carried Forward Into Later Parts

| Metric | Best use | Worst misuse | Connects forward to |
|---|---|---|---|
| Cadence | Detecting/correcting overstriding via small (+5–10%) self-selected adjustments | Prescribing a fixed universal number (e.g. "180") | Part 4 (strides/drills), Part 9 (injury) |
| Ground Contact Time | Within-session fatigue detection; population economy trend (weak individually) | Cross-athlete ranking; ignoring pace-dependence | Part 8/9 (durability, injury) |
| Vertical Oscillation | Vertical ratio as a normalised economy signal | Direct conscious suppression cueing | Part 1 (economy lever), Part 8 (strength) |
| Stride Length | Intra-individual trend only, alongside cadence/GCT | Any cross-athlete or population benchmarking | Part 9 (overstriding/injury) |
| Running Power | Gradient-stable effort control (hills, trail, downhill) | Cross-device/cross-athlete comparison | Part 3 (zones), Part 6 (race terrain) |

---

