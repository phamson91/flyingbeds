import { FC } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import {
	BtnBold,
	BtnItalic,
	BtnUnderline,
	Editor,
	EditorProvider,
	Toolbar,
} from 'react-simple-wysiwyg';

interface TProps {
	value: string;
	onChange: (e: any) => void;
	id: string;
	className?: string;
	containerProps?: any;
	errors: FieldErrors<FieldValues>;
}
const CustomEditor: FC<TProps> = ({
	value,
	onChange,
	id,
	className,
	containerProps,
	errors,
	...props
}) => {
	return (
		<EditorProvider>
			<Editor
				value={value}
				onChange={onChange}
				id={id}
				className={className}
				containerProps={containerProps}
				{...props}
			>
				<Toolbar>
					<BtnBold />
					<BtnItalic />
					<BtnUnderline />
				</Toolbar>
			</Editor>
			{errors && errors[id] ? (
				<p
					className="text-rose-500 text-xs inline-block"
					data-testid={`${id}-error`}
				>{`${errors[id]?.message}`}</p>
			) : null}
		</EditorProvider>
	);
};

export default CustomEditor;
