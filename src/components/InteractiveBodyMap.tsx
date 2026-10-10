import React from 'react';

interface BodyMapProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
}

interface AreaInfo {
  id: string;
  label: string;
  hindi: string;
  commonSymptoms: string;
}

const areas: AreaInfo[] = [
  { id: 'head', label: 'Head & Face', hindi: 'सिर एवं चेहरा', commonSymptoms: 'Headache, dizziness, vision change, facial droop' },
  { id: 'neck', label: 'Neck & Throat', hindi: 'गला एवं गर्दन', commonSymptoms: 'Sore throat, difficulty swallowing, stiffness' },
  { id: 'chest', label: 'Chest & Heart', hindi: 'छाती एवं हृदय', commonSymptoms: 'Chest pain, shortness of breath, palpitations' },
  { id: 'abdomen', label: 'Abdomen & Stomach', hindi: 'पेट एवं पाचन', commonSymptoms: 'Severe stomach pain, vomiting, acid reflux' },
  { id: 'pelvis', label: 'Pelvis & Groin', hindi: 'पेल्विस एवं कमर', commonSymptoms: 'Urinary pain, pregnancy bleeding, pelvic cramps' },
  { id: 'arms', label: 'Arms & Hands', hindi: 'हाथ एवं भुजाएं', commonSymptoms: 'Burns, lacerations, weakness, swelling' },
  { id: 'legs', label: 'Legs & Knees', hindi: 'पैर एवं घुटने', commonSymptoms: 'Knee joint pain, fracture, inability to bear weight' },
  { id: 'feet', label: 'Feet & Ankles', hindi: 'पैर के पंजे एवं टखने', commonSymptoms: 'Diabetic foot ulcer, pedal edema, numbness' },
  { id: 'skin', label: 'Skin / Whole Body', hindi: 'त्वचा / संपूर्ण शरीर', commonSymptoms: 'Diffuse rash, high fever, generalized weakness' },
];

export const InteractiveBodyMap: React.FC<BodyMapProps> = ({ selectedArea, onSelectArea }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Interactive Body Area Selector
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click on the body diagram or tap the quick buttons below to indicate where the primary problem is located.
          </p>
        </div>
        {selectedArea && (
          <span className="px-3 py-1 bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-xs rounded-full border border-teal-300 dark:border-teal-700">
            Selected: {areas.find(a => a.id === selectedArea)?.label || selectedArea}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Figure */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-56 h-80 sm:w-64 sm:h-96 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center">
            <svg
              viewBox="0 0 200 320"
              className="w-full h-full max-h-84 select-none drop-shadow-sm"
            >
              {/* Head */}
              <circle
                cx="100"
                cy="32"
                r="22"
                onClick={() => onSelectArea('head')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'head'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Neck */}
              <rect
                x="93"
                y="54"
                width="14"
                height="12"
                rx="2"
                onClick={() => onSelectArea('neck')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'neck'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Chest (Thorax) */}
              <path
                d="M72 68 H128 L124 115 H76 Z"
                onClick={() => onSelectArea('chest')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'chest'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Abdomen */}
              <path
                d="M76 118 H124 L120 155 H80 Z"
                onClick={() => onSelectArea('abdomen')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'abdomen'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Pelvis */}
              <path
                d="M80 157 H120 L115 185 H85 Z"
                onClick={() => onSelectArea('pelvis')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'pelvis'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Left Arm (viewer right) */}
              <path
                d="M130 70 L158 135 L168 180 L158 184 L146 138 L126 78 Z"
                onClick={() => onSelectArea('arms')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'arms'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Right Arm (viewer left) */}
              <path
                d="M70 70 L42 135 L32 180 L42 184 L54 138 L74 78 Z"
                onClick={() => onSelectArea('arms')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'arms'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Left Leg (viewer right) */}
              <path
                d="M103 186 L118 250 L116 288 H102 L99 250 L98 186 Z"
                onClick={() => onSelectArea('legs')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'legs'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Right Leg (viewer left) */}
              <path
                d="M97 186 L82 250 L84 288 H98 L101 250 L102 186 Z"
                onClick={() => onSelectArea('legs')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'legs'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Left Foot */}
              <ellipse
                cx="110"
                cy="298"
                rx="10"
                ry="6"
                onClick={() => onSelectArea('feet')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'feet'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />

              {/* Right Foot */}
              <ellipse
                cx="90"
                cy="298"
                rx="10"
                ry="6"
                onClick={() => onSelectArea('feet')}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === 'feet'
                    ? 'fill-teal-500 stroke-teal-700 stroke-2'
                    : 'fill-slate-200 dark:fill-slate-700 hover:fill-teal-200 dark:hover:fill-teal-800 stroke-slate-300 dark:stroke-slate-600'
                }`}
              />
            </svg>

            <span className="absolute bottom-2 text-[10px] text-slate-400 font-mono">
              ANATOMICAL MAP
            </span>
          </div>
        </div>

        {/* Clickable Area Buttons List */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {areas.map((area) => {
            const isSelected = selectedArea === area.id;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onSelectArea(area.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 dark:border-teal-400 shadow-sm ring-2 ring-teal-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {area.label}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {area.hindi}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {area.commonSymptoms}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
