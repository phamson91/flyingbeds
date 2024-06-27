'use client';

import React, { useEffect, useState } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn(
			'relative flex w-full touch-none select-none items-center',
			className
		)}
		{...props}
	>
		<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
			<SliderPrimitive.Range className="absolute h-full bg-slate-900 dark:bg-slate-50" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300" />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

const SliderMulti = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(
	(
		{ className, min, max, step, value, onValueChange, key, ...props }: any,
		ref
	) => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		const initialValue = Array.isArray(value) ? value : [min, max];
		const [localValues, setLocalValues] = useState(initialValue);

		useEffect(() => {
			setLocalValues(initialValue);
		}, [key, initialValue]);

		const handleValueChange = (newValues: number[]) => {
			setLocalValues(newValues);
			if (onValueChange) {
				onValueChange(newValues);
			}
		};

		return (
			<SliderPrimitive.Root
				ref={ref}
				min={min}
				max={max}
				step={step}
				value={localValues}
				onValueChange={handleValueChange}
				className={cn(
					'relative flex w-full touch-none select-none items-center',
					className
				)}
				{...props}
			>
				<SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
					<SliderPrimitive.Range className="absolute h-full bg-primary" />
				</SliderPrimitive.Track>
				{localValues.map((value, index) => (
					<React.Fragment key={index}>
						<div
							className="absolute text-center"
							style={{
								left: `calc(${((value - min) / (max - min)) * 100}% + 0px)`,
								top: `10px`,
							}}
						>
							<span className="text-xs whitespace-nowrap">{value}</span>
						</div>
						<SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
					</React.Fragment>
				))}
			</SliderPrimitive.Root>
		);
	}
);

SliderMulti.displayName = SliderPrimitive.Root.displayName;

export { Slider, SliderMulti };
