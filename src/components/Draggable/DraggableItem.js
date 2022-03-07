import { DragSource, DropTarget } from 'react-dnd';
import React, { Component } from 'react';

import ItemTypes from './ItemTypes';
import { findDOMNode } from 'react-dom';
import { flow } from 'lodash';

const style = {
	cursor: 'move',
};

class DraggableItem extends Component {
	render() {
		const { isDragging, connectDragSource, connectDropTarget, children } = this.props;
		const opacity = isDragging ? 0 : 1;

		return connectDragSource(
			connectDropTarget(<div style={{ ...style, opacity }}>{children}</div>),
		);
	}
}

const itemSource = {
	beginDrag(props) {
		return {
			index: props.index,
			listId: props.listId,
			item: props.item,
		};
	},

	endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();

		if (dropResult && dropResult.listId !== item.listId) {
			props.removeItem(item.index);
		}
	},
};

const itemTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;
		const sourceListId = monitor.getItem().listId;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		// eslint-disable-next-line react/no-find-dom-node
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		if (props.listId === sourceListId) {
			props.moveItem(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			// eslint-disable-next-line no-param-reassign
			monitor.getItem().index = hoverIndex;
		}
	},
};

export default flow(
	DropTarget(ItemTypes.CARD, itemTarget, (connect) => ({
		connectDropTarget: connect.dropTarget(),
	})),
	DragSource(ItemTypes.CARD, itemSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	})),
)(DraggableItem);
