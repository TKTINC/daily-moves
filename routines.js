/* Original routines. Each move: [name, seconds, animation, coaching cue, {side:true} when done on both sides].
   src credits the saved reel that inspired the routine's purpose; nothing from it is copied or embedded. */
const IG = (id,k='reel') => `https://www.instagram.com/${k}/${id}/`;
const FB = id => `https://www.facebook.com/reel/${id}/`;
const SIDES = {side:true};

const R = {
  bed:{t:'Wake-up in bed', cat:'Wake-up & balance',
    why:'Wakes the spine and joints gently before your feet touch the floor, so the first steps of the day are easier on the back and knees.',
    src:{by:'@dr_sulman_feroz', url:IG('Db2Ui7uj3Rs'), lbl:'5 stretches from bed, daily mornings'},
    moves:[
      ['Ankle pumps',30,'anklePump','Point the toes away, then pull them back toward you. This wakes up the calf pump and circulation.'],
      ['One knee to chest',40,'singleHug','Hug one knee in and breathe out. Keep the other leg long.',SIDES],
      ['Both knees hug',30,'kneeHug','Hug both knees in and rock gently side to side.'],
      ['Small bridges',30,'bridgeLift','Feet flat, lift the hips a few inches, then lower slowly. About 8 reps.'],
      ['Full-body stretch',20,'bodyReach','Reach arms overhead and point the toes. One long breath in, long breath out.'],
      ['Sit on the bed edge',30,'bedSit','Sit for 30 seconds before you stand. It lets your blood pressure settle.']]},

  dizzy:{t:'Steady standing', cat:'Wake-up & balance',
    why:'Light-headedness on standing often comes from blood pressure dipping for a moment. Priming the leg and arm muscles first helps push blood back up.',
    src:{by:'@dr_sulman_feroz', url:IG('Ddq70cmjSco'), lbl:'Dizziness while standing up and moving'},
    moves:[
      ['Seated ankle pumps',20,'chairAnkle','Toes up, heels up. Quick and steady.'],
      ['Seated marching',30,'chairMarch','Lift one knee, then the other. Sit tall.'],
      ['Arms forward, squeeze fists',20,'chairFists','Reach forward and squeeze both fists and thighs firmly for a few seconds.'],
      ['Slow stand with a pause',45,'slowStand','Lean forward, stand slowly, and pause standing for a few breaths before you move.'],
      ['Stand tall and breathe',20,'standBreathe','Hold something steady if you need to. Then start your day.']],
    note:'If dizziness is frequent or new, tell your doctor. Some BP medicines can cause it.'},

  energy:{t:'Instant energy', cat:'Morning energy', rounds:2,
    why:'Four standing moves that switch on the whole body and lift the heart rate a little. A good bridge from your walk into slower work.',
    src:{by:'@mrvijayfitnesss', url:IG('DcXlNUXpejo'), lbl:'Mornings… instant energy'},
    moves:[
      ['March with arm swing',40,'march','Lift the knees, swing the arms. Keep a pace where you could still talk.'],
      ['Squat to reach',40,'squatReach','Sit back into a squat, then stand and reach high.'],
      ['Knee to opposite elbow',40,'fCrunch','Hands by your head. Bring one knee up toward the opposite elbow.'],
      ['Overhead arm swings',40,'armSwing','Swing both arms up and down loosely. Breathe freely.']]},

  upper:{t:'Upper body & heart', cat:'Morning energy',
    why:'Arm and chest work opens the ribcage and shoulders. That helps posture and makes breathing feel freer.',
    src:{by:'@mrvijayfitnesss', url:IG('DcS2GY0ipA_'), lbl:'Mornings… upper body'},
    moves:[
      ['Arm circles',30,'armCircle','Big slow circles. Change direction halfway.'],
      ['Wall push-ups',40,'wallPush','Hands on a wall at shoulder height. Body in one line. Breathe out as you push.'],
      ['Shoulder-blade squeeze',30,'fW','Arms in a W. Squeeze the shoulder blades down and together.'],
      ['Gentle punches',30,'punch','Alternate easy punches forward. Turn slightly from the waist.'],
      ['Overhead press',30,'press','Hands at shoulders, press up overhead, lower slowly.']]},

  four:{t:'Four power moves', cat:'Strength', rounds:2,
    why:'Four big-muscle moves for energy and leanness. A bit more effort, so they sit on strength day.',
    src:{by:'@mrvijayfitnesss', url:IG('DcRQ151JSRw'), lbl:'Mornings…'},
    moves:[
      ['Squats',40,'squats','Sit back as if onto a chair. Knees follow the toes. Stand tall at the top.'],
      ['Reverse lunges',40,'reverseLunge','Step one foot back and lower gently. Hold a chair if needed.',SIDES],
      ['Wall push-ups',40,'wallPush','Slow down, faster up. Keep the tummy firm.'],
      ['Calf raises',30,'calfRaise','Rise onto the toes, pause, lower slowly.']]},

  target:{t:'Home strength circuit', cat:'Strength', rounds:2,
    why:'Your most demanding routine. Once a week it builds leg, hip and core strength, which protects the joints and helps blood sugar.',
    src:{by:'@shrutifitzz', url:IG('DcqsgY2EsO_'), lbl:'Target !!!'},
    moves:[
      ['Squats',40,'squats','Quality over speed. Breathe out as you stand.'],
      ['Wall push-ups',40,'wallPush','Move your feet further back to make it harder.'],
      ['Glute bridges',40,'bridgeLift','Squeeze the buttocks at the top.'],
      ['Bird dog',40,'birdDog','Reach opposite arm and leg long. Keep the back flat.'],
      ['Plank hold',30,'plank','On the toes or the knees. Don’t hold your breath.'],
      ['Reverse lunges',40,'reverseLunge','Small steps are fine. Hold support if needed.',SIDES]],
    note:'Weeks 1–2: do one round only. Rest whenever your breathing gets hard to control.'},

  five:{t:'Longevity five', cat:'Mobility & yoga',
    why:'Five moves for the pillars of ageing well: balance, leg strength, and hip and upper-back mobility.',
    src:{by:'@themobilitymanual', url:IG('DbvWUudlpge','p'), lbl:'5 daily Mobility'},
    moves:[
      ['Chair to toe stand',45,'chairToToe','Stand up from the chair, rise onto the toes, sit back down with control.'],
      ['T-spine opener',50,'tspine','On all fours, sweep one arm under, then open it up to the ceiling.',SIDES],
      ['World’s greatest stretch',60,'wgs','From a lunge, place a hand down and reach the other arm up.',SIDES],
      ['Kneel to tall kneel',40,'kneelUp','A simpler version of the 90/90 knee stand: from sitting on the heels, rise to a tall kneel. Use a cushion under the knees.'],
      ['Bridge marching',45,'bridgeMarch','Hold a bridge and lift one foot at a time without letting the hips drop.']]},

  yoga10:{t:'10-minute yoga flow', cat:'Mobility & yoga',
    why:'A complete short asana sequence for strength, flexibility and a calm mind.',
    src:{by:'@yogawithyaduveer', url:IG('DcOpv__PiKP'), lbl:'10 min Aasanaas'},
    moves:[
      ['Tadasana with breath',45,'mountain','Breathe in, arms up. Breathe out, arms down.'],
      ['Forward fold and half lift',60,'foldLift','Bend the knees as much as you need. Lengthen the spine on the lift.'],
      ['Low lunge',60,'lowLunge','Back knee down, hips sink forward. Arms up if comfortable.',SIDES],
      ['Downward dog',60,'dog','Hips high, heels reaching down. Bend the knees freely.'],
      ['Cobra',45,'cobra','Elbows bent and close. Lift the chest, shoulders away from the ears.'],
      ['Child’s pose',45,'child','Sit back to the heels, arms long. Breathe into the back.'],
      ['Cat-cow',60,'catCow','Round on the out-breath, arch gently on the in-breath.'],
      ['Bridge',45,'bridgeHold','Lift the hips and hold for a few breaths.'],
      ['Knee hug',30,'kneeRock','Hug the knees in and rock side to side.'],
      ['Shavasana',60,'rest','Lie still. Let the breath be easy.']]},

  pose12:{t:'Surya Namaskar, 12 poses', cat:'Mobility & yoga',
    why:'The classic 12-pose sun salutation, taught slowly one pose at a time, then flowed together. It works the whole body and breath.',
    src:{by:'@yogawithyaduveer', url:IG('DdB098nPjma'), lbl:'All 12 poses with good demo mode'},
    moves:[
      ['1 · Pranamasana (prayer)',20,'P:prayer','Stand tall, palms together at the chest.'],
      ['2 · Hasta Uttanasana (raised arms)',20,'P:reachBack','Breathe in. Arms up, gentle backward stretch.'],
      ['3 · Padahastasana (forward bend)',25,'P:fold','Breathe out. Fold forward, knees soft.'],
      ['4 · Ashwa Sanchalanasana (lunge)',25,'P:lungeHandsDown','Breathe in. Step the right leg back, look forward.'],
      ['5 · Dandasana (plank)',20,'P:plank','Hold the breath briefly or breathe softly. Body in one line.'],
      ['6 · Ashtanga Namaskara (eight points)',20,'P:eightLimb','Breathe out. Knees, chest and chin to the floor, hips up.'],
      ['7 · Bhujangasana (cobra)',25,'P:cobra','Breathe in. Slide forward and lift the chest.'],
      ['8 · Adho Mukha Svanasana (mountain)',25,'P:dog','Breathe out. Hips up into an inverted V.'],
      ['9 · Ashwa Sanchalanasana (lunge)',25,'P:lungeHandsDown','Breathe in. Right foot forward between the hands.'],
      ['10 · Padahastasana (forward bend)',20,'P:fold','Breathe out. Step the left foot forward and fold.'],
      ['11 · Hasta Uttanasana (raised arms)',20,'P:reachBack','Breathe in. Rise up with arms overhead.'],
      ['12 · Tadasana (mountain pose)',20,'P:stand','Breathe out. Arms down, stand still for a moment.'],
      ['Flow all 12 together',90,'sun12','Now link them with the breath. Lead with the left leg in the next round.']]},

  six:{t:'Six-move yoga reset', cat:'Mobility & yoga',
    why:'Six poses, each for a different stiff spot: spine, hamstrings, back, hip flexors, hips and shoulders.',
    src:{by:'@houseofatma.wellbeing', url:IG('DcjEfPTtyz3'), lbl:'Six non-negotiable'},
    moves:[
      ['Cat-cow',60,'catCow','Mobilises the whole spine.'],
      ['Walking down dog',60,'dogPedal','Bend one knee, then the other, to stretch the calves and hamstrings.'],
      ['Cobra',45,'cobra','Strengthens the back muscles for better posture.'],
      ['Crescent lunge',60,'crescent','Opens tight hip flexors. Hold a chair for balance if needed.',SIDES],
      ['Yogi squat (malasana)',45,'malasana','Releases the lower back and hips. Sit on a block or hold support if needed.'],
      ['Puppy pose',45,'puppy','Hips over knees, chest melts down. Opens the upper back and shoulders.']]},

  men40:{t:'Yoga for men over 40', cat:'Mobility & yoga',
    why:'Poses that support back health, flexibility, pelvic strength and stress relief as you age.',
    src:{by:'@sumantv_official', url:IG('Dci9gztE_hJ'), lbl:'Must-do for Males'},
    moves:[
      ['Setu Bandhasana (bridge)',45,'bridgeHold','Strengthens the buttocks, back and pelvic floor.'],
      ['Shalabhasana (locust)',40,'locust','Lift the chest and legs a little. Builds lower-back strength.'],
      ['Bhujangasana (cobra)',40,'cobra','Opens the chest and keeps the spine supple.'],
      ['Malasana (yogi squat)',40,'malasana','Opens the hips and helps digestion.'],
      ['Paschimottanasana (seated forward bend)',50,'seatedFold','Bend the knees as much as needed. Lengthen, don’t force.'],
      ['Pawanmuktasana (knee hug)',40,'kneeRock','Releases the lower back and abdomen.'],
      ['Shavasana',30,'rest','Rest and let the breath settle.']]},

  seven:{t:'Seven loosening moves', cat:'Mobility & yoga',
    why:'Seven whole-body moves to feel stronger and looser at the same time.',
    src:{by:'@healthwithhearts', url:IG('Dcisq2sNOpL'), lbl:'7 Morning Moves'},
    moves:[
      ['Standing cat-cow',40,'standCatCow','Hands on thighs. Round, then gently arch the back.'],
      ['Hip circles',40,'fHips','Hands on hips, slow circles. Change direction halfway.'],
      ['Side bends',40,'fBend','Reach up and over. Keep both feet grounded.'],
      ['Squat hold',40,'squatHold','Sink down, hold, and rise slowly.'],
      ['Calf raises',30,'calfRaise','Up onto the toes, pause, lower.'],
      ['Chest opener',30,'armsBack','Hands back, chest lifts. Breathe in deeply.'],
      ['Shake it out',30,'fShake','Let the arms and shoulders go loose.']]},

  hipspine:{t:'Hips & spine', cat:'Neck, shoulders & hips',
    why:'Mobilises the lower back and hips, the areas that stiffen most from sitting.',
    src:{by:'a reel you saved', url:IG('DcZMcfbpG7z'), lbl:'Hips & Spine', removed:true},
    moves:[
      ['Cat-cow',50,'catCow','Slow, with the breath.'],
      ['Thread the needle',50,'needle','Slide one arm under the body and rest the shoulder down.',SIDES],
      ['Knee to chest',40,'singleHug','Hug one knee, keep the other leg long.',SIDES],
      ['Standing twist',40,'fTwist','Let the arms swing loosely as you turn from side to side.'],
      ['Child’s pose',40,'child','Breathe into the lower back.'],
      ['Bridge',40,'bridgeLift','Roll up slowly, then lower slowly.']]},

  hips:{t:'Hip openers', cat:'Neck, shoulders & hips',
    why:'Gentle openers to release hips that tighten after a day of sitting. About 60 seconds per move.',
    src:{by:'@thebodycoach', url:IG('DbTNoWnsuUI'), lbl:'Hip stretches'},
    moves:[
      ['Low lunge stretch',60,'lungeStretch','Sink the hips forward until you feel the front of the hip open.',SIDES],
      ['Butterfly',60,'fButterfly','Soles together, let the knees fall open. Gentle flutter.'],
      ['Figure-4 stretch',60,'figure4','Ankle over the opposite knee. Draw the legs in gently.',SIDES],
      ['Wide child’s pose',60,'child','Knees wide, sit back, breathe.'],
      ['Knee hug and rock',30,'kneeRock','Massage the lower back.']],
    note:'Weekdays: 1 round. On Sunday, repeat the routine up to 3 times.'},

  neckA:{t:'Neck & shoulder release', cat:'Neck, shoulders & hips',
    why:'Undoes forward head and rounded shoulders from screens and reading.',
    src:{by:'Neeraj Joshi Fitness', url:FB('1712738926732767'), lbl:'Neck and shoulders'},
    moves:[
      ['Chin tucks',30,'chinTuck','Slide the chin straight back, making a double chin. Hold 3 seconds.'],
      ['Side neck tilts',40,'fTilt','Ear toward shoulder. Keep the other shoulder down.'],
      ['Slow head turns',30,'fTurn','Look over one shoulder, then the other. Slow and smooth.'],
      ['Shoulder rolls',30,'fShrug','Lift the shoulders up, back and down.'],
      ['Shoulder-blade squeeze',30,'fW','Arms in a W. Squeeze and hold.']]},

  neckB:{t:'Posture reset', cat:'Neck, shoulders & hips',
    why:'Strengthens the upper back and stretches the chest, a good partner to the over-40 yoga.',
    src:{by:'Harish Chawla', url:FB('1696876054705768'), lbl:'Shoulders and neck'},
    moves:[
      ['Shoulder rolls',30,'fShrug','Up, back and down. Slow.'],
      ['W to Y raises',30,'fY','From a W, reach up into a Y. Shoulders stay low.'],
      ['Doorway chest stretch',40,'doorway','Forearm on a door frame, step through gently.',SIDES],
      ['Chin tucks',30,'chinTuck','Long back of the neck.'],
      ['Chest opener',30,'armsBack','Hands back, open the chest, breathe in.']]},

  heart:{t:'Heart-friendly cardio', cat:'Heart, BP & circulation',
    why:'Rhythmic, moderate moves that raise circulation without strain.',
    src:{by:'@debparna_goswami', url:IG('DcVKF-tT5n_'), lbl:'For healthy heart'},
    moves:[
      ['March in place',45,'march','Warm up at an easy pace.'],
      ['Step-touch with arms',45,'fStep','Step side to side, arms open and close.'],
      ['Low-impact jacks',45,'fJacks','Step one foot out as the arms go up. No jumping.'],
      ['Knee drive, arms up',40,'kneeDrive','Arms reach up, knee comes up as the arms pull down.',SIDES],
      ['Easy march to cool down',30,'march','Slow down and let the breath settle.']],
    note:'Stop if you feel chest discomfort, unusual breathlessness or dizziness.'},

  bp:{t:'5 minutes for BP & blood sugar', cat:'Heart, BP & circulation',
    why:'Short bursts of big-muscle movement help muscles take up glucose and support healthy blood pressure, alongside your medicines and diet.',
    src:{by:'@dr_sulman_feroz', url:IG('DdO3uR3ADLt'), lbl:'5-Min routine morning for BP, sugar and overall'},
    moves:[
      ['Chair sit-to-stand',60,'slowStand','Stand up and sit down with control. Breathe out as you stand.'],
      ['Calf raises',40,'calfRaise','The calves pump blood back to the heart.'],
      ['High-knee march',45,'highKnees','Brisk but comfortable.'],
      ['Wall push-ups',40,'wallPush','Steady rhythm. Never hold your breath.'],
      ['Hip hinge',40,'hinge','Push the hips back with a flat back, then stand tall.'],
      ['Slow march',30,'march','Cool down.']],
    note:'Bonus: a few minutes of marching after meals also helps blood sugar.'},

  no2:{t:'Nitric-oxide burst', cat:'Heart, BP & circulation', rounds:3,
    why:'Quick, repeated big-muscle movements boost blood flow. The body releases nitric oxide, which helps blood vessels relax.',
    src:{by:'@dr_sulman_feroz', url:IG('DakTRfLiXy7'), lbl:'5 min NO2 based moves'},
    moves:[
      ['Quick squats',20,'squatsFast','About 10 reps, light and rhythmic.'],
      ['Alternating arm raises',20,'fArmRaise','Punch each arm up overhead in turn.'],
      ['Low-impact jacks',20,'fJacksFast','Step out, arms up. No jumping needed.'],
      ['Overhead press',20,'pressFast','Quick presses up and down.'],
      ['Breathe',15,'standBreathe','Rest. Notice the warmth in your hands and feet.']]},

  lymph:{t:'Lymph flow', cat:'Heart, BP & circulation',
    why:'Lymph has no pump of its own. Muscle movement and deep breathing are what move it. Sundays and Wednesdays, as you planned.',
    src:{by:'@dr_sulman_feroz', url:IG('Ddi5fUKDxF9'), lbl:'Weekly twice for lymphatic system… Sundays and Wednesdays'},
    moves:[
      ['Deep belly breathing',60,'chairBreathe','Breathe in through the nose so the belly rises. Long, slow breath out.'],
      ['Shoulder rolls',40,'fShrug','Lymph nodes sit around the collarbones. Roll freely.'],
      ['Arm pumps overhead',40,'fPump','Pump the arms up and down.'],
      ['Calf pumps',40,'calfRaise','The calf muscles are the body’s second heart.'],
      ['March in place',40,'march','Easy pace, arms swinging.'],
      ['Gentle heel bounce',30,'heelBounce','Small, soft bounces on the balls of the feet.'],
      ['Side bends',30,'fBend','Stretch along the sides of the body.']],
    note:'Drink a glass of water afterwards.'},

  vor:{t:'VOR focus drill', cat:'Wake-up & balance',
    why:'VOR (vestibulo-ocular reflex) training: keep your eyes fixed on your thumb while your head moves. It trains the balance and visual systems to work together, which can sharpen focus and steadiness.',
    src:{by:'@dr_sulman_feroz', url:IG('Ddl6dOMgdFq'), lbl:'VOR for brain fog'},
    moves:[
      ['Head turns, eyes on thumb',30,'fVorSlow','Hold your thumb at arm’s length. Keep the nail sharp while turning the head side to side.'],
      ['Rest',15,'standBreathe','Blink and relax the eyes.'],
      ['Faster head turns',30,'fVor','A little faster, only as fast as the thumb stays in focus.'],
      ['Up-down nods, eyes on thumb',30,'nod','Nod gently up and down, eyes fixed on the thumb.'],
      ['Rest',15,'standBreathe','Done. Sit down if you feel dizzy.']],
    note:'Do this sitting down if you are prone to dizziness. Go slower, not faster.'},

  chest:{t:'Stress release for the chest', cat:'Calm & stress',
    why:'A 10-minute wind-down that releases the chest and upper-body tightness that builds with stress. Your Om SaiRam evening routine.',
    src:{by:'@theperfecthealthhyd_koti', url:IG('DY4eYGvioAg'), lbl:'Om SaiRam!!! Stress Relief'},
    moves:[
      ['Belly breathing',90,'chairBreathe','Breathe in for 4, out for 6. Let the shoulders drop.'],
      ['Shoulder rolls',45,'fShrug','Slow and wide.'],
      ['Open arms and hug',60,'fArmsOpen','Open wide as you breathe in. Hug yourself as you breathe out.'],
      ['Chest opener',45,'armsBack','Hands back, chest lifts, chin level.'],
      ['Doorway chest stretch',60,'doorway','Gentle. Breathe into the front of the chest.',SIDES],
      ['Standing cat-cow',45,'standCatCow','Hands on thighs, round and arch.'],
      ['Child’s pose',60,'child','Let the forehead rest. Breathe into the back.'],
      ['Rest with 4-6 breathing',90,'rest','Lie still. In for 4, out for 6.']],
    note:'This is for muscle tension only. Chest pain with breathlessness, sweating, or pain spreading to the arm or jaw needs emergency help right away.'},

  stress:{t:'Daily wind-down', cat:'Calm & stress',
    why:'Simple moves and slow breathing that relax the muscles and calm the nervous system before sleep.',
    src:{by:'@dr_sulman_feroz', url:IG('DdFtw0FAZSZ'), lbl:'Daily stress reliever routine'},
    moves:[
      ['Child’s pose',45,'child','Arms long or by the sides.'],
      ['Slow cat-cow',45,'catCow','Move with the breath, slower than usual.'],
      ['Knee hug',30,'kneeRock','Rock gently.'],
      ['Legs up the wall',60,'legsUp','Hips near a wall, legs resting up it. Very calming.'],
      ['4-6 breathing',60,'rest','In for 4, out for 6. Lights low after this.']]},

  legs:{t:'Strong legs minute', cat:'Strength',
    why:'One minute for the thighs, hips and calves. Three times a day builds the strength and balance that protect the knees.',
    src:{by:'@dr_sulman_feroz', url:IG('DX5w75DDXZR'), lbl:'Strong legs… 1 min thrice a day'},
    moves:[
      ['Slow chair squats',35,'slowStand','Touch the chair lightly and stand up again.'],
      ['Calf raises',25,'calfRaise','Hold a chair or wall for balance.']]},

  dizzyInfo:{t:'Dizziness: causes to know', cat:'Wake-up & balance', info:true,
    why:'A read-through, not a routine. Note anything that applies to you and mention it to your doctor.',
    src:{by:'All about health and nutrition', url:FB('4300784493486340'), lbl:'(saved without a note)'},
    facts:[
      ['Standing up too fast','Blood pressure dips for a moment. Sit first, pump the ankles, then rise.'],
      ['Not enough water','Mild dehydration lowers blood volume. Drink regularly through the day.'],
      ['Medicines','BP tablets and some others can cause light-headedness. Ask your doctor about the timing.'],
      ['Low blood sugar','Long gaps without food, or diabetes medicines. Eat regular meals.'],
      ['Inner-ear problems','Brief spinning when you turn in bed or look up is often BPPV, which a doctor can treat.'],
      ['Low haemoglobin','Anaemia shows up on a simple blood test.'],
      ['Poor sleep and stress','Both make heavy-head feelings worse. The evening wind-downs help.']],
    moves:[]}
};

/* Expand single-pose moves ("P:poseName") into hold-and-breathe animations, then compute minutes */
for(const r of Object.values(R)){
  r.moves = r.moves.map(([n,d,a,cue,o])=>({n,d,a,cue,side:!!(o&&o.side)}));
  r.m = r.info ? 3 : Math.max(1, Math.round((r.moves.reduce((s,mv)=>s+mv.d,0)*(r.rounds||1) + r.moves.length*(r.rounds||1)*5)/60));
}
window.ROUTINES = R;
