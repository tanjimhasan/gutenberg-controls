/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * External dependencies
 */
import {
	DndContext,
	closestCenter,
	useSensor,
	useSensors,
	PointerSensor,
	KeyboardSensor,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import {
	restrictToVerticalAxis,
	restrictToWindowEdges,
	restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';

/**
 * Internal dependencies
 */
import Label from '../../components/label';
import SortableItem from './sortable-item';
import { getMaxId } from './utils';
import { Item, RepeaterControlProps } from './types';
import {
	ButtonContainer,
	Container,
	ItemList,
	Label as StyledLabel,
} from './styles';

export default function Repeater( props: RepeaterControlProps ) {
	const { control, attributes, attr_key, setAttributes } = props;
	const attribute = attributes[ attr_key ];
	const itemListRef = useRef< HTMLDivElement >( null ); // Ref for the scrollable list
	const [ newItemAdded, setNewItemAdded ] = useState( false );

	const sensors = useSensors(
		useSensor( PointerSensor ),
		useSensor( KeyboardSensor )
	);

	const handleDragEnd = useCallback(
		( event: DragEndEvent ) => {
			const { active, over } = event;
			if ( ! over || active.id === over.id ) return;
			const oldIndex = attribute.findIndex(
				( item: Item ) => item.id === active.id
			);
			const newIndex = attribute.findIndex(
				( item: Item ) => item.id === over.id
			);
			const newAttributes = arrayMove( attribute, oldIndex, newIndex );
			setAttributes( { [ attr_key ]: newAttributes } );
		},
		[ attribute, setAttributes, attr_key ]
	);

	useEffect( () => {
		if ( newItemAdded && itemListRef.current ) {
			// Scroll to bottom of the list
			itemListRef.current.scrollTo( {
				top: itemListRef.current.scrollHeight,
				behavior: 'smooth',
			} );
			setNewItemAdded( false );
		}
	}, [ attribute, newItemAdded ] );

	const addItem = useCallback( () => {
		const newItem = {
			id: getMaxId( attribute ) + 1,
			label: 'New Item',
			value: Date.now(),
			collapsed: true,
		};
		const newAttributes = [ ...attribute, newItem ];
		setAttributes( { [ attr_key ]: newAttributes } );
		setNewItemAdded( true );
	}, [ attribute, setAttributes, attr_key ] );

	const isDisabledRemove =
		( undefined === control?.preventEmpty || control.preventEmpty ) &&
		attribute.length === 1;

	const removeItem = useCallback(
		( id: number ) => {
			if ( isDisabledRemove ) {
				return;
			}
			const newAttributes = attribute.filter(
				( item: Item ) => item.id !== id
			);
			setAttributes( { [ attr_key ]: newAttributes } );
		},
		[ attribute, setAttributes, attr_key, isDisabledRemove ]
	);

	const duplicateItem = useCallback(
		( id: number ) => {
			const itemToDuplicate = attribute.find(
				( item: Item ) => item.id === id
			);
			if ( itemToDuplicate ) {
				const newItem = {
					...itemToDuplicate,
					id: getMaxId( attribute ) + 1,
				};
				const newAttributes = [ ...attribute, newItem ];
				setAttributes( { [ attr_key ]: newAttributes } );
			}
		},
		[ attribute, setAttributes, attr_key ]
	);

	const toggleCollapse = useCallback(
		( id: number ) => {
			const newAttributes = attribute.map( ( item: Item ) =>
				item.id === id ? { ...item, collapsed: ! item.collapsed } : item
			);
			setAttributes( { [ attr_key ]: newAttributes } );
		},
		[ attribute, setAttributes, attr_key ]
	);

	return (
		<div
			className={ `components-base-control wpmvc-repeater-wrapper ${
				control?.className ?? ''
			}` }
		>
			<StyledLabel className="repeater-label">
				{ /* @ts-ignore */ }
				<Label { ...props } />
			</StyledLabel>
			<Container className="repeater-container">
				<DndContext
					sensors={ sensors }
					collisionDetection={ closestCenter }
					onDragEnd={ handleDragEnd }
					modifiers={ [
						restrictToVerticalAxis,
						restrictToWindowEdges,
						restrictToFirstScrollableAncestor,
					] }
				>
					<SortableContext
						items={ attribute }
						strategy={ verticalListSortingStrategy }
					>
						<ItemList
							className="repeater-item-list"
							ref={ itemListRef }
						>
							{ attribute.map( ( item: Item ) => (
								<SortableItem
									key={ item.id }
									item={ item }
									repeaterProps={ props }
									onRemove={ removeItem }
									onDuplicate={ duplicateItem }
									onToggleCollapse={ toggleCollapse }
									isDisabledRemove={ isDisabledRemove }
								/>
							) ) }
						</ItemList>
					</SortableContext>
				</DndContext>
				{ ! control?.fixed && (
					<ButtonContainer className="repeater-button-container">
						<Button
							onClick={ addItem }
							variant="tertiary"
							size="small"
						>
							{ control?.addButtonText
								? control.addButtonText
								: '+ ADD ITEM' }
						</Button>
					</ButtonContainer>
				) }
			</Container>
		</div>
	);
}
