/**
 * WordPress dependencies
 */
import { __experimentalInputControl as InputControl } from '@wordpress/components';

/**
 * External dependencies
 */
// import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { CommonControlProps } from '../types/control';
import { getValue, isDisabled, memoCallback, updateAttribute } from '../utils';
import Label from '../components/label';
import styled from 'styled-components';
import { memo } from 'react';

// const StyledInput = styled( InputControl )< { isInvalid: boolean } >`
// 	${ ( { isInvalid } ) =>
// 		isInvalid &&
// 		css`
// 			.components-input-control__backdrop {
// 				border-color: red !important;
// 			}

// 			.components-base-control__help {
// 				color: red !important;
// 			}
// 		` }
// `;
const StyledInputControl = styled( InputControl )< {
	isDisabled: string;
} >`
	${ ( props ) =>
		'true' === props.isDisabled &&
		`
		pointer-events: none;
		opacity: 0.5;
	` }
`;

const Text = memo( ( props: CommonControlProps ) => {
	const { control } = props;
	const { helpText } = control || {};

	return (
		<StyledInputControl
			label={ <Label { ...props } /> }
			help={ helpText }
			size="__unstable-large"
			value={ getValue( props ) }
			onChange={ ( value: any ) => updateAttribute( value, props ) }
			isDisabled={ isDisabled( props ) ? 'true' : 'false' }
			className={ control?.className }
			onClick={ ( event: React.MouseEvent ) => event.stopPropagation() }
			required={ control?.required }
		/>
	);
}, memoCallback );

export default Text;
