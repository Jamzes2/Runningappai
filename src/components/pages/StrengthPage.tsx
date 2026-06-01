"use client";

import React, { useState } from 'react';
import { Dumbbell, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Exercise {
  name: string;
  sets: string;
  load: string;
  completed: boolean;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
}

const strengthWorkouts: Workout[] = [
  {
    id: 'w1',
    title: 'Leg Stability & Stride Strength',
    description: 'Targeting hip abductors and unilateral calf/glute loading to build high force production and minimize stride asymmetries.',
    exercises: [
      { name: 'Bulgarian Split Squats', sets: '3 sets x 8 reps (each leg)', load: '12kg dumbbell', completed: false },
      { name: 'Single-Leg Kettlebell Deadlifts', sets: '3 sets x 10 reps (each leg)', load: '16kg kettlebell', completed: false },
      { name: 'Soleus Calf Raises (Bent Knee)', sets: '4 sets x 15 reps (each leg)', load: 'Bodyweight (slow tempo)', completed: false }
    ]
  },
  {
    id: 'w2',
    title: 'Core & Hip Control',
    description: 'Stabilizing the trunk to prevent hip drop (pelvic tilt) and energy leakage during late-stage fatigue runs.',
    exercises: [
      { name: 'Copenhagen Plank (Adductor)', sets: '3 sets x 30s holds (each side)', load: 'Bodyweight', completed: false },
      { name: 'Weighted Deadbugs', sets: '3 sets x 12 reps', load: '5kg plate', completed: false },
      { name: 'Plank with Shoulder Taps', sets: '3 sets x 20 reps', load: 'Bodyweight', completed: false }
    ]
  },
  {
    id: 'w3',
    title: 'Explosive Plyometrics (Rate of Force Development)',
    description: 'Decreasing ground contact time by teaching the Achilles tendon to store and return elastic energy.',
    exercises: [
      { name: 'Weighted Box Jumps', sets: '3 sets x 6 reps', load: 'Bodyweight', completed: false },
      { name: 'Single-Leg Bounding Drills', sets: '3 sets x 30m reps', load: 'Bodyweight', completed: false },
      { name: 'Pogo Jumps (Ankle stiffness focus)', sets: '3 sets x 40 reps', load: 'Bodyweight', completed: false }
    ]
  }
];

export default function StrengthPage() {
  const [workouts, setWorkouts] = useState<Workout[]>(strengthWorkouts);

  const toggleExercise = (workoutId: string, exerciseIndex: number) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        const newExercises = [...w.exercises];
        newExercises[exerciseIndex] = {
          ...newExercises[exerciseIndex],
          completed: !newExercises[exerciseIndex].completed
        };
        return { ...w, exercises: newExercises };
      }
      return w;
    }));
  };

  return (
    <div className="grid grid-cols-[1.4fr_1fr] gap-6 h-[calc(100vh-120px)] overflow-hidden animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* LEFT: WORKOUTS CARDS */}
      <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
        {workouts.map(workout => (
          <div key={workout.id} className="glass-panel p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[0.62rem] text-accent font-extrabold tracking-wider block">RUNNER SPECIALIST TARGET</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{workout.title}</h3>
              </div>
              <Dumbbell size={18} className="text-accent" />
            </div>
            <p className="text-[0.78rem] text-textSecondary leading-relaxed mb-4">{workout.description}</p>
            
            {/* Exercises List */}
            <div className="flex flex-col gap-2.5">
              {workout.exercises.map((ex, i) => (
                <div 
                  key={i}
                  onClick={() => toggleExercise(workout.id, i)}
                  className={`p-3 px-4 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    ex.completed ? 'bg-accent/5 border-accent' : 'bg-white/[0.01] border-borderDark'
                  }`}
                >
                  <div>
                    <p className={`text-[0.8rem] font-bold ${ex.completed ? 'text-accent' : 'text-white'}`}>{ex.name}</p>
                    <p className="text-[0.7rem] text-textSecondary mt-0.5">{ex.sets} // Load: <span className="text-textPrimary">{ex.load}</span></p>
                  </div>
                  <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all ${
                    ex.completed ? 'border-accent bg-accent' : 'border-textMuted bg-transparent'
                  }`}>
                    {ex.completed && <span className="text-black text-[0.62rem] font-black">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: INJURY PROTECTION & TIPS */}
      <div className="flex flex-col gap-5 h-full overflow-y-auto">
        
        {/* Injury Warning Panel */}
        <div className="glass-panel p-5 border-l-4 border-l-[#FF3B30]">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={16} className="text-[#FF3B30]" />
            <h4 className="text-[0.82rem] font-extrabold tracking-wider text-[#FF3B30]">BIOMECHANICAL RISK RADAR</h4>
          </div>
          <p className="text-[0.78rem] text-textSecondary leading-relaxed">
            Your **Left Ground Contact Balance** has drifted slightly. Stabilize your left hip flexor. Avoid deep squatting movements if patellar pressure elevates.
          </p>
          <div className="mt-4 p-2.5 bg-[#FF453B]/5 border border-[#FF453B]/20 rounded-md text-[0.7rem] text-[#FF453A]">
            WARNING: Standard squats are suspended. Use Bulgarian Split Squats with lighter load to balance limb strength.
          </div>
        </div>

        {/* Dynamic Tips Panel */}
        <div className="glass-panel p-5 flex-1">
          <h4 className="text-[0.82rem] font-extrabold text-accent tracking-wider mb-4">TIPS FOR KINETIC ENERGY STORAGE</h4>
          
          <div className="flex flex-col gap-4 text-[0.75rem] text-textSecondary">
            <div className="flex gap-2.5">
              <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Tendinous Elasticity</p>
                <p className="mt-1 leading-relaxed">Plyometric work like Pogo Jumps primes the Achilles tendon to behave like a spring, saving up to 15% aerobic cost at sub-maximal paces.</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Soleus Specific Strength</p>
                <p className="mt-1 leading-relaxed">The soleus muscle absorbs 6-8x bodyweight per stride during running. Do soleus calf raises with bent knees to bypass gastrocnemius load.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
