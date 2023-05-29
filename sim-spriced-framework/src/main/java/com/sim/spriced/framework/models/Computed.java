package com.sim.spriced.framework.models;


import lombok.Getter;
import lombok.Setter;

@Getter
public class Computed {

	Node node;

	Computed(Node node) {
		this.node = node;
	}

	Computed add(Node node) {
		BinaryOperator binNode = new BinaryOperator(Operations.ADD, this.node, node);
		this.node = binNode;
		return this;
	}

	Computed substract(Node node) {
		BinaryOperator binNode = new BinaryOperator(Operations.SUBSTRACT, this.node, node);
		this.node = binNode;
		return this;
	}

	Computed multiply(Node node) {
		BinaryOperator binNode = new BinaryOperator(Operations.MULTIPLY, this.node, node);
		this.node = binNode;
		return this;
	}

	Computed divide(Node node) {
		BinaryOperator binNode = new BinaryOperator(Operations.DIVIDE, this.node, node);
		this.node = binNode;
		return this;
	}

	Computed concat(Node node) {
		BinaryOperator binNode = new BinaryOperator(Operations.CONCAT, this.node, node);
		this.node = binNode;
		return this;
	}

	Computed not() {
		UnaryOperator unaryOperator = new UnaryOperator(Operations.NOT, node);
		this.node = unaryOperator;
		return this;
	}

	Computed percentage(int percentage) {
		UnaryOperator unaryOperator = new UnaryOperator(Operations.PERCENTAGE, node,percentage);
		this.node = unaryOperator;
		return this;
	}

//	public interface IValue {
//		boolean isOperator();
//	}

	@Setter
	@Getter
	public abstract class Node {
		Node left;
		Node right;

		abstract NodeType getType();
		abstract Object getValue();
		abstract Object getExtraData();
	}

	enum NodeType {
		LEAF, OPERATOR
	}

	enum Operations {
		ADD, SUBSTRACT, MULTIPLY, DIVIDE, CONCAT, NOT, PERCENTAGE
	}

	public class LeafNode extends Node {
		Attribute attribute;

		public LeafNode(Attribute attribute) {
			this.attribute = attribute;
			this.left = null;
			this.right = null;
		}

		@Override
		NodeType getType() {
			return NodeType.LEAF;
		}

		@Override
		Object getValue() {
			return this.attribute;
		}

		@Override
		Object getExtraData() {
			return null;
		}

	}

	public class UnaryOperator extends Node {
		Node node;
		final Operations operation;
		Object extraData;

		UnaryOperator(Operations operation, Node node) {
			this.left = null;
			this.right = null;
			this.node = node;
			this.operation = operation;
		}
		UnaryOperator(Operations operation, Node node,Object extraData) {
			this(operation,node);
			this.extraData = extraData;
		}

		@Override
		NodeType getType() {
			return NodeType.LEAF;
		}

		@Override
		Object getValue() {
			return this.operation;
		}

		@Override
		Object getExtraData() {
			// TODO Auto-generated method stub
			return null;
		}
	}

	public class BinaryOperator extends Node {

		final Operations operation;

		public BinaryOperator(Operations operation, Node left, Node right) {
			this.operation = operation;
			this.left = left;
			this.right = right;
		}

		@Override
		NodeType getType() {
			return NodeType.OPERATOR;
		}

		@Override
		Object getValue() {
			return this.operation;
		}

		@Override
		Object getExtraData() {
			// TODO Auto-generated method stub
			return null;
		}

	}

}
