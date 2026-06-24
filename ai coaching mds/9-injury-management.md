# THE AI RUNNING COACH KNOWLEDGE BASE
## Part 9: Injury Management

> **Important scope note, to be reflected in the app's actual UX, not just this document:** This chapter equips the AI coaching engine to *recognise patterns consistent with* common running injuries and to make conservative, safe training modifications — it does not equip the engine to diagnose. No AI system should present a diagnosis to a user. Every injury-related output should be framed as "this pattern is consistent with X — here is a conservative training modification, and here is when to see a physiotherapist or sports physician," never "you have X." Persistent pain, pain that worsens, pain affecting gait, or any suspected bone stress injury should always trigger a recommendation to seek in-person professional assessment — the AI engine's job is risk reduction and triage, not clinical care.

> **Continuity note:** This part consumes the composite injury risk score from Part 8 (Section 7.2) and the biomechanical composite patterns from Part 7 (Section 6.1) as its primary inputs, and produces the "injury adjustment engine" — concrete, conservative training modifications keyed to the specific injury pattern detected.

---

## 0.0 The Shared Structure Behind Every Injury Below

All eight conditions in this chapter are, in the large majority of recreational cases, **overuse injuries** — they follow the same underlying mechanism established in Part 8 (Section 0.0): tissue loaded faster than it can adapt, repeated over time. This means every injury chapter below shares a common logical skeleton, and the AI engine should treat the differences between injuries as differences in *which tissue* failed and *why*, not as eight unrelated problems requiring eight unrelated mental models.

```
AI Rule 0.1 — Shared Injury-Management Skeleton
For every injury pattern in this Part, the engine should populate:
   1. symptom_match_confidence  (how well reported symptoms fit the pattern)
   2. risk_factor_match         (how many known risk factors the athlete has)
   3. severity_tier             (mild / moderate / severe — drives response)
   4. training_modification     (what changes now, specific to this tissue)
   5. return_to_run_trigger     (the specific, objective criterion that must
                                  be met before progression — never time-based
                                  alone; pain-based and function-based)
   6. professional_referral_flag (when in doubt, default to YES)
```

---

## 1.0 Runner's Knee (Patellofemoral Pain Syndrome)

### 1.1 Symptoms
Diffuse, aching pain around or behind the kneecap, typically worsened by downhill running, descending stairs, prolonged sitting ("theatre sign"), or squatting. Usually gradual onset, often bilateral over time even if it starts unilaterally.

### 1.2 Risk Factors
Sudden increases in mileage or hill volume; weak hip abductors/external rotators (a well-supported finding — hip weakness is one of the most consistently identified contributors); overstriding (Part 7, Section 1.4/4.3); worn or inappropriate footwear; a rapid increase in downhill running specifically.

### 1.3 Training Modifications
Reduce or temporarily eliminate downhill running and deep-knee-flexion activity (stairs, squats below comfortable range); reduce volume to a pain-free level rather than stopping entirely if symptoms are mild; maintain aerobic fitness via flat, even-surface running at reduced volume or cross-training (cycling, swimming, deep-water running) if knee-flexion-sensitive activities provoke symptoms; begin hip and glute strengthening immediately — this is the single most evidence-supported corrective intervention for this condition.

### 1.4 Return-to-Run Protocol
Pain-free with daily activities and basic strength testing (single-leg squat, step-down) before any running resumes. Resume on flat terrain at reduced volume (commonly 50% of pre-injury volume as a starting point), progressing primarily through volume before reintroducing hills or speed work, using a strict pain-guided rule: no exercise-induced pain above a low, mutually agreed threshold (commonly described in physiotherapy guidance as roughly 3/10), and no pain that persists or worsens the following day.

---

## 2.0 Achilles Tendinopathy

### 2.1 Symptoms
Pain and stiffness localised to the Achilles tendon, classically worst with the first steps in the morning, easing somewhat with light activity, then often returning with increased loading. Mid-portion tendinopathy (2–6cm above the heel) is most common; insertional tendinopathy (right at the heel bone) is a distinct sub-type with somewhat different loading sensitivities (insertional cases are often more sensitive to deep ankle dorsiflexion/stretching).

### 2.2 Risk Factors
Sudden increases in volume or intensity (especially speed work, hill repeats, and any abrupt increase in plyometric-type loading); calf weakness or reduced calf endurance; a rapid increase in time spent in minimalist or zero-drop footwear without adequate adaptation; reduced ankle dorsiflexion range; age-related tendon stiffness changes.

### 2.3 Training Modifications
Reduce or temporarily eliminate hill running, speed work, and any bounding/plyometric activity, all of which load the Achilles disproportionately. Continue flat, easy running if it can be done without provoking symptoms beyond the same low pain threshold used in Section 1.4 — complete rest is not consistently shown to be necessary or superior to controlled loading for tendinopathy, and tendons generally respond well to progressive loading rather than full immobilisation. Begin isometric and then heavy slow resistance calf loading (e.g., progressively loaded heel raises) — this is the most evidence-supported intervention category for tendinopathy generally.

### 2.4 Return-to-Run Protocol
Progress from isometric calf loading → heavy slow resistance loading → energy-storage exercises (e.g., controlled hopping) before returning to any running involving speed or hills. Resume running on flat terrain first, at reduced volume, using the same next-day-pain rule as Section 1.4. Insertional cases should avoid deep dorsiflexion stretching during the acute phase, as this can directly provoke symptoms at the insertion point — a meaningful distinction the AI engine should capture if the athlete reports heel-specific (vs. mid-tendon) pain location.

---

## 3.0 Shin Splints (Medial Tibial Stress Syndrome)

### 3.1 Symptoms
Diffuse aching or sharp pain along the inner border of the shin (tibia), typically over a broader area than a stress fracture (see Section 6); often worsens during a run and may ease somewhat once warmed up in earlier stages, then progresses to pain present throughout a run and even at rest if training continues unmodified.

### 3.2 Risk Factors
Rapid increases in mileage (a textbook progressive-overload violation per Part 1, Section 4); running on hard or cambered surfaces; overstriding and high impact loading; low cadence; previous history of MTSS (a strong predictor of recurrence); inadequate footwear for the individual's biomechanics.

### 3.3 Training Modifications
Reduce volume substantially and immediately at the first sign of symptoms — MTSS exists on a continuum with bone stress injury (Section 6), and early, decisive load reduction is the most effective way to prevent progression to an actual stress fracture. Address cadence (Part 7, Section 1) if overstriding is identified as a contributing pattern. Cross-train (cycling, swimming, deep-water running, elliptical) to maintain fitness during the reduced-running period.

### 3.4 Return-to-Run Protocol
A commonly used graded approach: resume at roughly 50% of pre-injury intensity/volume, increasing by approximately 10–15% per week, guided strictly by symptom response rather than a fixed calendar. Some published protocols use alternating "on/off" days with progressive interval lengths until a substantial pain-free continuous run (e.g., 45 minutes) is achieved before returning to a normal training structure. **Diffuse pain that fails to improve with reduced load, or that becomes more localised and sharp, should prompt a referral for assessment of possible progression to a bone stress injury (Section 6).**

---

## 4.0 Plantar Fasciitis

### 4.1 Symptoms
Sharp, stabbing pain at the bottom of the heel, classically most severe with the very first steps in the morning or after any period of rest, easing somewhat with movement but often returning with prolonged standing or running.

### 4.2 Risk Factors
Sudden increases in running volume; tight calf muscles and reduced ankle dorsiflexion; prolonged standing occupations; inappropriate or worn footwear; higher body mass relative to the load-bearing structures involved; flat or high-arched foot structures in some individuals (the relationship between arch type and injury risk is less consistent in the evidence than commonly assumed, and should not be over-weighted as a risk factor on its own).

### 4.3 Training Modifications
Reduce volume to a pain-tolerable level; avoid barefoot walking on hard surfaces, particularly first thing in the morning; address calf flexibility and ankle mobility, which has reasonable supporting evidence for this specific condition (a case where mobility work, per Part 8 Section 6, earns a more prominent role than it does for injury prevention generally, because it targets a specific, commonly identified restriction). Calf and intrinsic foot strengthening have growing evidence support alongside stretching-based approaches.

### 4.4 Return-to-Run Protocol
Resume running once morning pain has substantially resolved and daily walking is pain-free; begin with shorter, flatter runs and progress volume gradually using the same next-day-pain guidance as Sections 1.4/2.4. This condition is frequently slow to resolve fully (commonly described as taking weeks to several months even with good management), so the AI engine should set realistic timeline expectations rather than implying a quick fix.

---

## 5.0 ITB (Iliotibial Band) Syndrome

### 5.1 Symptoms
Sharp or burning pain on the outside of the knee, classically appearing at a consistent point in a run (often a similar distance/time each session in early stages) rather than from the very first step, and frequently worsened by downhill running and longer runs.

### 5.2 Risk Factors
Hip abductor weakness (a strong, well-supported contributor — closely related to the runner's knee risk profile in Section 1.2, reflecting that both conditions often share a common proximal hip-strength deficit); sudden increases in mileage or downhill running; running repeatedly on a cambered surface or track in one direction without variation; leg length differences.

### 5.3 Training Modifications
Reduce or eliminate downhill running and banked/cambered surfaces during the acute phase; reduce overall volume to below the typical onset point identified in Section 5.1; begin hip and glute strengthening — given the shared mechanism with patellofemoral pain (Section 1), the same strengthening program frequently addresses both conditions simultaneously.

### 5.4 Return-to-Run Protocol
Resume on flat terrain at reduced volume once pain-free with hip strength testing and basic functional movements (single-leg squat, step-down); progress volume before reintroducing hills, monitoring closely for a return of the characteristic "consistent point in the run" pain pattern as an early warning of re-aggravation.

---

## 6.0 Stress Fractures (Bone Stress Injuries)

### 6.1 Symptoms
Localised, often sharp and well-defined pain (more focal than the diffuse pain of MTSS, Section 3) that initially appears only with running, then progressively appears with walking and eventually at rest as the injury advances. Tenderness to direct palpation at a specific point is a classic sign. Common sites in runners include the tibia, metatarsals, navicular, and femoral neck — the latter two being higher-risk sites requiring more cautious management.

### 6.2 Risk Factors
A history of rapid training load increases (the clearest and most modifiable risk factor — directly tying back to Part 1's progressive overload guardrails and Part 8's load-management framework); low bone mineral density; **Relative Energy Deficiency in Sport (RED-S)** — chronic low energy availability, which is a well-established and serious risk factor, particularly relevant for athletes with high training volumes and inadequate fuelling, irrespective of gender, though the AI engine should be alert to this in any athlete showing a pattern of high training load combined with restrictive eating behaviour or menstrual irregularity; prior stress fracture history (a strong predictor of recurrence); biomechanical factors including overstriding and high impact loading rates.

### 6.3 Training Modifications
**This is the one injury category in this knowledge base where the AI engine should default to immediate, complete cessation of running and a mandatory professional-referral flag, rather than a graduated self-managed reduction.** Confirmed or strongly suspected stress fractures require medical assessment (commonly imaging) and a structured, often clinician-supervised return process — this is not a condition the AI engine should attempt to manage independently the way it can responsibly support graduated self-management of Sections 1–5 and 7–8.

```
AI Rule 6.1 — Mandatory Hard Stop for Suspected Bone Stress Injury
IF reported_symptoms match the focal, point-tender, progressively
   worsening pattern described in Section 6.1
   OR risk_factor_match includes a known prior stress fracture
   OR composite injury risk score (Part 8, Section 7.2) is HIGH
      AND pain location is focal/bony rather than diffuse
THEN:
   - immediately set running_volume = 0 (not "reduced")
   - set professional_referral_flag = MANDATORY, not optional
   - explicitly recommend in-app that the athlete seek medical
     assessment before any further running
   - do NOT generate a self-managed graduated return plan;
     this is the one injury type in this Part where the AI
     engine's job ends at safe stoppage and referral, not at
     prescribing the recovery pathway itself
```

### 6.4 Return-to-Run Protocol (Context for the App, Not a Self-Directed Plan)
Once a clinician has cleared an athlete and graded the bone stress injury as low-risk, published rehabilitation literature generally supports a return-to-run process beginning once the athlete is pain-free with daily activities for a sustained period (commonly cited as approximately 5 consecutive days), prioritising an increase in running *volume* before *speed*, guided throughout by an "optimal loading" principle: at every stage, the load applied should not provoke symptoms either during or after the activity. The AI engine's appropriate role at this stage is to support a clinician-approved plan (e.g., logging adherence, monitoring for symptom recurrence) rather than to generate the plan independently — see Rule 6.1's distinction between this condition and the others in this chapter.

---

## 7.0 Hamstring Injuries

### 7.1 Symptoms
Sudden, sharp posterior thigh pain during a strain-type injury (often associated with sprinting, hill work, or sudden speed changes); a more gradual, ache-type onset is also possible with overuse-pattern hamstring tendinopathy, particularly near the sit bone (proximal hamstring tendinopathy), which is distinct from an acute muscle strain and behaves more like the tendinopathies in Section 2.

### 7.2 Risk Factors
Insufficient warm-up before speed work; muscular strength imbalance between hamstrings and quadriceps; previous hamstring injury (one of the strongest predictors of re-injury across sports science literature generally); sudden introduction of significant speed or hill work without adequate prior conditioning; for the tendinopathy variant specifically — prolonged sitting and stretching positions that compress the tendon near its origin can aggravate rather than help, an important nuance to capture.

### 7.3 Training Modifications
For an acute strain: stop running immediately, avoid stretching the area in the acute phase (counter to common instinct, gentle pain-free movement is generally preferable to aggressive stretching very early after a strain), and allow an initial period of relative rest before progressively reloading. For tendinopathy-pattern symptoms: reduce speed work and hill running specifically (the highest hamstring-loading activities), maintain easy aerobic volume if tolerated, and avoid deep hip-flexion stretching positions that may compress and aggravate the tendon near its origin.

### 7.4 Return-to-Run Protocol
For acute strains, return-to-run criteria typically require pain-free walking, pain-free light jogging, and adequate strength symmetry between limbs (commonly tested via simple functional strength comparisons) before progressing to genuine speed work — speed and sprinting-type efforts should be the *last* element reintroduced, not the first, given how strongly initial-phase speed work features in the original injury mechanism (Section 7.2). For tendinopathy, expect a slower, more tendon-typical recovery timeline (weeks to months) following the same progressive-loading philosophy described for Achilles tendinopathy (Section 2.3).

---

## 8.0 Calf Strains

### 8.1 Symptoms
Sudden, sharp pain in the calf, often described as a "pulling" or "tearing" sensation, frequently occurring during a sudden acceleration, hill effort, or change of pace; may be accompanied by visible swelling or bruising in more significant strains. Lower-grade strains may present as a more gradual tightness and ache.

### 8.2 Risk Factors
Insufficient warm-up before speed or hill work; calf muscle fatigue from inadequate recovery between hard sessions; a sudden increase in hill running or speed work without prior conditioning; dehydration and inadequate recovery have been anecdotally linked though the evidence base here is weaker than for the structural/loading risk factors above; prior calf strain history.

### 8.3 Training Modifications
Stop running on the affected leg immediately following an acute strain; in the earliest phase, focus on pain-free range of motion and light activity rather than aggressive stretching; begin progressive calf loading (similar isometric → heavy-slow-resistance progression described for Achilles tendinopathy in Section 2.3) once acute pain has settled, since the calf musculature and Achilles tendon function as a connected unit and respond to similar progressive loading principles.

### 8.4 Return-to-Run Protocol
Progress from pain-free walking → pain-free easy jogging → progressive calf-loading exercises → controlled acceleration/deceleration drills → full speed work, in that order, with speed and hill-specific work reintroduced last, mirroring the hamstring return logic in Section 7.4 — both injuries share the same underlying lesson: the activity most likely to have caused the injury (sudden speed/acceleration demand) should be the last element reintroduced, not the first.

---

## 9.0 The Injury Adjustment Engine

This section is the deliverable promised at the start of this Part: a unified system for converting a detected (not diagnosed) injury pattern into a concrete, conservative, and explainable training plan adjustment.

### 9.1 The Master Adjustment Logic

```
AI Rule 9.1 — Injury Adjustment Engine (master flow)

STEP 1 — Pattern Match (NOT diagnosis)
   Compare reported symptom location, onset pattern, and aggravating
   factors against the eight profiles in Sections 1–8.
   Output a symptom_match_confidence per pattern, not a single
   forced classification — multiple patterns can have partial matches,
   and the engine should represent that ambiguity rather than
   collapsing it into false certainty.

STEP 2 — Severity Triage
   IF pattern matches Section 6 (bone stress injury) criteria
      OR pain is severe, sudden-onset, or affecting gait
   THEN → MANDATORY hard stop + referral (Rule 6.1) — skip to STEP 5
   ELSE IF pain is present but mild, gradual-onset, and not worsening
   THEN → proceed to graduated self-management (STEP 3)
   ELSE (ambiguous or moderate-but-unclear)
   THEN → recommend professional assessment AND apply a conservative
        interim modification (STEP 3) while awaiting that assessment —
        these two actions are not mutually exclusive

STEP 3 — Apply Tissue-Specific Training Modification
   Pull the specific modification from the matched injury's Section
   X.3 (avoid downhill for runner's knee/ITB; avoid hills/speed for
   Achilles/calf; reduce volume immediately for MTSS; address calf
   flexibility for plantar fasciitis; avoid acute stretching for
   hamstring strain; etc.) — modifications are NOT interchangeable
   across injury types, which is precisely why this Part is organised
   by specific tissue rather than as one generic "reduce training" rule.

STEP 4 — Set Return-to-Run Trigger (never purely time-based)
   Pull the specific functional/pain-based criterion from Section X.4
   (e.g. pain-free daily activity + strength test for runner's
   knee/ITB; isometric-to-heavy-slow-resistance progression for
   tendinopathies; pain-free walking + strength symmetry before
   speed for strains). Calendar time is a secondary sanity check,
   never the primary criterion.

STEP 5 — Log and Feed Back
   Record the injury event and pattern match into the athlete's
   individualised parameters (Part 1, Rule 7.1) — injury history
   should permanently raise that athlete's sensitivity to the
   matched pattern's risk factors in all future training, not just
   during the current recovery (e.g. a runner's knee history should
   keep hip-strength maintenance work and conservative downhill
   progression as standing features of that athlete's plan long
   after symptoms resolve).
```

### 9.2 Why Step 5 Matters More Than It Looks

The most common practical failure in injury management — by athletes and apps alike — is treating recovery as a return to *zero*, with no lasting change to the training approach that produced the injury in the first place. An AI engine has a unique advantage here over a human memory: it can permanently and precisely retain which risk factors applied to a given injury and quietly keep relevant protective elements (strength work, progression guardrails, terrain caution) in place indefinitely, without the athlete needing to remember to ask for it.

```
AI Rule 9.2 — Permanent Risk-Factor Memory
Once an injury pattern has been matched and logged, the athlete's
risk_factor_profile (Part 1, Section 7.2) should be permanently
updated to reflect it. Future plan generation must check this
profile and proactively include the relevant protective element
(e.g. hip strength maintenance, downhill progression caution,
calf loading maintenance) as a standing feature — not something
that fades out a few weeks after symptoms resolve.
```

---

## 10.0 Chapter Summary — Carried Forward Into Later Parts

| Injury | Key risk factor | Critical modification | Return-to-run anchor |
|---|---|---|---|
| Runner's knee | Hip weakness, overstriding | Cut downhill/deep knee flexion | Pain-free + strength test before resuming |
| Achilles tendinopathy | Sudden speed/hill increase, calf weakness | Cut hills/speed, NOT complete rest | Isometric → heavy-slow-resistance progression |
| Shin splints (MTSS) | Rapid mileage increase | Immediate volume cut (prevent BSI progression) | 50% volume, +10–15%/wk, symptom-guided |
| Plantar fasciitis | Calf tightness, sudden volume increase | Calf/ankle mobility + load reduction | Morning pain resolved + pain-free walking |
| ITB syndrome | Hip weakness, downhill running | Cut downhill/cambered surfaces | Hip strength test + flat-terrain return |
| Stress fracture | Rapid load increase, RED-S, prior history | **Mandatory stop + referral** | Clinician-guided only — app supports, doesn't direct |
| Hamstring injury | Insufficient warm-up, prior injury, sudden speed | Avoid acute stretching, delay speed work | Strength symmetry before any speed reintroduced |
| Calf strain | Insufficient warm-up, sudden acceleration demand | Avoid acute stretching, progressive reloading | Speed/hills reintroduced last, not first |

---
