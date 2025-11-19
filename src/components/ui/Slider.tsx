import type { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  valueLabel?: string
}

export function Slider({ label, valueLabel, className = '', ...props }: SliderProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{label}</span>
          {valueLabel && <span className="font-semibold text-electric-blue">{valueLabel}</span>}
        </div>
      )}
      <input
        type="range"
        className={`w-full accent-electric-blue bg-transparent h-2 rounded-full appearance-none
          [&::-webkit-slider-runnable-track]:bg-white/10
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-electric-blue
          [&::-moz-range-track]:bg-white/10 [&::-moz-range-thumb]:bg-electric-blue [&::-moz-range-thumb]:border-0
          ${className}`}
        {...props}
      />
    </div>
  )
}
