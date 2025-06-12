/**
 * WordPress dependencies
 */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Label from '../../components/label';
import { getValue, isDisabled, updateAttribute } from '../../utils';

/**
 * External dependencies
 */
import styled from 'styled-components';
import { isFunction } from 'lodash';
import { ToggleGroupControlProps } from './types';

const StyledToggleGroup = styled( ToggleGroupControl )< {
	isDisabled: string;
} >`
	${ ( props ) =>
		'true' === props.isDisabled &&
		`
		pointer-events: none;
		opacity: 0.5;
	` }
`;

export default function ToggleGroup(
	props: ToggleGroupControlProps
): JSX.Element {
	const { control, attributes } = props;
	const { options, helpText } = control;

	const toggleOptions = isFunction( options )
		? options( attributes )
		: options;

	return (
		<StyledToggleGroup
			//@ts-ignore
			label={ <Label { ...props } /> }
			help={ helpText }
			isBlock
			value={ getValue( props ) }
			onChange={ ( value: any ) => updateAttribute( value, props ) }
			size="__unstable-large"
			isDisabled={ isDisabled( props ) ? 'true' : 'false' }
			className={ control?.className }
			required={ control?.required }
			__nextHasNoMarginBottom
		>
			{ toggleOptions.map( ( option: any, index: any ) => {
				return (
					<ToggleGroupControlOption
						key={ index }
						value={ option.value }
						label={ option.label }
					/>
				);
			} ) }
		</StyledToggleGroup>
	);
}
