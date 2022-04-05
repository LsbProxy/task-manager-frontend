import React, { Component } from 'react';
import { get, isFunction } from 'lodash';

import DraggabbleItem from './DraggableItem';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import update from 'immutability-helper';

class DraggableContainer extends Component {
	pushItem = (item) => {
		const { items, handleChange } = this.props;

		handleChange(
			update(items, {
				$push: [item],
			}),
		);
	};

	removeItem = (index) => {
		const { items, handleChange } = this.props;

		handleChange(
			update(items, {
				$splice: [[index, 1]],
			}),
		);
	};

	moveItem = (dragIndex, hoverIndex) => {
		const { items, handleChange } = this.props;

		const dragItem = items[dragIndex];

		handleChange(
			update(items, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragItem],
				],
			}),
		);
	};

	render() {
		const { connectDropTarget, ItemComponent, id, itemProps, items } = this.props;

		return connectDropTarget(
			<div
				style={{
					height: '100%',
				}}
			>
				{items.map((item, i) => (
					<DraggabbleItem
						key={item.id}
						index={i}
						listId={id}
						item={item}
						removeItem={this.removeItem}
						moveItem={this.moveItem}
					>
						<ItemComponent {...item} {...itemProps} />
					</DraggabbleItem>
				))}
			</div>,
		);
	}
}

export const itemTarget = {
	drop(props, monitor, component) {
		const { id } = props;
		const sourceObj = monitor.getItem();

		if (id !== sourceObj.listId) {
			component.pushItem(sourceObj.item);

			if (isFunction(props.updateItem)) {
				props.updateItem(id, sourceObj);
			}
		}

		return {
			listId: id,
		};
	},
};

export default DropTarget(ItemTypes.CARD, itemTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop(),
}))(DraggableContainer);
